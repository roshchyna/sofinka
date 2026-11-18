import { createFileRoute, notFound } from "@tanstack/react-router";
import { LearningLessonPlayer } from "@/components/learning/lesson-player";
import {
	getLearningLesson,
	getMathCourse,
	MATH_COURSE_ID,
} from "@/data/courses/math-to-100";
import { toLanguage } from "@/i18n/languages";

export const Route = createFileRoute("/$language/learn/$courseId/$lessonId")({
	validateSearch: (search: Record<string, unknown>): { mode?: "review" } => ({
		mode: search.mode === "review" ? "review" : undefined,
	}),
	beforeLoad: ({ params }) => {
		if (
			params.courseId !== MATH_COURSE_ID ||
			!getLearningLesson(
				getMathCourse(toLanguage(params.language)),
				params.lessonId,
			)
		)
			throw notFound();
	},
	component: LessonPage,
});

function LessonPage() {
	const { language, lessonId } = Route.useParams();
	const { mode } = Route.useSearch();
	return (
		<LearningLessonPlayer
			language={toLanguage(language)}
			lessonId={lessonId}
			mode={mode ?? "lesson"}
		/>
	);
}
