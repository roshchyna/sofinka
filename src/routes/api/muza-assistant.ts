import { createFileRoute } from "@tanstack/react-router";
import { loadEnv } from "../../../server/env.mjs";
import { getLanguageConfig } from "../../../server/languages.mjs";

loadEnv();

const MODEL = process.env.OPENROUTER_MODEL ?? "openrouter/free";
const MAX_HISTORY_MESSAGES = 16;

interface MuzaRequestMessage {
	content?: unknown;
	role?: unknown;
}

interface MuzaRequestBody {
	age?: unknown;
	language?: unknown;
	messages?: unknown;
}

interface OpenRouterStreamChunk {
	choices?: Array<{
		delta?: {
			content?: string;
		};
	}>;
	error?: {
		message?: string;
	};
}

export const Route = createFileRoute("/api/muza-assistant")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				if (!process.env.OPENROUTER_API_KEY) {
					return Response.json(
						{ error: "OPENROUTER_API_KEY is missing" },
						{ status: 500 },
					);
				}

				try {
					const body = (await request.json()) as MuzaRequestBody;
					const age = normalizeAge(body.age);
					const language = getLanguageConfig(body.language).name;
					const messages = normalizeMessages(body.messages);

					if (!messages.length || messages.at(-1)?.role !== "user") {
						return Response.json(
							{ error: "A user message is required." },
							{ status: 400 },
						);
					}

					const origin = new URL(request.url).origin;
					const openRouterResponse = await fetch(
						"https://openrouter.ai/api/v1/chat/completions",
						{
							body: JSON.stringify({
								messages: [
									{
										content: buildSystemPrompt({ age, language }),
										role: "system",
									},
									...messages,
								],
								model: MODEL,
								stream: true,
							}),
							headers: {
								Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
								"Content-Type": "application/json",
								"HTTP-Referer": origin,
								"X-Title": "Sofinka Muza Assistant",
							},
							method: "POST",
						},
					);

					if (!openRouterResponse.ok) {
						const errorText = await openRouterResponse.text();
						return Response.json(
							{
								error:
									readOpenRouterError(errorText) ?? "OpenRouter request failed",
							},
							{ status: openRouterResponse.status },
						);
					}

					if (!openRouterResponse.body) {
						return Response.json(
							{ error: "OpenRouter response body is empty" },
							{ status: 500 },
						);
					}

					return streamOpenRouterText(openRouterResponse.body);
				} catch (error) {
					return Response.json(
						{
							error: error instanceof Error ? error.message : "Unknown error",
						},
						{ status: 500 },
					);
				}
			},
		},
	},
});

function normalizeAge(value: unknown) {
	const age = Number(value);
	return Number.isFinite(age) && age >= 3 && age <= 10 ? age : 7;
}

function normalizeMessages(value: unknown) {
	if (!Array.isArray(value)) return [];

	return value
		.filter((message): message is MuzaRequestMessage => {
			return Boolean(message) && typeof message === "object";
		})
		.map((message) => ({
			content: String(message.content ?? "").trim(),
			role: message.role === "assistant" ? "assistant" : "user",
		}))
		.filter((message) => message.content.length > 0)
		.slice(-MAX_HISTORY_MESSAGES);
}

function buildSystemPrompt({
	age,
	language,
}: {
	age: number;
	language: string;
}) {
	return [
		"You are Muza, the friendly assistant inside Sofinka, a quiz app for kids.",
		`Reply in ${language}.`,
		`Assume the child is ${age} years old.`,
		"Help parents, teachers, and children with quiz ideas, topic explanations, hints, and age-appropriate learning prompts.",
		"Keep answers concise, warm, practical, and safe for children.",
		"Do not mention internal execution details.",
	].join(" ");
}

function streamOpenRouterText(body: ReadableStream<Uint8Array>) {
	const reader = body.getReader();
	const decoder = new TextDecoder();
	const encoder = new TextEncoder();
	let buffer = "";

	const stream = new ReadableStream<Uint8Array>({
		async start(controller) {
			try {
				while (true) {
					const { done, value } = await reader.read();
					if (done) break;

					buffer += decoder.decode(value, { stream: true });
					const events = buffer.split("\n\n");
					buffer = events.pop() ?? "";

					for (const event of events) {
						const text = readStreamEventText(event);
						if (text) controller.enqueue(encoder.encode(text));
					}
				}

				if (buffer.trim()) {
					const text = readStreamEventText(buffer);
					if (text) controller.enqueue(encoder.encode(text));
				}

				controller.close();
			} catch (error) {
				controller.error(error);
			} finally {
				reader.releaseLock();
			}
		},
	});

	return new Response(stream, {
		headers: {
			"Cache-Control": "no-cache",
			"Content-Type": "text/plain; charset=utf-8",
		},
	});
}

function readStreamEventText(event: string) {
	const dataLines = event
		.split("\n")
		.map((line) => line.trim())
		.filter((line) => line.startsWith("data:"))
		.map((line) => line.slice("data:".length).trim())
		.filter(Boolean);

	let text = "";
	for (const dataLine of dataLines) {
		if (dataLine === "[DONE]") continue;

		const parsed = JSON.parse(dataLine) as OpenRouterStreamChunk;
		if (parsed.error?.message) throw new Error(parsed.error.message);

		text += parsed.choices
			?.map((choice) => choice.delta?.content ?? "")
			.join("");
	}

	return text;
}

function readOpenRouterError(rawText: string) {
	try {
		const parsed = JSON.parse(rawText) as { error?: { message?: string } };
		return parsed.error?.message;
	} catch {
		return rawText.slice(0, 240);
	}
}
