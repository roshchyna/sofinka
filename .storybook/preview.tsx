import type { Preview } from "@storybook/react-vite";
import i18n from "../src/i18n";
import { languageOptions, toLanguage } from "../src/i18n/languages";
import { setTheme } from "../src/lib/theme";
import { setMockApiFailure } from "./mock-api";
import { Providers } from "./providers";
import "../src/styles.css";

const preview: Preview = {
	globalTypes: {
		theme: {
			toolbar: {
				icon: "paintbrush",
				items: ["light", "dark"],
				dynamicTitle: true,
			},
		},
		language: {
			toolbar: {
				icon: "globe",
				items: languageOptions.map(({ value, label }) => ({
					value,
					title: label,
				})),
				dynamicTitle: true,
			},
		},
	},
	initialGlobals: { theme: "light", language: "en" },
	parameters: {
		layout: "fullscreen",
		controls: { expanded: true },
		options: {
			storySort: {
				order: [
					"Muza",
					"UI",
					"Questions",
					"Question builder",
					"Learning",
					"Chat",
					"App",
				],
			},
		},
	},
	loaders: [
		async ({ globals, parameters }) => {
			await i18n.changeLanguage(toLanguage(globals.language));
			setTheme(globals.theme === "dark" ? "dark" : "light");
			setMockApiFailure(parameters.apiFailure === true);
			return {};
		},
	],
	decorators: [
		(Story, context) => (
			<Providers
				key={`${context.id}-${context.globals.language}`}
				language={toLanguage(context.globals.language)}
			>
				<div className="min-h-screen bg-zinc-50 p-6 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-100">
					<Story />
				</div>
			</Providers>
		),
	],
};

export default preview;
