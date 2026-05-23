// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	getLanguage,
	LANGUAGE_CHANGED_EVENT,
	saveLanguage,
} from "@/lib/language-storage";

describe("language storage", () => {
	beforeEach(() => {
		window.localStorage.clear();
	});

	it("returns the default language when storage is empty", () => {
		expect(getLanguage()).toBe("en");
	});

	it("returns a saved supported language", () => {
		window.localStorage.setItem("sofinka.language", "ua");

		expect(getLanguage()).toBe("ua");
	});

	it("ignores unsupported stored language values", () => {
		window.localStorage.setItem("sofinka.language", "uk");

		expect(getLanguage()).toBe("en");
	});

	it("saves language and dispatches the changed event", () => {
		const listener = vi.fn();
		window.addEventListener(LANGUAGE_CHANGED_EVENT, listener);

		saveLanguage("en");

		expect(window.localStorage.getItem("sofinka.language")).toBe("en");
		expect(listener).toHaveBeenCalledTimes(1);
		window.removeEventListener(LANGUAGE_CHANGED_EVENT, listener);
	});
});
