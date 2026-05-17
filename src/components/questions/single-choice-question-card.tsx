import { useTranslation } from "react-i18next";
import { AnswerOptionButton } from "@/components/questions/answer-option-button";
import { useSingleAnswer } from "@/components/questions/answer-state";
import { QuestionCardShell } from "@/components/questions/question-card-shell";
import { questionThemes } from "@/components/questions/question-theme";
import type { SingleChoiceQuestion } from "@/components/questions/question-types";

interface SingleChoiceQuestionCardProps {
	question: SingleChoiceQuestion;
}

export function SingleChoiceQuestionCard({
	question,
}: SingleChoiceQuestionCardProps) {
	const { t } = useTranslation();
	const theme = questionThemes[question.type];
	const answer = useSingleAnswer(question.options);

	return (
		<QuestionCardShell
			canSubmit={answer.canSubmit}
			footerText={
				answer.isSubmitted
					? answer.isCorrect
						? t("questionCard.singleChoiceCorrect")
						: t("questionCard.singleChoiceWrong")
					: t("questionCard.singleChoiceIdle")
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
				{question.options.map((option) => (
					<AnswerOptionButton
						isCorrect={option.isCorrect}
						isSelected={answer.isSelected(option.id)}
						isSubmitted={answer.isSubmitted}
						key={option.id}
						onClick={() => answer.chooseOption(option.id)}
						theme={theme}
					>
						{option.label}
					</AnswerOptionButton>
				))}
			</div>
		</QuestionCardShell>
	);
}
