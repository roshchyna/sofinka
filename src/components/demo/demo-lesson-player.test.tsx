// @vitest-environment jsdom

import {
	createMemoryHistory,
	createRootRoute,
	createRoute,
	createRouter,
	RouterProvider,
} from "@tanstack/react-router";
import {
	cleanup,
	fireEvent,
	render,
	screen,
	within,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { DemoLessonPlayer } from "@/components/demo/demo-lesson-player";
import type { DemoQuestion } from "@/data/demo-lesson";
import { getDemoLesson } from "@/data/demo-lesson";
import i18n from "@/i18n";
import { type Language, languages } from "@/i18n/languages";

vi.mock("@/lib/reward-success", () => ({ rewardCorrectAnswer: vi.fn() }));

beforeEach(() => {
	vi.spyOn(window, "scrollTo").mockImplementation(() => {});
});

afterEach(() => {
	cleanup();
	vi.restoreAllMocks();
});

async function renderLesson(language: Language) {
	await i18n.changeLanguage(language);
	const root = createRootRoute();
	const demo = createRoute({
		getParentRoute: () => root,
		path: "/$language/demo",
		component: () => <DemoLessonPlayer language={language} />,
	});
	const home = createRoute({
		getParentRoute: () => root,
		path: "/$language",
		component: () => <h1>Quiz</h1>,
	});
	const router = createRouter({
		routeTree: root.addChildren([demo, home]),
		history: createMemoryHistory({ initialEntries: [`/${language}/demo`] }),
		defaultPendingMinMs: 0,
	});
	render(<RouterProvider router={router} />);
	return screen.findByRole("button", { name: i18n.t("demo.start") });
}

function answerCorrectly(question: DemoQuestion) {
	switch (question.type) {
		case "single-choice":
		case "odd-one-out":
		case "image-choice": {
			const option = question.options.find((item) => item.isCorrect);
			expect(option).toBeDefined();
			fireEvent.click(screen.getByRole("radio", { name: option?.label }));
			break;
		}
		case "multiple-choice":
			for (const option of question.options.filter((item) => item.isCorrect)) {
				fireEvent.click(screen.getByRole("checkbox", { name: option.label }));
			}
			break;
		case "true-false":
			fireEvent.click(
				screen.getByRole("radio", {
					name: i18n.t(question.answer ? "editor.true" : "editor.false"),
				}),
			);
			break;
		case "text-input": {
			const input = screen.getByRole("textbox", { name: question.title });
			fireEvent.change(input, { target: { value: question.answers?.[0] } });
			fireEvent.keyDown(input, { key: "Enter" });
			return;
		}
		case "matching": {
			const left = screen.getByRole("group", {
				name: i18n.t("questionCard.matchingLeftTitle"),
			});
			const right = screen.getByRole("group", {
				name: i18n.t("questionCard.matchingRightTitle"),
			});
			for (const pair of question.pairs) {
				fireEvent.click(within(left).getByRole("button", { name: pair.left }));
				fireEvent.click(
					within(right).getByRole("button", { name: pair.right }),
				);
			}
			break;
		}
		case "ordering": {
			const list = screen.getByRole("list");
			for (const [target, item] of question.items.entries()) {
				const index = within(list)
					.getAllByRole("listitem")
					.findIndex((row) => within(row).queryByText(item.label));
				expect(index).toBeGreaterThanOrEqual(target);
				for (let position = index; position > target; position -= 1) {
					const row = within(list).getAllByRole("listitem")[position];
					fireEvent.click(
						within(row).getByRole("button", {
							name: i18n.t("questionCard.moveItemUp", { item: item.label }),
						}),
					);
				}
			}
			break;
		}
		case "sorting":
			for (const item of question.items) {
				fireEvent.click(screen.getByRole("button", { name: item.label }));
				const category = question.categories.find(
					(group) => group.id === item.categoryId,
				);
				const group = screen.getByRole("group", { name: category?.label });
				fireEvent.click(
					within(group).getByRole("button", {
						name: i18n.t("questionCard.sortingPlace", { item: item.label }),
					}),
				);
			}
	}
	const check = screen.getByRole("button", { name: i18n.t("common.check") });
	expect((check as HTMLButtonElement).disabled).toBe(false);
	fireEvent.click(check);
}

describe.each(languages)("demo lesson flow in %s", (language) => {
	it("shows explanations after checking and starts a fresh card on the next question", async () => {
		const start = await renderLesson(language);
		fireEvent.click(start);
		expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
			i18n.t("demo.questionProgress", { current: 1, total: 12 }),
		);
		expect(document.activeElement).toBe(
			screen.getByRole("heading", { level: 1 }),
		);
		expect(
			screen.queryByRole("button", { name: i18n.t("demo.nextQuestion") }),
		).toBeNull();
		expect(
			(
				screen.getByRole("button", {
					name: i18n.t("common.check"),
				}) as HTMLButtonElement
			).disabled,
		).toBe(true);

		const lesson = getDemoLesson(language);
		answerCorrectly(lesson.questions[0]);
		expect(screen.getByText(lesson.questions[0].explanation)).toBeTruthy();
		expect(document.activeElement).toBe(
			screen.getByRole("heading", { name: i18n.t("demo.explanationTitle") }),
		);
		expect(
			screen.queryByRole("button", { name: i18n.t("common.tryAgain") }),
		).toBeNull();
		fireEvent.click(
			screen.getByRole("button", { name: i18n.t("demo.nextQuestion") }),
		);
		expect(
			screen.getByRole("textbox", { name: lesson.questions[1].title }),
		).toBeTruthy();
		expect(screen.queryByText(lesson.questions[0].explanation)).toBeNull();
		expect(screen.getByRole("progressbar").getAttribute("value")).toBe("1");
	});

	it("completes all twelve real cards, counts the first wrong answer and restarts cleanly", async () => {
		fireEvent.click(await renderLesson(language));
		const lesson = getDemoLesson(language);

		for (const [index, question] of lesson.questions.entries()) {
			expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
				i18n.t("demo.questionProgress", { current: index + 1, total: 12 }),
			);
			if (index === 0) {
				fireEvent.click(screen.getByRole("radio", { name: "32" }));
				fireEvent.click(
					screen.getByRole("button", { name: i18n.t("common.check") }),
				);
			} else {
				answerCorrectly(question);
			}
			expect(screen.getByText(question.explanation)).toBeTruthy();
			expect(screen.getByRole("progressbar").getAttribute("value")).toBe(
				String(index + 1),
			);
			fireEvent.click(
				screen.getByRole("button", {
					name: i18n.t(index === 11 ? "demo.finish" : "demo.nextQuestion"),
				}),
			);
		}

		expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
			i18n.t("demo.completedTitle"),
		);
		expect(screen.getByText("11 / 12")).toBeTruthy();
		fireEvent.click(
			screen.getByRole("button", { name: i18n.t("demo.playAgain") }),
		);
		expect(screen.getByRole("progressbar").getAttribute("value")).toBe("0");
		expect(
			screen.getByRole("radio", { name: "42" }).getAttribute("aria-checked"),
		).toBe("false");
		expect(
			screen.queryByRole("region", { name: i18n.t("demo.explanationTitle") }),
		).toBeNull();
		answerCorrectly(lesson.questions[0]);
		expect(screen.getByRole("progressbar").getAttribute("value")).toBe("1");
	}, 10000);
});
