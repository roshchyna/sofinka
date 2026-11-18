import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, CheckCircle2, Clock3 } from "lucide-react";
import { LearningStorageNotice } from "@/components/learning/learning-status";
import { learningCopy } from "@/data/courses/learning-copy";
import { getMathCourse } from "@/data/courses/math-to-100";
import type { Language } from "@/i18n/languages";
import { recommendLearningSession } from "@/lib/learning/recommendations";
import { sessionKey } from "@/lib/learning/session";
import { useLearningProgress } from "@/lib/learning/use-learning-session";
import { Button } from "@/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/ui/card";

export function CourseOverview({ language }: { language: Language }) {
	const course = getMathCourse(language);
	const copy = learningCopy[language];
	const { progress, storageStatus } = useLearningProgress();
	const recommendation = progress
		? recommendLearningSession(course, progress, Date.now())
		: null;
	const completed = course.publishedLessons.filter(
		(lesson) =>
			progress?.sessions[sessionKey(lesson.id, "lesson")]?.status ===
			"completed",
	).length;
	const reviewDue = course.publishedLessons.some(
		(lesson) =>
			(progress?.reviews[lesson.skillId]?.dueAt ?? Infinity) <= Date.now(),
	);
	return (
		<section
			className="mx-auto grid w-full max-w-4xl gap-6"
			aria-labelledby="learning-title"
		>
			<Card className="border-pink-200 bg-gradient-to-br from-pink-50 via-white to-indigo-50 dark:border-pink-900/60 dark:from-pink-950/40 dark:via-zinc-900 dark:to-indigo-950/40">
				<CardHeader className="gap-4">
					<p className="flex items-center gap-2 font-medium text-pink-700 text-sm dark:text-pink-300">
						<BookOpen aria-hidden="true" className="size-4" />
						{copy.eyebrow}
					</p>
					<h1
						id="learning-title"
						className="font-semibold text-3xl tracking-tight sm:text-4xl"
					>
						{course.title}
					</h1>
					<CardDescription className="text-base">
						{course.description}
					</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-4">
					{progress ? (
						<>
							<p className="text-sm">
								{copy.courseProgress}:{" "}
								<strong>
									{completed} / {course.lessons.length}
								</strong>
							</p>
							<progress
								aria-label={copy.courseProgress}
								className="h-2 w-full accent-pink-600"
								value={completed}
								max={course.lessons.length}
							/>
							{reviewDue && (
								<p className="font-medium text-pink-800 dark:text-pink-200">
									{copy.reviewDue}
								</p>
							)}
							{recommendation && (
								<Button asChild className="w-full sm:w-fit" size="xl">
									<Link
										to="/$language/learn/$courseId/$lessonId"
										params={{
											language,
											courseId: course.id,
											lessonId: recommendation.lessonId,
										}}
										search={{
											mode:
												recommendation.mode === "review" ? "review" : undefined,
										}}
									>
										{recommendation.resume
											? copy.resume
											: recommendation.mode === "review"
												? copy.review
												: copy.start}
										<ArrowRight aria-hidden="true" />
									</Link>
								</Button>
							)}
						</>
					) : (
						<output>{copy.loading}</output>
					)}
				</CardContent>
			</Card>
			<p className="text-sm text-zinc-600 dark:text-zinc-400">
				{copy.firstRelease}
			</p>
			<ol className="grid gap-3">
				{course.lessons.map((outline, index) => {
					const available = course.publishedLessons.some(
						(lesson) => lesson.id === outline.id,
					);
					const session = progress?.sessions[sessionKey(outline.id, "lesson")];
					const status = !available
						? copy.comingSoon
						: session?.status === "completed"
							? copy.completed
							: session
								? copy.inProgress
								: copy.notStarted;
					return (
						<li key={outline.id}>
							<Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
								<span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-pink-100 font-semibold text-pink-900 dark:bg-pink-950 dark:text-pink-200">
									{session?.status === "completed" ? (
										<CheckCircle2 aria-hidden="true" className="size-5" />
									) : (
										index + 1
									)}
								</span>
								<div className="min-w-0 flex-1">
									<h2 className="font-semibold text-lg">{outline.title}</h2>
									<p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
										{outline.goal}
									</p>
									<p className="mt-2 flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
										{!available && (
											<Clock3 aria-hidden="true" className="size-3" />
										)}
										{status}
									</p>
								</div>
								{available && progress && (
									<Button
										asChild
										variant="outline"
										className="w-full sm:w-auto"
									>
										<Link
											to="/$language/learn/$courseId/$lessonId"
											params={{
												language,
												courseId: course.id,
												lessonId: outline.id,
											}}
											search={{
												mode:
													session?.status === "completed"
														? "review"
														: undefined,
											}}
										>
											{session?.status === "completed"
												? copy.review
												: session
													? copy.resume
													: copy.start}
											<ArrowRight aria-hidden="true" />
										</Link>
									</Button>
								)}
							</Card>
						</li>
					);
				})}
			</ol>
			<LearningStorageNotice language={language} status={storageStatus} />
			{storageStatus === "saved" && (
				<p className="text-xs text-zinc-500 dark:text-zinc-400">
					{copy.localNote}
				</p>
			)}
		</section>
	);
}
