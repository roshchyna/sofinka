import type { Meta, StoryObj } from "@storybook/react-vite";
import { MuzaMascot, type MuzaMascotState } from "./muza-mascot";

const states = [
	"idle",
	"thinking",
	"writing",
	"speaking",
	"listening",
	"happy",
	"hint",
	"error",
	"waving",
	"sleeping",
	"purring",
] satisfies MuzaMascotState[];
const meta = {
	title: "Muza/Mascot",
	component: MuzaMascot,
	tags: ["autodocs"],
	args: {
		state: "idle",
		label: "Muza",
		className: "size-48",
		interactive: false,
	},
	argTypes: {
		state: { control: "select", options: states },
		className: {
			control: "select",
			options: ["size-12", "size-28", "size-48"],
		},
	},
} satisfies Meta<typeof MuzaMascot>;
export default meta;
type Story = StoryObj<typeof meta>;

export const AllStates: Story = {
	render: (args) => (
		<div className="grid grid-cols-2 gap-6 md:grid-cols-4">
			{states.map((state) => (
				<figure key={state} className="grid justify-items-center gap-3">
					<MuzaMascot {...args} state={state} />
					<figcaption>{state}</figcaption>
				</figure>
			))}
		</div>
	),
};
