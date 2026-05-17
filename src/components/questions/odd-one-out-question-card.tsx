import { useTranslation } from "react-i18next";
import { AnswerOptionButton } from "@/components/questions/answer-option-button";
import { useSingleAnswer } from "@/components/questions/answer-state";
import { QuestionCardShell } from "@/components/questions/question-card-shell";
import { questionThemes } from "@/components/questions/question-theme";
import {
	getOptionIsCorrect,
	type OddOneOutQuestion,
} from "@/components/questions/question-types";

interface OddOneOutQuestionCardProps {
	question: OddOneOutQuestion;
}

export function OddOneOutQuestionCard({
	question,
}: OddOneOutQuestionCardProps) {
	const { t } = useTranslation();
	const options = question.options.map((option) => ({
		...option,
		isCorrect: getOptionIsCorrect(option),
	}));
	const theme = questionThemes[question.type];
	const answer = useSingleAnswer(options);

	return (
		<QuestionCardShell
			canSubmit={answer.canSubmit}
			footerText={
				answer.isSubmitted
					? answer.isCorrect
						? t("questionCard.oddCorrect")
						: t("questionCard.oddWrong")
					: t("questionCard.oddIdle")
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
				{options.map((option) => (
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
