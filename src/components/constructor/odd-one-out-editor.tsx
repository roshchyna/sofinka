import { useTranslation } from "react-i18next";
import {
	createNextId,
	type DraftEditorProps,
	rowClassName,
} from "@/components/constructor/question-draft";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";

export function OddOneOutEditor({
	draft,
	idPrefix,
	setDraft,
}: DraftEditorProps) {
	const { t } = useTranslation();

	function setCorrectOption(optionId: string) {
		setDraft((current) => ({
			...current,
			oddOptions: current.oddOptions.map((option) => ({
				...option,
				isCorrect: option.id === optionId,
			})),
		}));
	}

	return (
		<div className="grid gap-3">
			<p className="font-medium text-sm">{t("editor.options")}</p>
			{draft.oddOptions.map((option) => (
				<div
					className={`${rowClassName} sm:grid-cols-[1fr_auto_auto] sm:items-center`}
					key={option.id}
				>
					<Input
						onChange={(event) =>
							setDraft((current) => ({
								...current,
								oddOptions: current.oddOptions.map((item) =>
									item.id === option.id
										? { ...item, label: event.target.value }
										: item,
								),
							}))
						}
						placeholder={t("editor.option")}
						value={option.label}
					/>
					<label className="flex items-center gap-2 text-sm">
						<input
							checked={option.isCorrect}
							className="h-4 w-4"
							name={`${idPrefix}-odd`}
							onChange={() => setCorrectOption(option.id)}
							type="radio"
						/>
						{t("editor.oddOneOut")}
					</label>
					<Button
						disabled={draft.oddOptions.length <= 1}
						onClick={() =>
							setDraft((current) => ({
								...current,
								oddOptions: current.oddOptions.filter(
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
			))}
			<Button
				onClick={() =>
					setDraft((current) => ({
						...current,
						oddOptions: [
							...current.oddOptions,
							{
								id: createNextId(current.oddOptions, "odd"),
								label: "",
								isCorrect: false,
							},
						],
					}))
				}
				variant="surface"
			>
				{t("editor.addOption")}
			</Button>
		</div>
	);
}
