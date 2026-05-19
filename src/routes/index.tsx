import { createFileRoute, Navigate } from "@tanstack/react-router";

import { getLanguage } from "@/lib/language-storage";

export const Route = createFileRoute("/")({
	component: IndexRedirect,
});

function IndexRedirect() {
	return (
		<Navigate
			params={{
				language: getLanguage(),
			}}
			replace
			to="/$language"
		/>
	);
}
