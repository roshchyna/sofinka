// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GenerateQuestionsDialog } from "@/components/constructor/generate-questions-dialog";
import i18n from "@/i18n";

const { toastError, toastSuccess } = vi.hoisted(() => ({
	toastError: vi.fn(),
	toastSuccess: vi.fn(),
}));

vi.mock("sonner", () => ({
	toast: {
		error: toastError,
		success: toastSuccess,
	},
}));

function renderWithQueryClient(children: ReactNode) {
	const queryClient = new QueryClient({
		defaultOptions: {
			mutations: { retry: false },
			queries: { retry: false },
		},
	});

	return render(
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
	);
}

describe("GenerateQuestionsDialog", () => {
	beforeEach(async () => {
		await i18n.changeLanguage("ua");
		window.localStorage.clear();
		window.localStorage.setItem("sofinka.childAge", "8");
		vi.stubGlobal(
			"fetch",
			vi.fn(async () => ({
				json: async () => ({
					questions: [
						{
							id: 1,
							type: "odd-one-out",
							title: "Знайди зайве",
							options: [
								{ id: "option-1", label: "Кіт", isCorrect: false },
								{ id: "option-2", label: "Авто", isCorrect: true },
							],
						},
					],
				}),
				ok: true,
			})),
		);
	});

	afterEach(async () => {
		vi.unstubAllGlobals();
		toastSuccess.mockClear();
		toastError.mockClear();
		await i18n.changeLanguage("ru");
	});

	it("sends the full selected language name and generation params", async () => {
		const onGenerated = vi.fn();
		renderWithQueryClient(
			<GenerateQuestionsDialog onGenerated={onGenerated} />,
		);

		fireEvent.click(screen.getByRole("button", { name: "Згенерувати" }));
		fireEvent.change(screen.getByLabelText("Тема"), {
			target: {
				value: "Космос",
			},
		});
		fireEvent.change(screen.getByLabelText("Кількість"), {
			target: {
				value: "2",
			},
		});
		fireEvent.change(screen.getByLabelText("Тип запитання"), {
			target: {
				value: "odd-one-out",
			},
		});
		fireEvent.submit(screen.getByLabelText("Тема").closest("form") as Element);

		await waitFor(() => expect(globalThis.fetch).toHaveBeenCalledTimes(1));

		const [requestUrl, requestInit] = vi.mocked(globalThis.fetch).mock.calls[0];
		expect(requestUrl).toBe("/api/generate-questions");
		expect(JSON.parse(String(requestInit?.body))).toEqual({
			age: 8,
			count: 2,
			language: "Ukrainian",
			topic: "Космос",
			type: "odd-one-out",
		});
		await waitFor(() => expect(onGenerated).toHaveBeenCalledTimes(1));
		expect(toastSuccess).toHaveBeenCalledWith("AI-запитання додано.");
		expect(toastError).not.toHaveBeenCalled();
	});
});
