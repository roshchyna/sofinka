import type { Question } from "@/components/questions/question-types";
import { getDefaultQuestions } from "@/data/default-questions";
import type { Language } from "@/i18n/languages";
import { DEFAULT_LANGUAGE } from "@/i18n/languages";
import { getLanguage } from "@/lib/language-storage";

const LEGACY_QUESTIONS_STORAGE_KEY = "sofinka.questions";
const QUESTIONS_STORAGE_KEY_PREFIX = "sofinka.questions";

export const QUESTIONS_CHANGED_EVENT = "sofinka.questions.changed";

function getQuestionsStorageKey(language: Language) {
	return `${QUESTIONS_STORAGE_KEY_PREFIX}.${language}`;
}

function getStoredQuestions(language: Language) {
	const rawQuestions =
		window.localStorage.getItem(getQuestionsStorageKey(language)) ??
		(language === DEFAULT_LANGUAGE
			? window.localStorage.getItem(LEGACY_QUESTIONS_STORAGE_KEY)
			: null);

	if (!rawQuestions) return null;

	try {
		const questions = JSON.parse(rawQuestions) as Question[];
		return Array.isArray(questions) ? questions : null;
	} catch {
		return null;
	}
}

export function getQuestions(language: Language = getLanguage()) {
	if (typeof window === "undefined") return getDefaultQuestions(language);

	return getStoredQuestions(language) ?? getDefaultQuestions(language);
}

export function saveQuestions(
	questions: Question[],
	language: Language = getLanguage(),
) {
	if (typeof window === "undefined") return;

	window.localStorage.setItem(
		getQuestionsStorageKey(language),
		JSON.stringify(questions),
	);
	window.dispatchEvent(new Event(QUESTIONS_CHANGED_EVENT));
}

export function resetQuestions(language: Language = getLanguage()) {
	saveQuestions(getDefaultQuestions(language), language);
}
