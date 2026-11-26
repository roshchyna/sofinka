// @vitest-environment jsdom

import {
	composeStories,
	type ReactRenderer,
	setProjectAnnotations,
} from "@storybook/react-vite";
import { cleanup } from "@testing-library/react";
import type { Store_CSFExports } from "storybook/internal/types";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { setMockApiFailure } from "../.storybook/mock-api";
import preview from "../.storybook/preview";

vi.mock("@/lib/reward-success", () => ({ rewardCorrectAnswer: vi.fn() }));
vi.mock("lottie-react", () => ({
	default: () => <div role="img" aria-label="Animation preview" />,
}));

const annotations = setProjectAnnotations(preview);
const modules = import.meta.glob<Store_CSFExports<ReactRenderer>>(
	"./**/*.stories.tsx",
	{ eager: true },
);

beforeAll(async () => {
	vi.stubGlobal("BroadcastChannel", undefined);
	vi.stubGlobal(
		"ResizeObserver",
		class {
			observe() {}
			unobserve() {}
			disconnect() {}
		},
	);
	vi.stubGlobal("matchMedia", () => ({
		matches: false,
		addEventListener() {},
		removeEventListener() {},
	}));
	HTMLElement.prototype.scrollTo = vi.fn();
	window.scrollTo = vi.fn();
	await annotations.beforeAll?.();
});

afterEach(() => {
	cleanup();
	window.localStorage.clear();
	setMockApiFailure(false);
});

for (const [path, module] of Object.entries(modules)) {
	describe(path, () => {
		const stories: Record<string, { run: () => Promise<void> }> =
			composeStories(module);
		for (const [name, story] of Object.entries(stories)) {
			it(name, async () => {
				await story.run();
			});
		}
	});
}

describe("Storybook API isolation", () => {
	it("generates local fixtures without contacting the AI server", async () => {
		const response = await fetch("/api/generate-questions", {
			method: "POST",
			body: JSON.stringify({
				language: "Ukrainian",
				type: "sorting",
				count: 2,
			}),
		});
		const data = await response.json();
		expect(data.questions).toHaveLength(2);
		expect(data.questions[0].type).toBe("sorting");
	});
	it("mocks chat and rejects unconfigured API requests", async () => {
		const response = await fetch("/api/muza-assistant", {
			method: "POST",
			body: JSON.stringify({ language: "English" }),
		});
		expect((await response.json()).reply).toContain("34 = 30 + 4");
		expect((await fetch("/api/unconfigured")).status).toBe(501);
	});
});
