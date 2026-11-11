import type { QuestionAnswerResult } from "@/components/questions/question-types";

export type DemoSessionState =
	| { status: "intro" }
	| {
			status: "active";
			questionIndex: number;
			answers: readonly QuestionAnswerResult[];
	  }
	| { status: "completed"; answers: readonly QuestionAnswerResult[] };

export type DemoSessionAction =
	| { type: "start" }
	| { type: "answer"; result: QuestionAnswerResult }
	| { type: "next" };

export const initialDemoSession: DemoSessionState = { status: "intro" };

export function transitionDemoSession(
	state: DemoSessionState,
	action: DemoSessionAction,
	questions: readonly { id: number }[],
): DemoSessionState {
	if (action.type === "start") {
		return questions.length
			? { status: "active", questionIndex: 0, answers: [] }
			: { status: "completed", answers: [] };
	}
	if (state.status !== "active") return state;

	const question = questions[state.questionIndex];
	if (!question) return state;
	const hasAnswer = state.answers.some(
		(answer) => answer.questionId === question.id,
	);

	if (action.type === "answer") {
		if (action.result.questionId !== question.id || hasAnswer) return state;
		return { ...state, answers: [...state.answers, action.result] };
	}
	if (!hasAnswer) return state;
	return state.questionIndex === questions.length - 1
		? { status: "completed", answers: state.answers }
		: { ...state, questionIndex: state.questionIndex + 1 };
}
