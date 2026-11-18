import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Lightbulb } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { LearningStorageNotice } from "@/components/learning/learning-status";
import { LessonSummary } from "@/components/learning/lesson-summary";
import { WorkedExample } from "@/components/learning/worked-example";
import { QuestionRenderer } from "@/components/questions/question-renderer";
import type { QuestionAnswerResult } from "@/components/questions/question-types";
import { learningCopy } from "@/data/courses/learning-copy";
import {
	getLearningExercise,
	getLearningLesson,
	getMathCourse,
} from "@/data/courses/math-to-100";
import type { Language } from "@/i18n/languages";
import { createLearningSession, sessionKey } from "@/lib/learning/session";
import type {
	LearningAttempt,
	LearningExercise,
	LearningLesson,
	SessionMode,
} from "@/lib/learning/types";
import { useLearningProgress } from "@/lib/learning/use-learning-session";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader } from "@/ui/card";

function answerLabel(exercise: LearningExercise, attempt: LearningAttempt) {
	const question = exercise.question;
	const value = attempt.value;
	if (
		question.type === "matching" &&
		typeof value === "object" &&
		!Array.isArray(value)
	) {
		return question.pairs
			.map(
				(pair) =>
					`${pair.left} → ${question.pairs.find((option) => option.id === value[pair.id])?.right ?? "—"}`,
			)
			.join("; ");
	}
	if ("options" in question && question.options) {
		const ids =
			typeof value === "string" ? [value] : Array.isArray(value) ? value : [];
		return ids
			.map(
				(id) =>
					question.options?.find((option) => option.id === id)?.label ?? id,
			)
			.join("; ");
	}
	return typeof value === "string" ? value : "";
}

function ExerciseStep({
	exercise,
	lesson,
	language,
	attempt,
	hinted,
	onHint,
	onAnswer,
}: {
	exercise: LearningExercise;
	lesson: LearningLesson;
	language: Language;
	attempt: LearningAttempt | undefined;
	hinted: boolean;
	onHint: () => void;
	onAnswer: (result: QuestionAnswerResult) => void;
}) {
	const copy = learningCopy[language];
	const [showExample, setShowExample] = useState(false);
	if (attempt)
		return (
			<Card>
				<CardHeader>
					<h2 className="font-semibold text-2xl">
						{attempt.isCorrect ? copy.correct : copy.incorrect}
					</h2>
					<p className="leading-relaxed">{exercise.question.title}</p>
				</CardHeader>
				<CardContent className="grid gap-4">
					<p className="break-words text-sm text-zinc-600 dark:text-zinc-400">
						{copy.yourAnswer}: {answerLabel(exercise, attempt)}
					</p>
					<h3 className="font-semibold">{copy.explanation}</h3>
					<p className="leading-relaxed">{exercise.explanation}</p>
					{attempt.hintUsed && (
						<p className="text-sm text-zinc-500 dark:text-zinc-400">
							{copy.hintTitle}
						</p>
					)}
				</CardContent>
			</Card>
		);
	return (
		<div className="grid gap-4">
			<QuestionRenderer
				question={exercise.question}
				allowRetry={false}
				onAnswer={onAnswer}
			/>
			<div className="grid gap-3">
				<Button
					variant="outline"
					className="h-auto min-h-11 whitespace-normal"
					onClick={onHint}
					aria-expanded={hinted}
					aria-controls="learning-hint"
					disabled={hinted}
				>
					<Lightbulb aria-hidden="true" />
					{copy.hint}
				</Button>
				{hinted && (
					<output
						id="learning-hint"
						className="rounded-lg bg-amber-50 p-4 leading-relaxed text-amber-950 dark:bg-amber-950/40 dark:text-amber-100"
					>
						{exercise.hint}
					</output>
				)}
				<Button
					variant="ghost"
					className="h-auto min-h-11 whitespace-normal"
					aria-expanded={showExample}
					aria-controls="learning-example-help"
					onClick={() => {
						if (!showExample) onHint();
						setShowExample((shown) => !shown);
					}}
				>
					{showExample ? copy.hideExample : copy.viewExample}
				</Button>
				{showExample && (
					<div id="learning-example-help" className="grid gap-3">
						<p className="text-sm text-zinc-500 dark:text-zinc-400">
							{copy.exampleHelp}
						</p>
						<WorkedExample lesson={lesson} language={language} />
					</div>
				)}
			</div>
		</div>
	);
}

