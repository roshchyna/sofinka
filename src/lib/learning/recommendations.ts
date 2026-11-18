import { sessionKey } from "./session";
import type { LearningCourse, LearningProgress, SessionMode } from "./types";

export function recommendLearningSession(
	course: LearningCourse,
	progress: LearningProgress,
	now: number,
): { lessonId: string; mode: SessionMode; resume: boolean } | null {
	const active = Object.values(progress.sessions)
		.filter(
			(session) =>
				session.status === "active" &&
				course.publishedLessons.some(
					(lesson) => lesson.id === session.lessonId,
				),
		)
		.sort((a, b) => b.startedAt - a.startedAt)[0];
	if (active)
		return { lessonId: active.lessonId, mode: active.mode, resume: true };
	const due = course.publishedLessons.find(
		(lesson) => (progress.reviews[lesson.skillId]?.dueAt ?? Infinity) <= now,
	);
	if (due) return { lessonId: due.id, mode: "review", resume: false };
	const next = course.publishedLessons.find(
		(lesson) =>
			progress.sessions[sessionKey(lesson.id, "lesson")]?.status !==
			"completed",
	);
	if (next) return { lessonId: next.id, mode: "lesson", resume: false };
	const first = course.publishedLessons[0];
	return first ? { lessonId: first.id, mode: "review", resume: false } : null;
}
