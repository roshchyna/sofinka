import { CheckCircle2, Link2, XCircle } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { QuestionCardShell } from "@/components/questions/question-card-shell";
import { questionThemes } from "@/components/questions/question-theme";
import type { MatchingQuestion } from "@/components/questions/question-types";
import { rewardCorrectAnswer } from "@/lib/reward-success";
import { Button } from "@/ui/button";
import { cn } from "@/utils/twMerge";

interface MatchingQuestionCardProps {
	question: MatchingQuestion;
}

export function MatchingQuestionCard({ question }: MatchingQuestionCardProps) {
	const { t } = useTranslation();
	const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
	const [matches, setMatches] = useState<Record<string, string>>({});
	const [isSubmitted, setIsSubmitted] = useState(false);

	const theme = questionThemes[question.type];
	const rightOptions = question.pairs.slice().reverse();
	const isComplete = question.pairs.every((pair) => matches[pair.id]);
	const isCorrect = question.pairs.every(
		(pair) => matches[pair.id] === pair.id,
	);

	function chooseLeft(pairId: string) {
		if (isSubmitted) return;
		setSelectedLeftId(pairId);
	}

	function chooseRight(pairId: string) {
		if (isSubmitted || !selectedLeftId) return;

		setMatches((currentMatches) => {
			const nextMatches = Object.fromEntries(
				Object.entries(currentMatches).filter(([, value]) => value !== pairId),
			);

			return {
				...nextMatches,
				[selectedLeftId]: pairId,
			};
		});
		setSelectedLeftId(null);
	}

	function resetQuestion() {
		setSelectedLeftId(null);
		setMatches({});
		setIsSubmitted(false);
	}

	function submitAnswer() {
		setIsSubmitted(true);
		if (isCorrect) rewardCorrectAnswer();
	}

	function getRightLabel(pairId: string) {
		return question.pairs.find((pair) => pair.id === pairId)?.right;
	}

	return (
		<QuestionCardShell
			canSubmit={isComplete}
			footerText={
				isSubmitted
					? isCorrect
						? t("questionCard.matchingCorrect")
						: t("questionCard.matchingWrong")
					: selectedLeftId
						? t("questionCard.matchingPickRight")
						: t("questionCard.matchingIdle")
			}
			isSubmitted={isSubmitted}
			onReset={resetQuestion}
			onSubmit={submitAnswer}
			question={question}
			theme={theme}
		>
			<div className="grid gap-4 sm:grid-cols-2">
				<div className="grid gap-3">
					<p className="font-medium text-sm text-zinc-600 dark:text-zinc-300">
						{t("questionCard.matchingLeftTitle")}
					</p>
					{question.pairs.map((pair) => {
						const isSelected = selectedLeftId === pair.id;
						const matchedRightLabel = getRightLabel(matches[pair.id]);
						const showCorrect = isSubmitted && matches[pair.id] === pair.id;
						const showWrong =
							isSubmitted &&
							Boolean(matches[pair.id]) &&
							matches[pair.id] !== pair.id;

						return (
							<Button
								className={cn(
									"h-auto justify-start whitespace-normal px-4 py-4 text-left",
									isSelected && theme.selected,
									showCorrect &&
										"border-emerald-600 bg-emerald-50 text-emerald-950 hover:bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-900 dark:text-zinc-300 dark:hover:bg-emerald-900",
									showWrong &&
										"border-red-600 bg-red-50 text-red-950 hover:bg-red-50 dark:border-red-400 dark:bg-red-900 dark:text-zinc-300 dark:hover:bg-red-900",
								)}
								key={pair.id}
								onClick={() => chooseLeft(pair.id)}
								size="xl"
								variant="outline"
							>
								<span className="flex flex-1 flex-col gap-1">
									<span>{pair.left}</span>
									{matchedRightLabel && (
										<span className="flex items-center gap-1 text-xs opacity-75">
											<Link2 className="size-3" />
											{matchedRightLabel}
										</span>
									)}
								</span>
								{showCorrect && (
									<CheckCircle2 className="text-emerald-600 dark:text-emerald-300" />
								)}
								{showWrong && (
									<XCircle className="text-red-600 dark:text-red-300" />
								)}
							</Button>
						);
					})}
				</div>

				<div className="grid gap-3">
					<p className="font-medium text-sm text-zinc-600 dark:text-zinc-300">
						{t("questionCard.matchingRightTitle")}
					</p>
					{rightOptions.map((pair) => {
						const isMatched = Object.values(matches).includes(pair.id);

						return (
							<Button
								className={cn(
									"h-auto justify-start whitespace-normal px-4 py-4 text-left",
									isMatched &&
										"border-zinc-300 bg-white/70 text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800/70 dark:text-zinc-400",
									selectedLeftId && !isMatched && theme.selected,
								)}
								disabled={isSubmitted}
								key={pair.id}
								onClick={() => chooseRight(pair.id)}
								size="xl"
								variant="outline"
							>
								{pair.right}
							</Button>
						);
					})}
				</div>
			</div>
		</QuestionCardShell>
	);
}
