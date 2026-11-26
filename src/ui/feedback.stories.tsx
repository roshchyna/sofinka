import type { Meta, StoryObj } from "@storybook/react-vite";
import { toast } from "sonner";
import { Button } from "./button";
import { Loader } from "./loader";
import { Toaster } from "./toaster";

export default { title: "UI/Feedback" } satisfies Meta;
export const Loading: StoryObj = { render: () => <Loader /> };
export const Toasts: StoryObj = {
	render: () => (
		<>
			<Toaster />
			<div className="flex flex-wrap gap-3">
				<Button onClick={() => toast.success("Lesson completed!")}>
					Success
				</Button>
				<Button onClick={() => toast.error("Please try again")}>Error</Button>
				<Button onClick={() => toast.warning("Progress could not be saved")}>
					Warning
				</Button>
				<Button onClick={() => toast.info("Try a hint")}>Info</Button>
			</div>
		</>
	),
};
