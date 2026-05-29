import {
	CheckCircle2,
	Circle,
	Square,
	SquareCheckBig,
	XCircle,
} from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import type { QuestionTheme } from "@/components/questions/question-theme";
import { Button } from "@/ui/button";
import { cn } from "@/utils/twMerge";

type SelectionMode = "radio" | "checkbox";

interface AnswerOptionButtonProps {
	children: ReactNode;
	className?: string;
	isCorrect: boolean;
	isSelected: boolean;
	isSubmitted: boolean;
	mode?: SelectionMode;
	onClick: () => void;
	theme: QuestionTheme;
}

export function AnswerOptionButton({
	children,
	className,
	isCorrect,
	isSelected,
	isSubmitted,
	mode = "radio",
	onClick,
	theme,
}: AnswerOptionButtonProps) {
	const { t } = useTranslation();
	const showCorrect = isSubmitted && isCorrect;
	const showWrong = isSubmitted && isSelected && !isCorrect;

	return (
		<Button
			aria-checked={isSelected}
			className={cn(
				"h-auto justify-start gap-3 whitespace-normal px-4 py-4 text-left",
				isSelected && theme.selected,
				showCorrect &&
					"border-emerald-600 bg-emerald-50 text-emerald-950 hover:bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-950 dark:text-emerald-50 dark:hover:bg-emerald-950",
				showWrong &&
					"border-red-600 bg-red-50 text-red-950 hover:bg-red-50 dark:border-red-400 dark:bg-red-950 dark:text-red-50 dark:hover:bg-red-950",
				className,
			)}
			onClick={onClick}
			role={mode}
			size="xl"
			variant="outline"
		>
			<span className="flex-1">{children}</span>
			{showCorrect && (
				<>
					<span className="sr-only">{t("questionCard.optionCorrect")}</span>
					<CheckCircle2 className="text-emerald-600 dark:text-emerald-300" />
				</>
			)}
			{showWrong && (
				<>
					<span className="sr-only">{t("questionCard.optionIncorrect")}</span>
					<XCircle className="text-red-600 dark:text-red-300" />
				</>
			)}
			{!isSubmitted && mode === "radio" && isSelected && (
				<>
					<span className="sr-only">{t("questionCard.optionSelected")}</span>
					<Circle className="fill-zinc-950 text-zinc-950 dark:fill-zinc-50 dark:text-zinc-300" />
				</>
			)}
			{!isSubmitted &&
				mode === "checkbox" &&
				(isSelected ? (
					<>
						<span className="sr-only">{t("questionCard.optionSelected")}</span>
						<SquareCheckBig className="text-zinc-950 dark:text-zinc-300" />
					</>
				) : (
					<Square className="text-zinc-400 dark:text-zinc-500" />
				))}
		</Button>
	);
}
