import { createFileRoute, notFound } from "@tanstack/react-router";
import { CourseOverview } from "@/components/learning/course-overview";
import { MATH_COURSE_ID } from "@/data/courses/math-to-100";
import { toLanguage } from "@/i18n/languages";

export const Route = createFileRoute("/$language/learn/$courseId/")({
	beforeLoad: ({ params }) => {
		if (params.courseId !== MATH_COURSE_ID) throw notFound();
	},
	component: CoursePage,
});

function CoursePage() {
	return <CourseOverview language={toLanguage(Route.useParams().language)} />;
}
