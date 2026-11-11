import { createInstance } from "i18next";
import { renderToStaticMarkup } from "react-dom/server";
import { I18nextProvider } from "react-i18next";
import { assert, describe, expect, it } from "vitest";

import { QuestionRenderer } from "@/components/questions/question-renderer";
import { getTextInputAnswers } from "@/components/questions/question-types";
import {
	type DemoQuestion,
	demoLessonSources,
	getDemoLesson,
} from "@/data/demo-lesson";
import { languages } from "@/i18n/languages";
import { resources } from "@/i18n/resources";

function readNumbers(text: string) {
	return (text.match(/\d+/g) ?? []).map(Number);
}

function calculate(text: string) {
	const match = text.match(/(\d+)\s*([+−×÷])\s*(\d+)/);
	assert(match, `Expected an arithmetic expression in: ${text}`);
	const left = Number(match[1]);
	const right = Number(match[3]);

	switch (match[2]) {
		case "+":
			return left + right;
		case "−":
			return left - right;
		case "×":
			return left * right;
		case "÷":
			return left / right;
		default:
			throw new Error(`Unsupported expression: ${text}`);
	}
}

function singleAnswer(question: DemoQuestion) {
	assert(question.type === "single-choice");
	const correctOptions = question.options.filter((option) => option.isCorrect);
	expect(correctOptions).toHaveLength(1);
	return Number(correctOptions[0].label);
}

describe.each(languages)("demo lesson in %s", (language) => {
	const lesson = getDemoLesson(language);

	function questionById(id: number) {
		const question = lesson.questions.find((item) => item.id === id);
		assert(question, `Missing question ${id}`);
		return question;
	}

	it("contains twelve complete questions with stable identifiers and topic references", () => {
		expect(lesson.age).toBe(8);
		expect(lesson.language).toBe(language);
		expect(lesson.questions).toHaveLength(12);
		expect(lesson.questions.map((question) => question.id)).toEqual(
			Array.from({ length: 12 }, (_, index) => index + 1),
		);

		for (const question of lesson.questions) {
			for (const text of [
				question.title,
				question.description,
				question.hint,
				question.explanation,
			]) {
				expect(text?.trim().length).toBeGreaterThan(0);
			}
			expect(question.skill.length).toBeGreaterThan(0);
			expect(question.sourceIds.length).toBeGreaterThan(0);
			for (const sourceId of question.sourceIds) {
				expect(demoLessonSources[sourceId].url).toMatch(/^https:\/\//);
			}
		}
	});

	it("checks numeric answers against the actual translated conditions and expressions", () => {
		const addition = questionById(1);
		expect(singleAnswer(addition)).toBe(calculate(addition.title));

		const subtraction = questionById(2);
		assert(subtraction.type === "text-input");
		expect(getTextInputAnswers(subtraction)).toContain(
			String(calculate(subtraction.title)),
		);

		const equivalent = questionById(3);
		assert(equivalent.type === "multiple-choice");
		const [target] = readNumbers(equivalent.title);
		for (const option of equivalent.options) {
			expect(option.isCorrect).toBe(calculate(option.label) === target);
		}

		const matching = questionById(4);
		assert(matching.type === "matching");
		for (const pair of matching.pairs) {
			expect(Number(pair.right)).toBe(calculate(pair.left));
		}

		const wordProblem = questionById(5);
		const quantities = readNumbers(wordProblem.title);
		expect(quantities).toHaveLength(3);
		const [boxes, pencils, givenAway] = quantities;
		expect(singleAnswer(wordProblem)).toBe(boxes * pencils - givenAway);

		const ordering = questionById(6);
		assert(ordering.type === "ordering");
		const ordered = ordering.items.map((item) => Number(item.label));
		expect(ordered).toEqual([...ordered].sort((a, b) => a - b));

		const pattern = questionById(7);
		const sequence = readNumbers(pattern.title);
		expect(sequence).toHaveLength(4);
		const step = sequence[1] - sequence[0];
		for (let index = 1; index < sequence.length; index += 1) {
			expect(sequence[index] - sequence[index - 1]).toBe(step);
		}
		expect(singleAnswer(pattern)).toBe(sequence[sequence.length - 1] + step);

		const sorting = questionById(8);
		assert(sorting.type === "sorting");
		for (const item of sorting.items) {
			expect(item.categoryId).toBe(
				Number(item.label) % 2 === 0 ? "even" : "odd",
			);
		}

		const halves = questionById(9);
		assert(halves.type === "true-false");
		const [whole, proposedHalf] = readNumbers(halves.title);
		expect(halves.answer).toBe(whole / 2 === proposedHalf);

		const time = questionById(10);
		assert(time.type === "text-input");
		const [hours, minutes, duration] = readNumbers(time.title);
		const finish = hours * 60 + minutes + duration;
		const expected = `${String(Math.floor(finish / 60)).padStart(2, "0")}:${String(finish % 60).padStart(2, "0")}`;
		const acceptedAnswers = getTextInputAnswers(time);
		expect(acceptedAnswers).toContain(expected);
		for (const answer of acceptedAnswers) {
			expect(answer.replace(".", ":")).toBe(expected);
		}
	});

	it("has one solid shape and a unique solution to the number-card puzzle", () => {
		const geometry = questionById(11);
		assert(geometry.type === "odd-one-out");
		expect(
			geometry.options
				.filter((option) => option.isCorrect)
				.map((option) => option.id),
		).toEqual(["cube"]);

		const logic = questionById(12);
		const cards = readNumbers(logic.title);
		expect(cards).toHaveLength(3);
		const solutions: number[] = [];
		for (const mia of cards) {
			for (const leo of cards) {
				for (const sam of cards) {
					if (
						new Set([mia, leo, sam]).size === 3 &&
						mia === Math.max(...cards) &&
						leo < sam
					) {
						solutions.push(sam);
					}
				}
			}
		}
		expect(solutions).toHaveLength(1);
		expect(singleAnswer(logic)).toBe(solutions[0]);
	});

	it("renders every question with the existing cards in its selected language", async () => {
		const i18n = createInstance();
		await i18n.init({ resources, lng: language, fallbackLng: "en" });

		for (const question of lesson.questions) {
			const markup = renderToStaticMarkup(
				<I18nextProvider i18n={i18n}>
					<QuestionRenderer question={question} />
				</I18nextProvider>,
			);
			expect(markup).toContain(renderToStaticMarkup(question.title));
			expect(markup).toContain(renderToStaticMarkup(question.description));
			expect(markup).not.toContain(i18n.t("questionCard.unsupported"));
			if (question.type === "true-false") {
				expect(question.description).toContain(i18n.t("editor.true"));
				expect(question.description).toContain(i18n.t("editor.false"));
			}
		}
	});
});
