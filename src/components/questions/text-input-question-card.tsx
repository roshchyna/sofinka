import { CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { QuestionCardShell } from "@/components/questions/question-card-shell";
import { questionThemes } from "@/components/questions/question-theme";
import {
	getTextInputAnswers,
	type TextInputQuestion,
} from "@/components/questions/question-types";
import { rewardCorrectAnswer } from "@/lib/reward-success";
import { Input } from "@/ui/input";
import { cn } from "@/utils/twMerge";

interface TextInputQuestionCardProps {
	question: TextInputQuestion;
}

function normalizeAnswer(answer: string) {
	return answer.trim().replace(/\s+/g, " ").toLowerCase();
}

export function TextInputQuestionCard({
	question,
}: TextInputQuestionCardProps) {
	const { t } = useTranslation();
	const [answer, setAnswer] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);

	const theme = questionThemes[question.type];
	const answers = getTextInputAnswers(question);
	const normalizedAnswer = normalizeAnswer(answer);
	const primaryAnswer = answers[0] ?? "";
	const isCorrect = answers.some(
		(correctAnswer) => normalizeAnswer(correctAnswer) === normalizedAnswer,
	);

	function resetQuestion() {
		setAnswer("");
		setIsSubmitted(false);
	}

	function submitAnswer() {
		setIsSubmitted(true);
		if (isCorrect) rewardCorrectAnswer();
	}

	return (
		<QuestionCardShell
			canSubmit={Boolean(normalizedAnswer)}
			footerText={
				isSubmitted
					? isCorrect
						? t("questionCard.textInputCorrect")
						: t("questionCard.textInputWrong", { answer: primaryAnswer })
					: t("questionCard.textInputIdle")
			}
			isSubmitted={isSubmitted}
			onReset={resetQuestion}
			onSubmit={submitAnswer}
			question={question}
			theme={theme}
		>
			<div className="grid gap-3">
				<div className="relative">
					<Input
						aria-label={question.title}
						className={cn(
							"pr-10",
							isSubmitted &&
								isCorrect &&
								"border-emerald-600 bg-emerald-50 text-emerald-950 dark:border-emerald-400 dark:bg-emerald-950 dark:text-emerald-50",
							isSubmitted &&
								!isCorrect &&
								"border-red-600 bg-red-50 text-red-950 dark:border-red-400 dark:bg-red-950 dark:text-red-50",
						)}
						disabled={isSubmitted}
						onChange={(event) => setAnswer(event.target.value)}
						onKeyDown={(event) => {
							if (event.key === "Enter" && normalizedAnswer) {
								submitAnswer();
							}
						}}
						placeholder={
							question.placeholder ?? t("questionCard.textInputPlaceholder")
						}
						value={answer}
					/>
					{isSubmitted &&
						(isCorrect ? (
							<CheckCircle2 className="-translate-y-1/2 absolute top-1/2 right-3 text-emerald-600 dark:text-emerald-300" />
						) : (
							<XCircle className="-translate-y-1/2 absolute top-1/2 right-3 text-red-600 dark:text-red-300" />
						))}
				</div>
			</div>
		</QuestionCardShell>
	);
}
