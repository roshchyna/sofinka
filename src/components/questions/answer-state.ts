import { useState } from "react";
import { rewardCorrectAnswer } from "@/lib/reward-success";

interface AnswerOptionState {
	id: string;
	isCorrect: boolean;
}

export function useSingleAnswer(options: AnswerOptionState[]) {
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const selectedOption = options.find((option) => option.id === selectedId);
	const isCorrect = selectedOption?.isCorrect ?? false;

	function chooseOption(optionId: string) {
		if (isSubmitted) return;
		setSelectedId(optionId);
	}

	function resetAnswer() {
		setSelectedId(null);
		setIsSubmitted(false);
	}

	function submitAnswer() {
		setIsSubmitted(true);
		if (isCorrect) rewardCorrectAnswer();
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

export function useMultipleAnswer(options: AnswerOptionState[]) {
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const correctIds = options
		.filter((option) => option.isCorrect)
		.map((option) => option.id);
	const isCorrect =
		selectedIds.length === correctIds.length &&
		correctIds.every((id) => selectedIds.includes(id));

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
		setIsSubmitted(false);
	}

	function submitAnswer() {
		setIsSubmitted(true);
		if (isCorrect) rewardCorrectAnswer();
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
