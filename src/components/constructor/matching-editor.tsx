import { useTranslation } from "react-i18next";
import {
	createNextId,
	type DraftEditorProps,
	rowClassName,
} from "@/components/constructor/question-draft";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";

export function MatchingEditor({ draft, setDraft }: DraftEditorProps) {
	const { t } = useTranslation();

	return (
		<div className="grid gap-3">
			<p className="font-medium text-sm">{t("editor.pairs")}</p>
			{draft.matchingPairs.map((pair) => (
				<div
					className={`${rowClassName} sm:grid-cols-[1fr_1fr_auto] sm:items-center`}
					key={pair.id}
				>
					<Input
						onChange={(event) =>
							setDraft((current) => ({
								...current,
								matchingPairs: current.matchingPairs.map((item) =>
									item.id === pair.id
										? { ...item, left: event.target.value }
										: item,
								),
							}))
						}
						placeholder={t("editor.leftCard")}
						value={pair.left}
					/>
					<Input
						onChange={(event) =>
							setDraft((current) => ({
								...current,
								matchingPairs: current.matchingPairs.map((item) =>
									item.id === pair.id
										? { ...item, right: event.target.value }
										: item,
								),
							}))
						}
						placeholder={t("editor.rightCard")}
						value={pair.right}
					/>
					<Button
						disabled={draft.matchingPairs.length <= 1}
						onClick={() =>
							setDraft((current) => ({
								...current,
								matchingPairs: current.matchingPairs.filter(
									(item) => item.id !== pair.id,
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
						matchingPairs: [
							...current.matchingPairs,
							{
								id: createNextId(current.matchingPairs, "pair"),
								left: "",
								right: "",
							},
						],
					}))
				}
				variant="surface"
			>
				{t("editor.addPair")}
			</Button>
		</div>
	);
}
