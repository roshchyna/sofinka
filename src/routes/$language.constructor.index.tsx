import { createFileRoute } from "@tanstack/react-router";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import backgroundConstructorImage from "@/assets/background-constructor.jpg";
import { ChoiceOptionsEditor } from "@/components/constructor/choice-options-editor";
import { FieldLabel } from "@/components/constructor/field-label";
import { GenerateQuestionsDialog } from "@/components/constructor/generate-questions-dialog";
import { ImageChoiceEditor } from "@/components/constructor/image-choice-editor";
import { MatchingEditor } from "@/components/constructor/matching-editor";
import { OddOneOutEditor } from "@/components/constructor/odd-one-out-editor";
import { OrderingEditor } from "@/components/constructor/ordering-editor";
import {
	createEmptyDraft,
	fieldGroupClassName,
	getQuestionTypeLabel,
	type QuestionDraft,
	type QuestionType,
	questionTypeOptions,
	toDraft,
	toQuestion,
} from "@/components/constructor/question-draft";
import { SortingEditor } from "@/components/constructor/sorting-editor";
import { TextInputEditor } from "@/components/constructor/text-input-editor";
import { TrueFalseEditor } from "@/components/constructor/true-false-editor";
import type { Question } from "@/components/questions/question-types";
import { getDefaultQuestions } from "@/data/default-questions";
import { toLanguage } from "@/i18n/languages";
import {
	getQuestions,
	resetQuestions,
	saveQuestions,
} from "@/lib/questions-storage";
import { Button } from "@/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/ui/card";
import { Input } from "@/ui/input";
import { Select } from "@/ui/select";
import { Textarea } from "@/ui/textarea";

export const Route = createFileRoute("/$language/constructor/")({
	component: ConstructorPage,
});

interface QuestionDraftFieldsProps {
	draft: QuestionDraft;
	idPrefix: string;
	setDraft: Dispatch<SetStateAction<QuestionDraft>>;
}

function QuestionDraftFields({
	draft,
	idPrefix,
	setDraft,
}: QuestionDraftFieldsProps) {
	const { t } = useTranslation();

	return (
		<div className="grid gap-4">
			<div className={fieldGroupClassName}>
				<FieldLabel htmlFor={`${idPrefix}-type`}>
					{t("constructor.typeLabel")}
				</FieldLabel>
				<Select
					id={`${idPrefix}-type`}
					onValueChange={(value) => {
						const type = value as QuestionType;
						setDraft((current) => {
							const nextDraft = createEmptyDraft(type);

							return {
								...nextDraft,
								id: current.id,
								title: current.title,
								description: current.description,
							};
						});
					}}
					options={questionTypeOptions.map((option) => ({
						label: t(option.labelKey),
						value: option.value,
					}))}
					value={draft.type}
				/>
			</div>

			<div className={fieldGroupClassName}>
				<FieldLabel htmlFor={`${idPrefix}-title`}>
					{t("constructor.questionLabel")}
				</FieldLabel>
				<Input
					id={`${idPrefix}-title`}
					onChange={(event) =>
						setDraft((current) => ({
							...current,
							title: event.target.value,
						}))
					}
					value={draft.title}
				/>
			</div>

			<div className={fieldGroupClassName}>
				<FieldLabel htmlFor={`${idPrefix}-description`}>
					{t("constructor.descriptionLabel")}
				</FieldLabel>
				<Textarea
					className="min-h-20"
					id={`${idPrefix}-description`}
					onChange={(event) =>
						setDraft((current) => ({
							...current,
							description: event.target.value,
						}))
					}
					value={draft.description}
				/>
			</div>

			<QuestionTypeFields
				draft={draft}
				idPrefix={idPrefix}
				setDraft={setDraft}
			/>
		</div>
	);
}

function QuestionTypeFields({
	draft,
	idPrefix,
	setDraft,
}: QuestionDraftFieldsProps) {
	switch (draft.type) {
		case "single-choice":
			return (
				<ChoiceOptionsEditor
					draft={draft}
					idPrefix={idPrefix}
					multiple={false}
					setDraft={setDraft}
				/>
			);
		case "multiple-choice":
			return (
				<ChoiceOptionsEditor
					draft={draft}
					idPrefix={idPrefix}
					multiple
					setDraft={setDraft}
				/>
			);
		case "true-false":
			return (
				<TrueFalseEditor
					draft={draft}
					idPrefix={idPrefix}
					setDraft={setDraft}
				/>
			);
		case "matching":
			return <MatchingEditor draft={draft} setDraft={setDraft} />;
		case "ordering":
			return <OrderingEditor draft={draft} setDraft={setDraft} />;
		case "sorting":
			return <SortingEditor draft={draft} setDraft={setDraft} />;
		case "text-input":
			return (
				<TextInputEditor
					draft={draft}
					idPrefix={idPrefix}
					setDraft={setDraft}
				/>
			);
		case "image-choice":
			return (
				<ImageChoiceEditor
					draft={draft}
					idPrefix={idPrefix}
					setDraft={setDraft}
				/>
			);
		case "odd-one-out":
			return (
				<OddOneOutEditor
					draft={draft}
					idPrefix={idPrefix}
					setDraft={setDraft}
				/>
			);
	}
}

