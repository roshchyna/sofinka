import { describe, expect, it } from "vitest";
import {
	DEFAULT_LANGUAGE,
	getLanguageName,
	isLanguage,
	languageOptions,
	toLanguage,
} from "@/i18n/languages";

describe("language helpers", () => {
	it("recognizes supported language codes", () => {
		expect(isLanguage("en")).toBe(true);
		expect(isLanguage("uk")).toBe(true);
		expect(isLanguage("ru")).toBe(true);
		expect(isLanguage("ua")).toBe(false);
		expect(isLanguage("Ukrainian")).toBe(false);
	});

	it("falls back to the default language for unsupported values", () => {
		expect(toLanguage("en")).toBe("en");
		expect(toLanguage("uk")).toBe("uk");
		expect(toLanguage("bad")).toBe(DEFAULT_LANGUAGE);
		expect(toLanguage(undefined)).toBe(DEFAULT_LANGUAGE);
	});

	it("maps language codes to full API language names", () => {
		expect(getLanguageName("en")).toBe("English");
		expect(getLanguageName("uk")).toBe("Ukrainian");
		expect(getLanguageName("ru")).toBe("Russian");
	});

	it("keeps select labels and values in sync", () => {
		expect(languageOptions).toEqual([
			{ label: "English", value: "en" },
			{ label: "Ukrainian", value: "uk" },
			{ label: "Russian", value: "ru" },
		]);
	});
});
