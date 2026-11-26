import { getDefaultQuestions } from "../src/data/default-questions";
import { getLanguageName, languages, toLanguage } from "../src/i18n/languages";

let shouldFail = false;
export function setMockApiFailure(value: boolean) {
	shouldFail = value;
}

// Installed only in the Storybook iframe. No /api request reaches a real server.
const originalFetch = globalThis.fetch.bind(globalThis);
globalThis.fetch = async (input, init) => {
	const url = new URL(
		input instanceof Request ? input.url : String(input),
		window.location.href,
	);
	if (!url.pathname.startsWith("/api/")) return originalFetch(input, init);
	init?.signal?.throwIfAborted();
	if (shouldFail)
		return Response.json(
			{ error: "Storybook: simulated request failure" },
			{ status: 503 },
		);
	const body = JSON.parse(
		typeof init?.body === "string" ? init.body : "{}",
	) as { language?: string; type?: string; count?: number };
	const language =
		languages.find((value) => getLanguageName(value) === body.language) ??
		toLanguage(body.language);
	if (url.pathname === "/api/generate-questions") {
		const question =
			getDefaultQuestions(language).find((item) => item.type === body.type) ??
			getDefaultQuestions(language)[0];
		return Response.json({
			questions: Array.from(
				{ length: Math.max(1, Math.min(body.count ?? 1, 10)) },
				(_, i) => ({ ...question, id: 900 + i }),
			),
		});
	}
	if (url.pathname === "/api/muza-assistant") {
		const replies = {
			en: "Let's solve it together! **34 = 30 + 4**: three tens and four ones.",
			ua: "Розберімося разом! **34 = 30 + 4**: три десятки й чотири одиниці.",
			ru: "Разберёмся вместе! **34 = 30 + 4**: три десятка и четыре единицы.",
		};
		return Response.json({ reply: replies[language] });
	}
	return Response.json(
		{ error: "Storybook: no mock for this API" },
		{ status: 501 },
	);
};
