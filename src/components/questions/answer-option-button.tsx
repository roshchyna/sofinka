import {
	CheckCircle2,
	Circle,
	Square,
	SquareCheckBig,
	XCircle,
} from "lucide-react";
import type { ReactNode } from "react";
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
	const showCorrect = isSubmitted && isCorrect;
	const showWrong = isSubmitted && isSelected && !isCorrect;

	return (
		<Button
			aria-checked={mode === "radio" ? isSelected : undefined}
			aria-pressed={mode === "checkbox" ? isSelected : undefined}
			className={cn(
				"h-auto justify-start gap-3 whitespace-normal px-4 py-4 text-left",
				isSelected && theme.selected,
				showCorrect &&
					"border-emerald-600 bg-emerald-50 text-emerald-950 hover:bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-900 dark:text-zinc-300 dark:hover:bg-emerald-900",
				showWrong &&
					"border-red-600 bg-red-50 text-red-950 hover:bg-red-50 dark:border-red-400 dark:bg-red-900 dark:text-zinc-300 dark:hover:bg-red-900",
				className,
			)}
			onClick={onClick}
			role={mode === "radio" ? "radio" : undefined}
			size="xl"
			variant="outline"
		>
			<span className="flex-1">{children}</span>
			{showCorrect && (
				<CheckCircle2 className="text-emerald-600 dark:text-emerald-300" />
			)}
			{showWrong && <XCircle className="text-red-600 dark:text-red-300" />}
			{!isSubmitted && mode === "radio" && isSelected && (
				<Circle className="fill-zinc-950 text-zinc-950 dark:fill-zinc-50 dark:text-zinc-300" />
			)}
			{!isSubmitted &&
				mode === "checkbox" &&
				(isSelected ? (
					<SquareCheckBig className="text-zinc-950 dark:text-zinc-300" />
				) : (
					<Square className="text-zinc-400 dark:text-zinc-500" />
				))}
		</Button>
	);
}