export function LearningLessonPlayer({
	language,
	lessonId,
	mode,
}: {
	language: Language;
	lessonId: string;
	mode: SessionMode;
}) {
	const course = getMathCourse(language);
	const lesson = getLearningLesson(course, lessonId);
	const copy = learningCopy[language];
	const navigate = useNavigate();
	const { progress, dispatch, storageStatus } = useLearningProgress();
	const heading = useRef<HTMLDivElement>(null);
	const key = sessionKey(lessonId, mode);
	const session = progress?.sessions[key];
	const attempt = progress?.attempts.find(
		(item) => item.id === `${session?.id}:${session?.currentStepId}`,
	);
	const currentStepId = session?.currentStepId;
	const status = session?.status;
	const attemptId = attempt?.id;
	useEffect(() => {
		if (currentStepId || status === "completed" || attemptId)
			heading.current?.focus();
	}, [currentStepId, status, attemptId]);
	if (!lesson) return <p>{copy.unavailable}</p>;

	function start(nextMode: SessionMode = mode) {
		if (!lesson || !progress) return;
		const nextSession = createLearningSession(
			lesson,
			nextMode,
			crypto.randomUUID(),
			Date.now(),
			progress.reviews[lesson.skillId]?.count ?? 0,
		);
		dispatch({ type: "start", session: nextSession });
		if (nextMode !== mode)
			void navigate({
				to: "/$language/learn/$courseId/$lessonId",
				params: { language, courseId: course.id, lessonId },
				search: { mode: "review" },
				replace: true,
			});
	}

	const stepIndex = session?.stepIds.indexOf(session.currentStepId) ?? 0;
	const exercise = session
		? getLearningExercise(lesson, session.currentStepId)
		: undefined;
	return (
		<section
			className="mx-auto grid w-full max-w-2xl gap-5 pb-6"
			aria-label={lesson.title}
		>
			<Link
				to="/$language/learn/$courseId"
				params={{ language, courseId: course.id }}
				className="flex min-h-11 w-fit items-center gap-2 text-sm text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-300"
			>
				<ArrowLeft aria-hidden="true" className="size-4" />
				{copy.back}
			</Link>
			<div ref={heading} tabIndex={-1} className="outline-none">
				{!progress ? (
					<output>{copy.loading}</output>
				) : !session ? (
					<Card>
						<CardHeader className="gap-4">
							<p className="text-pink-700 text-sm dark:text-pink-300">
								{copy.eyebrow}
							</p>
							<h1 className="font-semibold text-3xl">{lesson.title}</h1>
							<h2 className="font-semibold">{copy.goal}</h2>
							<p className="leading-relaxed">{lesson.goal}</p>
						</CardHeader>
						<CardContent className="grid gap-5">
							<p className="leading-relaxed text-zinc-600 dark:text-zinc-400">
								{mode === "review" ? copy.reviewDetails : copy.lessonDetails}
							</p>
							<Button className="w-full" size="xl" onClick={() => start()}>
								{mode === "review" ? copy.newReview : copy.start}
								<ArrowRight aria-hidden="true" />
							</Button>
						</CardContent>
					</Card>
				) : session.status === "completed" ? (
					<LessonSummary
						language={language}
						session={session}
						attempts={progress.attempts.filter(
							(item) => item.sessionId === session.id,
						)}
						onReview={() => start("review")}
					/>
				) : (
					<div className="grid gap-5">
						<header className="grid gap-3">
							<h1 className="font-semibold text-2xl">{lesson.title}</h1>
							<p className="text-sm text-zinc-500 dark:text-zinc-400">
								{copy.step} {stepIndex + 1} {copy.of} {session.stepIds.length}
								{mode === "review" ? ` · ${copy.review}` : ""}
							</p>
							<progress
								aria-label={lesson.title}
								className="h-2 w-full accent-pink-600"
								max={session.stepIds.length}
								value={stepIndex + (attempt ? 1 : 0)}
							/>
						</header>
						{exercise ? (
							<ExerciseStep
								key={exercise.id}
								exercise={exercise}
								lesson={lesson}
								language={language}
								attempt={attempt}
								hinted={session.hintedExerciseIds.includes(exercise.id)}
								onHint={() => dispatch({ type: "hint", key })}
								onAnswer={(result) =>
									dispatch({ type: "answer", key, result, now: Date.now() })
								}
							/>
						) : (
							<WorkedExample lesson={lesson} language={language} />
						)}
						{(!exercise || attempt) && (
							<Button
								className="w-full"
								size="xl"
								onClick={() => dispatch({ type: "next", key, now: Date.now() })}
							>
								{stepIndex === session.stepIds.length - 1
									? copy.finish
									: copy.next}
								<ArrowRight aria-hidden="true" />
							</Button>
						)}
					</div>
				)}
			</div>
			<LearningStorageNotice language={language} status={storageStatus} />
			{storageStatus === "saved" && (
				<p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
					{copy.paused}
				</p>
			)}
		</section>
	);
}
