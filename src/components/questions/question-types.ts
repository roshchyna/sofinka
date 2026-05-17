export interface QuestionBase {
	id: number;
	type: string;
	eyebrow?: string;
	title: string;
	description?: string;
}

export interface ChoiceOption {
	id: string;
	label: string;
	isCorrect: boolean;
}

export interface SingleChoiceQuestion extends QuestionBase {
	type: "single-choice";
	options: ChoiceOption[];
}

export interface MultipleChoiceQuestion extends QuestionBase {
	type: "multiple-choice";
	options: ChoiceOption[];
}

export interface TrueFalseQuestion extends QuestionBase {
	type: "true-false";
	answer?: boolean;
	options?: ChoiceOption[];
}

export interface MatchingPair {
	id: string;
	left: string;
	right: string;
}

export interface MatchingQuestion extends QuestionBase {
	type: "matching";
	pairs: MatchingPair[];
}

export interface OrderingItem {
	id: string;
	label: string;
}

export interface OrderingQuestion extends QuestionBase {
	type: "ordering";
	items: OrderingItem[];
}

export interface SortingCategory {
	id: string;
	label: string;
}

export interface SortingItem {
	id: string;
	label: string;
	categoryId: string;
}

export interface SortingQuestion extends QuestionBase {
	type: "sorting";
	categories: SortingCategory[];
	items: SortingItem[];
}

export interface TextInputQuestion extends QuestionBase {
	type: "text-input";
	answer?: string;
	answers?: string[];
	options?: ChoiceOption[];
	placeholder?: string;
}

export interface ImageChoiceOption {
	id: string;
	label: string;
	imageSrc: string;
	imageAlt: string;
	isCorrect: boolean;
}

export interface ImageChoiceQuestion extends QuestionBase {
	type: "image-choice";
	options: ImageChoiceOption[];
}

export interface OddOneOutOption {
	id: string;
	label: string;
	isCorrect: boolean;
	isOddOneOut?: boolean;
}

export interface OddOneOutQuestion extends QuestionBase {
	type: "odd-one-out";
	options: OddOneOutOption[];
}

export type Question =
	| SingleChoiceQuestion
	| MultipleChoiceQuestion
	| TrueFalseQuestion
	| MatchingQuestion
	| OrderingQuestion
	| SortingQuestion
	| TextInputQuestion
	| ImageChoiceQuestion
	| OddOneOutQuestion;

export function getTrueFalseAnswer(question: TrueFalseQuestion) {
	if (typeof question.answer === "boolean") return question.answer;

	const correctOptionIndex = question.options?.findIndex(
		(option) => option.isCorrect,
	);

	return correctOptionIndex === undefined || correctOptionIndex <= 0;
}

export function getTextInputAnswers(question: TextInputQuestion) {
	if (Array.isArray(question.answers)) return question.answers;
	if (typeof question.answer === "string") return [question.answer];

	return (
		question.options
			?.filter((option) => option.isCorrect)
			.map((option) => option.label)
			.filter(Boolean) ?? []
	);
}

export function getOptionIsCorrect(option: {
	isCorrect?: boolean;
	isOddOneOut?: boolean;
}) {
	return option.isCorrect ?? option.isOddOneOut ?? false;
}
