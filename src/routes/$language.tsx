import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import i18n from "@/i18n";
import {
	DEFAULT_LANGUAGE,
	isLanguage,
	type Language,
	toLanguage,
} from "@/i18n/languages";

export const Route = createFileRoute("/$language")({
	beforeLoad: ({ params }) => {
		if (!isLanguage(params.language)) {
			throw redirect({
				params: {
					language: DEFAULT_LANGUAGE,
				},
				to: "/$language",
			});
		}

		syncLanguage(params.language);
	},
	component: LanguageLayout,
});

function LanguageLayout() {
	return <Outlet />;
}

function syncLanguage(language: Language) {
	const currentLanguage = toLanguage(i18n.resolvedLanguage ?? i18n.language);

	if (currentLanguage !== language) {
		void i18n.changeLanguage(language);
	}
}
