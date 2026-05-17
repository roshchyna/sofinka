import { useTranslation } from "react-i18next";
import { FieldLabel } from "@/components/constructor/field-label";
import {
	type DraftEditorProps,
	fieldGroupClassName,
} from "@/components/constructor/question-draft";
import { Select } from "@/ui/select";

export function TrueFalseEditor({
	draft,
	idPrefix,
	setDraft,
}: DraftEditorProps) {
	const { t } = useTranslation();

	return (
		<div className={fieldGroupClassName}>
			<FieldLabel htmlFor={`${idPrefix}-true-false`}>
				{t("editor.correctAnswer")}
			</FieldLabel>
			<Select
				id={`${idPrefix}-true-false`}
				onChange={(event) =>
					setDraft((current) => ({
						...current,
						trueFalseAnswer: event.target.value === "true",
					}))
				}
				value={String(draft.trueFalseAnswer)}
			>
				<option value="true">{t("editor.true")}</option>
				<option value="false">{t("editor.false")}</option>
			</Select>
		</div>
	);
}
