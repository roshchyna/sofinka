import type {
	ChoiceOption,
	Question,
} from "@/components/questions/question-types";
import {
	type DemoLessonCopy,
	type DemoQuestionId,
	demoLessonCopy,
} from "@/data/demo-lesson-copy";
import type { Language } from "@/i18n/languages";

// Topic references for our own questions; original wording is in demo-lesson-copy.ts.
export const demoLessonSources = {
	oxfordAddition: {
		title: "Oxford Owl: Addition and subtraction, age 7–8",
		url: "https://home.oxfordowl.co.uk/maths/primary-addition-subtraction/addition-subtraction-year-3-age-7-8/",
	},
	oxfordMultiplication: {
		title: "Oxford Owl: Multiplication and division, age 7–8",
		url: "https://home.oxfordowl.co.uk/maths/primary-multiplication-division/multiplication-division-year-3-age-7-8/",
	},
	oxfordPlaceValue: {
		title: "Oxford Owl: Number and place value, age 7–8",
		url: "https://home.oxfordowl.co.uk/maths/primary-number-place-value/number-place-value-year-3-age-7-8/",
	},
	oxfordFractions: {
		title: "Oxford Owl: Fractions, age 7–8",
		url: "https://home.oxfordowl.co.uk/maths/primary-fractions/fractions-year-3-age-7-8/",
	},
	oxfordMeasurement: {
		title: "Oxford Owl: Measurement, age 7–8",
		url: "https://home.oxfordowl.co.uk/maths/primary-measurement/measurement-year-3-age-7-8/",
	},
	oxfordGeometry: {
		title: "Oxford Owl: Geometry and shapes, age 7–8",
		url: "https://home.oxfordowl.co.uk/maths/primary-geometry-shapes/geometry-shapes-year-3-age-7-8/",
	},
	nrichOrdering: {
		title: "NRICH: Counting, comparing and ordering, age 7–11",
		url: "https://nrich.maths.org/curriculum/counting-comparing-and-ordering-age-7-11",
	},
	nrichPatterns: {
		title: "NRICH: Patterns and sequences, age 7–11",
		url: "https://nrich.maths.org/curriculum/patterns-and-sequences-age-7-11",
	},
	nrichStatements: {
		title: "NRICH: Satisfying Four Statements",
		url: "https://nrich.maths.org/problems/satisfying-four-statements",
	},
} as const;

export type DemoSourceId = keyof typeof demoLessonSources;

export type DemoSkill =
	| "addition"
	| "subtraction"
	| "equivalent-expressions"
	| "multiplication-and-division"
	| "two-step-word-problems"
	| "number-ordering"
	| "number-patterns"
	| "parity"
	| "halves"
	| "elapsed-time"
	| "flat-and-solid-shapes"
	| "logical-deduction";

export type DemoQuestion = Question & {
	skill: DemoSkill;
	hint: string;
	explanation: string;
	sourceIds: readonly DemoSourceId[];
};

export interface DemoLesson {
	id: string;
	version: number;
	age: number;
	language: Language;
	questions: readonly DemoQuestion[];
}

const lessonMetadata = {
	id: "math-logic-age-8",
	version: 1,
	age: 8,
} as const;

function createNumberOptions(values: number[], answer: number): ChoiceOption[] {
	return values.map((value) => ({
		id: String(value),
		label: String(value),
		isCorrect: value === answer,
	}));
}

