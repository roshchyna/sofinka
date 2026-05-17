import { createServer } from "node:http";
import { loadEnv } from "./env.mjs";
import {
	getRequestOrigin,
	readJson,
	sendJson,
	setCorsHeaders,
} from "./http-utils.mjs";
import { getLanguageConfig } from "./languages.mjs";
import { parseModelJson } from "./model-json.mjs";
import { buildPrompt } from "./prompt-builder.mjs";
import { normalizeGeneratedResponse } from "./question-normalizers.mjs";

loadEnv();

const PORT = Number(process.env.PORT ?? 3001);
const MODEL = process.env.OPENROUTER_MODEL ?? "openrouter/free";

const server = createServer(async (req, res) => {
	setCorsHeaders(req, res);

	if (req.method === "OPTIONS") {
		res.writeHead(204);
		res.end();
		return;
	}

	if (req.method !== "POST" || req.url !== "/api/generate-questions") {
		sendJson(res, 404, { error: "Not found" });
		return;
	}

	if (!process.env.OPENROUTER_API_KEY) {
		sendJson(res, 500, { error: "OPENROUTER_API_KEY is missing" });
		return;
	}

	try {
		const body = await readJson(req);
		const topic = String(body.topic ?? "").trim();
		const age = String(body.age ?? "7").trim();
		const count = Number(body.count ?? 5);
		const language = getLanguageConfig(body.language).name;
		const type = String(body.type ?? "single-choice").trim();

		if (!topic) {
			sendJson(res, 400, { error: "topic is required" });
			return;
		}

		const openRouterResponse = await fetch(
			"https://openrouter.ai/api/v1/chat/completions",
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
					"Content-Type": "application/json",
					"HTTP-Referer": getRequestOrigin(req),
					"X-Title": "Sofinka Education Generator",
				},
				body: JSON.stringify({
					model: MODEL,
					messages: [
						{
							role: "system",
							content: `Return only valid JSON. No markdown. Generate educational quiz questions in ${language}.`,
						},
						{
							role: "user",
							content: buildPrompt({ age, count, language, topic, type }),
						},
					],
				}),
			},
		);

		const rawText = await openRouterResponse.text();

		let data;
		try {
			data = JSON.parse(rawText);
		} catch {
			sendJson(res, 500, {
				error: `OpenRouter returned invalid JSON: ${rawText.slice(0, 200)}`,
			});
			return;
		}

		if (!openRouterResponse.ok) {
			sendJson(res, openRouterResponse.status, {
				error: data?.error?.message ?? "OpenRouter request failed",
			});
			return;
		}

		const content = data?.choices?.[0]?.message?.content ?? "{}";
		const generated = parseModelJson(content);
		sendJson(
			res,
			200,
			normalizeGeneratedResponse(generated, { language, topic, type }),
		);
	} catch (error) {
		sendJson(res, 500, {
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
});

server.listen(PORT, "127.0.0.1", () => {
	console.log(`AI backend is running on http://localhost:${PORT}`);
});
