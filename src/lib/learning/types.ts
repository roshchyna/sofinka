import type {
	Question,
	QuestionAnswerValue,
} from "@/components/questions/question-types";

export interface LearningExercise {
	id: string;
	lessonId: string;
	skillId: string;
	question: Question;
	hint: string;
	explanation: string;
}

export interface LearningLesson {
	id: string;
	version: number;
	skillId: string;
	title: string;
	goal: string;
	example: { id: string; tens: number; ones: number; explanation: string };
	exercises: readonly LearningExercise[];
	reviewExercises: readonly LearningExercise[];
}

export interface LearningCourse {
	id: string;
	version: number;
	title: string;
	description: string;
	lessons: readonly { id: string; title: string; goal: string }[];
	publishedLessons: readonly LearningLesson[];
}

export type SessionMode = "lesson" | "review";

export interface LearningSession {
	id: string;
	lessonId: string;
	lessonVersion: number;
	mode: SessionMode;
	status: "active" | "completed";
	stepIds: string[];
	currentStepId: string;
	hintedExerciseIds: string[];
	startedAt: number;
	completedAt: number | null;
}

export interface LearningAttempt {
	id: string;
	sessionId: string;
	exerciseId: string;
	questionId: number;
	value: QuestionAnswerValue;
	isCorrect: boolean;
	hintUsed: boolean;
	submittedAt: number;
}

export interface LearningProgress {
	schemaVersion: 1;
	courseId: string;
	sessions: Record<string, LearningSession>;
	attempts: LearningAttempt[];
	reviews: Record<string, { dueAt: number; count: number }>;
}
