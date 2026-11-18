import type { QuestionAnswerResult } from "@/components/questions/question-types";
import { getLearningExercise, getMathCourse } from "@/data/courses/math-to-100";
import type {
	LearningLesson,
	LearningProgress,
	LearningSession,
	SessionMode,
} from "./types";

export const DAY_MS = 24 * 60 * 60 * 1000;

export function emptyLearningProgress(): LearningProgress {
	return {
		schemaVersion: 1,
		courseId: getMathCourse("en").id,
		sessions: {},
		attempts: [],
		reviews: {},
	};
}

export function sessionKey(lessonId: string, mode: SessionMode) {
	return `${lessonId}:${mode}`;
}

export function createLearningSession(
	lesson: LearningLesson,
	mode: SessionMode,
	id: string,
	now: number,
	reviewCount = 0,
): LearningSession {
	const stepIds =
		mode === "lesson"
			? [lesson.example.id, ...lesson.exercises.map((exercise) => exercise.id)]
			: Array.from(
					{ length: Math.min(2, lesson.reviewExercises.length) },
					(_, i) =>
						lesson.reviewExercises[
							(reviewCount + i) % lesson.reviewExercises.length
						].id,
				);
	return {
		id,
		lessonId: lesson.id,
		lessonVersion: lesson.version,
		mode,
		status: "active",
		stepIds,
		currentStepId: stepIds[0],
		hintedExerciseIds: [],
		startedAt: now,
		completedAt: null,
	};
}

export type LearningAction =
	| { type: "restore"; progress: LearningProgress }
	| { type: "start"; session: LearningSession }
	| { type: "hint"; key: string }
	| { type: "answer"; key: string; result: QuestionAnswerResult; now: number }
	| { type: "next"; key: string; now: number };

export function learningReducer(
	progress: LearningProgress | null,
	action: LearningAction,
): LearningProgress | null {
	if (action.type === "restore") return action.progress;
	if (!progress) return progress;
	if (action.type === "start") {
		const key = sessionKey(action.session.lessonId, action.session.mode);
		if (progress.sessions[key]?.status === "active") return progress;
		return {
			...progress,
			sessions: { ...progress.sessions, [key]: action.session },
		};
	}
	const session = progress.sessions[action.key];
	if (!session || session.status !== "active") return progress;
	const lesson = getMathCourse("en").publishedLessons.find(
		(item) => item.id === session.lessonId,
	);
	if (!lesson) return progress;
	const exercise = getLearningExercise(lesson, session.currentStepId);
	const attemptId = `${session.id}:${session.currentStepId}`;
	const hasAnswer = progress.attempts.some(
		(attempt) => attempt.id === attemptId,
	);
	if (action.type === "hint") {
		if (
			!exercise ||
			hasAnswer ||
			session.hintedExerciseIds.includes(exercise.id)
		)
			return progress;
		return {
			...progress,
			sessions: {
				...progress.sessions,
				[action.key]: {
					...session,
					hintedExerciseIds: [...session.hintedExerciseIds, exercise.id],
				},
			},
		};
	}
	if (action.type === "answer") {
		if (
			!exercise ||
			hasAnswer ||
			action.result.questionId !== exercise.question.id
		)
			return progress;
		return {
			...progress,
			attempts: [
				...progress.attempts,
				{
					id: attemptId,
					sessionId: session.id,
					exerciseId: exercise.id,
					questionId: action.result.questionId,
					value: action.result.value,
					isCorrect: action.result.isCorrect,
					hintUsed: session.hintedExerciseIds.includes(exercise.id),
					submittedAt: action.now,
				},
			],
		};
	}
	if (exercise && !hasAnswer) return progress;
	const index = session.stepIds.indexOf(session.currentStepId);
	if (index < session.stepIds.length - 1) {
		return {
			...progress,
			sessions: {
				...progress.sessions,
				[action.key]: { ...session, currentStepId: session.stepIds[index + 1] },
			},
		};
	}
	const attempts = progress.attempts.filter(
		(attempt) => attempt.sessionId === session.id,
	);
	const needsSupport = attempts.some(
		(attempt) => !attempt.isCorrect || attempt.hintUsed,
	);
	const reviewCount =
		(progress.reviews[lesson.skillId]?.count ?? 0) +
		(session.mode === "review" ? 1 : 0);
	const delay = needsSupport
		? DAY_MS
		: session.mode === "review"
			? 7 * DAY_MS
			: 2 * DAY_MS;
	return {
		...progress,
		sessions: {
			...progress.sessions,
			[action.key]: {
				...session,
				status: "completed",
				completedAt: action.now,
			},
		},
		reviews: {
			...progress.reviews,
			[lesson.skillId]: { dueAt: action.now + delay, count: reviewCount },
		},
	};
}
