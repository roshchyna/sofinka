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
				onValueChange={(value) =>
					setDraft((current) => ({
						...current,
						trueFalseAnswer: value === "true",
					}))
				}
				options={[
					{ label: t("editor.true"), value: "true" },
					{ label: t("editor.false"), value: "false" },
				]}
				value={String(draft.trueFalseAnswer)}
			/>
		</div>
	);
}
