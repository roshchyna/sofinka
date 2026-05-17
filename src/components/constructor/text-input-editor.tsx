import { useTranslation } from "react-i18next";
import { FieldLabel } from "@/components/constructor/field-label";
import {
	createNextId,
	type DraftEditorProps,
	fieldGroupClassName,
	rowClassName,
} from "@/components/constructor/question-draft";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";

export function TextInputEditor({
	draft,
	idPrefix,
	setDraft,
}: DraftEditorProps) {
	const { t } = useTranslation();

	return (
		<div className="grid gap-3">
			<div className={fieldGroupClassName}>
				<FieldLabel htmlFor={`${idPrefix}-placeholder`}>
					{t("editor.textPlaceholderLabel")}
				</FieldLabel>
				<Input
					id={`${idPrefix}-placeholder`}
					onChange={(event) =>
						setDraft((current) => ({
							...current,
							textPlaceholder: event.target.value,
						}))
					}
					value={draft.textPlaceholder}
				/>
			</div>

			<p className="font-medium text-sm">{t("editor.correctAnswers")}</p>
			{draft.textAnswers.map((answer) => (
				<div
					className={`${rowClassName} sm:grid-cols-[1fr_auto] sm:items-center`}
					key={answer.id}
				>
					<Input
						onChange={(event) =>
							setDraft((current) => ({
								...current,
								textAnswers: current.textAnswers.map((item) =>
									item.id === answer.id
										? { ...item, value: event.target.value }
										: item,
								),
							}))
						}
						placeholder={t("editor.correctAnswer")}
						value={answer.value}
					/>
					<Button
						disabled={draft.textAnswers.length <= 1}
						onClick={() =>
							setDraft((current) => ({
								...current,
								textAnswers: current.textAnswers.filter(
									(item) => item.id !== answer.id,
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
						textAnswers: [
							...current.textAnswers,
							{
								id: createNextId(current.textAnswers, "answer"),
								value: "",
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
