import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { fn } from "storybook/test";
import { toLanguage } from "@/i18n/languages";
import { getMuzaCopy } from "./copy";
import { PromptInput } from "./prompt-input";
import type { MuzaPersonaState } from "./types";

const send = fn();
const meta = {
	title: "Chat/Prompt input",
	args: { state: "idle" },
	render: function Prompt({ state }) {
		const { i18n } = useTranslation();
		const copy = getMuzaCopy(toLanguage(i18n.resolvedLanguage));
		const [value, setValue] = useState("");
		return (
			<div className="max-w-xl">
				<PromptInput
					value={value}
					onChange={setValue}
					onSubmit={() => {
						send(value);
						setValue("");
					}}
					onClear={() => setValue("")}
					canClear={Boolean(value)}
					isClearLoading={false}
					isStreamLoading={state !== "idle"}
					personaState={state}
					title={copy.title}
					placeholder={copy.placeholder}
					status={
						state === "thinking"
							? copy.thinking
							: state === "writing"
								? copy.writing
								: copy.ready
					}
					sendLabel={copy.send}
					clearLabel={copy.clear}
					clearPrompt={copy.clearPrompt}
					clearCancelLabel={copy.clearCancel}
					clearConfirmLabel={copy.clearConfirm}
				/>
			</div>
		);
	},
} satisfies Meta<{ state: MuzaPersonaState }>;
export default meta;
export const Ready: StoryObj<typeof meta> = {};
export const Thinking: StoryObj<typeof meta> = { args: { state: "thinking" } };
export const Writing: StoryObj<typeof meta> = { args: { state: "writing" } };
