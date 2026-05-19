import { useRive, useStateMachineInput } from "@rive-app/react-webgl2";
import { SendHorizontal } from "lucide-react";
import { type FormEvent, type KeyboardEvent, useEffect } from "react";

import { Button } from "@/ui/button";
import { Textarea } from "@/ui/textarea";
import { cn } from "@/utils/twMerge";
import { ClearDialog } from "./clear-dialog";
import type { MuzaPersonaState } from "./types";

interface PromptInputProps {
	canClear: boolean;
	clearCancelLabel: string;
	clearConfirmLabel: string;
	clearLabel: string;
	clearPrompt: string;
	isClearLoading: boolean;
	isStreamLoading: boolean;
	onChange: (value: string) => void;
	onClear: () => void;
	onSubmit: () => void;
	personaState: MuzaPersonaState;
	placeholder: string;
	sendLabel: string;
	status: string;
	title: string;
	value: string;
}

const muzaOrbRiv = "/rive/orb-1.2.riv";
const promptOrbStateMachine = "default";

function PromptPersona({ state }: { state: MuzaPersonaState }) {
	const { rive, RiveComponent } = useRive({
		autoplay: true,
		src: muzaOrbRiv,
		stateMachines: promptOrbStateMachine,
	});
	const thinkingInput = useStateMachineInput(
		rive,
		promptOrbStateMachine,
		"thinking",
	);

	useEffect(() => {
		if (thinkingInput) {
			thinkingInput.value = state === "thinking";
		}
	}, [state, thinkingInput]);

	return (
		<RiveComponent
			className={cn(
				"size-12 shrink-0 transition duration-300",
				state === "thinking" && "scale-105",
				state === "writing" && "scale-105 animate-pulse",
			)}
		/>
	);
}

export function PromptInput({
	canClear,
	clearCancelLabel,
	clearConfirmLabel,
	clearLabel,
	clearPrompt,
	isClearLoading,
	isStreamLoading,
	onChange,
	onClear,
	onSubmit,
	personaState,
	placeholder,
	sendLabel,
	status,
	title,
	value,
}: PromptInputProps) {
	const canSubmit = Boolean(value.trim()) && !isStreamLoading;

	function submitForm(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (canSubmit) onSubmit();
	}

	function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
		if (
			event.key !== "Enter" ||
			event.shiftKey ||
			event.metaKey ||
			event.ctrlKey
		) {
			return;
		}

		event.preventDefault();
		if (canSubmit) onSubmit();
	}

	return (
		<form
			className="border-zinc-200 border-t bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
			onSubmit={submitForm}
		>
			<Textarea
				className="min-h-20 resize-none border-0 bg-zinc-50 shadow-none focus-visible:border-zinc-950 dark:bg-zinc-900"
				disabled={isStreamLoading}
				onChange={(event) => onChange(event.target.value)}
				onKeyDown={handleKeyDown}
				placeholder={placeholder}
				value={value}
			/>
			<div className="mt-3 flex items-center justify-between gap-3">
				<div className="flex min-w-0 items-center gap-2">
					<PromptPersona state={personaState} />
					<div className="min-w-0">
						<div className="truncate font-medium text-sm text-zinc-950 dark:text-zinc-100">
							{title}
						</div>
						<div className="truncate text-xs text-zinc-500 dark:text-zinc-400">
							{status}
						</div>
					</div>
				</div>

				<div className="flex shrink-0 items-center gap-1">
					{canClear && (
						<ClearDialog
							cancelLabel={clearCancelLabel}
							confirmLabel={clearConfirmLabel}
							disabled={isStreamLoading}
							isClearLoading={isClearLoading}
							label={clearLabel}
							message={clearPrompt}
							onClear={onClear}
						/>
					)}
					<Button
						aria-label={sendLabel}
						className={cn(!canSubmit && "opacity-40")}
						disabled={!canSubmit}
						size="icon"
						title={sendLabel}
						type="submit"
					>
						<SendHorizontal />
					</Button>
				</div>
			</div>
		</form>
	);
}
