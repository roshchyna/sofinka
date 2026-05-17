// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	CHILD_AGE_CHANGED_EVENT,
	childAgeOptions,
	getChildAge,
	saveChildAge,
} from "@/lib/child-age-storage";

describe("child age storage", () => {
	beforeEach(() => {
		window.localStorage.clear();
	});

	it("returns the default child age when storage is empty", () => {
		expect(getChildAge()).toBe(7);
	});

	it("returns a saved allowed child age", () => {
		window.localStorage.setItem("sofinka.childAge", "5");

		expect(getChildAge()).toBe(5);
	});

	it("ignores unsupported child ages", () => {
		window.localStorage.setItem("sofinka.childAge", "99");

		expect(getChildAge()).toBe(7);
	});

	it("saves age and dispatches the changed event", () => {
		const listener = vi.fn();
		window.addEventListener(CHILD_AGE_CHANGED_EVENT, listener);

		saveChildAge(8);

		expect(window.localStorage.getItem("sofinka.childAge")).toBe("8");
		expect(listener).toHaveBeenCalledTimes(1);
		window.removeEventListener(CHILD_AGE_CHANGED_EVENT, listener);
	});

	it("keeps the supported age range explicit", () => {
		expect(childAgeOptions).toEqual([3, 4, 5, 6, 7, 8, 9, 10]);
	});
});
