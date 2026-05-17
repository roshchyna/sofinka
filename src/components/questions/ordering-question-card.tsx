import { ArrowDown, ArrowUp, CheckCircle2, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { QuestionCardShell } from "@/components/questions/question-card-shell";
import { questionThemes } from "@/components/questions/question-theme";
import type { OrderingQuestion } from "@/components/questions/question-types";
import { rewardCorrectAnswer } from "@/lib/reward-success";
import { Button } from "@/ui/button";
import { cn } from "@/utils/twMerge";

interface OrderingQuestionCardProps {
	question: OrderingQuestion;
}

export function OrderingQuestionCard({ question }: OrderingQuestionCardProps) {
	const { t } = useTranslation();
	const initialItems = useMemo(
		() => question.items.slice().reverse(),
		[question],
	);
	const [items, setItems] = useState(initialItems);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const theme = questionThemes[question.type];
	const isCorrect = items.every(
		(item, index) => item.id === question.items[index]?.id,
	);

	function moveItem(fromIndex: number, direction: -1 | 1) {
		if (isSubmitted) return;

		const toIndex = fromIndex + direction;
		if (toIndex < 0 || toIndex >= items.length) return;

		setItems((currentItems) => {
			const nextItems = [...currentItems];
			const movingItem = nextItems[fromIndex];
			const targetItem = nextItems[toIndex];

			if (!movingItem || !targetItem) {
				return currentItems;
			}

			nextItems[fromIndex] = targetItem;
			nextItems[toIndex] = movingItem;
			return nextItems;
		});
	}

	function resetQuestion() {
		setItems(initialItems);
		setIsSubmitted(false);
	}

	function submitAnswer() {
		setIsSubmitted(true);
		if (isCorrect) rewardCorrectAnswer();
	}

	return (
		<QuestionCardShell
			canSubmit={true}
			footerText={
				isSubmitted
					? isCorrect
						? t("questionCard.orderingCorrect")
						: t("questionCard.orderingWrong")
					: t("questionCard.orderingIdle")
			}
			isSubmitted={isSubmitted}
			onReset={resetQuestion}
			onSubmit={submitAnswer}
			question={question}
			theme={theme}
		>
			<div className="grid gap-3">
				{items.map((item, index) => {
					const isItemCorrect = item.id === question.items[index]?.id;

					return (
						<div
							className={cn(
								"flex items-center gap-3 rounded-md border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900",
								isSubmitted &&
									isItemCorrect &&
									"border-emerald-600 bg-emerald-50 text-emerald-950 dark:border-emerald-400 dark:bg-emerald-900 dark:text-zinc-300",
								isSubmitted &&
									!isItemCorrect &&
									"border-red-600 bg-red-50 text-red-950 dark:border-red-400 dark:bg-red-900 dark:text-zinc-300",
							)}
							key={item.id}
						>
							<span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-zinc-950 font-semibold text-white text-xs dark:bg-zinc-50 dark:text-zinc-950">
								{index + 1}
							</span>
							<span className="flex-1 font-medium">{item.label}</span>
							{isSubmitted &&
								(isItemCorrect ? (
									<CheckCircle2 className="text-emerald-600 dark:text-emerald-300" />
								) : (
									<XCircle className="text-red-600 dark:text-red-300" />
								))}
							{!isSubmitted && (
								<div className="flex items-center gap-1">
									<Button
										aria-label={t("questionCard.moveUp")}
										disabled={index === 0}
										onClick={() => moveItem(index, -1)}
										size="icon"
										variant="ghost"
									>
										<ArrowUp />
									</Button>
									<Button
										aria-label={t("questionCard.moveDown")}
										disabled={index === items.length - 1}
										onClick={() => moveItem(index, 1)}
										size="icon"
										variant="ghost"
									>
										<ArrowDown />
									</Button>
								</div>
							)}
						</div>
					);
				})}
			</div>
		</QuestionCardShell>
	);
}