function ConstructorPage() {
	const { i18n, t } = useTranslation();
	const language = toLanguage(i18n.resolvedLanguage ?? i18n.language);
	const [questions, setQuestions] = useState<Question[]>(() =>
		getDefaultQuestions(language),
	);
	const [draft, setDraft] = useState<QuestionDraft>(() => createEmptyDraft());
	const [editingQuestionId, setEditingQuestionId] = useState<number | null>(
		null,
	);
	const [editDraft, setEditDraft] = useState<QuestionDraft>(() =>
		createEmptyDraft(),
	);
	const [message, setMessage] = useState("");

	useEffect(() => {
		setQuestions(getQuestions(language));
	}, [language]);

	function saveDraft() {
		const id = Math.max(0, ...questions.map((item) => item.id)) + 1;
		const question = toQuestion(draft, id);

		if (!question) {
			setMessage(t("constructor.addTitleMessage"));
			return;
		}

		const nextQuestions = [...questions, question];
		setQuestions(nextQuestions);
		saveQuestions(nextQuestions, language);
		setDraft(createEmptyDraft(draft.type));
		setMessage(t("constructor.questionAdded"));
		toast.success(t("constructor.questionCreatedToast"));
	}

	function editQuestion(question: Question) {
		setEditingQuestionId(question.id);
		setEditDraft(toDraft(question));
		setMessage(t("constructor.questionEditing"));
	}

	function cancelEdit() {
		setEditingQuestionId(null);
		setEditDraft(createEmptyDraft());
		setMessage("");
	}

	function saveEditedQuestion() {
		if (editingQuestionId === null) return;

		const question = toQuestion(editDraft, editingQuestionId);

		if (!question) {
			setMessage(t("constructor.addTitleMessage"));
			return;
		}

		const nextQuestions = questions.map((item) =>
			item.id === editingQuestionId ? question : item,
		);

		setQuestions(nextQuestions);
		saveQuestions(nextQuestions, language);
		cancelEdit();
		setMessage(t("constructor.questionUpdated"));
		toast.success(t("constructor.questionUpdatedToast"));
	}

	function deleteQuestion(questionId: number) {
		const nextQuestions = questions.filter(
			(question) => question.id !== questionId,
		);
		setQuestions(nextQuestions);
		saveQuestions(nextQuestions, language);
		if (editingQuestionId === questionId) {
			cancelEdit();
		}
		setMessage(t("constructor.questionDeleted"));
		toast.success(t("constructor.questionDeletedToast"));
	}

	function restoreDefaults() {
		const defaultQuestions = getDefaultQuestions(language);

		resetQuestions(language);
		setQuestions(defaultQuestions);
		setDraft(createEmptyDraft());
		cancelEdit();
		setMessage(t("constructor.defaultsRestored"));
	}

	function addGeneratedQuestions(generatedQuestions: Question[]) {
		const firstId = Math.max(0, ...questions.map((item) => item.id)) + 1;
		const nextQuestions = [
			...questions,
			...generatedQuestions.map((question, index) => ({
				...question,
				id: firstId + index,
			})),
		];

		setQuestions(nextQuestions);
		saveQuestions(nextQuestions, language);
		setMessage(t("constructor.aiQuestionsAdded"));
	}

	return (
		<section
			className="relative left-1/2 -my-8 min-h-[calc(100vh-3.5rem)] w-screen -translate-x-1/2 bg-cover bg-center bg-no-repeat px-6 py-8"
			style={{ backgroundImage: `url(${backgroundConstructorImage})` }}
		>
			<div className="absolute inset-0 bg-white/70 dark:bg-zinc-950/75" />

			<div className="relative mx-auto grid w-full max-w-6xl gap-6">
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between gap-3">
							<CardTitle>{t("constructor.title")}</CardTitle>
							<GenerateQuestionsDialog onGenerated={addGeneratedQuestions} />
						</div>

						<CardDescription>{t("constructor.description")}</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-4">
						<QuestionDraftFields
							draft={draft}
							idPrefix="new-question"
							setDraft={setDraft}
						/>
					</CardContent>
					<CardFooter className="flex-wrap justify-between">
						<p className="text-sm text-zinc-500 dark:text-zinc-400">
							{message}
						</p>
						<div className="flex gap-2">
							<Button
								onClick={() => setDraft(createEmptyDraft(draft.type))}
								variant="surface"
							>
								{t("common.clear")}
							</Button>
							<Button onClick={saveDraft}>{t("common.save")}</Button>
						</div>
					</CardFooter>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>{t("constructor.savedTitle")}</CardTitle>
						<CardDescription>
							{t("constructor.savedDescription", { count: questions.length })}
						</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-3">
						{questions.map((question, index) => {
							const isEditing = editingQuestionId === question.id;

							return (
								<div
									className="rounded-md border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900"
									key={question.id}
								>
									<div className="flex items-center justify-between gap-3">
										<div>
											<p className="font-medium">
												{index + 1}. {question.title}
											</p>
											<p className="text-sm text-zinc-500 dark:text-zinc-400">
												{getQuestionTypeLabel(question.type, t)}
											</p>
										</div>
										<div className="flex gap-2">
											<Button
												onClick={() => editQuestion(question)}
												size="sm"
												variant="surface"
											>
												{t("common.edit")}
											</Button>
											<Button
												onClick={() => deleteQuestion(question.id)}
												size="sm"
												variant="outline"
											>
												{t("common.delete")}
											</Button>
										</div>
									</div>

									{isEditing && (
										<div className="mt-4 grid gap-4 border-zinc-200 border-t pt-4 dark:border-zinc-800">
											<QuestionDraftFields
												draft={editDraft}
												idPrefix={`edit-question-${question.id}`}
												setDraft={setEditDraft}
											/>
											<div className="flex justify-end gap-2">
												<Button onClick={cancelEdit} variant="surface">
													{t("common.cancel")}
												</Button>
												<Button onClick={saveEditedQuestion}>
													{t("common.saveChanges")}
												</Button>
											</div>
										</div>
									)}
								</div>
							);
						})}
					</CardContent>
					<CardFooter>
						<Button onClick={restoreDefaults} variant="outline">
							{t("constructor.restoreDefaults")}
						</Button>
					</CardFooter>
				</Card>
			</div>
		</section>
	);
}
