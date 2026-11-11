import { createFileRoute } from "@tanstack/react-router";

import { DemoLessonPlayer } from "@/components/demo/demo-lesson-player";
import { toLanguage } from "@/i18n/languages";

export const Route = createFileRoute("/$language/demo/")({
	component: DemoPage,
});

function DemoPage() {
	const { language } = Route.useParams();

	return <DemoLessonPlayer language={toLanguage(language)} />;
}
