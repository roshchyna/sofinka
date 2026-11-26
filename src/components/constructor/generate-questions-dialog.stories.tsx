import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Toaster } from "@/ui/toaster";
import { GenerateQuestionsDialog } from "./generate-questions-dialog";

const meta = {
	title: "Question builder/Generation",
	component: GenerateQuestionsDialog,
	args: { onGenerated: fn() },
	decorators: [
		(Story) => (
			<>
				<Toaster />
				<Story />
			</>
		),
	],
} satisfies Meta<typeof GenerateQuestionsDialog>;
export default meta;
export const Success: StoryObj<typeof meta> = {};
export const RequestFailure: StoryObj<typeof meta> = {
	parameters: { apiFailure: true },
};
