import { Link, useRouterState } from "@tanstack/react-router";
import { Languages, Moon, Sun } from "lucide-react";
import { type PropsWithChildren, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	DEFAULT_LANGUAGE,
	type Language,
	languageOptions,
	toLanguage,
} from "@/i18n/languages";
import {
	CHILD_AGE_CHANGED_EVENT,
	childAgeOptions,
	getChildAge,
	saveChildAge,
} from "@/lib/child-age-storage";
import {
	getLanguage,
	LANGUAGE_CHANGED_EVENT,
	saveLanguage,
} from "@/lib/language-storage";
import { isThemeDark, setTheme, updateTheme } from "@/lib/theme";
import { Button } from "@/ui/button";
import { Select } from "@/ui/select";

export default function ApplicationShell({ children }: PropsWithChildren) {
	const { i18n, t } = useTranslation();
	const [childAge, setChildAge] = useState(7);
	const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);
	const [isDark, setIsDark] = useState(true);
	const isTransitioning = useRouterState({
		select: (state) => state.isTransitioning,
	});

	useEffect(() => {
		const syncChildAge = () => setChildAge(getChildAge());

		syncChildAge();
		window.addEventListener(CHILD_AGE_CHANGED_EVENT, syncChildAge);
		window.addEventListener("storage", syncChildAge);

		return () => {
			window.removeEventListener(CHILD_AGE_CHANGED_EVENT, syncChildAge);
			window.removeEventListener("storage", syncChildAge);
		};
	}, []);

	useEffect(() => {
		const syncLanguage = () => {
			const nextLanguage = getLanguage();

			setLanguageState(nextLanguage);
			document.documentElement.lang = nextLanguage;
			void i18n.changeLanguage(nextLanguage);
		};

		syncLanguage();
		window.addEventListener(LANGUAGE_CHANGED_EVENT, syncLanguage);
		window.addEventListener("storage", syncLanguage);

		return () => {
			window.removeEventListener(LANGUAGE_CHANGED_EVENT, syncLanguage);
			window.removeEventListener("storage", syncLanguage);
		};
	}, [i18n]);

	useEffect(() => {
		const syncTheme = () => {
			const nextTheme = updateTheme();
			setIsDark(isThemeDark(nextTheme));
		};
		const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

		syncTheme();
		window.addEventListener("storage", syncTheme);
		systemTheme.addEventListener("change", syncTheme);

		return () => {
			window.removeEventListener("storage", syncTheme);
			systemTheme.removeEventListener("change", syncTheme);
		};
	}, []);

	function toggleTheme() {
		const nextTheme = isDark ? "light" : "dark";

		setTheme(nextTheme);
		setIsDark(isThemeDark(nextTheme));
	}

	function changeChildAge(age: number) {
		setChildAge(age);
		saveChildAge(age);
	}

	function changeLanguage(language: Language) {
		setLanguageState(language);
		saveLanguage(language);
		document.documentElement.lang = language;
		void i18n.changeLanguage(language);
	}

	return (
		<div className="flex min-h-screen flex-col bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-300">
			<header className="shrink-0 border-zinc-200 border-b bg-pink-50 dark:border-zinc-800 dark:bg-zinc-900">
				<div className="mx-auto flex min-h-14 max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-2">
					<Link to="/" className="font-semibold text-lg dark:text-zinc-300">
						Sofinka
					</Link>

					<nav className="flex flex-wrap items-center justify-end gap-2 text-sm">
						<Button asChild size="sm" className="px-3">
							<Link to="/">{t("nav.quiz")}</Link>
						</Button>
						<Button asChild size="sm" className="px-3">
							<Link to="/constructor">{t("nav.constructor")}</Link>
						</Button>
						<label
							className="flex items-center gap-2 text-zinc-600 text-xs dark:text-zinc-400"
							htmlFor="child-age"
						>
							<span>{t("nav.age")}</span>
							<Select
								aria-label={t("nav.childAge")}
								className="h-8 w-24 px-2 text-xs"
								id="child-age"
								onChange={(event) => changeChildAge(Number(event.target.value))}
								value={childAge}
							>
								{childAgeOptions.map((age) => (
									<option key={age} value={age}>
										{t("nav.ageOption", { age })}
									</option>
								))}
							</Select>
						</label>
						<label
							className="flex items-center gap-2 text-zinc-600 text-xs dark:text-zinc-400"
							htmlFor="app-language"
						>
							<Languages className="size-4" aria-hidden="true" />
							<span>{t("nav.language")}</span>
							<Select
								aria-label={t("nav.selectLanguage")}
								className="h-8 w-32 px-2 text-xs"
								id="app-language"
								onChange={(event) =>
									changeLanguage(toLanguage(event.target.value))
								}
								value={language}
							>
								{languageOptions.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</Select>
						</label>
						<Button
							aria-label={
								isDark ? t("nav.enableLightTheme") : t("nav.enableDarkTheme")
							}
							size="sm"
							variant="outline"
							onClick={toggleTheme}
						>
							{isDark ? <Sun /> : <Moon />}
						</Button>
					</nav>
				</div>

				{isTransitioning && (
					<div className="h-0.5 bg-zinc-950 dark:bg-zinc-50" />
				)}
			</header>

			<main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-8">
				{children}
			</main>
		</div>
	);
}
