import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { MuzaBadge } from "./muza-badge";

const meta = {
	title: "Chat/Badge",
	component: MuzaBadge,
	tags: ["autodocs"],
	args: { title: "Muza Assistant", betaLabel: "NEW", onClick: fn() },
} satisfies Meta<typeof MuzaBadge>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
