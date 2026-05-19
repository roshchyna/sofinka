import { Link, useRouterState } from "@tanstack/react-router";
import { Languages, Menu, Moon, Sun, UserCheck } from "lucide-react";
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
import {
	Dialog,
	DialogSideContent,
	DialogTitle,
	DialogTrigger,
} from "@/ui/dialog";
import { Select } from "@/ui/select";

export default function ApplicationShell({ children }: PropsWithChildren) {
	const { i18n, t } = useTranslation();
	const [childAge, setChildAge] = useState(7);
	const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);
	const [isDark, setIsDark] = useState(true);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

	function closeMobileMenu() {
		setIsMobileMenuOpen(false);
	}

	function renderNavigationControls(idPrefix: "desktop" | "mobile") {
		const isMobile = idPrefix === "mobile";
		const linkClassName = isMobile ? "h-10 justify-start" : "px-3";
		const fieldClassName = isMobile
			? "flex items-center justify-between gap-3 rounded-md border border-zinc-200 bg-white px-3 py-2 text-zinc-600 text-xs dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
			: "flex items-center gap-2 text-zinc-600 text-xs dark:text-zinc-400";
		const childAgeId = `${idPrefix}-child-age`;
		const languageId = `${idPrefix}-app-language`;

		return (
			<>
				<Button
					asChild
					className={linkClassName}
					size="sm"
					variant={isMobile ? "outline" : "default"}
				>
					<Link onClick={isMobile ? closeMobileMenu : undefined} to="/">
						{t("nav.quiz")}
					</Link>
				</Button>
				<Button
					asChild
					className={linkClassName}
					size="sm"
					variant={isMobile ? "outline" : "default"}
				>
					<Link
						onClick={isMobile ? closeMobileMenu : undefined}
						to="/constructor"
					>
						{t("nav.constructor")}
					</Link>
				</Button>
				{isMobile && (
					<div className="mt-4 w-full border-zinc-200 border-t pt-6 dark:border-zinc-800/70">
						<div className="font-semibold text-lg text-zinc-950 dark:text-zinc-50">
							{t("nav.preferences")}
						</div>
					</div>
				)}
				<label className={fieldClassName} htmlFor={childAgeId}>
					<UserCheck className="size-4" aria-hidden="true" />
					<span>{t("nav.age")}</span>
					<Select
						aria-label={t("nav.childAge")}
						className={
							isMobile ? "h-9 w-32 px-2 text-xs" : "h-8 w-24 px-2 text-xs"
						}
						id={childAgeId}
						onValueChange={(value) => changeChildAge(Number(value))}
						options={childAgeOptions.map((age) => ({
							label: t("nav.ageOption", { age }),
							value: String(age),
						}))}
						value={String(childAge)}
					/>
				</label>
				<label className={fieldClassName} htmlFor={languageId}>
					<span className="flex items-center gap-2">
						<Languages className="size-4" aria-hidden="true" />
						<span>{t("nav.language")}</span>
					</span>
					<Select
						aria-label={t("nav.selectLanguage")}
						className={
							isMobile ? "h-9 w-40 px-2 text-xs" : "h-8 w-32 px-2 text-xs"
						}
						id={languageId}
						onValueChange={(value) => changeLanguage(toLanguage(value))}
						options={languageOptions.map((option) => ({
							label: option.label,
							value: option.value,
						}))}
						value={language}
					/>
				</label>
				<Button
					aria-label={
						isDark ? t("nav.enableLightTheme") : t("nav.enableDarkTheme")
					}
					className={isMobile ? "h-10 justify-start" : undefined}
					onClick={toggleTheme}
					size="sm"
					variant="outline"
				>
					{isDark ? <Sun /> : <Moon />}
					{isMobile && (
						<span>
							{isDark ? t("nav.enableLightTheme") : t("nav.enableDarkTheme")}
						</span>
					)}
				</Button>
			</>
		);
	}

	return (
		<div className="flex min-h-screen flex-col bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-300">
			<header className="shrink-0 border-zinc-200 border-b bg-pink-50 dark:border-zinc-800 dark:bg-zinc-900">
				<div className="mx-auto flex min-h-14 max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-2">
					<Link to="/" className="font-semibold text-lg dark:text-zinc-300">
						Sofinka
					</Link>

					<nav className="hidden flex-wrap items-center justify-end gap-2 text-sm md:flex">
						{renderNavigationControls("desktop")}
					</nav>

					<Dialog open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
						<DialogTrigger asChild>
							<Button
								aria-label={t("nav.openMenu")}
								className="md:hidden"
								size="sm"
								variant="outline"
							>
								<Menu />
							</Button>
						</DialogTrigger>
						<DialogSideContent className="">
							<DialogTitle className="pr-8">{t("nav.menu")}</DialogTitle>
							<nav className="grid justify-items-end gap-3 text-sm">
								{renderNavigationControls("mobile")}
							</nav>
						</DialogSideContent>
					</Dialog>
				</div>

				{isTransitioning && (
					<div className="h-0.5 bg-zinc-950 dark:bg-zinc-50" />
				)}
			</header>

			<main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-8">
				{children}
			</main>
		</div>
	);
}
