import { useTranslation } from "react-i18next";
import {
	createNextId,
	type DraftEditorProps,
	rowClassName,
} from "@/components/constructor/question-draft";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";

export function ImageChoiceEditor({
	draft,
	idPrefix,
	setDraft,
}: DraftEditorProps) {
	const { t } = useTranslation();

	function setSingleCorrect(optionId: string) {
		setDraft((current) => ({
			...current,
			imageOptions: current.imageOptions.map((option) => ({
				...option,
				isCorrect: option.id === optionId,
			})),
		}));
	}

	return (
		<div className="grid gap-3">
			<p className="font-medium text-sm">{t("editor.images")}</p>
			{draft.imageOptions.map((option) => (
				<div
					className={`${rowClassName} lg:grid-cols-[1fr_1fr_1fr_auto_auto] lg:items-center`}
					key={option.id}
				>
					<Input
						onChange={(event) =>
							setDraft((current) => ({
								...current,
								imageOptions: current.imageOptions.map((item) =>
									item.id === option.id
										? { ...item, label: event.target.value }
										: item,
								),
							}))
						}
						placeholder={t("editor.imageTitle")}
						value={option.label}
					/>
					<Input
						onChange={(event) =>
							setDraft((current) => ({
								...current,
								imageOptions: current.imageOptions.map((item) =>
									item.id === option.id
										? { ...item, imageSrc: event.target.value }
										: item,
								),
							}))
						}
						placeholder="/quiz/circle.svg"
						value={option.imageSrc}
					/>
					<Input
						onChange={(event) =>
							setDraft((current) => ({
								...current,
								imageOptions: current.imageOptions.map((item) =>
									item.id === option.id
										? { ...item, imageAlt: event.target.value }
										: item,
								),
							}))
						}
						placeholder={t("editor.imageDescription")}
						value={option.imageAlt}
					/>
					<label className="flex items-center gap-2 text-sm">
						<input
							checked={option.isCorrect}
							className="h-4 w-4"
							name={`${idPrefix}-image-correct`}
							onChange={() => setSingleCorrect(option.id)}
							type="radio"
						/>
						{t("editor.correctImage")}
					</label>
					<Button
						disabled={draft.imageOptions.length <= 1}
						onClick={() =>
							setDraft((current) => ({
								...current,
								imageOptions: current.imageOptions.filter(
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
						imageOptions: [
							...current.imageOptions,
							{
								id: createNextId(current.imageOptions, "image"),
								label: "",
								imageSrc: "",
								imageAlt: "",
								isCorrect: false,
							},
						],
					}))
				}
				variant="surface"
			>
				{t("editor.addImage")}
			</Button>
		</div>
	);
}
