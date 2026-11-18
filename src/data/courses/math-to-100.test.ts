import { describe, expect, it } from "vitest";
import { languages } from "@/i18n/languages";
import { getMathCourse } from "./math-to-100";

describe("first learning course content", () => {
	it.each(
		languages,
	)("has six outlined lessons and one complete lesson in %s", (language) => {
		const course = getMathCourse(language);
		expect(course.lessons).toHaveLength(6);
		expect(course.publishedLessons).toHaveLength(1);
		const lesson = course.publishedLessons[0];
		expect(lesson.exercises).toHaveLength(6);
		expect(lesson.reviewExercises).toHaveLength(3);
		expect(lesson.example.tens * 10 + lesson.example.ones).toBe(34);
		for (const exercise of [...lesson.exercises, ...lesson.reviewExercises]) {
			expect(exercise.question.title.length).toBeGreaterThan(5);
			expect(exercise.hint.length).toBeGreaterThan(5);
			expect(exercise.explanation.length).toBeGreaterThan(5);
			if (exercise.question.type === "matching") {
				for (const pair of exercise.question.pairs)
					expect(
						pair.right.split(" + ").reduce((sum, n) => sum + Number(n), 0),
					).toBe(Number(pair.left));
			}
		}
		const textAnswers = lesson.exercises
			.filter((exercise) => exercise.question.type === "text-input")
			.map((exercise) =>
				exercise.question.type === "text-input"
					? exercise.question.answers
					: [],
			);
		expect(textAnswers).toEqual([["5"], ["3"]]);
	});

	it("keeps semantic identifiers and answers stable across translations", () => {
		const signatures = languages.map((language) => {
			const lesson = getMathCourse(language).publishedLessons[0];
			return [...lesson.exercises, ...lesson.reviewExercises].map(
				({ id, question }) => ({
					id,
					questionId: question.id,
					type: question.type,
					answers:
						question.type === "text-input"
							? question.answers
							: "options" in question
								? question.options?.map((option) => [
										option.id,
										option.isCorrect,
									])
								: question.type === "matching"
									? question.pairs.map((pair) => pair.id)
									: [],
				}),
			);
		});
		expect(signatures[1]).toEqual(signatures[0]);
		expect(signatures[2]).toEqual(signatures[0]);
		expect(new Set(signatures[0].map((item) => item.id)).size).toBe(9);
	});
});
