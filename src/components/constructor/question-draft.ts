import type { Dispatch, SetStateAction } from "react";

import {
	getOptionIsCorrect,
	getTextInputAnswers,
	getTrueFalseAnswer,
	type Question,
} from "@/components/questions/question-types";
import i18n from "@/i18n";
import { normalizeImageSource } from "@/lib/image-source";

export type QuestionType = Question["type"];

export interface DraftChoiceOption {
	id: string;
	label: string;
	isCorrect: boolean;
}

export interface DraftMatchingPair {
	id: string;
	left: string;
	right: string;
}

export interface DraftOrderingItem {
	id: string;
	label: string;
}

export interface DraftSortingCategory {
	id: string;
	label: string;
}

export interface DraftSortingItem {
	id: string;
	label: string;
	categoryId: string;
}

export interface DraftTextAnswer {
	id: string;
	value: string;
}

export interface DraftImageOption {
	id: string;
	label: string;
	imageSrc: string;
	imageAlt: string;
	isCorrect: boolean;
}

export interface DraftOddOption {
	id: string;
	label: string;
	isCorrect: boolean;
}

export interface QuestionDraft {
	id?: number;
	type: QuestionType;
	title: string;
	description: string;
	choiceOptions: DraftChoiceOption[];
	trueFalseAnswer: boolean;
	matchingPairs: DraftMatchingPair[];
	orderingItems: DraftOrderingItem[];
	sortingCategories: DraftSortingCategory[];
	sortingItems: DraftSortingItem[];
	textAnswers: DraftTextAnswer[];
	textPlaceholder: string;
	imageOptions: DraftImageOption[];
	oddOptions: DraftOddOption[];
}

export interface DraftEditorProps {
	draft: QuestionDraft;
	idPrefix?: string;
	setDraft: Dispatch<SetStateAction<QuestionDraft>>;
}

export interface ChoiceOptionsEditorProps extends DraftEditorProps {
	idPrefix: string;
	multiple: boolean;
}

export const fieldGroupClassName = "grid gap-2";

export const rowClassName =
	"grid gap-3 rounded-md border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950";

export const questionTypeOptions: { labelKey: string; value: QuestionType }[] =
	[
		{ labelKey: "questionTypes.single-choice", value: "single-choice" },
		{ labelKey: "questionTypes.multiple-choice", value: "multiple-choice" },
		{ labelKey: "questionTypes.true-false", value: "true-false" },
		{ labelKey: "questionTypes.matching", value: "matching" },
		{ labelKey: "questionTypes.ordering", value: "ordering" },
		{ labelKey: "questionTypes.sorting", value: "sorting" },
		{ labelKey: "questionTypes.text-input", value: "text-input" },
		{ labelKey: "questionTypes.image-choice", value: "image-choice" },
		{ labelKey: "questionTypes.odd-one-out", value: "odd-one-out" },
	];

function makeId(prefix: string, index: number) {
	return `${prefix}-${index + 1}`;
}

export function createNextId(items: { id: string }[], prefix: string) {
	const nextNumber =
		Math.max(
			0,
			...items.map((item) => Number(item.id.split("-").at(-1)) || 0),
		) + 1;

	return `${prefix}-${nextNumber}`;
}

export function getQuestionTypeLabel(
	type: QuestionType,
	translate: (key: string) => string = (key) => i18n.t(key),
) {
	const labelKey = questionTypeOptions.find(
		(option) => option.value === type,
	)?.labelKey;

	return labelKey ? translate(labelKey) : type;
}

function createChoiceOptions(type: QuestionType): DraftChoiceOption[] {
	if (type === "multiple-choice") {
		return [
			{ id: "option-1", label: "2 + 2", isCorrect: true },
			{ id: "option-2", label: "3 + 1", isCorrect: true },
			{ id: "option-3", label: "5 - 1", isCorrect: true },
			{ id: "option-4", label: "6 - 1", isCorrect: false },
		];
	}

	return [
		{ id: "option-1", label: "3", isCorrect: false },
		{ id: "option-2", label: "4", isCorrect: true },
		{ id: "option-3", label: "5", isCorrect: false },
		{ id: "option-4", label: "6", isCorrect: false },
	];
}

export function createEmptyDraft(
	type: QuestionType = "single-choice",
): QuestionDraft {
	const t = (key: string) => i18n.t(key);

	return {
		type,
		title: "",
		description: "",
		choiceOptions: createChoiceOptions(type),
		trueFalseAnswer: true,
		matchingPairs: [
			{
				id: "pair-1",
				left: t("draft.defaults.cat"),
				right: t("draft.defaults.meow"),
			},
			{
				id: "pair-2",
				left: t("draft.defaults.dog"),
				right: t("draft.defaults.woof"),
			},
		],
		orderingItems: [
			{ id: "item-1", label: t("draft.defaults.morning") },
			{ id: "item-2", label: t("draft.defaults.day") },
			{ id: "item-3", label: t("draft.defaults.evening") },
			{ id: "item-4", label: t("draft.defaults.night") },
		],
		sortingCategories: [
			{ id: "fruit", label: t("draft.defaults.fruit") },
			{ id: "vegetable", label: t("draft.defaults.vegetable") },
		],
		sortingItems: [
			{
				id: "sort-item-1",
				label: t("draft.defaults.apple"),
				categoryId: "fruit",
			},
			{
				id: "sort-item-2",
				label: t("draft.defaults.carrot"),
				categoryId: "vegetable",
			},
		],
		textAnswers: [{ id: "answer-1", value: t("draft.defaults.kitten") }],
		textPlaceholder: t("draft.defaults.kittenPlaceholder"),
		imageOptions: [
			{
				id: "image-1",
				label: t("draft.defaults.circle"),
				imageSrc: "/quiz/circle.svg",
				imageAlt: t("draft.defaults.circleAlt"),
				isCorrect: true,
			},
			{
				id: "image-2",
				label: t("draft.defaults.square"),
				imageSrc: "/quiz/square.svg",
				imageAlt: t("draft.defaults.squareAlt"),
				isCorrect: false,
			},
		],
		oddOptions: [
			{ id: "odd-1", label: t("draft.defaults.apple"), isCorrect: false },
			{ id: "odd-2", label: t("draft.defaults.banana"), isCorrect: false },
			{ id: "odd-3", label: t("draft.defaults.pear"), isCorrect: false },
			{ id: "odd-4", label: t("draft.defaults.car"), isCorrect: true },
		],
	};
}

