import type { Question } from "@/components/questions/question-types";

export interface QuestionTheme {
	card: string;
	header: string;
	eyebrow: string;
	selected: string;
}

export const questionThemes: Record<Question["type"], QuestionTheme> = {
	"single-choice": {
		card: "border-sky-200 bg-sky-50 dark:border-sky-900 dark:bg-sky-950",
		header: "rounded-t-xl",
		eyebrow: "text-sky-700 dark:text-sky-300",
		selected: "border-sky-600 bg-sky-50 dark:border-sky-400 dark:bg-sky-900",
	},
	"multiple-choice": {
		card: "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950",
		header: "rounded-t-xl",
		eyebrow: "text-emerald-700 dark:text-emerald-300",
		selected:
			"border-emerald-600 bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-900",
	},
	"true-false": {
		card: "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950",
		header: "rounded-t-xl",
		eyebrow: "text-amber-700 dark:text-amber-300",
		selected:
			"border-amber-600 bg-amber-50 dark:border-amber-400 dark:bg-amber-900",
	},
	matching: {
		card: "border-violet-200 bg-violet-50 dark:border-violet-900 dark:bg-violet-950",
		header: "rounded-t-xl",
		eyebrow: "text-violet-700 dark:text-violet-300",
		selected:
			"border-violet-600 bg-violet-50 dark:border-violet-400 dark:bg-violet-900",
	},
	ordering: {
		card: "border-pink-200 bg-pink-50 dark:border-pink-900 dark:bg-pink-950",
		header: "rounded-t-xl",
		eyebrow: "text-pink-700 dark:text-pink-300",
		selected:
			"border-pink-600 bg-pink-50 dark:border-pink-400 dark:bg-pink-900",
	},
	sorting: {
		card: "border-cyan-200 bg-cyan-50 dark:border-cyan-900 dark:bg-cyan-950",
		header: "rounded-t-xl",
		eyebrow: "text-cyan-700 dark:text-cyan-300",
		selected:
			"border-cyan-600 bg-cyan-50 dark:border-cyan-400 dark:bg-cyan-900",
	},
	"text-input": {
		card: "border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950",
		header: "rounded-t-xl",
		eyebrow: "text-orange-700 dark:text-orange-300",
		selected:
			"border-orange-600 bg-orange-50 dark:border-orange-400 dark:bg-orange-900",
	},
	"image-choice": {
		card: "border-rose-200 bg-rose-50 dark:border-rose-900 dark:bg-rose-950",
		header: "rounded-t-xl",
		eyebrow: "text-rose-700 dark:text-rose-300",
		selected:
			"border-rose-600 bg-rose-50 dark:border-rose-400 dark:bg-rose-900",
	},
	"odd-one-out": {
		card: "border-fuchsia-200 bg-fuchsia-50 dark:border-fuchsia-900 dark:bg-fuchsia-950",
		header: "rounded-t-xl",
		eyebrow: "text-fuchsia-700 dark:text-fuchsia-300",
		selected:
			"border-fuchsia-600 bg-fuchsia-50 dark:border-fuchsia-400 dark:bg-fuchsia-900",
	},
};
