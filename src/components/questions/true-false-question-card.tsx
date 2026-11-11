import { useTranslation } from "react-i18next";
import { AnswerOptionButton } from "@/components/questions/answer-option-button";
import { useSingleAnswer } from "@/components/questions/answer-state";
import { QuestionCardShell } from "@/components/questions/question-card-shell";
import { questionThemes } from "@/components/questions/question-theme";
import type {
	QuestionCardProps,
	TrueFalseQuestion,
} from "@/components/questions/question-types";

export function TrueFalseQuestionCard({
	question,
	onAnswer,
	allowRetry,
}: QuestionCardProps<TrueFalseQuestion>) {
	const { t } = useTranslation();
	const answerOptions = question.options?.length
		? question.options.map((option) => ({
				id: option.id,
				label: option.label,
				isCorrect: option.isCorrect,
			}))
		: [
				{
					id: "true",
					label: t("editor.true"),
					isCorrect: question.answer === true,
				},
				{
					id: "false",
					label: t("editor.false"),
					isCorrect: question.answer === false,
				},
			];
	const theme = questionThemes[question.type];
	const answer = useSingleAnswer(answerOptions, {
		questionId: question.id,
		onAnswer,
	});

	return (
		<QuestionCardShell
			allowRetry={allowRetry}
			canSubmit={answer.canSubmit}
			footerText={
				answer.isSubmitted
					? answer.isCorrect
						? t("questionCard.trueFalseCorrect")
						: t("questionCard.trueFalseWrong")
					: t("questionCard.trueFalseIdle")
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
				{answerOptions.map((option) => (
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
