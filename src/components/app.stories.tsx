import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect } from "react";
import { ApplicationBackground } from "@/common/application-background";
import ApplicationShell from "@/common/application-shell";
import { backgrounds } from "@/lib/backgrounds";
import { FluidCursor } from "./fluid-cursor";
import NotFoundAnimation from "./not-found-page";

const meta = {
	title: "App/Components",
	args: { enabled: false, background: backgrounds[0].id },
	argTypes: {
		background: { control: "select", options: backgrounds.map(({ id }) => id) },
	},
} satisfies Meta<{ enabled: boolean; background: string }>;
export default meta;
type Story = StoryObj<{ enabled: boolean; background: string }>;
export const Shell: Story = {
	render: () => (
		<ApplicationShell>
			<p>Sofinka application shell</p>
		</ApplicationShell>
	),
};
export const NotFound: Story = { render: () => <NotFoundAnimation /> };
export const Cursor: Story = {
	render: ({ enabled }) => (
		<>
			<p>Enable the cursor effect in Controls, then move the pointer.</p>
			<FluidCursor enabled={enabled} />
		</>
	),
};
export const Background: Story = {
	render: function Background({ background }) {
		useEffect(() => {
			const previous = document.documentElement.style.getPropertyValue(
				"--sofinka-background-image",
			);
			const selected =
				backgrounds.find(({ id }) => id === background) ?? backgrounds[0];
			document.documentElement.style.setProperty(
				"--sofinka-background-image",
				`url(${JSON.stringify(selected.src)})`,
			);
			return () =>
				document.documentElement.style.setProperty(
					"--sofinka-background-image",
					previous,
				);
		}, [background]);
		return (
			<div className="relative isolate grid h-80 place-items-center">
				<ApplicationBackground />
				<p>Shared application background</p>
			</div>
		);
	},
};
