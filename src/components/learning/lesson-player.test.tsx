// @vitest-environment jsdom

import {
	createMemoryHistory,
	createRootRoute,
	createRoute,
	createRouter,
	RouterProvider,
	useParams,
} from "@tanstack/react-router";
import {
	act,
	cleanup,
	fireEvent,
	render,
	screen,
	waitFor,
	within,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Question } from "@/components/questions/question-types";
import { learningCopy } from "@/data/courses/learning-copy";
import {
	FIRST_LESSON_ID,
	getMathCourse,
	MATH_COURSE_ID,
} from "@/data/courses/math-to-100";
import i18n from "@/i18n";
import { type Language, toLanguage } from "@/i18n/languages";
import { sessionKey } from "@/lib/learning/session";
import {
	LEARNING_STORAGE_KEY,
	parseLearningProgress,
} from "@/lib/learning/storage";
import { rewardCorrectAnswer } from "@/lib/reward-success";
import { CourseOverview } from "./course-overview";
import { LearningLessonPlayer } from "./lesson-player";

vi.mock("@/lib/reward-success", () => ({ rewardCorrectAnswer: vi.fn() }));

beforeEach(() => {
	window.localStorage.clear();
	vi.clearAllMocks();
	vi.spyOn(window, "scrollTo").mockImplementation(() => {});
});
afterEach(() => {
	cleanup();
	vi.restoreAllMocks();
});

function TestCourseOverview() {
	const params = useParams({ strict: false });
	return <CourseOverview language={toLanguage(params.language)} />;
}

async function renderLesson(language: Language = "en") {
	await i18n.changeLanguage(language);
	const root = createRootRoute();
	const overview = createRoute({
		getParentRoute: () => root,
		path: "/$language/learn/$courseId",
		component: TestCourseOverview,
	});
	const lesson = createRoute({
		getParentRoute: () => root,
		path: "/$language/learn/$courseId/$lessonId",
		validateSearch: (search: Record<string, unknown>): { mode?: "review" } => ({
			mode: search.mode === "review" ? "review" : undefined,
		}),
		component: () => (
			<LearningLessonPlayer
				language={toLanguage(lesson.useParams().language)}
				lessonId={lesson.useParams().lessonId}
				mode={lesson.useSearch().mode ?? "lesson"}
			/>
		),
	});
	const router = createRouter({
		routeTree: root.addChildren([overview, lesson]),
		history: createMemoryHistory({
			initialEntries: [
				`/${language}/learn/${MATH_COURSE_ID}/${FIRST_LESSON_ID}`,
			],
		}),
		defaultPendingMinMs: 0,
	});
	render(<RouterProvider router={router} />);
	await screen.findByRole("heading", {
		name: getMathCourse(language).publishedLessons[0].title,
		level: 1,
	});
	return router;
}

function begin(language: Language = "en") {
	fireEvent.click(
		screen.getByRole("button", { name: learningCopy[language].start }),
	);
	fireEvent.click(
		screen.getByRole("button", { name: learningCopy[language].next }),
	);
}

