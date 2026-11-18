import type { Language } from "@/i18n/languages";

export function getLocalizedPath(pathname: string, language: Language) {
	const segments = pathname.split("/").filter(Boolean);
	return `/${[language, ...segments.slice(1)].join("/")}`;
}
