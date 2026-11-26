import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { getDefaultQuestions } from "@/data/default-questions";
import { AnswerOptionButton } from "./answer-option-button";
import { QuestionCardShell } from "./question-card-shell";
import { questionThemes } from "./question-theme";

export default { title: "Questions/Shared parts" } satisfies Meta;
export const Option: StoryObj = {
	render: () => (
		<AnswerOptionButton
			isCorrect
			isSelected={false}
			isSubmitted={false}
			theme={questionThemes["single-choice"]}
			onClick={fn()}
		>
			30 + 4
		</AnswerOptionButton>
	),
};
export const Selected: StoryObj = {
	render: () => (
		<AnswerOptionButton
			isCorrect
			isSelected
			isSubmitted={false}
			theme={questionThemes["single-choice"]}
			onClick={fn()}
		>
			30 + 4
		</AnswerOptionButton>
	),
};
export const Correct: StoryObj = {
	render: () => (
		<AnswerOptionButton
			isCorrect
			isSelected
			isSubmitted
			theme={questionThemes["single-choice"]}
			onClick={fn()}
		>
			30 + 4
		</AnswerOptionButton>
	),
};
export const Incorrect: StoryObj = {
	render: () => (
		<AnswerOptionButton
			isCorrect={false}
			isSelected
			isSubmitted
			theme={questionThemes["single-choice"]}
			onClick={fn()}
		>
			3 + 4
		</AnswerOptionButton>
	),
};
export const CheckboxOption: StoryObj = {
	render: () => (
		<AnswerOptionButton
			mode="checkbox"
			isCorrect
			isSelected
			isSubmitted={false}
			theme={questionThemes["multiple-choice"]}
			onClick={fn()}
		>
			2 + 2
		</AnswerOptionButton>
	),
};
export const Shell: StoryObj = {
	render: () => (
		<QuestionCardShell
			question={getDefaultQuestions("en")[0]}
			theme={questionThemes["single-choice"]}
			canSubmit
			isSubmitted={false}
			footerText="Choose one answer."
			onSubmit={fn()}
			onReset={fn()}
		>
			<p>Question content</p>
		</QuestionCardShell>
	),
};
