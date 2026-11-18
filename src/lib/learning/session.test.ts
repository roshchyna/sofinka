// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";
import { FIRST_LESSON_ID, getMathCourse } from "@/data/courses/math-to-100";
import { recommendLearningSession } from "./recommendations";
import {
	createLearningSession,
	DAY_MS,
	emptyLearningProgress,
	learningReducer,
	sessionKey,
} from "./session";
import {
	LEARNING_STORAGE_KEY,
	loadLearningProgress,
	parseLearningProgress,
} from "./storage";
import type { LearningProgress, SessionMode } from "./types";

const course = getMathCourse("en");
const lesson = course.publishedLessons[0];
const now = Date.UTC(2026, 10, 17, 15);
const key = sessionKey(FIRST_LESSON_ID, "lesson");

function start(
	mode: SessionMode = "lesson",
	progress = emptyLearningProgress(),
	id = "test-session",
) {
	return learningReducer(progress, {
		type: "start",
		session: createLearningSession(
			lesson,
			mode,
			id,
			now,
			progress.reviews[lesson.skillId]?.count,
		),
	}) as LearningProgress;
}

function complete(progress: LearningProgress, mode: SessionMode = "lesson") {
	const sessionId = sessionKey(lesson.id, mode);
	while (progress.sessions[sessionId].status !== "completed") {
		const session = progress.sessions[sessionId];
		const exercise = [...lesson.exercises, ...lesson.reviewExercises].find(
			(item) => item.id === session.currentStepId,
		);
		if (exercise)
			progress = learningReducer(progress, {
				type: "answer",
				key: sessionId,
				now,
				result: {
					questionId: exercise.question.id,
					isCorrect: true,
					value: "answer",
				},
			}) as LearningProgress;
		progress = learningReducer(progress, {
			type: "next",
			key: sessionId,
			now,
		}) as LearningProgress;
	}
	return progress;
}

beforeEach(() => {
	window.localStorage.clear();
	vi.restoreAllMocks();
});

describe("learning session boundaries", () => {
	it("requires an answer before advancing and retains only the first submitted result", () => {
		let progress = start();
		progress = learningReducer(progress, {
			type: "next",
			key,
			now,
		}) as LearningProgress;
		expect(learningReducer(progress, { type: "next", key, now })).toBe(
			progress,
		);
		const wrongQuestion = {
			questionId: 999,
			isCorrect: true,
			value: "wrong question",
		};
		expect(
			learningReducer(progress, {
				type: "answer",
				key,
				now,
				result: wrongQuestion,
			}),
		).toBe(progress);
		progress = learningReducer(progress, {
			type: "hint",
			key,
		}) as LearningProgress;
		const result = {
			questionId: lesson.exercises[0].question.id,
			isCorrect: false,
			value: "3 + 4",
		};
		progress = learningReducer(progress, {
			type: "answer",
			key,
			now,
			result,
		}) as LearningProgress;
		expect(
			learningReducer(progress, {
				type: "answer",
				key,
				now,
				result: { ...result, isCorrect: true },
			}),
		).toBe(progress);
		expect(progress.attempts).toHaveLength(1);
		expect(progress.attempts[0]).toMatchObject({
			isCorrect: false,
			hintUsed: true,
		});
		expect(learningReducer(progress, { type: "hint", key })).toBe(progress);
	});

	it("preserves an active plan when start is clicked again", () => {
		const progress = start();
		expect(start("lesson", progress, "another-session")).toBe(progress);
	});

	it("completes the lesson once and schedules delayed review", () => {
		const progress = complete(start());
		expect(progress.sessions[key].status).toBe("completed");
		expect(progress.attempts).toHaveLength(6);
		expect(progress.reviews[lesson.skillId]).toEqual({
			dueAt: now + 2 * DAY_MS,
			count: 0,
		});
		expect(learningReducer(progress, { type: "next", key, now })).toBe(
			progress,
		);
	});

	it("schedules earlier support after a hint and keeps lesson completion during review", () => {
		let progress = start();
		progress = learningReducer(progress, {
			type: "next",
			key,
			now,
		}) as LearningProgress;
		progress = learningReducer(progress, {
			type: "hint",
			key,
		}) as LearningProgress;
		progress = complete(progress);
		expect(progress.reviews[lesson.skillId].dueAt).toBe(now + DAY_MS);
		progress = complete(start("review", progress, "review-one"), "review");
		expect(progress.sessions[key].status).toBe("completed");
		expect(progress.reviews[lesson.skillId]).toEqual({
			dueAt: now + 7 * DAY_MS,
			count: 1,
		});
		const next = createLearningSession(lesson, "review", "review-two", now, 1);
		expect(next.stepIds).not.toEqual(
			progress.sessions[sessionKey(lesson.id, "review")].stepIds,
		);
		expect(
			next.stepIds.every((id) =>
				lesson.reviewExercises.some((exercise) => exercise.id === id),
			),
		).toBe(true);
	});

	it("recommends an unfinished visit before due review or a different lesson", () => {
		const progress = start();
		progress.reviews[lesson.skillId] = { dueAt: now - DAY_MS, count: 0 };
		expect(recommendLearningSession(course, progress, now)).toEqual({
			lessonId: lesson.id,
			mode: "lesson",
			resume: true,
		});
		expect(
			recommendLearningSession(course, complete(progress), now + 3 * DAY_MS)
				?.mode,
		).toBe("review");
	});
});

describe("learning progress recovery", () => {
	it("restores the same step and checked answer without replaying it", () => {
		let progress = start();
		progress = learningReducer(progress, {
			type: "next",
			key,
			now,
		}) as LearningProgress;
		progress = learningReducer(progress, {
			type: "answer",
			key,
			now,
			result: { questionId: 101, isCorrect: true, value: "30 + 4" },
		}) as LearningProgress;
		expect(parseLearningProgress(JSON.stringify(progress))).toEqual(progress);
		expect(parseLearningProgress(JSON.stringify(complete(progress)))).toEqual(
			complete(progress),
		);
	});

	it.each([
		"{bad json",
		JSON.stringify({ schemaVersion: 99 }),
		"null",
	])("rejects invalid storage safely: %s", (raw) => {
		window.localStorage.setItem(LEARNING_STORAGE_KEY, raw);
		expect(loadLearningProgress().status).toBe("invalid");
		expect(window.localStorage.getItem(LEARNING_STORAGE_KEY)).toBe(raw);
	});

	it("rejects outdated content, unknown steps and incomplete claimed completion", () => {
		const progress = start();
		progress.sessions[key].lessonVersion = 99;
		expect(parseLearningProgress(JSON.stringify(progress))).toBeNull();
		progress.sessions[key].lessonVersion = lesson.version;
		progress.sessions[key].currentStepId = "missing-step";
		expect(parseLearningProgress(JSON.stringify(progress))).toBeNull();
		progress.sessions[key].currentStepId = lesson.exercises.at(-1)?.id ?? "";
		progress.sessions[key].status = "completed";
		progress.sessions[key].completedAt = now;
		expect(parseLearningProgress(JSON.stringify(progress))).toBeNull();
	});

	it("allows learning when browser storage cannot be read", () => {
		vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
			throw new Error("blocked");
		});
		expect(loadLearningProgress()).toEqual({
			progress: emptyLearningProgress(),
			status: "unavailable",
		});
	});
});
