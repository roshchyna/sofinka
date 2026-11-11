import { describe, expect, it } from "vitest";

import {
	initialDemoSession,
	transitionDemoSession,
} from "@/components/demo/demo-session";

describe("demo session boundaries", () => {
	it("rejects skipped, stale and duplicate answers while preserving the first result", () => {
		const questions = [{ id: 1 }, { id: 2 }];
		const started = transitionDemoSession(
			initialDemoSession,
			{ type: "start" },
			questions,
		);
		expect(transitionDemoSession(started, { type: "next" }, questions)).toBe(
			started,
		);
		expect(
			transitionDemoSession(
				started,
				{
					type: "answer",
					result: { questionId: 2, isCorrect: true, value: "future" },
				},
				questions,
			),
		).toBe(started);
		const first = transitionDemoSession(
			started,
			{
				type: "answer",
				result: { questionId: 1, isCorrect: false, value: "wrong" },
			},
			questions,
		);
		expect(
			transitionDemoSession(
				first,
				{
					type: "answer",
					result: { questionId: 1, isCorrect: true, value: "retry" },
				},
				questions,
			),
		).toBe(first);
		const next = transitionDemoSession(first, { type: "next" }, questions);
		expect(
			transitionDemoSession(
				next,
				{
					type: "answer",
					result: { questionId: 1, isCorrect: true, value: "late" },
				},
				questions,
			),
		).toBe(next);
	});
});
