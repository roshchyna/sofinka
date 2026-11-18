import { learningCopy } from "@/data/courses/learning-copy";
import type { Language } from "@/i18n/languages";
import type { LearningLesson } from "@/lib/learning/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";

export function WorkedExample({
	lesson,
	language,
}: {
	lesson: LearningLesson;
	language: Language;
}) {
	const copy = learningCopy[language];
	const { tens, ones, explanation } = lesson.example;
	return (
		<Card className="overflow-hidden border-pink-200 dark:border-pink-900/60">
			<CardHeader>
				<CardTitle>{copy.example}</CardTitle>
			</CardHeader>
			<CardContent className="grid gap-6">
				<div
					role="img"
					aria-label={copy.exampleDiagram}
					className="flex flex-wrap gap-8 rounded-xl bg-pink-50 p-5 dark:bg-pink-950/30"
				>
					<div className="grid content-start gap-3" aria-hidden="true">
						<p className="font-medium text-sm">{copy.tens}</p>
						{Array.from({ length: tens }, (_, n) => n + 1).map((ten) => (
							<div
								key={ten}
								className="grid grid-cols-10 overflow-hidden rounded border border-pink-800"
							>
								{Array.from({ length: 10 }, (_, n) => n + 1).map((unit) => (
									<span
										key={unit}
										className="h-5 w-3.5 border-pink-800 border-r bg-pink-400 last:border-r-0 dark:bg-pink-700"
									/>
								))}
							</div>
						))}
						<span className="font-semibold">
							{tens} × 10 = {tens * 10}
						</span>
					</div>
					<div className="grid content-start gap-3" aria-hidden="true">
						<p className="font-medium text-sm">{copy.ones}</p>
						<div className="flex flex-wrap gap-2">
							{Array.from({ length: ones }, (_, n) => n + 1).map((unit) => (
								<span
									key={unit}
									className="size-5 rounded-sm border border-indigo-800 bg-indigo-300 dark:bg-indigo-700"
								/>
							))}
						</div>
						<span className="font-semibold">{ones}</span>
					</div>
				</div>
				<p className="text-center font-semibold text-3xl tabular-nums">
					{tens * 10} + {ones} = {tens * 10 + ones}
				</p>
				<p className="leading-relaxed">{explanation}</p>
			</CardContent>
		</Card>
	);
}
