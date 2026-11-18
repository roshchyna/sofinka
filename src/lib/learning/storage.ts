import { getLearningExercise, getMathCourse } from "@/data/courses/math-to-100";
import { emptyLearningProgress, sessionKey } from "./session";
import type {
	LearningAttempt,
	LearningProgress,
	LearningSession,
} from "./types";

export const LEARNING_STORAGE_KEY = "sofinka.learning.v1";
export type StorageStatus = "loading" | "saved" | "unavailable" | "invalid";

function record(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
function timestamp(value: unknown): value is number {
	return typeof value === "number" && Number.isFinite(value) && value >= 0;
}
function strings(value: unknown): value is string[] {
	return (
		Array.isArray(value) && value.every((item) => typeof item === "string")
	);
}
function answerValue(value: unknown) {
	return (
		typeof value === "string" ||
		strings(value) ||
		(record(value) &&
			Object.values(value).every((item) => typeof item === "string"))
	);
}

function validAttempt(value: unknown): value is LearningAttempt {
	if (!record(value) || typeof value.exerciseId !== "string") return false;
	const exercise = getMathCourse("en")
		.publishedLessons.flatMap((lesson) => [
			...lesson.exercises,
			...lesson.reviewExercises,
		])
		.find((item) => item.id === value.exerciseId);
	return Boolean(
		exercise &&
			typeof value.sessionId === "string" &&
			value.sessionId.length > 0 &&
			value.id === `${value.sessionId}:${value.exerciseId}` &&
			value.questionId === exercise.question.id &&
			typeof value.isCorrect === "boolean" &&
			typeof value.hintUsed === "boolean" &&
			answerValue(value.value) &&
			timestamp(value.submittedAt),
	);
}

function validSession(
	key: string,
	value: unknown,
	attempts: LearningAttempt[],
): value is LearningSession {
	if (
		!record(value) ||
		typeof value.lessonId !== "string" ||
		typeof value.id !== "string" ||
		!value.id ||
		(value.mode !== "lesson" && value.mode !== "review")
	)
		return false;
	const lesson = getMathCourse("en").publishedLessons.find(
		(item) => item.id === value.lessonId,
	);
	if (
		!lesson ||
		key !== sessionKey(lesson.id, value.mode) ||
		value.lessonVersion !== lesson.version ||
		!strings(value.stepIds) ||
		!strings(value.hintedExerciseIds) ||
		typeof value.currentStepId !== "string" ||
		!value.stepIds.includes(value.currentStepId) ||
		new Set(value.stepIds).size !== value.stepIds.length ||
		!timestamp(value.startedAt)
	)
		return false;
	if (value.mode === "lesson") {
		const expected = [
			lesson.example.id,
			...lesson.exercises.map((exercise) => exercise.id),
		];
		if (JSON.stringify(value.stepIds) !== JSON.stringify(expected))
			return false;
	} else if (
		value.stepIds.length !== Math.min(2, lesson.reviewExercises.length) ||
		!value.stepIds.every((id) =>
			lesson.reviewExercises.some((exercise) => exercise.id === id),
		)
	)
		return false;
	const stepIds = value.stepIds;
	if (
		!value.hintedExerciseIds.every(
			(id) => stepIds.includes(id) && getLearningExercise(lesson, id),
		)
	)
		return false;
	if (value.status !== "active" && value.status !== "completed") return false;
	if (
		value.status === "active"
			? value.completedAt !== null
			: !timestamp(value.completedAt)
	)
		return false;
	const currentIndex = value.stepIds.indexOf(value.currentStepId);
	if (value.status === "completed" && currentIndex !== value.stepIds.length - 1)
		return false;
	const required = value.stepIds
		.slice(0, currentIndex + (value.status === "completed" ? 1 : 0))
		.filter((id) => id !== lesson.example.id);
	return required.every((id) =>
		attempts.some(
			(attempt) => attempt.sessionId === value.id && attempt.exerciseId === id,
		),
	);
}

export function parseLearningProgress(raw: string): LearningProgress | null {
	try {
		const value: unknown = JSON.parse(raw);
		const course = getMathCourse("en");
		if (
			!record(value) ||
			value.schemaVersion !== 1 ||
			value.courseId !== course.id ||
			!record(value.sessions) ||
			!record(value.reviews) ||
			!Array.isArray(value.attempts) ||
			!value.attempts.every(validAttempt)
		)
			return null;
		const attempts = value.attempts;
		if (new Set(attempts.map((attempt) => attempt.id)).size !== attempts.length)
			return null;
		if (
			!Object.entries(value.sessions).every(([key, session]) =>
				validSession(key, session, attempts),
			)
		)
			return null;
		if (
			!Object.entries(value.reviews).every(
				([skillId, review]) =>
					course.publishedLessons.some(
						(lesson) => lesson.skillId === skillId,
					) &&
					record(review) &&
					timestamp(review.dueAt) &&
					Number.isInteger(review.count) &&
					Number(review.count) >= 0,
			)
		)
			return null;
		return value as unknown as LearningProgress;
	} catch {
		return null;
	}
}

export function loadLearningProgress(): {
	progress: LearningProgress;
	status: StorageStatus;
} {
	try {
		const raw = window.localStorage.getItem(LEARNING_STORAGE_KEY);
		if (raw === null)
			return { progress: emptyLearningProgress(), status: "saved" };
		const progress = parseLearningProgress(raw);
		return progress
			? { progress, status: "saved" }
			: { progress: emptyLearningProgress(), status: "invalid" };
	} catch {
		return { progress: emptyLearningProgress(), status: "unavailable" };
	}
}

export function saveLearningProgress(progress: LearningProgress) {
	window.localStorage.setItem(LEARNING_STORAGE_KEY, JSON.stringify(progress));
}
