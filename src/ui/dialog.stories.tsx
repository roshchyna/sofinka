import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogSideContent,
	DialogTitle,
	DialogTrigger,
} from "./dialog";

const meta = {
	title: "UI/Dialog",
	args: { side: false },
	render: ({ side }) => {
		const Content = side ? DialogSideContent : DialogContent;
		return (
			<Dialog>
				<DialogTrigger asChild>
					<Button>Open dialog</Button>
				</DialogTrigger>
				<Content>
					<DialogHeader>
						<DialogTitle>Keep learning?</DialogTitle>
						<DialogDescription>
							Your progress is saved in this browser.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<DialogClose asChild>
							<Button variant="outline">Close</Button>
						</DialogClose>
					</DialogFooter>
				</Content>
			</Dialog>
		);
	},
} satisfies Meta<{ side: boolean }>;
export default meta;
export const Modal: StoryObj<typeof meta> = {};
export const SidePanel: StoryObj<typeof meta> = { args: { side: true } };
