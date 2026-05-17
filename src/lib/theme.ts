export const THEME_STORAGE_KEY = "theme";

export type Theme = "light" | "dark" | "black" | "system";

const fallbackTheme: Theme = "dark";
const themes = new Set<Theme>(["light", "dark", "black", "system"]);

function normalizeTheme(theme: string | null): Theme {
	return themes.has(theme as Theme) ? (theme as Theme) : fallbackTheme;
}

function getSystemTheme() {
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

export function getTheme() {
	if (typeof window === "undefined") return fallbackTheme;

	const rawTheme = normalizeTheme(
		window.localStorage.getItem(THEME_STORAGE_KEY),
	);

	window.localStorage.setItem(THEME_STORAGE_KEY, rawTheme);

	return rawTheme;
}

export function isThemeDark(theme = getTheme()) {
	if (theme === "black") return true;
	if (theme === "dark") return true;
	if (theme === "system") return getSystemTheme() === "dark";

	return false;
}

export function updateTheme() {
	if (typeof document === "undefined") return fallbackTheme;

	const rawTheme = getTheme();
	const systemTheme = getSystemTheme();
	const isDark =
		rawTheme === "dark" || (rawTheme === "system" && systemTheme === "dark");
	const isBlack = rawTheme === "black";

	document.documentElement.classList.toggle("dark", isDark);
	document.documentElement.classList.toggle("black", isBlack);
	document.documentElement.style.colorScheme =
		isDark || isBlack ? "dark" : "light";

	return rawTheme;
}

export function setTheme(theme: Theme) {
	if (typeof window === "undefined") return;

	window.localStorage.setItem(THEME_STORAGE_KEY, theme);
	updateTheme();
}