function createQuestions(copy: DemoLessonCopy): DemoQuestion[] {
	function details(
		id: DemoQuestionId,
		skill: DemoSkill,
		instruction: keyof DemoLessonCopy["instructions"],
		sourceIds: readonly DemoSourceId[],
	) {
		return {
			id,
			...copy.questions[id],
			description: copy.instructions[instruction],
			skill,
			sourceIds,
		};
	}

	return [
		{
			...details(1, "addition", "singleChoice", ["oxfordAddition"]),
			type: "single-choice",
			options: createNumberOptions([32, 42, 41, 52], 42),
		},
		{
			...details(2, "subtraction", "numberInput", ["oxfordAddition"]),
			type: "text-input",
			answers: ["35"],
		},
		{
			...details(3, "equivalent-expressions", "multipleChoice", [
				"oxfordAddition",
				"oxfordMultiplication",
			]),
			type: "multiple-choice",
			options: [
				{ id: "add-18-6", label: "18 + 6", isCorrect: true },
				{ id: "multiply-6-4", label: "6 × 4", isCorrect: true },
				{ id: "subtract-30-6", label: "30 − 6", isCorrect: true },
				{ id: "multiply-4-5", label: "4 × 5", isCorrect: false },
			],
		},
		{
			...details(4, "multiplication-and-division", "matching", [
				"oxfordMultiplication",
			]),
			type: "matching",
			pairs: [
				{ id: "multiply-4-3", left: "4 × 3", right: "12" },
				{ id: "divide-20-4", left: "20 ÷ 4", right: "5" },
				{ id: "multiply-7-3", left: "7 × 3", right: "21" },
				{ id: "divide-18-3", left: "18 ÷ 3", right: "6" },
			],
		},
		{
			...details(5, "two-step-word-problems", "singleChoice", [
				"oxfordMultiplication",
				"oxfordAddition",
			]),
			type: "single-choice",
			options: createNumberOptions([7, 9, 12, 17], 7),
		},
		{
			...details(6, "number-ordering", "ordering", [
				"oxfordPlaceValue",
				"nrichOrdering",
			]),
			type: "ordering",
			items: [208, 218, 280, 820].map((value) => ({
				id: String(value),
				label: String(value),
			})),
		},
		{
			...details(7, "number-patterns", "singleChoice", [
				"oxfordPlaceValue",
				"nrichPatterns",
			]),
			type: "single-choice",
			options: createNumberOptions([26, 27, 28, 32], 28),
		},
		{
			...details(8, "parity", "sorting", ["oxfordMultiplication"]),
			type: "sorting",
			categories: [
				{ id: "even", label: copy.parity.even },
				{ id: "odd", label: copy.parity.odd },
			],
			items: [
				{ id: "17", label: "17", categoryId: "odd" },
				{ id: "24", label: "24", categoryId: "even" },
				{ id: "31", label: "31", categoryId: "odd" },
				{ id: "46", label: "46", categoryId: "even" },
				{ id: "58", label: "58", categoryId: "even" },
				{ id: "63", label: "63", categoryId: "odd" },
			],
		},
		{
			...details(9, "halves", "trueFalse", ["oxfordFractions"]),
			type: "true-false",
			answer: false,
		},
		{
			...details(10, "elapsed-time", "timeInput", ["oxfordMeasurement"]),
			type: "text-input",
			answers: ["15:45", "15.45"],
			placeholder: "00:00",
		},
		{
			...details(11, "flat-and-solid-shapes", "oddOneOut", ["oxfordGeometry"]),
			type: "odd-one-out",
			options: [
				{ id: "triangle", label: copy.shapes.triangle, isCorrect: false },
				{ id: "square", label: copy.shapes.square, isCorrect: false },
				{ id: "circle", label: copy.shapes.circle, isCorrect: false },
				{ id: "cube", label: copy.shapes.cube, isCorrect: true },
			],
		},
		{
			...details(12, "logical-deduction", "singleChoice", [
				"nrichStatements",
				"nrichOrdering",
			]),
			type: "single-choice",
			options: createNumberOptions([2, 5, 8], 5),
		},
	];
}

function createLesson(language: Language): DemoLesson {
	return {
		...lessonMetadata,
		language,
		questions: createQuestions(demoLessonCopy[language]),
	};
}

const demoLessonsByLanguage: Record<Language, DemoLesson> = {
	en: createLesson("en"),
	ua: createLesson("ua"),
	ru: createLesson("ru"),
};

export function getDemoLesson(language: Language): DemoLesson {
	return demoLessonsByLanguage[language];
}
