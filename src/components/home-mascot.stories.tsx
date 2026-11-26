import type { Meta, StoryObj } from "@storybook/react-vite";
import { HomeMascot } from "./home-mascot";

const meta = {
	title: "Muza/Home mascot",
	component: HomeMascot,
	tags: ["autodocs"],
} satisfies Meta<typeof HomeMascot>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
