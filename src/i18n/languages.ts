export const languages = ["en", "ua", "ru"] as const;

export type Language = (typeof languages)[number];

export const DEFAULT_LANGUAGE: Language = "en";

export const languageOptions: { label: string; value: Language }[] = [
	{ label: "English", value: "en" },
	{ label: "Ukrainian", value: "ua" },
	{ label: "Russian", value: "ru" },
];

export const languageNames: Record<Language, string> = {
	en: "English",
	ua: "Ukrainian",
	ru: "Russian",
} as const;

export type LanguageName = (typeof languageNames)[Language];

export function isLanguage(value: unknown): value is Language {
	return typeof value === "string" && languages.includes(value as Language);
}

export function toLanguage(value: unknown): Language {
	return isLanguage(value) ? value : DEFAULT_LANGUAGE;
}

export function getLanguageName(language: Language): LanguageName {
	return languageNames[language];
}
