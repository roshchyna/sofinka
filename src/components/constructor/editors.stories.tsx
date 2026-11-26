import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentType, useState } from "react";
import { getDefaultQuestions } from "@/data/default-questions";
import i18n from "@/i18n";
import { toLanguage } from "@/i18n/languages";
import { Input } from "@/ui/input";
import { ChoiceOptionsEditor } from "./choice-options-editor";
import { FieldLabel } from "./field-label";
import { ImageChoiceEditor } from "./image-choice-editor";
import { MatchingEditor } from "./matching-editor";
import { OddOneOutEditor } from "./odd-one-out-editor";
import { OrderingEditor } from "./ordering-editor";
import {
	createEmptyDraft,
	type DraftEditorProps,
	type QuestionType,
	toDraft,
} from "./question-draft";
import { SortingEditor } from "./sorting-editor";
import { TextInputEditor } from "./text-input-editor";
import { TrueFalseEditor } from "./true-false-editor";

const editors: Record<QuestionType, ComponentType<DraftEditorProps>> = {
	"single-choice": (props) => (
		<ChoiceOptionsEditor {...props} idPrefix="story-choice" multiple={false} />
	),
	"multiple-choice": (props) => (
		<ChoiceOptionsEditor {...props} idPrefix="story-choice" multiple />
	),
	"true-false": TrueFalseEditor,
	matching: MatchingEditor,
	ordering: OrderingEditor,
	sorting: SortingEditor,
	"text-input": TextInputEditor,
	"image-choice": ImageChoiceEditor,
	"odd-one-out": OddOneOutEditor,
};

function EditorPreview({ type }: { type: QuestionType }) {
	const [draft, setDraft] = useState(() => {
		const question = getDefaultQuestions(
			toLanguage(i18n.resolvedLanguage),
		).find((item) => item.type === type);
		return question ? toDraft(question) : createEmptyDraft(type);
	});
	const Editor = editors[type];
	return (
		<div className="max-w-3xl">
			<Editor draft={draft} setDraft={setDraft} idPrefix="story-editor" />
		</div>
	);
}

const meta = {
	title: "Question builder/Editors",
	args: { type: "single-choice" },
	argTypes: { type: { control: "select", options: Object.keys(editors) } },
	render: ({ type }) => <EditorPreview key={type} type={type} />,
} satisfies Meta<{ type: QuestionType }>;
export default meta;
type Story = StoryObj<typeof meta>;
export const SingleChoice: Story = {};
export const MultipleChoice: Story = { args: { type: "multiple-choice" } };
export const TrueFalse: Story = { args: { type: "true-false" } };
export const Matching: Story = { args: { type: "matching" } };
export const Ordering: Story = { args: { type: "ordering" } };
export const Sorting: Story = { args: { type: "sorting" } };
export const TextInput: Story = { args: { type: "text-input" } };
export const ImageChoice: Story = { args: { type: "image-choice" } };
export const OddOneOut: Story = { args: { type: "odd-one-out" } };
export const Label: Story = {
	render: () => (
		<div className="grid max-w-sm gap-2">
			<FieldLabel htmlFor="story-label">Question title</FieldLabel>
			<Input id="story-label" defaultValue="What is 2 + 2?" />
		</div>
	),
};
