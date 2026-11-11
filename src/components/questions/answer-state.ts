import { useRef, useState } from "react";
import type {
	QuestionAnswerResult,
	QuestionAnswerValue,
} from "@/components/questions/question-types";
import { rewardCorrectAnswer } from "@/lib/reward-success";

interface AnswerOptionState {
	id: string;
	isCorrect: boolean;
}

interface AnswerReporter {
	questionId: number;
	onAnswer?: (result: QuestionAnswerResult) => void;
}

interface AnswerSubmissionOptions {
	canSubmit: boolean;
	isCorrect: boolean;
	value: QuestionAnswerValue;
	questionId?: number;
	onAnswer?: (result: QuestionAnswerResult) => void;
}

export function useAnswerSubmission({
	canSubmit,
	isCorrect,
	value,
	questionId,
	onAnswer,
}: AnswerSubmissionOptions) {
	const [isSubmitted, setIsSubmitted] = useState(false);
	const submittedRef = useRef(false);

	function submitAnswer() {
		if (!canSubmit || submittedRef.current) return;
		submittedRef.current = true;
		setIsSubmitted(true);
		if (isCorrect) rewardCorrectAnswer();
		if (questionId !== undefined) {
			onAnswer?.({
				questionId,
				isCorrect,
				value:
					typeof value === "string"
						? value
						: Array.isArray(value)
							? [...value]
							: { ...value },
			});
		}
	}

	function resetSubmission() {
		submittedRef.current = false;
		setIsSubmitted(false);
	}

	return { isSubmitted, submitAnswer, resetSubmission };
}

export function useSingleAnswer(
	options: AnswerOptionState[],
	reporter?: AnswerReporter,
) {
	const [selectedId, setSelectedId] = useState<string | null>(null);

	const selectedOption = options.find((option) => option.id === selectedId);
	const isCorrect = selectedOption?.isCorrect ?? false;
	const { isSubmitted, submitAnswer, resetSubmission } = useAnswerSubmission({
		...reporter,
		canSubmit: selectedId !== null,
		isCorrect,
		value: selectedId ?? "",
	});

	function chooseOption(optionId: string) {
		if (isSubmitted) return;
		setSelectedId(optionId);
	}

	function resetAnswer() {
		setSelectedId(null);
		resetSubmission();
	}

	return {
		canSubmit: selectedId !== null,
		chooseOption,
		isCorrect,
		isSelected: (optionId: string) => selectedId === optionId,
		isSubmitted,
		resetAnswer,
		selectedId,
		submitAnswer,
	};
}

export function useMultipleAnswer(
	options: AnswerOptionState[],
	reporter?: AnswerReporter,
) {
	const [selectedIds, setSelectedIds] = useState<string[]>([]);

	const correctIds = options
		.filter((option) => option.isCorrect)
		.map((option) => option.id);
	const isCorrect =
		selectedIds.length === correctIds.length &&
		correctIds.every((id) => selectedIds.includes(id));
	const { isSubmitted, submitAnswer, resetSubmission } = useAnswerSubmission({
		...reporter,
		canSubmit: selectedIds.length > 0,
		isCorrect,
		value: selectedIds,
	});

	function toggleOption(optionId: string) {
		if (isSubmitted) return;

		setSelectedIds((currentIds) =>
			currentIds.includes(optionId)
				? currentIds.filter((id) => id !== optionId)
				: [...currentIds, optionId],
		);
	}

	function resetAnswer() {
		setSelectedIds([]);
		resetSubmission();
	}

	return {
		canSubmit: selectedIds.length > 0,
		isCorrect,
		isSelected: (optionId: string) => selectedIds.includes(optionId),
		isSubmitted,
		resetAnswer,
		selectedIds,
		submitAnswer,
		toggleOption,
	};
}
