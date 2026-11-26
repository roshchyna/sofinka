import type { Meta, StoryObj } from "@storybook/react-vite";
import MuzaAssistant from "./index";
import { MuzaPage } from "./page";

export default { title: "Chat/Assistant" } satisfies Meta;
export const Panel: StoryObj = { render: () => <MuzaAssistant age={7} /> };
export const Page: StoryObj = { render: () => <MuzaPage age={7} /> };
export const RequestFailure: StoryObj = {
	parameters: { apiFailure: true },
	render: () => <MuzaPage age={7} />,
};