function answerCorrectly(question: Question) {
	switch (question.type) {
		case "single-choice": {
			const correct = question.options.find((option) => option.isCorrect);
			fireEvent.click(screen.getByRole("radio", { name: correct?.label }));
			break;
		}
		case "multiple-choice":
			for (const option of question.options.filter(
				(option) => option.isCorrect,
			))
				fireEvent.click(screen.getByRole("checkbox", { name: option.label }));
			break;
		case "text-input": {
			const input = screen.getByRole("textbox", { name: question.title });
			expect(input.getAttribute("inputmode")).toBe("numeric");
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
		default:
			throw new Error(
				`Unexpected first-lesson question type: ${question.type}`,
			);
	}
	fireEvent.click(screen.getByRole("button", { name: i18n.t("common.check") }));
}

describe("learning lesson interaction", () => {
	it.each([
		"en",
		"ua",
		"ru",
	] as const)("finishes the six-question lesson and offers review in %s", async (language) => {
		await renderLesson(language);
		const copy = learningCopy[language];
		begin(language);
		const lesson = getMathCourse(language).publishedLessons[0];
		for (const [index, exercise] of lesson.exercises.entries()) {
			if (index === 0)
				fireEvent.click(screen.getByRole("button", { name: copy.hint }));
			answerCorrectly(exercise.question);
			expect(screen.getByText(exercise.explanation)).toBeDefined();
			fireEvent.click(
				screen.getByRole("button", {
					name: index === 5 ? copy.finish : copy.next,
				}),
			);
		}
		expect(
			await screen.findByRole("heading", { name: copy.summary }),
		).toBeDefined();
		expect(screen.getByText("6 / 6")).toBeDefined();
		expect(screen.getByText("5 / 6")).toBeDefined();
		const progress = parseLearningProgress(
			window.localStorage.getItem(LEARNING_STORAGE_KEY) ?? "",
		);
		expect(progress?.sessions[sessionKey(lesson.id, "lesson")].status).toBe(
			"completed",
		);
		expect(progress?.attempts).toHaveLength(6);
		fireEvent.click(screen.getByRole("button", { name: copy.review }));
		expect(await screen.findByRole("radio", { name: "40 + 7" })).toBeDefined();
	});

	it("restores checked feedback and the following question without another reward", async () => {
		await renderLesson();
		begin();
		answerCorrectly(
			getMathCourse("en").publishedLessons[0].exercises[0].question,
		);
		expect(rewardCorrectAnswer).toHaveBeenCalledTimes(1);
		cleanup();
		await renderLesson();
		expect(screen.getByText(learningCopy.en.correct)).toBeDefined();
		expect(screen.queryByRole("radio")).toBeNull();
		expect(rewardCorrectAnswer).toHaveBeenCalledTimes(1);
		fireEvent.click(screen.getByRole("button", { name: learningCopy.en.next }));
		expect(
			screen.getByRole("textbox", {
				name: getMathCourse("en").publishedLessons[0].exercises[1].question
					.title,
			}),
		).toBeDefined();
	});

	it("preserves the current exercise and help when the route language changes", async () => {
		const router = await renderLesson();
		begin();
		fireEvent.click(screen.getByRole("button", { name: learningCopy.en.hint }));
		await act(async () => {
			await i18n.changeLanguage("ru");
			await router.navigate({
				to: "/$language/learn/$courseId/$lessonId",
				params: {
					language: "ru",
					courseId: MATH_COURSE_ID,
					lessonId: FIRST_LESSON_ID,
				},
				search: { mode: undefined },
			});
		});
		const exercise = getMathCourse("ru").publishedLessons[0].exercises[0];
		expect(await screen.findByText(exercise.question.title)).toBeDefined();
		expect(screen.getByText(exercise.hint)).toBeDefined();
		answerCorrectly(exercise.question);
		const progress = parseLearningProgress(
			window.localStorage.getItem(LEARNING_STORAGE_KEY) ?? "",
		);
		expect(progress?.attempts).toHaveLength(1);
		expect(progress?.attempts[0].hintUsed).toBe(true);
	});

	it("keeps malformed saved data untouched while allowing a temporary lesson", async () => {
		window.localStorage.setItem(LEARNING_STORAGE_KEY, "{unreadable");
		await renderLesson();
		expect(screen.getByText(learningCopy.en.invalidStorage)).toBeDefined();
		begin();
		expect(screen.getByRole("radio", { name: "30 + 4" })).toBeDefined();
		expect(window.localStorage.getItem(LEARNING_STORAGE_KEY)).toBe(
			"{unreadable",
		);
	});

	it("reports a save failure and continues in memory", async () => {
		await renderLesson();
		vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
			throw new Error("quota");
		});
		begin();
		expect(await screen.findByText(learningCopy.en.storageError)).toBeDefined();
		expect(screen.queryByText(learningCopy.en.paused)).toBeNull();
		answerCorrectly(
			getMathCourse("en").publishedLessons[0].exercises[0].question,
		);
		expect(screen.getByText(learningCopy.en.correct)).toBeDefined();
	});

	it("shows the six-lesson outline and resumes an unfinished lesson", async () => {
		const router = await renderLesson();
		begin();
		await act(async () => {
			await router.navigate({
				to: "/$language/learn/$courseId",
				params: { language: "en", courseId: MATH_COURSE_ID },
			});
		});
		expect(
			await screen.findByRole("heading", {
				name: getMathCourse("en").title,
				level: 1,
			}),
		).toBeDefined();
		expect(screen.getAllByText(learningCopy.en.comingSoon)).toHaveLength(5);
		expect(
			screen.getAllByRole("link", { name: learningCopy.en.resume }).length,
		).toBeGreaterThan(0);
		fireEvent.click(
			screen.getAllByRole("link", { name: learningCopy.en.resume })[0],
		);
		await waitFor(() =>
			expect(screen.getByRole("radio", { name: "30 + 4" })).toBeDefined(),
		);
	});
});
