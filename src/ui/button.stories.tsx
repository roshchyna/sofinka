import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Button } from "./button";

const meta = {
	title: "UI/Button",
	component: Button,
	tags: ["autodocs"],
	args: {
		children: "Continue",
		onClick: fn(),
		disabled: false,
		isLoading: false,
	},
	argTypes: {
		variant: {
			control: "select",
			options: ["default", "surface", "outline", "ghost"],
		},
		size: {
			control: "select",
			options: ["xs", "sm", "md", "lg", "xl", "icon"],
		},
	},
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Surface: Story = { args: { variant: "surface" } };
export const Outline: Story = { args: { variant: "outline" } };
export const Ghost: Story = { args: { variant: "ghost" } };
export const Disabled: Story = { args: { disabled: true } };
export const Loading: Story = { args: { isLoading: true } };
export const Sizes: Story = {
	render: (args) => (
		<div className="flex flex-wrap items-center gap-3">
			{(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
				<Button {...args} key={size} size={size}>
					{size}
				</Button>
			))}
		</div>
	),
};
