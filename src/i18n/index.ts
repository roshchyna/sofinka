import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { DEFAULT_LANGUAGE, languages } from "@/i18n/languages";
import { resources } from "./resources";

void i18n.use(initReactI18next).init({
	fallbackLng: DEFAULT_LANGUAGE,
	interpolation: {
		escapeValue: false,
	},
	lng: DEFAULT_LANGUAGE,
	resources,
	returnEmptyString: false,
	supportedLngs: languages,
});

export default i18n;
