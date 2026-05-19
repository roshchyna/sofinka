import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	createRootRoute,
	HeadContent,
	Link,
	Outlet,
	Scripts,
	useRouterState,
} from "@tanstack/react-router";
import { lazy, type ReactNode, Suspense, useState } from "react";
import { useTranslation } from "react-i18next";

import ApplicationShell from "@/common/application-shell";
import "@/i18n";
import { type Language, toLanguage } from "@/i18n/languages";
import { Loader } from "@/ui/loader";
import { Toaster } from "@/ui/toaster";
import appCss from "../styles.css?url";
import { Button } from "../ui/button";

const NotFoundAnimation = lazy(() => import("@/components/not-found-page"));

const themeScript = `
try {
  const themes = ["light", "dark", "black", "system"];
  const storedTheme = localStorage.getItem("theme");
  const rawTheme = themes.includes(storedTheme) ? storedTheme : "dark";
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  const isDark = rawTheme === "dark" || (rawTheme === "system" && systemTheme === "dark");
  const isBlack = rawTheme === "black";

  localStorage.setItem("theme", rawTheme);
  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.classList.toggle("black", isBlack);
  document.documentElement.style.colorScheme = isDark || isBlack ? "dark" : "light";
} catch {}
`;

export const Route = createRootRoute({
	component: RootRouteComponent,
	notFoundComponent: NotFoundPage,
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Sofinka",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	shellComponent: RootDocument,
});

function RootRouteComponent() {
	const [queryClient] = useState(() => new QueryClient());

	return (
		<QueryClientProvider client={queryClient}>
			<Outlet />
		</QueryClientProvider>
	);
}

function NotFoundPage() {
	const language = useRouterState({
		select: (state) => getLanguageFromPathname(state.location.pathname),
	});
	const { t } = useTranslation();

	return (
		<section className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
			<Suspense
				fallback={
					<div className="flex h-72 w-full max-w-md items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-900">
						<Loader />
					</div>
				}
			>
				<NotFoundAnimation />
			</Suspense>
			<h1 className="font-semibold text-2xl text-zinc-950 dark:text-zinc-300 mt-5">
				{t("notFound.title")}
			</h1>
			<Button asChild>
				<Link
					params={{
						language,
					}}
					to="/$language"
				>
					{t("notFound.homeLink")}
				</Link>
			</Button>
		</section>
	);
}

function getLanguageFromPathname(pathname: string): Language {
	const [language] = pathname.split("/").filter(Boolean);

	return toLanguage(language);
}

function RootDocument({ children }: { children: ReactNode }) {
	const language = useRouterState({
		select: (state) => getLanguageFromPathname(state.location.pathname),
	});

	return (
		<html lang={language} suppressHydrationWarning>
			<head>
				{/* biome-ignore lint/security/noDangerouslySetInnerHtml: Applies the saved theme before hydration. */}
				<script dangerouslySetInnerHTML={{ __html: themeScript }} />
				<HeadContent />
			</head>
			<body>
				<ApplicationShell> {children} </ApplicationShell>
				<Toaster />
				<Scripts />
			</body>
		</html>
	);
}
