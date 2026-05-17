import { DEFAULT_LANGUAGE, isLanguage, type Language } from "@/i18n/languages";

const LANGUAGE_STORAGE_KEY = "sofinka.language";

export const LANGUAGE_CHANGED_EVENT = "sofinka.language.changed";

export function getLanguage() {
	if (typeof window === "undefined") return DEFAULT_LANGUAGE;

	const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
	return isLanguage(storedLanguage) ? storedLanguage : DEFAULT_LANGUAGE;
}

export function saveLanguage(language: Language) {
	if (typeof window === "undefined") return;

	window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
	window.dispatchEvent(new Event(LANGUAGE_CHANGED_EVENT));
}
