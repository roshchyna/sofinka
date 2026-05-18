declare module "../../../server/env.mjs" {
	export function loadEnv(): void;
}

declare module "../../../server/languages.mjs" {
	export interface LanguageConfig {
		code: string;
		name: string;
		answer: string;
		concept: string;
		description: string;
		imageDescription: string;
		mainTopic: string;
		other: string;
		otherOption: string;
		question: string;
		questionAbout: string;
		shortHint: string;
		topic: string;
		variant: string;
		sortingTitle: string;
		sortingDescription: string;
		group: string;
		item: string;
		trueLabel: string;
		falseLabel: string;
	}

	export function getLanguageConfig(language: unknown): LanguageConfig;
}

declare module "../../../server/model-json.mjs" {
	export function parseModelJson(content: unknown): unknown;
}

declare module "../../../server/prompt-builder.mjs" {
	export function buildPrompt(request: {
		age: string;
		count: number;
		language: string;
		topic: string;
		type: string;
	}): string;
}

declare module "../../../server/question-normalizers.mjs" {
	export function normalizeGeneratedResponse(
		generated: unknown,
		request: {
			language: string;
			topic: string;
			type: string;
		},
	): unknown;
}
