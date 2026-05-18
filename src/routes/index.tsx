import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import backgroundImage from "@/assets/background-home.jpg";
import { HomeMascot } from "@/components/home-mascot";
import { QuestionRenderer } from "@/components/questions/question-renderer";
import type { Question } from "@/components/questions/question-types";
import { getDefaultQuestions } from "@/data/default-questions";
import { toLanguage } from "@/i18n/languages";
import { getQuestions, QUESTIONS_CHANGED_EVENT } from "@/lib/questions-storage";
import { Loader } from "@/ui/loader";

export const Route = createFileRoute("/")({
	component: HomePage,
});

function HomePage() {
	const { i18n, t } = useTranslation();
	const language = toLanguage(i18n.resolvedLanguage ?? i18n.language);
	const [questions, setQuestions] = useState<Question[]>(() =>
		getDefaultQuestions(language),
	);

	useEffect(() => {
		const syncQuestions = () => setQuestions(getQuestions(language));

		syncQuestions();
		window.addEventListener(QUESTIONS_CHANGED_EVENT, syncQuestions);
		window.addEventListener("storage", syncQuestions);

		return () => {
			window.removeEventListener(QUESTIONS_CHANGED_EVENT, syncQuestions);
			window.removeEventListener("storage", syncQuestions);
		};
	}, [language]);

	return (
		<>
			<section
				className="relative left-1/2 -my-8 flex w-screen flex-1 -translate-x-1/2 bg-cover bg-center bg-no-repeat px-6 py-8"
				style={{ backgroundImage: `url(${backgroundImage})` }}
			>
				<div className="absolute inset-0 bg-white/70 dark:bg-zinc-950/75" />

				<div className="relative mx-auto w-full max-w-5xl columns-1 gap-6 md:columns-2">
					{questions.length ? (
						questions.map((question, index) => (
							<div className="mb-6 break-inside-avoid" key={question.id}>
								<QuestionRenderer
									question={{
										...question,
										eyebrow: t("home.questionEyebrow", { number: index + 1 }),
									}}
								/>
							</div>
						))
					) : (
						<div className="absolute inset-0 flex items-center justify-center rounded-lg">
							<Loader />
						</div>
					)}
				</div>
			</section>

			<div className="pointer-events-none fixed inset-x-0 bottom-3 z-20 sm:bottom-6">
				<div className="relative mx-auto w-full max-w-5xl px-6">
					<HomeMascot className="pointer-events-auto xl:hidden fixed bottom-3 left-6 sm:bottom-6 sm:left-6" />

					<div className="absolute bottom-0 right-full pr-3 pointer-events-auto hidden xl:block">
						<HomeMascot />
					</div>
				</div>
			</div>
		</>
	);
}
