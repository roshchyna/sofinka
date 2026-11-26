import type { Meta, StoryObj } from "@storybook/react-vite";
import { useTranslation } from "react-i18next";
import { expect, fn, userEvent, within } from "storybook/test";
import { getDefaultQuestions } from "@/data/default-questions";
import i18n from "@/i18n";
import { toLanguage } from "@/i18n/languages";
import { QuestionRenderer } from "./question-renderer";
import type { Question, QuestionAnswerResult } from "./question-types";

const types = [
	"single-choice",
	"multiple-choice",
	"true-false",
	"matching",
	"ordering",
	"sorting",
	"text-input",
	"image-choice",
	"odd-one-out",
] satisfies Question["type"][];
const meta = {
	title: "Questions/Cards",
	args: { type: "single-choice", allowRetry: true, onAnswer: fn() },
	argTypes: { type: { control: "select", options: types } },
	render: function Cards({ type, allowRetry, onAnswer }) {
		const { i18n } = useTranslation();
		const language = toLanguage(i18n.resolvedLanguage);
		const question = getDefaultQuestions(language).find(
			(item) => item.type === type,
		);
		if (!question) throw new Error(`Missing question fixture: ${type}`);
		return (
			<QuestionRenderer
				key={`${type}-${language}`}
				question={question}
				allowRetry={allowRetry}
				onAnswer={onAnswer}
			/>
		);
	},
} satisfies Meta<{
	type: Question["type"];
	allowRetry: boolean;
	onAnswer: (answer: QuestionAnswerResult) => void;
}>;
export default meta;
type Story = StoryObj<typeof meta>;
export const SingleChoice: Story = {};
export const CorrectSubmission: Story = {
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole("radio", { name: "4" }));
		await userEvent.click(
			canvas.getByRole("button", { name: i18n.t("common.check") }),
		);
		await expect(args.onAnswer).toHaveBeenCalledWith(
			expect.objectContaining({ isCorrect: true }),
		);
	},
};
export const MultipleChoice: Story = { args: { type: "multiple-choice" } };
export const TrueFalse: Story = { args: { type: "true-false" } };
export const Matching: Story = { args: { type: "matching" } };
export const Ordering: Story = { args: { type: "ordering" } };
export const Sorting: Story = { args: { type: "sorting" } };
export const TextInput: Story = { args: { type: "text-input" } };
export const ImageChoice: Story = { args: { type: "image-choice" } };
export const OddOneOut: Story = { args: { type: "odd-one-out" } };
