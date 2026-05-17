import { describe, expect, it } from "vitest";
import {
	getOptionIsCorrect,
	getTextInputAnswers,
	type TextInputQuestion,
} from "@/components/questions/question-types";

describe("question type helpers", () => {
	it("gets text-input answers from answers", () => {
		const question: TextInputQuestion = {
			id: 1,
			type: "text-input",
			title: "Question",
			answers: ["kitten"],
		};

		expect(getTextInputAnswers(question)).toEqual(["kitten"]);
	});

	it("gets text-input answers from legacy answer", () => {
		const question: TextInputQuestion = {
			id: 1,
			type: "text-input",
			title: "Question",
			answer: "kitten",
		};

		expect(getTextInputAnswers(question)).toEqual(["kitten"]);
	});

	it("gets text-input answers from options marked isCorrect", () => {
		const question: TextInputQuestion = {
			id: 1,
			type: "text-input",
			title: "Question",
			options: [
				{ id: "option-1", label: "kitten", isCorrect: true },
				{ id: "option-2", label: "cat", isCorrect: false },
			],
		};

		expect(getTextInputAnswers(question)).toEqual(["kitten"]);
	});

	it("prefers isCorrect over legacy isOddOneOut", () => {
		expect(getOptionIsCorrect({ isCorrect: true, isOddOneOut: false })).toBe(
			true,
		);
		expect(getOptionIsCorrect({ isCorrect: false, isOddOneOut: true })).toBe(
			false,
		);
	});

	it("supports legacy isOddOneOut when isCorrect is missing", () => {
		expect(getOptionIsCorrect({ isOddOneOut: true })).toBe(true);
		expect(getOptionIsCorrect({ isOddOneOut: false })).toBe(false);
	});
});
