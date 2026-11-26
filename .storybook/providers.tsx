import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	createMemoryHistory,
	createRootRoute,
	createRoute,
	createRouter,
	RouterProvider,
} from "@tanstack/react-router";
import { createContext, type ReactNode, useContext, useState } from "react";
import { I18nextProvider } from "react-i18next";
import { MuzaAssistantProvider } from "../src/components/muza-assistant/context";
import i18n from "../src/i18n";
import type { Language } from "../src/i18n/languages";

const StoryContent = createContext<ReactNode>(null);

function Content() {
	return <>{useContext(StoryContent)}</>;
}

export function Providers({
	children,
	language,
}: {
	children: ReactNode;
	language: Language;
}) {
	const [client] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: { retry: false },
					mutations: { retry: false },
				},
			}),
	);
	const [router] = useState(() => {
		const root = createRootRoute({ component: Content });
		const localized = createRoute({
			getParentRoute: () => root,
			path: "/$language",
		});
		const course = createRoute({
			getParentRoute: () => localized,
			path: "learn/$courseId",
		});
		const lesson = createRoute({
			getParentRoute: () => course,
			path: "$lessonId",
		});
		const constructorRoute = createRoute({
			getParentRoute: () => localized,
			path: "constructor",
		});
		return createRouter({
			routeTree: root.addChildren([
				localized.addChildren([course.addChildren([lesson]), constructorRoute]),
			]),
			history: createMemoryHistory({ initialEntries: [`/${language}`] }),
		});
	});
	return (
		<I18nextProvider i18n={i18n}>
			<QueryClientProvider client={client}>
				<MuzaAssistantProvider>
					<StoryContent.Provider value={children}>
						<RouterProvider router={router} />
					</StoryContent.Provider>
				</MuzaAssistantProvider>
			</QueryClientProvider>
		</I18nextProvider>
	);
}
