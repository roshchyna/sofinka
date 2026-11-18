import { Link } from "@tanstack/react-router";
import { Trophy } from "lucide-react";
import { learningCopy } from "@/data/courses/learning-copy";
import { MATH_COURSE_ID } from "@/data/courses/math-to-100";
import type { Language } from "@/i18n/languages";
import type { LearningAttempt, LearningSession } from "@/lib/learning/types";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader } from "@/ui/card";

export function LessonSummary({
	language,
	session,
	attempts,
	onReview,
}: {
	language: Language;
	session: LearningSession;
	attempts: LearningAttempt[];
	onReview: () => void;
}) {
	const copy = learningCopy[language];
	return (
		<Card>
			<CardHeader className="gap-4">
				<Trophy
					aria-hidden="true"
					className="size-10 text-pink-600 dark:text-pink-300"
				/>
				<h1 tabIndex={-1} className="font-semibold text-3xl">
					{session.mode === "review" ? copy.reviewSummary : copy.summary}
				</h1>
				<p className="leading-relaxed">{copy.summaryText}</p>
			</CardHeader>
			<CardContent className="grid gap-5">
				<dl className="grid gap-4 rounded-xl bg-pink-50 p-5 sm:grid-cols-2 dark:bg-pink-950/30">
					<div>
						<dt className="text-sm">{copy.correctCount}</dt>
						<dd className="mt-1 font-semibold text-3xl">
							{attempts.filter((attempt) => attempt.isCorrect).length} /{" "}
							{attempts.length}
						</dd>
					</div>
					<div>
						<dt className="text-sm">{copy.independentCount}</dt>
						<dd className="mt-1 font-semibold text-3xl">
							{
								attempts.filter(
									(attempt) => attempt.isCorrect && !attempt.hintUsed,
								).length
							}{" "}
							/ {attempts.length}
						</dd>
					</div>
				</dl>
				<p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
					{copy.supportNote}
				</p>
				<div className="flex flex-col gap-3 sm:flex-row">
					<Button asChild>
						<Link
							to="/$language/learn/$courseId"
							params={{ language, courseId: MATH_COURSE_ID }}
						>
							{copy.back}
						</Link>
					</Button>
					<Button variant="outline" onClick={onReview}>
						{session.mode === "review" ? copy.newReview : copy.review}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
