import { memo } from "react";
import { useTranslation } from "react-i18next";
import { MuzaMascot } from "@/components/muza-mascot/muza-mascot";
import { cn } from "@/utils/twMerge";

interface HomeMascotProps {
	className?: string;
}

export const HomeMascot = memo(({ className }: HomeMascotProps) => {
	const { t } = useTranslation();

	return (
		<MuzaMascot
			interactive
			label={t("home.mascotInteract")}
			className={cn("pointer-events-auto size-36 sm:size-48", className)}
		/>
	);
});

HomeMascot.displayName = "HomeMascot";
