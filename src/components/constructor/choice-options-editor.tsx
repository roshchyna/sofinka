import { useTranslation } from "react-i18next";
import type {
	ChoiceOptionsEditorProps,
	DraftChoiceOption,
} from "@/components/constructor/question-draft";
import {
	createNextId,
	rowClassName,
} from "@/components/constructor/question-draft";
import { Button } from "@/ui/button";
import { Checkbox } from "@/ui/checkbox";
import { Input } from "@/ui/input";
import { Radio, RadioGroup } from "@/ui/radio";

export function ChoiceOptionsEditor({
	draft,
	idPrefix,
	multiple,
	setDraft,
}: ChoiceOptionsEditorProps) {
	const { t } = useTranslation();

	function updateOption(optionId: string, patch: Partial<DraftChoiceOption>) {
		setDraft((current) => ({
			...current,
			choiceOptions: current.choiceOptions.map((option) =>
				option.id === optionId ? { ...option, ...patch } : option,
			),
		}));
	}

	function setSingleCorrect(optionId: string) {
		setDraft((current) => ({
			...current,
			choiceOptions: current.choiceOptions.map((option) => ({
				...option,
				isCorrect: option.id === optionId,
			})),
		}));
	}

	function renderOption(option: DraftChoiceOption) {
		const correctControlId = `${idPrefix}-${option.id}-correct`;

		return (
			<div
				className={`${rowClassName} sm:grid-cols-[1fr_auto_auto] sm:items-center`}
				key={option.id}
			>
				<Input
					onChange={(event) =>
						updateOption(option.id, { label: event.target.value })
					}
					placeholder={t("editor.answerPlaceholder")}
					value={option.label}
				/>
				<div className="flex items-center gap-2 text-sm">
					{multiple ? (
						<Checkbox
							checked={option.isCorrect}
							id={correctControlId}
							onCheckedChange={(checked) =>
								updateOption(option.id, { isCorrect: checked === true })
							}
						/>
					) : (
						<Radio id={correctControlId} value={option.id} />
					)}
					<label htmlFor={correctControlId}>{t("editor.correct")}</label>
				</div>
				<Button
					disabled={draft.choiceOptions.length <= 1}
					onClick={() =>
						setDraft((current) => ({
							...current,
							choiceOptions: current.choiceOptions.filter(
								(item) => item.id !== option.id,
							),
						}))
					}
					size="sm"
					variant="outline"
				>
					{t("common.delete")}
				</Button>
			</div>
		);
	}

	const correctOptionId =
		draft.choiceOptions.find((option) => option.isCorrect)?.id ?? "";

	return (
		<div className="grid gap-3">
			<p className="font-medium text-sm">{t("editor.answerOptions")}</p>
			{multiple ? (
				draft.choiceOptions.map(renderOption)
			) : (
				<RadioGroup onValueChange={setSingleCorrect} value={correctOptionId}>
					{draft.choiceOptions.map(renderOption)}
				</RadioGroup>
			)}
			<Button
				onClick={() =>
					setDraft((current) => ({
						...current,
						choiceOptions: [
							...current.choiceOptions,
							{
								id: createNextId(current.choiceOptions, "option"),
								label: "",
								isCorrect: false,
							},
						],
					}))
				}
				variant="surface"
			>
				{t("editor.addAnswer")}
			</Button>
		</div>
	);
}
