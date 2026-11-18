import { expect, it } from "vitest";
import { getLocalizedPath } from "./localized-path";

it("preserves the complete course and lesson path when changing language", () => {
	expect(getLocalizedPath("/en/learn/math-to-100/tens-and-ones", "ua")).toBe(
		"/ua/learn/math-to-100/tens-and-ones",
	);
	expect(getLocalizedPath("/ua/learn/math-to-100", "ru")).toBe(
		"/ru/learn/math-to-100",
	);
	expect(getLocalizedPath("/en/constructor/", "ru")).toBe("/ru/constructor");
	expect(getLocalizedPath("/", "en")).toBe("/en");
});
