import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Checkbox } from "./checkbox";
import { Input } from "./input";
import { Radio, RadioGroup } from "./radio";
import { Select } from "./select";
import { Textarea } from "./textarea";

const meta = {
	title: "UI/Forms",
	args: { disabled: false },
	argTypes: { disabled: { control: "boolean" } },
} satisfies Meta<{ disabled: boolean }>;
export default meta;
type Story = StoryObj<{ disabled: boolean }>;
export const TextInput: Story = {
	render: ({ disabled }) => (
		<label htmlFor="story-input" className="grid max-w-sm gap-2">
			Name
			<Input id="story-input" disabled={disabled} placeholder="Your name" />
		</label>
	),
};
export const TextArea: Story = {
	render: ({ disabled }) => (
		<label htmlFor="story-textarea" className="grid max-w-sm gap-2">
			Message
			<Textarea
				id="story-textarea"
				disabled={disabled}
				placeholder="Ask Muza a question"
			/>
		</label>
	),
};
export const Selection: Story = {
	render: function Selection({ disabled }) {
		const [value, setValue] = useState("en");
		return (
			<label className="grid max-w-sm gap-2" htmlFor="story-language">
				Language
				<Select
					id="story-language"
					disabled={disabled}
					value={value}
					onValueChange={setValue}
					options={[
						{ label: "English", value: "en" },
						{ label: "Українська", value: "ua" },
						{ label: "Русский", value: "ru" },
					]}
				/>
			</label>
		);
	},
};
export const Check: Story = {
	render: ({ disabled }) => (
		<label htmlFor="story-checkbox" className="flex items-center gap-2">
			<Checkbox id="story-checkbox" disabled={disabled} />
			Show hints
		</label>
	),
};
export const Checked: Story = {
	render: ({ disabled }) => (
		<label htmlFor="story-checked" className="flex items-center gap-2">
			<Checkbox id="story-checked" defaultChecked disabled={disabled} />
			Show hints
		</label>
	),
};
export const RadioOptions: Story = {
	render: ({ disabled }) => (
		<RadioGroup
			defaultValue="lesson"
			disabled={disabled}
			aria-label="Learning mode"
		>
			{["lesson", "review"].map((value) => (
				<label
					key={value}
					htmlFor={`story-${value}`}
					className="flex items-center gap-2"
				>
					<Radio id={`story-${value}`} value={value} />
					{value}
				</label>
			))}
		</RadioGroup>
	),
};
