import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { ClearDialog } from "./clear-dialog";

const meta = {
	title: "Chat/Clear dialog",
	component: ClearDialog,
	tags: ["autodocs"],
	args: {
		label: "Clear chat",
		cancelLabel: "Cancel",
		confirmLabel: "Clear",
		message: "Clear Muza chat history?",
		disabled: false,
		isClearLoading: false,
		onClear: fn(),
	},
} satisfies Meta<typeof ClearDialog>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
export const Disabled: StoryObj<typeof meta> = { args: { disabled: true } };
