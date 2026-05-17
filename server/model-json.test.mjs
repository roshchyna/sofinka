import { describe, expect, it } from "vitest";
import { parseModelJson } from "./model-json.mjs";

describe("parseModelJson", () => {
	it("parses plain JSON", () => {
		expect(parseModelJson('{"questions":[{"id":1}]}')).toEqual({
			questions: [{ id: 1 }],
		});
	});

	it("parses JSON from a fenced json block", () => {
		const content = '```json\n{"questions":[{"id":2}]}\n```';

		expect(parseModelJson(content)).toEqual({
			questions: [{ id: 2 }],
		});
	});

	it("parses JSON surrounded by model text", () => {
		const content = 'Here is the JSON: {"questions":[{"id":3}]} thanks!';

		expect(parseModelJson(content)).toEqual({
			questions: [{ id: 3 }],
		});
	});

	it("returns an empty object for broken JSON", () => {
		expect(parseModelJson('{"questions":')).toEqual({});
	});
});
