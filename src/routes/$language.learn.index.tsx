import { createFileRoute, redirect } from "@tanstack/react-router";
import { MATH_COURSE_ID } from "@/data/courses/math-to-100";

export const Route = createFileRoute("/$language/learn/")({
	beforeLoad: ({ params }) => {
		throw redirect({
			to: "/$language/learn/$courseId",
			params: { language: params.language, courseId: MATH_COURSE_ID },
		});
	},
});