export function toQuestion(draft: QuestionDraft, id: number): Question | null {
	const title = draft.title.trim();
	if (!title) return null;

	const base = {
		id,
		title,
		description: draft.description.trim() || undefined,
	};

	switch (draft.type) {
		case "single-choice":
		case "multiple-choice":
			return {
				...base,
				type: draft.type,
				options: draft.choiceOptions
					.filter((option) => option.label.trim())
					.map((option, index) => ({
						id: option.id || makeId("option", index),
						label: option.label.trim(),
						isCorrect: option.isCorrect,
					})),
			};
		case "true-false":
			return {
				...base,
				type: "true-false",
				answer: draft.trueFalseAnswer,
			};
		case "matching":
			return {
				...base,
				type: "matching",
				pairs: draft.matchingPairs
					.filter((pair) => pair.left.trim() || pair.right.trim())
					.map((pair, index) => ({
						id: pair.id || makeId("pair", index),
						left: pair.left.trim(),
						right: pair.right.trim(),
					})),
			};
		case "ordering":
			return {
				...base,
				type: "ordering",
				items: draft.orderingItems
					.filter((item) => item.label.trim())
					.map((item, index) => ({
						id: item.id || makeId("item", index),
						label: item.label.trim(),
					})),
			};
		case "sorting": {
			const categories = draft.sortingCategories
				.filter((category) => category.label.trim())
				.map((category, index) => ({
					id: category.id || makeId("category", index),
					label: category.label.trim(),
				}));
			const safeCategories = categories.length
				? categories
				: [{ id: "category-1", label: i18n.t("draft.defaults.group") }];

			return {
				...base,
				type: "sorting",
				categories: safeCategories,
				items: draft.sortingItems
					.filter((item) => item.label.trim())
					.map((item, index) => {
						const categoryExists = safeCategories.some(
							(category) => category.id === item.categoryId,
						);

						return {
							id: item.id || makeId("sort-item", index),
							label: item.label.trim(),
							categoryId: categoryExists
								? item.categoryId
								: safeCategories[0].id,
						};
					}),
			};
		}
		case "text-input":
			return {
				...base,
				type: "text-input",
				answers: draft.textAnswers
					.map((answer) => answer.value.trim())
					.filter(Boolean),
				placeholder: draft.textPlaceholder.trim() || undefined,
			};
		case "image-choice":
			return {
				...base,
				type: "image-choice",
				options: draft.imageOptions
					.filter((option) => option.label.trim() || option.imageSrc.trim())
					.map((option, index) => ({
						id: option.id || makeId("image", index),
						label: option.label.trim(),
						imageSrc: normalizeImageSource(option.imageSrc),
						imageAlt: option.imageAlt.trim() || option.label.trim(),
						isCorrect: option.isCorrect,
					})),
			};
		case "odd-one-out":
			return {
				...base,
				type: "odd-one-out",
				options: draft.oddOptions
					.filter((option) => option.label.trim())
					.map((option, index) => ({
						id: option.id || makeId("odd", index),
						label: option.label.trim(),
						isCorrect: option.isCorrect,
					})),
			};
	}
}

export function toDraft(question: Question): QuestionDraft {
	const base = {
		...createEmptyDraft(question.type),
		id: question.id,
		title: question.title,
		description: question.description ?? "",
	};

	switch (question.type) {
		case "single-choice":
		case "multiple-choice":
			return {
				...base,
				choiceOptions: question.options.map((option) => ({ ...option })),
			};
		case "true-false":
			return { ...base, trueFalseAnswer: getTrueFalseAnswer(question) };
		case "matching":
			return {
				...base,
				matchingPairs: question.pairs.map((pair) => ({ ...pair })),
			};
		case "ordering":
			return {
				...base,
				orderingItems: question.items.map((item) => ({ ...item })),
			};
		case "sorting":
			return {
				...base,
				sortingCategories: question.categories.map((category) => ({
					...category,
				})),
				sortingItems: question.items.map((item) => ({ ...item })),
			};
		case "text-input":
			return {
				...base,
				textAnswers: getTextInputAnswers(question).map((value, index) => ({
					id: makeId("answer", index),
					value,
				})),
				textPlaceholder: question.placeholder ?? "",
			};
		case "image-choice":
			return {
				...base,
				imageOptions: question.options.map((option) => ({
					...option,
					imageSrc: normalizeImageSource(option.imageSrc),
				})),
			};
		case "odd-one-out":
			return {
				...base,
				oddOptions: question.options.map((option) => ({
					id: option.id,
					label: option.label,
					isCorrect: getOptionIsCorrect(option),
				})),
			};
	}
}
