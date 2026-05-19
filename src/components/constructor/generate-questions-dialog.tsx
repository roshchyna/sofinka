import { useMutation } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import {
	fieldGroupClassName,
	type QuestionType,
	questionTypeOptions,
} from "@/components/constructor/question-draft";
import type { Question } from "@/components/questions/question-types";
import {
	getLanguageName,
	type LanguageName,
	toLanguage,
} from "@/i18n/languages";
import { getChildAge } from "@/lib/child-age-storage";
import { Button } from "@/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/ui/dialog";
import { Input } from "@/ui/input";
import { Select } from "@/ui/select";

interface GenerateQuestionsDialogProps {
	onGenerated: (questions: Question[]) => void;
}

interface GenerateQuestionsRequest {
	topic: string;
	age: number;
	count: number;
	language: LanguageName;
	type: QuestionType;
}

interface GenerateQuestionsMutationPayload extends GenerateQuestionsRequest {
	emptyErrorMessage: string;
	errorMessage: string;
}

interface GenerateQuestionsResponse {
	questions?: Question[];
	error?: string;
}

async function generateQuestions(payload: GenerateQuestionsMutationPayload) {
	const { emptyErrorMessage, errorMessage, ...request } = payload;
	const response = await fetch("/api/generate-questions", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(request),
	});
	const data = (await response.json()) as GenerateQuestionsResponse;

	if (!response.ok) {
		throw new Error(data.error ?? errorMessage);
	}

	if (!data.questions?.length) {
		throw new Error(emptyErrorMessage);
	}

	return data.questions;
}

export function GenerateQuestionsDialog({
	onGenerated,
}: GenerateQuestionsDialogProps) {
	const { i18n, t } = useTranslation();
	const language = toLanguage(i18n.resolvedLanguage ?? i18n.language);
	const [open, setOpen] = useState(false);
	const [topic, setTopic] = useState(() => t("generate.defaultTopic"));
	const [age, setAge] = useState(() => getChildAge());
	const [count, setCount] = useState(1);
	const [type, setType] = useState<QuestionType>("single-choice");

	const mutation = useMutation({
		mutationFn: generateQuestions,
		onSuccess: (questions) => {
			onGenerated(questions);
			setOpen(false);
			toast.success(t("generate.success"));
		},
		onError: (error) => {
			toast.error(error instanceof Error ? error.message : t("generate.error"));
		},
	});

	function submitForm(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		mutation.mutate({
			topic: topic.trim(),
			age,
			count,
			language: getLanguageName(language),
			type,
			emptyErrorMessage: t("generate.emptyError"),
			errorMessage: t("generate.error"),
		});
	}

	return (
		<Dialog
			onOpenChange={(nextOpen) => {
				setOpen(nextOpen);
				if (nextOpen) setAge(getChildAge());
			}}
			open={open}
		>
			<DialogTrigger asChild>
				<Button>
					<Sparkles className="size-4" />
					{t("generate.action")}
				</Button>
			</DialogTrigger>
			<DialogContent>
				<form className="grid gap-5" onSubmit={submitForm}>
					<DialogHeader>
						<DialogTitle>{t("generate.title")}</DialogTitle>
						<DialogDescription>{t("generate.description")}</DialogDescription>
					</DialogHeader>

					<div className="grid gap-4">
						<div className={fieldGroupClassName}>
							<label htmlFor="generate-topic" className="font-medium text-sm">
								{t("generate.topic")}
							</label>
							<Input
								id="generate-topic"
								onChange={(event) => setTopic(event.target.value)}
								required
								value={topic}
							/>
						</div>

						<div className="grid gap-4 sm:grid-cols-2">
							<div className={fieldGroupClassName}>
								<label htmlFor="generate-age" className="font-medium text-sm">
									{t("generate.age")}
								</label>
								<Input
									id="generate-age"
									min={3}
									onChange={(event) => setAge(Number(event.target.value))}
									required
									type="number"
									value={age}
								/>
							</div>

							<div className={fieldGroupClassName}>
								<label htmlFor="generate-count" className="font-medium text-sm">
									{t("generate.count")}
								</label>
								<Input
									id="generate-count"
									max={10}
									min={1}
									onChange={(event) => setCount(Number(event.target.value))}
									required
									type="number"
									value={count}
								/>
							</div>
						</div>

						<div className={fieldGroupClassName}>
							<label htmlFor="generate-type" className="font-medium text-sm">
								{t("generate.type")}
							</label>
							<Select
								id="generate-type"
								onValueChange={(value) => setType(value as QuestionType)}
								options={questionTypeOptions.map((option) => ({
									label: t(option.labelKey),
									value: option.value,
								}))}
								value={type}
							/>
						</div>
					</div>

					<DialogFooter>
						<DialogClose asChild>
							<Button disabled={mutation.isPending} variant="surface">
								{t("common.cancel")}
							</Button>
						</DialogClose>
						<Button isLoading={mutation.isPending} type="submit">
							{t("generate.action")}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
