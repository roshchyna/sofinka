import { describe, expect, it } from "vitest";
import { normalizeGeneratedResponse } from "./question-normalizers.mjs";

function normalize(question, request) {
	return normalizeGeneratedResponse(
		{ questions: [question] },
		{ language: "Russian", topic: "Животные", ...request },
	).questions[0];
}

describe("normalizeGeneratedResponse", () => {
	it("keeps odd-one-out correctness on isCorrect", () => {
		const question = normalize(
			{
				id: 9,
				title: "Какое животное не умеет летать?",
				options: [
					{ id: "sparrow", label: "Воробей", isCorrect: false },
					{ id: "penguin", label: "Пингвин", isCorrect: true },
				],
			},
			{ type: "odd-one-out" },
		);

		expect(question.type).toBe("odd-one-out");
		expect(question.options).toEqual([
			{ id: "sparrow", label: "Воробей", isCorrect: false },
			{ id: "penguin", label: "Пингвин", isCorrect: true },
		]);
	});

	it("supports old odd-one-out isOddOneOut as migration fallback", () => {
		const question = normalize(
			{
				options: [
					{ id: "apple", label: "Яблоко", isOddOneOut: false },
					{ id: "car", label: "Машина", isOddOneOut: true },
				],
			},
			{ type: "odd-one-out" },
		);

		expect(question.options).toEqual([
			{ id: "apple", label: "Яблоко", isCorrect: false },
			{ id: "car", label: "Машина", isCorrect: true },
		]);
	});

	it("normalizes true-false answers into options", () => {
		const question = normalize(
			{
				title: "Коровы дают молоко?",
				answer: false,
			},
			{ type: "true-false" },
		);

		expect(question.options).toEqual([
			{ id: "option-1", label: "Правда", isCorrect: false },
			{ id: "option-2", label: "Неправда", isCorrect: true },
		]);
	});

	it("normalizes text-input answers from answers", () => {
		const question = normalize(
			{
				answers: [" котёнок ", "", "котенок"],
				placeholder: "Ответ",
			},
			{ type: "text-input" },
		);

		expect(question.answers).toEqual(["котёнок", "котенок"]);
		expect(question.placeholder).toBe("Ответ");
	});

	it("normalizes text-input answers from correct options", () => {
		const question = normalize(
			{
				options: [
					{ id: "option-1", label: "котёнок", isCorrect: true },
					{ id: "option-2", label: "кошка", isCorrect: false },
				],
			},
			{ type: "text-input" },
		);

		expect(question.answers).toEqual(["котёнок"]);
	});

	it("creates safe fallback options when option answers are missing", () => {
		const question = normalize(
			{
				title: "",
				options: [],
			},
			{ topic: "Космос", type: "single-choice" },
		);

		expect(question.title).toBe("Вопрос про Космос");
		expect(question.options).toEqual([
			{ id: "option-1", label: "Космос", isCorrect: true },
			{ id: "option-2", label: "Другой вариант", isCorrect: false },
		]);
	});
});
