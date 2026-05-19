import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";

import { DEFAULT_LANGUAGE, isLanguage, languages } from "@/i18n/languages";
import { resources } from "./resources";

const i18n = createInstance();

void i18n.use(initReactI18next).init({
	fallbackLng: DEFAULT_LANGUAGE,
	interpolation: {
		escapeValue: false,
	},
	lng: getInitialLanguage(),
	resources,
	returnEmptyString: false,
	supportedLngs: languages,
});

export default i18n;

function getInitialLanguage() {
	if (typeof window === "undefined") return DEFAULT_LANGUAGE;

	const [language] = window.location.pathname.split("/").filter(Boolean);

	return isLanguage(language) ? language : DEFAULT_LANGUAGE;
}
