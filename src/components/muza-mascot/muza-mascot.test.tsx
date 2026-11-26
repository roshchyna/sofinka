// @vitest-environment jsdom

import {
	act,
	cleanup,
	fireEvent,
	render,
	screen,
} from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MuzaMascot } from "./muza-mascot";

afterEach(() => {
	cleanup();
	vi.useRealTimers();
});

describe("MuzaMascot", () => {
	it("greets on activation and returns to idle without submitting a surrounding form", () => {
		vi.useFakeTimers();
		const onSubmit = vi.fn();
		render(
			<form onSubmit={onSubmit}>
				<MuzaMascot interactive label="Greet Muza" />
			</form>,
		);
		const button = screen.getByRole("button", { name: "Greet Muza" });
		fireEvent.click(button);
		expect(button.querySelector("svg")?.dataset.state).toBe("happy");
		expect(onSubmit).not.toHaveBeenCalled();
		act(() => vi.advanceTimersByTime(1600));
		expect(button.querySelector("svg")?.dataset.state).toBe("idle");
	});

	it("lets application state override a greeting and stops talking when audio state ends", () => {
		vi.useFakeTimers();
		const { rerender } = render(<MuzaMascot interactive label="Muza" />);
		fireEvent.click(screen.getByRole("button", { name: "Muza" }));
		rerender(<MuzaMascot interactive label="Muza" state="speaking" />);
		expect(document.querySelector(".muza-speaking-mouth")).not.toBeNull();
		act(() => vi.advanceTimersByTime(1600));
		rerender(<MuzaMascot interactive label="Muza" state="thinking" />);
		expect(document.querySelector(".muza-speaking-mouth")).toBeNull();
		expect(document.querySelector("svg")?.dataset.state).toBe("thinking");
		rerender(<MuzaMascot interactive label="Muza" state="idle" />);
		expect(document.querySelector("svg")?.dataset.state).toBe("idle");
	});

	it("exposes one accessible image without adding a focus target in the chat", () => {
		render(<MuzaMascot label="Помічниця Муза" state="listening" />);
		expect(screen.getByRole("img", { name: "Помічниця Муза" })).toBeTruthy();
		expect(screen.queryByRole("button")).toBeNull();
		expect(document.querySelector("svg")?.getAttribute("aria-hidden")).toBe(
			"true",
		);
	});

	it("renders deterministically for SSR without browser storage or canvas", () => {
		const markup = renderToString(<MuzaMascot label="Muza" state="hint" />);
		expect(markup).toBe(
			renderToString(<MuzaMascot label="Muza" state="hint" />),
		);
		expect(markup).toContain('data-state="hint"');
		expect(markup).not.toContain("canvas");
	});
});
