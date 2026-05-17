import { createFileRoute } from "@tanstack/react-router";
import { loadEnv } from "../../../server/env.mjs";
import { getLanguageConfig } from "../../../server/languages.mjs";
import { parseModelJson } from "../../../server/model-json.mjs";
import { buildPrompt } from "../../../server/prompt-builder.mjs";
import { normalizeGeneratedResponse } from "../../../server/question-normalizers.mjs";

loadEnv();

const MODEL = process.env.OPENROUTER_MODEL ?? "openrouter/free";

interface OpenRouterResponseBody {
	choices?: Array<{
		message?: {
			content?: string;
		};
	}>;
	error?: {
		message?: string;
	};
}

export const Route = createFileRoute("/api/generate-questions")({
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
					const body = await request.json();
					const topic = String(body.topic ?? "").trim();
					const age = String(body.age ?? "7").trim();
					const count = Number(body.count ?? 5);
					const language = getLanguageConfig(body.language).name;
					const type = String(body.type ?? "single-choice").trim();

					if (!topic) {
						return Response.json(
							{ error: "topic is required" },
							{ status: 400 },
						);
					}

					const origin = new URL(request.url).origin;
					const openRouterResponse = await fetch(
						"https://openrouter.ai/api/v1/chat/completions",
						{
							method: "POST",
							headers: {
								Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
								"Content-Type": "application/json",
								"HTTP-Referer": origin,
								"X-Title": "Sofinka Education Generator",
							},
							body: JSON.stringify({
								model: MODEL,
								messages: [
									{
										role: "system",
										content: `Return only valid JSON. No markdown. Generate educational quiz questions in ${language}.`,
									},
									{
										role: "user",
										content: buildPrompt({ age, count, language, topic, type }),
									},
								],
							}),
						},
					);

					const rawText = await openRouterResponse.text();

					let data: OpenRouterResponseBody = {};
					try {
						data = JSON.parse(rawText) as OpenRouterResponseBody;
					} catch {
						return Response.json(
							{
								error: `OpenRouter returned invalid JSON: ${rawText.slice(0, 200)}`,
							},
							{ status: 500 },
						);
					}

					if (!openRouterResponse.ok) {
						return Response.json(
							{
								error: data?.error?.message ?? "OpenRouter request failed",
							},
							{ status: openRouterResponse.status },
						);
					}

					const content = data?.choices?.[0]?.message?.content ?? "{}";
					const generated = parseModelJson(content);

					return Response.json(
						normalizeGeneratedResponse(generated, { language, topic, type }),
					);
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
