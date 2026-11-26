import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./card";

const meta = {
	title: "UI/Card",
	component: Card,
	tags: ["autodocs"],
	args: { className: "max-w-md" },
} satisfies Meta<typeof Card>;
export default meta;
export const Complete: StoryObj<typeof meta> = {
	render: (args) => (
		<Card {...args}>
			<CardHeader>
				<CardTitle>Ready to learn?</CardTitle>
				<CardDescription>A short lesson on tens and ones.</CardDescription>
			</CardHeader>
			<CardContent>Learn to split 34 into 30 + 4.</CardContent>
			<CardFooter>
				<Button>Start lesson</Button>
				<Button variant="outline">Later</Button>
			</CardFooter>
		</Card>
	),
};
