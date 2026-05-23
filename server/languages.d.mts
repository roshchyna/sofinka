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
