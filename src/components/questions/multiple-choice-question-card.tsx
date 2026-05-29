import { useTranslation } from "react-i18next";
import { AnswerOptionButton } from "@/components/questions/answer-option-button";
import { useMultipleAnswer } from "@/components/questions/answer-state";
import { QuestionCardShell } from "@/components/questions/question-card-shell";
import { questionThemes } from "@/components/questions/question-theme";
import type { MultipleChoiceQuestion } from "@/components/questions/question-types";

interface MultipleChoiceQuestionCardProps {
	question: MultipleChoiceQuestion;
}

export function MultipleChoiceQuestionCard({
	question,
}: MultipleChoiceQuestionCardProps) {
	const { t } = useTranslation();
	const theme = questionThemes[question.type];
	const answer = useMultipleAnswer(question.options);

	return (
		<QuestionCardShell
			canSubmit={answer.canSubmit}
			footerText={
				answer.isSubmitted
					? answer.isCorrect
						? t("questionCard.multipleChoiceCorrect")
						: t("questionCard.multipleChoiceWrong")
					: t("questionCard.multipleChoiceIdle")
			}
			isSubmitted={answer.isSubmitted}
			onReset={answer.resetAnswer}
			onSubmit={answer.submitAnswer}
			question={question}
			theme={theme}
		>
			<fieldset className="grid gap-3 sm:grid-cols-2">
				<legend className="sr-only">{question.title}</legend>
				{question.options.map((option) => (
					<AnswerOptionButton
						isCorrect={option.isCorrect}
						isSelected={answer.isSelected(option.id)}
						isSubmitted={answer.isSubmitted}
						key={option.id}
						mode="checkbox"
						onClick={() => answer.toggleOption(option.id)}
						theme={theme}
					>
						{option.label}
					</AnswerOptionButton>
				))}
			</fieldset>
		</QuestionCardShell>
	);
}
