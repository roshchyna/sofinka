import { useRive } from "@rive-app/react-webgl2";
import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/utils/twMerge";

interface HomeMascotProps {
	className?: string;
}

const stateMachine = "State Machine 1";
const muzaCatRiv = "/rive/muza-cat-companion.riv";

export const HomeMascot = memo(({ className }: HomeMascotProps) => {
	const { t } = useTranslation();
	const [isLoaded, setIsLoaded] = useState(false);

	const { RiveComponent } = useRive({
		artboard: "Artboard",
		src: muzaCatRiv,
		stateMachines: stateMachine,
		autoplay: true,
		onLoad: () => setIsLoaded(true),
	});

	return (
		<RiveComponent
			aria-label={t("home.mascotAria")}
			className={cn(
				"pointer-events-auto size-36 shrink-0 transition-all duration-700 ease-out sm:size-48",
				"opacity-0 scale-95",
				isLoaded && "opacity-100 scale-100",
				className,
			)}
		/>
	);
});

HomeMascot.displayName = "HomeMascot";
