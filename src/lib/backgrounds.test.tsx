// @vitest-environment jsdom

import { runInNewContext } from "node:vm";
import { act } from "@testing-library/react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApplicationBackground } from "@/common/application-background";
import { backgroundScript, backgrounds } from "./backgrounds";

function runSetup() {
	runInNewContext(backgroundScript, { document, Math });
}

function selectedBackground() {
	return document.documentElement.dataset.background;
}

beforeEach(() => {
	sessionStorage.clear();
	document.documentElement.style.removeProperty("--sofinka-background-image");
	delete document.documentElement.dataset.background;
});

afterEach(() => {
	vi.restoreAllMocks();
	document.body.replaceChildren();
});

describe("pre-paint background setup", () => {
	it("selects a background and applies its URL", () => {
		vi.spyOn(Math, "random").mockReturnValue(0.99);
		runSetup();
		const expected = backgrounds[backgrounds.length - 1];
		expect(selectedBackground()).toBe(expected.id);
		expect(
			document.documentElement.style.getPropertyValue(
				"--sofinka-background-image",
			),
		).toContain(expected.src);
	});

	it("rolls again when setup runs again", () => {
		const random = vi
			.spyOn(Math, "random")
			.mockReturnValueOnce(0)
			.mockReturnValueOnce(0.99);
		runSetup();
		expect(selectedBackground()).toBe(backgrounds[0].id);
		runSetup();
		expect(selectedBackground()).toBe(backgrounds[backgrounds.length - 1].id);
		expect(random).toHaveBeenCalledTimes(2);
	});

	it("does not depend on session storage", () => {
		sessionStorage.setItem("sofinka.background.v1", "removed-background");
		const getItem = vi.spyOn(Storage.prototype, "getItem");
		const setItem = vi.spyOn(Storage.prototype, "setItem");
		vi.spyOn(Math, "random").mockReturnValue(0);

		expect(runSetup).not.toThrow();
		expect(selectedBackground()).toBe(backgrounds[0].id);
		expect(
			document.documentElement.style.getPropertyValue(
				"--sofinka-background-image",
			),
		).toContain("url(");
		expect(getItem).not.toHaveBeenCalled();
		expect(setItem).not.toHaveBeenCalled();
	});

	it("keeps server markup hydratable and the selection stable when page content changes", async () => {
		function Page({ title }: { title: string }) {
			return (
				<>
					<ApplicationBackground />
					<main>{title}</main>
				</>
			);
		}
		const container = document.createElement("div");
		document.body.append(container);
		container.innerHTML = renderToString(<Page title="Learn" />);
		runSetup();
		const selected = selectedBackground();
		const onRecoverableError = vi.fn();
		let root: ReturnType<typeof hydrateRoot> | undefined;
		await act(async () => {
			root = hydrateRoot(container, <Page title="Learn" />, {
				onRecoverableError,
			});
		});
		await act(async () => root?.render(<Page title="Constructor" />));
		expect(container.textContent).toBe("Constructor");
		expect(selectedBackground()).toBe(selected);
		expect(onRecoverableError).not.toHaveBeenCalled();
		await act(async () => root?.unmount());
	});
});
