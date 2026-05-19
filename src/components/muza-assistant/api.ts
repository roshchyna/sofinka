import type { Language } from "@/i18n/languages";
import { getLanguageName } from "@/i18n/languages";
import type { MuzaAssistantRequest, MuzaMessage } from "./types";

export const MUZA_ASSISTANT_ENDPOINT = "/api/muza-assistant";

interface StreamMuzaMessageOptions {
	age: number;
	endpoint?: string;
	language: Language;
	messages: MuzaMessage[];
	onChunk: (chunk: string) => void;
	signal?: AbortSignal;
}

interface MuzaAssistantJsonResponse {
	error?: string;
	reply?: string;
}

export async function streamMuzaMessage({
	age,
	endpoint = MUZA_ASSISTANT_ENDPOINT,
	language,
	messages,
	onChunk,
	signal,
}: StreamMuzaMessageOptions) {
	const payload: MuzaAssistantRequest = {
		age,
		language: getLanguageName(language),
		messages: messages.map(({ content, role }) => ({ content, role })),
	};

	const response = await fetch(endpoint, {
		body: JSON.stringify(payload),
		headers: { "Content-Type": "application/json" },
		method: "POST",
		signal,
	});

	const contentType = response.headers.get("Content-Type") ?? "";

	if (!response.ok) {
		if (contentType.includes("application/json")) {
			const data = (await response.json()) as MuzaAssistantJsonResponse;
			throw new Error(data.error ?? "Muza request failed.");
		}

		const text = await response.text();
		throw new Error(text || "Muza request failed.");
	}

	if (contentType.includes("application/json")) {
		const data = (await response.json()) as MuzaAssistantJsonResponse;
		onChunk(data.reply ?? "");
		return;
	}

	const reader = response.body?.getReader();
	if (!reader) {
		onChunk(await response.text());
		return;
	}

	const decoder = new TextDecoder();

	while (true) {
		const { done, value } = await reader.read();
		if (done) break;

		const chunk = decoder.decode(value, { stream: true });
		if (chunk) onChunk(chunk);
	}
}
