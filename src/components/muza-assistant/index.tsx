import {
	lazy,
	type ReactNode,
	Suspense,
	useCallback,
	useEffect,
	useState,
} from "react";
import { useTranslation } from "react-i18next";

import { toLanguage } from "@/i18n/languages";
import {
	Dialog,
	DialogDescription,
	DialogSideContent,
	DialogTitle,
	DialogTrigger,
} from "@/ui/dialog";
import { useMuzaAssistantContext } from "./context";
import { getMuzaCopy } from "./copy";
import { MuzaBadge } from "./muza-badge";

const MuzaPage = lazy(() =>
	import("./page").then((module) => ({ default: module.MuzaPage })),
);

interface MuzaAssistantProps {
	endpoint?: string;
	trigger?: ReactNode;
}

export default function MuzaAssistant({
	endpoint,
	trigger,
}: MuzaAssistantProps) {
	const { i18n } = useTranslation();
	const language = toLanguage(i18n.resolvedLanguage ?? i18n.language);
	const copy = getMuzaCopy(language);
	const [isOpen, setIsOpen] = useState(false);
	const { setIsOpen: setIsAssistantOpen } = useMuzaAssistantContext();

	const handleOpenChange = useCallback(
		(nextOpen: boolean) => {
			setIsOpen(nextOpen);
			setIsAssistantOpen(nextOpen);
		},
		[setIsAssistantOpen],
	);

	useEffect(() => {
		return () => {
			if (isOpen) setIsAssistantOpen(false);
		};
	}, [isOpen, setIsAssistantOpen]);

	return (
		<Dialog onOpenChange={handleOpenChange} open={isOpen}>
			{trigger ? (
				<DialogTrigger asChild>{trigger}</DialogTrigger>
			) : (
				<DialogTrigger asChild>
					<MuzaBadge
						betaLabel={copy.beta}
						className="fixed right-4 bottom-22 z-40 sm:right-6"
						title={copy.title}
					/>
				</DialogTrigger>
			)}
			<DialogSideContent className="w-[min(32rem,calc(100vw-1rem))] gap-0 overflow-hidden p-0">
				<DialogTitle className="sr-only">{copy.title}</DialogTitle>
				<DialogDescription className="sr-only">
					{copy.subtitle}
				</DialogDescription>
				{isOpen && (
					<Suspense fallback={<MuzaLoading label={copy.waiting} />}>
						<MuzaPage endpoint={endpoint} />
					</Suspense>
				)}
			</DialogSideContent>
		</Dialog>
	);
}

function MuzaLoading({ label }: { label: string }) {
	return (
		<output
			aria-live="polite"
			className="grid h-dvh place-items-center text-sm text-zinc-500 dark:text-zinc-400"
		>
			{label}
		</output>
	);
}
