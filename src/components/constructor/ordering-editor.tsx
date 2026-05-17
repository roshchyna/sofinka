import { useTranslation } from "react-i18next";
import {
	createNextId,
	type DraftEditorProps,
	rowClassName,
} from "@/components/constructor/question-draft";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";

export function OrderingEditor({ draft, setDraft }: DraftEditorProps) {
	const { t } = useTranslation();

	return (
		<div className="grid gap-3">
			<p className="font-medium text-sm">{t("editor.correctOrder")}</p>
			{draft.orderingItems.map((item, index) => (
				<div
					className={`${rowClassName} sm:grid-cols-[auto_1fr_auto] sm:items-center`}
					key={item.id}
				>
					<span className="font-medium text-sm text-zinc-500 dark:text-zinc-400">
						{index + 1}
					</span>
					<Input
						onChange={(event) =>
							setDraft((current) => ({
								...current,
								orderingItems: current.orderingItems.map((currentItem) =>
									currentItem.id === item.id
										? { ...currentItem, label: event.target.value }
										: currentItem,
								),
							}))
						}
						placeholder={t("editor.itemPlaceholder")}
						value={item.label}
					/>
					<Button
						disabled={draft.orderingItems.length <= 1}
						onClick={() =>
							setDraft((current) => ({
								...current,
								orderingItems: current.orderingItems.filter(
									(currentItem) => currentItem.id !== item.id,
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
						orderingItems: [
							...current.orderingItems,
							{
								id: createNextId(current.orderingItems, "item"),
								label: "",
							},
						],
					}))
				}
				variant="surface"
			>
				{t("editor.addItem")}
			</Button>
		</div>
	);
}
