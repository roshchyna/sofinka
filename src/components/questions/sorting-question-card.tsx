import { CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { QuestionCardShell } from "@/components/questions/question-card-shell";
import { questionThemes } from "@/components/questions/question-theme";
import type { SortingQuestion } from "@/components/questions/question-types";
import { rewardCorrectAnswer } from "@/lib/reward-success";
import { Button } from "@/ui/button";
import { cn } from "@/utils/twMerge";

interface SortingQuestionCardProps {
	question: SortingQuestion;
}

export function SortingQuestionCard({ question }: SortingQuestionCardProps) {
	const { t } = useTranslation();
	const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
	const [placements, setPlacements] = useState<Record<string, string>>({});
	const [isSubmitted, setIsSubmitted] = useState(false);

	const theme = questionThemes[question.type];
	const selectedItem = question.items.find(
		(item) => item.id === selectedItemId,
	);
	const unplacedItems = question.items.filter((item) => !placements[item.id]);
	const isComplete = question.items.every((item) => placements[item.id]);
	const isCorrect = question.items.every(
		(item) => placements[item.id] === item.categoryId,
	);

	function chooseItem(itemId: string) {
		if (isSubmitted) return;
		setSelectedItemId(itemId);
	}

	function chooseCategory(categoryId: string) {
		if (isSubmitted || !selectedItemId) return;

		setPlacements((currentPlacements) => ({
			...currentPlacements,
			[selectedItemId]: categoryId,
		}));
		setSelectedItemId(null);
	}

	function pickPlacedItem(itemId: string) {
		if (isSubmitted) return;

		setPlacements((currentPlacements) => {
			const nextPlacements = { ...currentPlacements };
			delete nextPlacements[itemId];
			return nextPlacements;
		});
		setSelectedItemId(itemId);
	}

	function resetQuestion() {
		setSelectedItemId(null);
		setPlacements({});
		setIsSubmitted(false);
	}

	function submitAnswer() {
		setIsSubmitted(true);
		if (isCorrect) rewardCorrectAnswer();
	}

	function getItemsForCategory(categoryId: string) {
		return question.items.filter((item) => placements[item.id] === categoryId);
	}

	return (
		<QuestionCardShell
			canSubmit={isComplete}
			footerText={
				isSubmitted
					? isCorrect
						? t("questionCard.sortingCorrect")
						: t("questionCard.sortingWrong")
					: selectedItem
						? t("questionCard.sortingPickGroup", {
								item: selectedItem.label,
							})
						: t("questionCard.sortingIdle")
			}
			isSubmitted={isSubmitted}
			onReset={resetQuestion}
			onSubmit={submitAnswer}
			question={question}
			theme={theme}
		>
			<div className="grid gap-5">
				<div className="grid gap-3">
					<p className="font-medium text-sm text-zinc-700 dark:text-zinc-200">
						{t("questionCard.sortingItemsTitle")}
					</p>
					<div className="grid gap-2 sm:grid-cols-2">
						{unplacedItems.map((item) => {
							const isSelected = selectedItemId === item.id;

							return (
								<Button
									className={cn(
										"h-auto justify-start whitespace-normal px-4 py-3 text-left",
										isSelected && theme.selected,
									)}
									key={item.id}
									onClick={() => chooseItem(item.id)}
									aria-pressed={isSelected}
									size="xl"
									variant="outline"
								>
									{item.label}
								</Button>
							);
						})}
					</div>
				</div>

				<div className="grid gap-3 sm:grid-cols-2">
					{question.categories.map((category) => {
						const categoryItems = getItemsForCategory(category.id);
						const hasWrongItem = categoryItems.some(
							(item) => item.categoryId !== category.id,
						);
						const showCorrect =
							isSubmitted && categoryItems.length > 0 && !hasWrongItem;

						return (
							<fieldset
								className={cn(
									"grid min-h-36 gap-3 rounded-md border border-zinc-200 bg-white/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/80",
									selectedItemId && !isSubmitted && theme.selected,
									isSubmitted &&
										showCorrect &&
										"border-emerald-600 bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-950",
									isSubmitted &&
										hasWrongItem &&
										"border-red-600 bg-red-50 dark:border-red-400 dark:bg-red-950",
								)}
								key={category.id}
							>
								<legend className="sr-only">{category.label}</legend>
								<div className="flex items-center justify-between gap-2">
									<p aria-hidden="true" className="font-semibold">
										{category.label}
									</p>
									{isSubmitted &&
										(hasWrongItem ? (
											<>
												<span className="sr-only">
													{t("questionCard.optionIncorrect")}
												</span>
												<XCircle className="text-red-600 dark:text-red-300" />
											</>
										) : (
											categoryItems.length > 0 && (
												<>
													<span className="sr-only">
														{t("questionCard.optionCorrect")}
													</span>
													<CheckCircle2 className="text-emerald-600 dark:text-emerald-300" />
												</>
											)
										))}
								</div>

								<div className="grid content-start gap-2">
									{categoryItems.map((item) => (
										<Button
											className={cn(
												"h-auto justify-start whitespace-normal px-3 py-2 text-left",
												isSubmitted &&
													item.categoryId === category.id &&
													"border-emerald-600 bg-emerald-50 text-emerald-950 hover:bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-950 dark:text-emerald-50 dark:hover:bg-emerald-950",
												isSubmitted &&
													item.categoryId !== category.id &&
													"border-red-600 bg-red-50 text-red-950 hover:bg-red-50 dark:border-red-400 dark:bg-red-950 dark:text-red-50 dark:hover:bg-red-950",
											)}
											disabled={isSubmitted}
											key={item.id}
											onClick={() => pickPlacedItem(item.id)}
											size="md"
											variant="outline"
										>
											{item.label}
										</Button>
									))}
								</div>

								<Button
									disabled={!selectedItemId || isSubmitted}
									onClick={() => chooseCategory(category.id)}
									variant="surface"
								>
									{selectedItem
										? t("questionCard.sortingPlace", {
												item: selectedItem.label,
											})
										: t("questionCard.sortingPickItem")}
								</Button>
							</fieldset>
						);
					})}
				</div>
			</div>
		</QuestionCardShell>
	);
}
