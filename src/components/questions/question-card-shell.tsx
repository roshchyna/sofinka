import type { ReactNode } from "react";
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

	return (
		<Card className={cn("w-full max-w-2xl overflow-hidden", theme.card)}>
			<CardHeader className={theme.header}>
				{question.eyebrow && (
					<p className={cn("font-medium text-sm", theme.eyebrow)}>
						{question.eyebrow}
					</p>
				)}
				<CardTitle>{question.title}</CardTitle>
				{question.description && (
					<CardDescription>{question.description}</CardDescription>
				)}
			</CardHeader>

			<CardContent>{children}</CardContent>

			<CardFooter className="flex-col items-stretch sm:flex-row sm:items-center sm:justify-between">
				<p className="min-h-5 text-sm text-zinc-600 dark:text-zinc-300">
					{footerText}
				</p>
				{isSubmitted ? (
					<Button onClick={onReset} variant="surface">
						{t("common.tryAgain")}
					</Button>
				) : (
					<Button disabled={!canSubmit} onClick={onSubmit}>
						{t("common.check")}
					</Button>
				)}
			</CardFooter>
		</Card>
	);
}
