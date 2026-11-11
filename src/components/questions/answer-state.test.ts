// @vitest-environment jsdom

import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	useAnswerSubmission,
	useMultipleAnswer,
	useSingleAnswer,
} from "@/components/questions/answer-state";

const { rewardCorrectAnswerMock } = vi.hoisted(() => ({
	rewardCorrectAnswerMock: vi.fn(),
}));

vi.mock("@/lib/reward-success", () => ({
	rewardCorrectAnswer: rewardCorrectAnswerMock,
}));

const options = [
	{ id: "wrong", isCorrect: false },
	{ id: "correct", isCorrect: true },
];

describe("answer submission reporting", () => {
	beforeEach(() => rewardCorrectAnswerMock.mockClear());

	it("reports and rewards a rapid duplicate submission only once and snapshots its value", () => {
		const onAnswer = vi.fn();
		const value = { first: "second" };
		const { result } = renderHook(() =>
			useAnswerSubmission({
				canSubmit: true,
				isCorrect: true,
				questionId: 4,
				value,
				onAnswer,
			}),
		);
		act(() => {
			result.current.submitAnswer();
			result.current.submitAnswer();
		});
		value.first = "changed";
		expect(onAnswer).toHaveBeenCalledExactlyOnceWith({
			questionId: 4,
			isCorrect: true,
			value: { first: "second" },
		});
		expect(rewardCorrectAnswerMock).toHaveBeenCalledTimes(1);
	});
});

describe("useSingleAnswer", () => {
	beforeEach(() => {
		rewardCorrectAnswerMock.mockClear();
	});

	it("marks a selected correct option as correct", () => {
		const { result } = renderHook(() => useSingleAnswer(options));

		act(() => result.current.chooseOption("correct"));

		expect(result.current.canSubmit).toBe(true);
		expect(result.current.isCorrect).toBe(true);
		expect(result.current.isSelected("correct")).toBe(true);
	});

	it("does not mark a selected wrong option as correct", () => {
		const { result } = renderHook(() => useSingleAnswer(options));

		act(() => result.current.chooseOption("wrong"));

		expect(result.current.isCorrect).toBe(false);
		expect(result.current.isSelected("wrong")).toBe(true);
	});

	it("submits and rewards only a correct answer", () => {
		const { result } = renderHook(() => useSingleAnswer(options));

		act(() => result.current.chooseOption("correct"));
		act(() => result.current.submitAnswer());

		expect(result.current.isSubmitted).toBe(true);
		expect(rewardCorrectAnswerMock).toHaveBeenCalledTimes(1);
	});

	it("prevents changing the selected option after submit", () => {
		const { result } = renderHook(() => useSingleAnswer(options));

		act(() => result.current.chooseOption("correct"));
		act(() => result.current.submitAnswer());
		act(() => result.current.chooseOption("wrong"));

		expect(result.current.isSelected("correct")).toBe(true);
		expect(result.current.isSelected("wrong")).toBe(false);
	});

	it("resets the answer state", () => {
		const { result } = renderHook(() => useSingleAnswer(options));

		act(() => result.current.chooseOption("correct"));
		act(() => result.current.submitAnswer());
		act(() => result.current.resetAnswer());

		expect(result.current.canSubmit).toBe(false);
		expect(result.current.isCorrect).toBe(false);
		expect(result.current.isSubmitted).toBe(false);
	});
});

describe("useMultipleAnswer", () => {
	beforeEach(() => {
		rewardCorrectAnswerMock.mockClear();
	});

	it("marks the exact set of correct options as correct", () => {
		const multipleOptions = [
			{ id: "a", isCorrect: true },
			{ id: "b", isCorrect: true },
			{ id: "c", isCorrect: false },
		];
		const { result } = renderHook(() => useMultipleAnswer(multipleOptions));

		act(() => result.current.toggleOption("a"));
		act(() => result.current.toggleOption("b"));

		expect(result.current.canSubmit).toBe(true);
		expect(result.current.isCorrect).toBe(true);
	});

	it("rejects incomplete and extra selections", () => {
		const multipleOptions = [
			{ id: "a", isCorrect: true },
			{ id: "b", isCorrect: true },
			{ id: "c", isCorrect: false },
		];
		const { result } = renderHook(() => useMultipleAnswer(multipleOptions));

		act(() => result.current.toggleOption("a"));
		expect(result.current.isCorrect).toBe(false);

		act(() => result.current.toggleOption("b"));
		act(() => result.current.toggleOption("c"));
		expect(result.current.isCorrect).toBe(false);
	});

	it("submits and rewards a correct multiple answer", () => {
		const multipleOptions = [
			{ id: "a", isCorrect: true },
			{ id: "b", isCorrect: true },
		];
		const { result } = renderHook(() => useMultipleAnswer(multipleOptions));

		act(() => result.current.toggleOption("a"));
		act(() => result.current.toggleOption("b"));
		act(() => result.current.submitAnswer());

		expect(result.current.isSubmitted).toBe(true);
		expect(rewardCorrectAnswerMock).toHaveBeenCalledTimes(1);
	});
});
