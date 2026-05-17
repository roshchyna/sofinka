import { useRive } from "@rive-app/react-webgl2";
import { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import muzaCatRiv from "@/assets/muza-cat-companion.riv";
import { cn } from "@/utils/twMerge";
import { Button } from "../ui/button";

interface HomeMascotProps {
	className?: string;
}

const stateMachine = "State Machine 1";

export const HomeMascot = memo(({ className }: HomeMascotProps) => {
	const { t } = useTranslation();
	const [isVisible, setIsVisible] = useState(false);
	const { rive, RiveComponent } = useRive({
		artboard: "Artboard",
		src: muzaCatRiv,
		stateMachines: stateMachine,
		autoplay: true,
	});

	useEffect(() => {
		const timeoutId = window.setTimeout(() => setIsVisible(true), 100);

		return () => window.clearTimeout(timeoutId);
	}, []);

	return (
		<>
			<Button onClick={() => rive?.play()}>{t("home.mascotAction")}</Button>

			<RiveComponent
				aria-label={t("home.mascotAria")}
				className={cn(
					"pointer-events-auto size-36 shrink-0 transition-all duration-700 ease-out sm:size-48",
					isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0",
					className,
				)}
			/>
		</>
	);
});

HomeMascot.displayName = "HomeMascot";
