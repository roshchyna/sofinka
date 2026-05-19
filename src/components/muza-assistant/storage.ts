import type { Language } from "@/i18n/languages";
import type { MuzaMessage, MuzaMessageRole } from "./types";

const STORAGE_PREFIX = "sofinka.muzaAssistant";
const STORAGE_VERSION = 1;

export const MUZA_CHANNEL_NAME = "sofinka.muzaAssistant.channel";

interface StoredMuzaHistory {
	version: number;
	messages: MuzaMessage[];
}

export function getMuzaStorageKey({
	age,
	language,
}: {
	age: number;
	language: Language;
}) {
	return `${STORAGE_PREFIX}.${language}.${age}`;
}

export function createMuzaMessage(
	role: MuzaMessageRole,
	content: string,
): MuzaMessage {
	return {
		content,
		createdAt: new Date().toISOString(),
		id: createId(),
		role,
	};
}

export function readMuzaMessages(storageKey: string): MuzaMessage[] {
	if (typeof window === "undefined") return [];

	try {
		const rawHistory = window.localStorage.getItem(storageKey);
		if (!rawHistory) return [];

		const parsed = JSON.parse(rawHistory) as StoredMuzaHistory;
		if (parsed.version !== STORAGE_VERSION || !Array.isArray(parsed.messages)) {
			return [];
		}

		return parsed.messages.filter(isMuzaMessage);
	} catch {
		return [];
	}
}

export function saveMuzaMessages(storageKey: string, messages: MuzaMessage[]) {
	if (typeof window === "undefined") return;

	window.localStorage.setItem(
		storageKey,
		JSON.stringify({
			messages,
			version: STORAGE_VERSION,
		} satisfies StoredMuzaHistory),
	);
}

export function clearMuzaMessages(storageKey: string) {
	if (typeof window === "undefined") return;

	window.localStorage.removeItem(storageKey);
}

function createId() {
	if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
		return crypto.randomUUID();
	}

	return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function isMuzaMessage(value: unknown): value is MuzaMessage {
	if (!value || typeof value !== "object") return false;

	const message = value as Partial<MuzaMessage>;
	return (
		(message.role === "user" || message.role === "assistant") &&
		typeof message.content === "string" &&
		typeof message.createdAt === "string" &&
		typeof message.id === "string"
	);
}
