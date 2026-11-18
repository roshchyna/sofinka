import type {
	ChoiceOption,
	Question,
} from "@/components/questions/question-types";
import { mathTo100Copy } from "@/data/courses/math-to-100-copy";
import type { Language } from "@/i18n/languages";
import type {
	LearningCourse,
	LearningExercise,
	LearningLesson,
} from "@/lib/learning/types";

export const MATH_COURSE_ID = "math-to-100";
export const FIRST_LESSON_ID = "tens-and-ones";
export const PLACE_VALUE_SKILL_ID = "two-digit-place-value";
const lessonIds = [
	FIRST_LESSON_ID,
	"reach-the-next-ten",
	"add-across-a-ten",
	"subtract-across-a-ten",
	"check-your-answer",
	"number-stories",
];
const exerciseIds = [
	"split-34",
	"tens-52",
	"match-parts",
	"explain-67",
	"ones-83",
	"pencils-38",
	"review-split-47",
	"review-tens-23",
	"review-blocks-56",
];

function options(labels: string[], correct: string): ChoiceOption[] {
	return labels.map((label) => ({
		id: label,
		label,
		isCorrect: label === correct,
	}));
}

export function getMathCourse(language: Language): LearningCourse {
	const copy = mathTo100Copy[language];
	const definitions: Question[] = [
		{
			id: 101,
			type: "single-choice",
			title: copy.titles[0],
			description: copy.choose,
			options: options(["30 + 4", "3 + 4", "30 + 40"], "30 + 4"),
		},
		{
			id: 102,
			type: "text-input",
			title: copy.titles[1],
			inputMode: "numeric",
			description: copy.enter,
			answers: ["5"],
		},
		{
			id: 103,
			type: "matching",
			title: copy.titles[2],
			description: copy.match,
			pairs: [
				{ id: "26", left: "26", right: "20 + 6" },
				{ id: "61", left: "61", right: "60 + 1" },
				{ id: "45", left: "45", right: "40 + 5" },
			],
		},
		{
			id: 104,
			type: "multiple-choice",
			title: copy.titles[3],
			description: copy.multiple,
			options: copy.statements.map((label, i) => ({
				id: `statement-${i}`,
				label,
				isCorrect: i < 2,
			})),
		},
		{
			id: 105,
			type: "text-input",
			title: copy.titles[4],
			inputMode: "numeric",
			description: copy.enter,
			answers: ["3"],
		},
		{
			id: 106,
			type: "single-choice",
			title: copy.titles[5],
			description: copy.choose,
			options: options(["38", "11", "308", "83"], "38"),
		},
		{
			id: 107,
			type: "single-choice",
			title: copy.titles[6],
			description: copy.choose,
			options: options(["4 + 7", "40 + 70", "40 + 7"], "40 + 7"),
		},
		{
			id: 108,
			type: "text-input",
			title: copy.titles[7],
			inputMode: "numeric",
			description: copy.enter,
			answers: ["2"],
		},
		{
			id: 109,
			type: "single-choice",
			title: copy.titles[8],
			description: copy.choose,
			options: options(["11", "56", "506", "65"], "56"),
		},
	];
	const exercises: LearningExercise[] = definitions.map((question, i) => ({
		id: `${FIRST_LESSON_ID}/${exerciseIds[i]}`,
		lessonId: FIRST_LESSON_ID,
		skillId: PLACE_VALUE_SKILL_ID,
		question,
		hint: copy.hints[i],
		explanation: copy.explanations[i],
	}));
	const lesson: LearningLesson = {
		id: FIRST_LESSON_ID,
		version: 1,
		skillId: PLACE_VALUE_SKILL_ID,
		title: copy.lessons[0][0],
		goal: copy.lessons[0][1],
		example: {
			id: "place-value-example",
			tens: 3,
			ones: 4,
			explanation: copy.example,
		},
		exercises: exercises.slice(0, 6),
		reviewExercises: exercises.slice(6),
	};
	return {
		id: MATH_COURSE_ID,
		version: 1,
		title: copy.title,
		description: copy.description,
		lessons: lessonIds.map((id, i) => ({
			id,
			title: copy.lessons[i][0],
			goal: copy.lessons[i][1],
		})),
		publishedLessons: [lesson],
	};
}

export function getLearningLesson(course: LearningCourse, lessonId: string) {
	return course.publishedLessons.find((lesson) => lesson.id === lessonId);
}

export function getLearningExercise(
	lesson: LearningLesson,
	exerciseId: string,
) {
	return [...lesson.exercises, ...lesson.reviewExercises].find(
		(exercise) => exercise.id === exerciseId,
	);
}
