import { useTranslation } from "react-i18next";
import { ImageChoiceQuestionCard } from "@/components/questions/image-choice-question-card";
import { MatchingQuestionCard } from "@/components/questions/matching-question-card";
import { MultipleChoiceQuestionCard } from "@/components/questions/multiple-choice-question-card";
import { OddOneOutQuestionCard } from "@/components/questions/odd-one-out-question-card";
import { OrderingQuestionCard } from "@/components/questions/ordering-question-card";
import type { QuestionCardProps } from "@/components/questions/question-types";
import { SingleChoiceQuestionCard } from "@/components/questions/single-choice-question-card";
import { SortingQuestionCard } from "@/components/questions/sorting-question-card";
import { TextInputQuestionCard } from "@/components/questions/text-input-question-card";
import { TrueFalseQuestionCard } from "@/components/questions/true-false-question-card";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/ui/card";

export function QuestionRenderer({
	question,
	...interaction
}: QuestionCardProps) {
	switch (question.type) {
		case "single-choice":
			return <SingleChoiceQuestionCard question={question} {...interaction} />;
		case "multiple-choice":
			return (
				<MultipleChoiceQuestionCard question={question} {...interaction} />
			);
		case "true-false":
			return <TrueFalseQuestionCard question={question} {...interaction} />;
		case "matching":
			return <MatchingQuestionCard question={question} {...interaction} />;
		case "ordering":
			return <OrderingQuestionCard question={question} {...interaction} />;
		case "sorting":
			return <SortingQuestionCard question={question} {...interaction} />;
		case "text-input":
			return <TextInputQuestionCard question={question} {...interaction} />;
		case "image-choice":
			return <ImageChoiceQuestionCard question={question} {...interaction} />;
		case "odd-one-out":
			return <OddOneOutQuestionCard question={question} {...interaction} />;
		default:
			return <UnsupportedQuestionCard question={question} />;
	}
}

function UnsupportedQuestionCard({ question }: QuestionCardProps) {
	const { t } = useTranslation();

	return (
		<Card className="w-full max-w-2xl">
			<CardHeader>
				<CardTitle>{question.title}</CardTitle>
				<CardDescription>{t("questionCard.unsupported")}</CardDescription>
			</CardHeader>
			<CardContent>
				<code className="rounded bg-zinc-100 px-2 py-1 text-sm dark:bg-zinc-800 dark:text-zinc-100">
					{question.type}
				</code>
			</CardContent>
		</Card>
	);
}
