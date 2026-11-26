import { memo } from "react";
import { useTranslation } from "react-i18next";
import { MuzaMascot } from "@/components/muza-mascot/muza-mascot";
import { cn } from "@/utils/twMerge";
import type { MuzaPersonaState } from "./types";

interface PersonaProps {
	className?: string;
	state: MuzaPersonaState;
}

export const Muza = memo(({ className, state }: PersonaProps) => {
	const { t } = useTranslation();

	return (
		<MuzaMascot
			className={cn("size-14", className)}
			label={t("home.mascotAria")}
			state={state}
		/>
	);
});

Muza.displayName = "Muza";
