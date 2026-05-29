import { type ReactNode, useId } from "react";
import { useTranslation } from "react-i18next";
import type { QuestionTheme } from "@/components/questions/question-theme";
import type { QuestionBase } from "@/components/questions/question-types";
import { Button } from "@/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/ui/card";
import { cn } from "@/utils/twMerge";

interface QuestionCardShellProps {
	canSubmit: boolean;
	children: ReactNode;
	footerText: string;
	isSubmitted: boolean;
	onReset: () => void;
	onSubmit: () => void;
	question: QuestionBase;
	theme: QuestionTheme;
}

export function QuestionCardShell({
	canSubmit,
	children,
	footerText,
	isSubmitted,
	onReset,
	onSubmit,
	question,
	theme,
}: QuestionCardShellProps) {
	const { t } = useTranslation();
	const titleId = useId();
	const descriptionId = useId();
	const feedbackId = useId();
	const describedBy = [question.description ? descriptionId : null, feedbackId]
		.filter(Boolean)
		.join(" ");

	return (
		<Card
			aria-describedby={describedBy}
			aria-labelledby={titleId}
			className={cn("w-full max-w-2xl overflow-hidden", theme.card)}
			role="group"
		>
			<CardHeader className={theme.header}>
				{question.eyebrow && (
					<p className={cn("font-medium text-sm", theme.eyebrow)}>
						{question.eyebrow}
					</p>
				)}
				<CardTitle id={titleId}>{question.title}</CardTitle>
				{question.description && (
					<CardDescription id={descriptionId}>
						{question.description}
					</CardDescription>
				)}
			</CardHeader>

			<CardContent>{children}</CardContent>

			<CardFooter className="flex-col items-stretch sm:flex-row sm:items-center sm:justify-between">
				<output
					aria-atomic="true"
					aria-live="polite"
					className="min-h-5 text-sm text-zinc-700 dark:text-zinc-200"
					id={feedbackId}
				>
					{footerText}
				</output>
				{isSubmitted ? (
					<Button
						aria-describedby={feedbackId}
						onClick={onReset}
						variant="surface"
					>
						{t("common.tryAgain")}
					</Button>
				) : (
					<Button
						aria-describedby={feedbackId}
						disabled={!canSubmit}
						onClick={onSubmit}
					>
						{t("common.check")}
					</Button>
				)}
			</CardFooter>
		</Card>
	);
}
