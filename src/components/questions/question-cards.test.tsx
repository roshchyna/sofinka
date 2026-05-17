// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { OddOneOutQuestionCard } from "@/components/questions/odd-one-out-question-card";
import { TextInputQuestionCard } from "@/components/questions/text-input-question-card";
import { TrueFalseQuestionCard } from "@/components/questions/true-false-question-card";
import i18n from "@/i18n";

const { rewardCorrectAnswerMock } = vi.hoisted(() => ({
	rewardCorrectAnswerMock: vi.fn(),
}));

vi.mock("@/lib/reward-success", () => ({
	rewardCorrectAnswer: rewardCorrectAnswerMock,
}));

describe("question card smoke tests", () => {
	beforeEach(async () => {
		await i18n.changeLanguage("ru");
		rewardCorrectAnswerMock.mockClear();
	});

	afterEach(() => {
		rewardCorrectAnswerMock.mockClear();
	});

	it("accepts odd-one-out answer by isCorrect", () => {
		render(
			<OddOneOutQuestionCard
				question={{
					id: 1,
					type: "odd-one-out",
					title: "Какое животное не умеет летать?",
					options: [
						{ id: "sparrow", label: "Воробей", isCorrect: false },
						{ id: "penguin", label: "Пингвин", isCorrect: true },
					],
				}}
			/>,
		);

		fireEvent.click(screen.getByRole("radio", { name: "Пингвин" }));
		fireEvent.click(screen.getByRole("button", { name: "Проверить" }));

		expect(screen.getByText("Верно. Это лишний вариант.")).toBeTruthy();
		expect(rewardCorrectAnswerMock).toHaveBeenCalledTimes(1);
	});

	it("accepts true-false answer from options.isCorrect", () => {
		render(
			<TrueFalseQuestionCard
				question={{
					id: 1,
					type: "true-false",
					title: "Солнце - звезда.",
					options: [
						{ id: "true", label: "Правда", isCorrect: true },
						{ id: "false", label: "Неправда", isCorrect: false },
					],
				}}
			/>,
		);

		fireEvent.click(screen.getByRole("radio", { name: "Правда" }));
		fireEvent.click(screen.getByRole("button", { name: "Проверить" }));

		expect(screen.getByText("Верно. Отлично рассуждаешь.")).toBeTruthy();
		expect(rewardCorrectAnswerMock).toHaveBeenCalledTimes(1);
	});

	it("accepts text-input answer from options.isCorrect label", () => {
		render(
			<TextInputQuestionCard
				question={{
					id: 1,
					type: "text-input",
					title: "Как называется детёныш кошки?",
					options: [
						{ id: "kitten", label: "котёнок", isCorrect: true },
						{ id: "cat", label: "кошка", isCorrect: false },
					],
				}}
			/>,
		);

		fireEvent.change(screen.getByLabelText("Как называется детёныш кошки?"), {
			target: { value: "котёнок" },
		});
		fireEvent.click(screen.getByRole("button", { name: "Проверить" }));

		expect(screen.getByText("Верно. Ответ принят.")).toBeTruthy();
		expect(rewardCorrectAnswerMock).toHaveBeenCalledTimes(1);
	});
});
