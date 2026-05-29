import { CheckCircle2, Circle, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSingleAnswer } from "@/components/questions/answer-state";
import { QuestionCardShell } from "@/components/questions/question-card-shell";
import { questionThemes } from "@/components/questions/question-theme";
import type { ImageChoiceQuestion } from "@/components/questions/question-types";
import { normalizeImageSource } from "@/lib/image-source";
import { Button } from "@/ui/button";
import { cn } from "@/utils/twMerge";

interface ImageChoiceQuestionCardProps {
	question: ImageChoiceQuestion;
}

export function ImageChoiceQuestionCard({
	question,
}: ImageChoiceQuestionCardProps) {
	const { t } = useTranslation();
	const theme = questionThemes[question.type];
	const answer = useSingleAnswer(question.options);

	return (
		<QuestionCardShell
			canSubmit={answer.canSubmit}
			footerText={
				answer.isSubmitted
					? answer.isCorrect
						? t("questionCard.imageChoiceCorrect")
						: t("questionCard.imageChoiceWrong")
					: t("questionCard.imageChoiceIdle")
			}
			isSubmitted={answer.isSubmitted}
			onReset={answer.resetAnswer}
			onSubmit={answer.submitAnswer}
			question={question}
			theme={theme}
		>
			<div
				aria-label={question.title}
				className="grid gap-3 sm:grid-cols-2"
				role="radiogroup"
			>
				{question.options.map((option) => {
					const isSelected = answer.isSelected(option.id);
					const showCorrect = answer.isSubmitted && option.isCorrect;
					const showWrong =
						answer.isSubmitted && isSelected && !option.isCorrect;
					const imageSrc = normalizeImageSource(option.imageSrc);

					return (
						<Button
							aria-checked={isSelected}
							className={cn(
								"h-auto flex-col gap-3 whitespace-normal px-4 py-4 text-center",
								isSelected && theme.selected,
								showCorrect &&
									"border-emerald-600 bg-emerald-50 text-emerald-950 hover:bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-950 dark:text-emerald-50 dark:hover:bg-emerald-950",
								showWrong &&
									"border-red-600 bg-red-50 text-red-950 hover:bg-red-50 dark:border-red-400 dark:bg-red-950 dark:text-red-50 dark:hover:bg-red-950",
							)}
							key={option.id}
							onClick={() => answer.chooseOption(option.id)}
							role="radio"
							size="xl"
							variant="outline"
						>
							{imageSrc ? (
								<img
									alt={option.imageAlt}
									className="aspect-square w-full max-w-28 rounded-md object-contain"
									src={imageSrc}
								/>
							) : (
								<div
									aria-hidden="true"
									className="grid aspect-square w-full max-w-28 place-items-center rounded-md border border-dashed border-zinc-300 bg-zinc-50 text-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-500"
								>
									<span className="text-xs">
										{t("questionCard.imageMissing")}
									</span>
								</div>
							)}
							<span className="flex items-center gap-2 font-medium">
								{option.label}
								{showCorrect && (
									<>
										<span className="sr-only">
											{t("questionCard.optionCorrect")}
										</span>
										<CheckCircle2 className="text-emerald-600 dark:text-emerald-300" />
									</>
								)}
								{showWrong && (
									<>
										<span className="sr-only">
											{t("questionCard.optionIncorrect")}
										</span>
										<XCircle className="text-red-600 dark:text-red-300" />
									</>
								)}
								{!answer.isSubmitted && isSelected && (
									<>
										<span className="sr-only">
											{t("questionCard.optionSelected")}
										</span>
										<Circle className="fill-zinc-950 text-zinc-950 dark:fill-zinc-50 dark:text-zinc-300" />
									</>
								)}
							</span>
						</Button>
					);
				})}
			</div>
		</QuestionCardShell>
	);
}
