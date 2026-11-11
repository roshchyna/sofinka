import { Link } from "@tanstack/react-router";
import {
	ArrowLeft,
	ArrowRight,
	Brain,
	Calculator,
	Clock,
	ListChecks,
	Shapes,
	Sparkles,
	UserRound,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import type { DemoLesson } from "@/data/demo-lesson";
import { Button } from "@/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
} from "@/ui/card";

const activities = [
	{
		icon: Calculator,
		title: "demo.numbersTitle",
		description: "demo.numbersDescription",
	},
	{
		icon: Shapes,
		title: "demo.patternsTitle",
		description: "demo.patternsDescription",
	},
	{
		icon: Brain,
		title: "demo.thinkingTitle",
		description: "demo.thinkingDescription",
	},
] as const;

interface DemoIntroProps {
	lesson: DemoLesson;
	onStart: () => void;
}

export function DemoIntro({ lesson, onStart }: DemoIntroProps) {
	const { t } = useTranslation();
	const lessonDetails = [
		{
			icon: UserRound,
			label: "demo.ageLabel",
			value: t("demo.ageValue", { age: lesson.age }),
		},
		{ icon: Clock, label: "demo.paceLabel", value: t("demo.paceValue") },
		{
			icon: ListChecks,
			label: "demo.questionsLabel",
			value: lesson.questions.length,
		},
	] as const;

	return (
		<section
			aria-labelledby="demo-title"
			className="mx-auto grid w-full max-w-4xl gap-8 py-4 sm:py-8"
		>
			<Card className="overflow-hidden border-pink-200 bg-gradient-to-br from-pink-50 via-white to-indigo-50 dark:border-pink-900/60 dark:from-pink-950/40 dark:via-zinc-900 dark:to-indigo-950/40">
				<CardHeader className="gap-4 p-6 sm:p-8">
					<p className="inline-flex items-center gap-2 font-medium text-pink-700 text-sm dark:text-pink-300">
						<Sparkles aria-hidden="true" className="size-4" />
						{t("demo.eyebrow")}
					</p>
					<h1
						className="font-semibold text-3xl tracking-tight sm:text-4xl"
						id="demo-title"
					>
						{t("demo.title")}
					</h1>
					<CardDescription className="max-w-2xl text-base leading-relaxed">
						{t("demo.description")}
					</CardDescription>
				</CardHeader>

				<CardContent className="px-6 sm:px-8">
					<dl className="grid grid-cols-3 gap-3 rounded-xl border border-pink-100 bg-white/80 p-4 dark:border-zinc-800 dark:bg-zinc-950/40 sm:gap-6 sm:p-5">
						{lessonDetails.map(({ icon: Icon, label, value }) => (
							<div className="grid content-start gap-2" key={label}>
								<dt className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 sm:text-sm">
									<Icon aria-hidden="true" className="size-4 shrink-0" />
									{t(label)}
								</dt>
								<dd className="font-semibold text-sm sm:text-base">{value}</dd>
							</div>
						))}
					</dl>
				</CardContent>

				<CardFooter className="flex-col items-start gap-4 px-6 pb-6 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:pb-8">
					<Button className="w-full sm:w-auto" onClick={onStart} size="xl">
						{t("demo.start")}
						<ArrowRight aria-hidden="true" />
					</Button>
					<Button asChild className="w-full sm:w-auto" variant="outline">
						<Link params={{ language: lesson.language }} to="/$language">
							<ArrowLeft aria-hidden="true" />
							{t("demo.backToQuiz")}
						</Link>
					</Button>
				</CardFooter>
			</Card>

			<div className="grid gap-4">
				<h2 className="font-semibold text-xl">{t("demo.activitiesTitle")}</h2>
				<div className="grid gap-4 sm:grid-cols-3">
					{activities.map(({ icon: Icon, title, description }) => (
						<Card key={title}>
							<CardHeader className="gap-3">
								<Icon
									aria-hidden="true"
									className="size-6 text-pink-600 dark:text-pink-300"
								/>
								<h3 className="font-semibold text-lg leading-snug">
									{t(title)}
								</h3>
							</CardHeader>
							<CardContent>
								<CardDescription className="leading-relaxed">
									{t(description)}
								</CardDescription>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}
