import { useTranslation } from "react-i18next";
import {
	createNextId,
	type DraftEditorProps,
	rowClassName,
} from "@/components/constructor/question-draft";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Select } from "@/ui/select";

export function SortingEditor({ draft, setDraft }: DraftEditorProps) {
	const { t } = useTranslation();

	return (
		<div className="grid gap-5">
			<div className="grid gap-3">
				<p className="font-medium text-sm">{t("editor.groups")}</p>
				{draft.sortingCategories.map((category) => (
					<div
						className={`${rowClassName} sm:grid-cols-[1fr_auto] sm:items-center`}
						key={category.id}
					>
						<Input
							onChange={(event) =>
								setDraft((current) => ({
									...current,
									sortingCategories: current.sortingCategories.map((item) =>
										item.id === category.id
											? { ...item, label: event.target.value }
											: item,
									),
								}))
							}
							placeholder={t("editor.groupName")}
							value={category.label}
						/>
						<Button
							disabled={draft.sortingCategories.length <= 1}
							onClick={() =>
								setDraft((current) => {
									const nextCategories = current.sortingCategories.filter(
										(item) => item.id !== category.id,
									);
									const fallbackCategoryId = nextCategories[0]?.id ?? "";

									return {
										...current,
										sortingCategories: nextCategories,
										sortingItems: current.sortingItems.map((item) =>
											item.categoryId === category.id
												? { ...item, categoryId: fallbackCategoryId }
												: item,
										),
									};
								})
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
							sortingCategories: [
								...current.sortingCategories,
								{
									id: createNextId(current.sortingCategories, "category"),
									label: "",
								},
							],
						}))
					}
					variant="surface"
				>
					{t("editor.addGroup")}
				</Button>
			</div>

			<div className="grid gap-3">
				<p className="font-medium text-sm">{t("editor.items")}</p>
				{draft.sortingItems.map((item) => (
					<div
						className={`${rowClassName} sm:grid-cols-[1fr_1fr_auto] sm:items-center`}
						key={item.id}
					>
						<Input
							onChange={(event) =>
								setDraft((current) => ({
									...current,
									sortingItems: current.sortingItems.map((currentItem) =>
										currentItem.id === item.id
											? { ...currentItem, label: event.target.value }
											: currentItem,
									),
								}))
							}
							placeholder={t("editor.item")}
							value={item.label}
						/>
						<Select
							onValueChange={(value) =>
								setDraft((current) => ({
									...current,
									sortingItems: current.sortingItems.map((currentItem) =>
										currentItem.id === item.id
											? { ...currentItem, categoryId: value }
											: currentItem,
									),
								}))
							}
							options={draft.sortingCategories.map((category) => ({
								label: category.label || t("editor.unnamed"),
								value: category.id,
							}))}
							value={item.categoryId}
						/>
						<Button
							disabled={draft.sortingItems.length <= 1}
							onClick={() =>
								setDraft((current) => ({
									...current,
									sortingItems: current.sortingItems.filter(
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
							sortingItems: [
								...current.sortingItems,
								{
									id: createNextId(current.sortingItems, "sort-item"),
									label: "",
									categoryId: current.sortingCategories[0]?.id ?? "",
								},
							],
						}))
					}
					variant="surface"
				>
					{t("editor.addSortingItem")}
				</Button>
			</div>
		</div>
	);
}
