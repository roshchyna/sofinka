import type { LanguageName } from "@/i18n/languages";

export type MuzaMessageRole = "user" | "assistant";

export type MuzaPersonaState = "idle" | "thinking" | "writing";

export interface MuzaMessage {
	id: string;
	role: MuzaMessageRole;
	content: string;
	createdAt: string;
}

export interface MuzaAssistantRequestMessage {
	role: MuzaMessageRole;
	content: string;
}

export interface MuzaAssistantRequest {
	age: number;
	language: LanguageName;
	messages: MuzaAssistantRequestMessage[];
}
