import type { Meta, StoryObj } from "@storybook/react-vite";
import { Muza } from "./persona";

const meta = {
	title: "Muza/Chat avatar",
	component: Muza,
	tags: ["autodocs"],
	args: { state: "idle", className: "size-12" },
} satisfies Meta<typeof Muza>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Ready: Story = {};
export const Thinking: Story = { args: { state: "thinking" } };
export const Writing: Story = { args: { state: "writing" } };
