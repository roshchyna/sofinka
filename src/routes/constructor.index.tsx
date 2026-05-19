import { createFileRoute, Navigate } from "@tanstack/react-router";

import { getLanguage } from "@/lib/language-storage";

export const Route = createFileRoute("/constructor/")({
	component: ConstructorRedirect,
});

function ConstructorRedirect() {
	return (
		<Navigate
			params={{
				language: getLanguage(),
			}}
			replace
			to="/$language/constructor"
		/>
	);
}
