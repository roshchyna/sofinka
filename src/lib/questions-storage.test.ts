// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Question } from "@/components/questions/question-types";
import { getDefaultQuestions } from "@/data/default-questions";
import {
	getQuestions,
	QUESTIONS_CHANGED_EVENT,
	resetQuestions,
	saveQuestions,
} from "@/lib/questions-storage";

function makeQuestion(id: number, title = `Question ${id}`): Question {
	return {
		id,
		type: "single-choice",
		title,
		options: [
			{ id: "option-1", label: "Correct", isCorrect: true },
			{ id: "option-2", label: "Wrong", isCorrect: false },
		],
	};
}

describe("questions storage", () => {
	beforeEach(() => {
		window.localStorage.clear();
	});

	it("returns localized default questions when storage is empty", () => {
		expect(getQuestions("en")).toBe(getDefaultQuestions("en"));
		expect(getQuestions("uk")).toBe(getDefaultQuestions("uk"));
		expect(getQuestions("ru")).toBe(getDefaultQuestions("ru"));
	});

	it("saves questions under a language-specific key", () => {
		const questions = [makeQuestion(101, "English question")];

		saveQuestions(questions, "en");

		expect(window.localStorage.getItem("sofinka.questions.en")).toBe(
			JSON.stringify(questions),
		);
		expect(getQuestions("en")).toEqual(questions);
		expect(getQuestions("ru")).toBe(getDefaultQuestions("ru"));
	});

	it("uses current saved language when language argument is omitted", () => {
		const questions = [makeQuestion(102, "Ukrainian question")];
		window.localStorage.setItem("sofinka.language", "uk");

		saveQuestions(questions);

		expect(getQuestions()).toEqual(questions);
		expect(window.localStorage.getItem("sofinka.questions.uk")).toBe(
			JSON.stringify(questions),
		);
	});

	it("falls back to the legacy questions key only for the default language", () => {
		const questions = [makeQuestion(103, "Legacy question")];
		window.localStorage.setItem("sofinka.questions", JSON.stringify(questions));

		expect(getQuestions("ru")).toEqual(questions);
		expect(getQuestions("en")).toBe(getDefaultQuestions("en"));
	});

	it("ignores invalid stored question JSON", () => {
		window.localStorage.setItem("sofinka.questions.uk", "{bad json");

		expect(getQuestions("uk")).toBe(getDefaultQuestions("uk"));
	});

	it("resets questions to localized defaults and dispatches the changed event", () => {
		const listener = vi.fn();
		window.addEventListener(QUESTIONS_CHANGED_EVENT, listener);
		saveQuestions([makeQuestion(104)], "en");

		resetQuestions("en");

		expect(getQuestions("en")).toEqual(getDefaultQuestions("en"));
		expect(listener).toHaveBeenCalledTimes(2);
		window.removeEventListener(QUESTIONS_CHANGED_EVENT, listener);
	});
});
