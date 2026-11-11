import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, RotateCcw, Trophy } from "lucide-react";
import { useEffect, useReducer, useRef } from "react";
import { useTranslation } from "react-i18next";

import { DemoIntro } from "@/components/demo/demo-intro";
import {
	type DemoSessionAction,
	type DemoSessionState,
	initialDemoSession,
	transitionDemoSession,
} from "@/components/demo/demo-session";
import { QuestionRenderer } from "@/components/questions/question-renderer";
import { type DemoLesson, getDemoLesson } from "@/data/demo-lesson";
import type { Language } from "@/i18n/languages";
import { Button } from "@/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
} from "@/ui/card";

export function DemoLessonPlayer({ language }: { language: Language }) {
	const lesson = getDemoLesson(language);

	return (
		<LessonSession
			key={`${lesson.id}:${lesson.version}:${language}`}
			lesson={lesson}
		/>
	);
}

function LessonSession({ lesson }: { lesson: DemoLesson }) {
	const { t } = useTranslation();
	const [session, dispatch] = useReducer(
		(state: DemoSessionState, action: DemoSessionAction) =>
			transitionDemoSession(state, action, lesson.questions),
		initialDemoSession,
	);
	const headingRef = useRef<HTMLHeadingElement>(null);
	const explanationRef = useRef<HTMLHeadingElement>(null);
	const question =
		session.status === "active"
			? lesson.questions[session.questionIndex]
			: undefined;
	const hasAnswer =
		session.status === "active" &&
		session.answers.some((answer) => answer.questionId === question?.id);

	useEffect(() => {
		if (session.status === "intro") return;
		const target = hasAnswer ? explanationRef.current : headingRef.current;
		target?.focus();
	}, [session.status, hasAnswer]);

	function startLesson() {
		dispatch({ type: "start" });
	}

	if (session.status === "intro") {
		return <DemoIntro lesson={lesson} onStart={startLesson} />;
	}

	if (session.status === "completed") {
		const correct = session.answers.filter((answer) => answer.isCorrect).length;

		return (
			<section
				aria-labelledby="demo-complete-title"
				className="mx-auto w-full max-w-2xl py-4 sm:py-8"
			>
				<Card>
					<CardHeader className="gap-4">
						<Trophy
							aria-hidden="true"
							className="size-10 text-pink-600 dark:text-pink-300"
						/>
						<h1
							className="font-semibold text-3xl"
							id="demo-complete-title"
							ref={headingRef}
							tabIndex={-1}
						>
							{t("demo.completedTitle")}
						</h1>
						<CardDescription className="text-base leading-relaxed">
							{t("demo.completedDescription")}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<dl className="grid gap-2 rounded-xl bg-pink-50 p-5 dark:bg-pink-950/30">
							<dt className="text-sm text-zinc-600 dark:text-zinc-400">
								{t("demo.scoreLabel")}
							</dt>
							<dd className="font-semibold text-4xl">
								{t("demo.scoreValue", {
									correct,
									total: lesson.questions.length,
								})}
							</dd>
						</dl>
					</CardContent>
					<CardFooter className="flex-col items-stretch sm:flex-row sm:justify-between">
						<Button onClick={startLesson}>
							<RotateCcw aria-hidden="true" />
							{t("demo.playAgain")}
						</Button>
						<Button asChild variant="outline">
							<Link params={{ language: lesson.language }} to="/$language">
								<ArrowLeft aria-hidden="true" />
								{t("demo.backToQuiz")}
							</Link>
						</Button>
					</CardFooter>
				</Card>
			</section>
		);
	}

	if (!question) return null;
	const isLastQuestion = session.questionIndex === lesson.questions.length - 1;

	return (
		<section
			aria-labelledby="demo-question-progress"
			className="mx-auto grid w-full max-w-2xl gap-6 py-4 sm:py-8"
		>
			<header className="grid gap-3">
				<p className="text-pink-700 text-sm dark:text-pink-300">
					{t("demo.title")}
				</p>
				<h1
					className="font-semibold text-2xl"
					id="demo-question-progress"
					ref={headingRef}
					tabIndex={-1}
				>
					{t("demo.questionProgress", {
						current: session.questionIndex + 1,
						total: lesson.questions.length,
					})}
				</h1>
				<progress
					aria-label={t("demo.lessonProgress")}
					aria-valuetext={t("demo.progressValue", {
						answered: session.answers.length,
						total: lesson.questions.length,
					})}
					className="h-2 w-full accent-pink-500"
					max={lesson.questions.length}
					value={session.answers.length}
				/>
			</header>

			<QuestionRenderer
				allowRetry={false}
				key={question.id}
				onAnswer={(result) => dispatch({ type: "answer", result })}
				question={question}
			/>

			{hasAnswer && (
				<>
					<Card aria-labelledby="demo-explanation-title" role="region">
						<CardHeader>
							<h2
								className="font-semibold text-lg"
								id="demo-explanation-title"
								ref={explanationRef}
								tabIndex={-1}
							>
								{t("demo.explanationTitle")}
							</h2>
						</CardHeader>
						<CardContent>
							<p className="text-zinc-700 leading-relaxed dark:text-zinc-300">
								{question.explanation}
							</p>
						</CardContent>
					</Card>
					<Button
						className="w-full sm:justify-self-end sm:w-auto"
						onClick={() => dispatch({ type: "next" })}
						size="xl"
					>
						{t(isLastQuestion ? "demo.finish" : "demo.nextQuestion")}
						<ArrowRight aria-hidden="true" />
					</Button>
				</>
			)}
		</section>
	);
}
