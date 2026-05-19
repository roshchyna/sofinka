import { useRive } from "@rive-app/react-webgl2";
import { memo } from "react";
import { cn } from "@/utils/twMerge";
import type { MuzaPersonaState } from "./types";

interface PersonaProps {
	className?: string;
	state: MuzaPersonaState;
}

const muzaCatRiv = "/rive/muza-cat-companion.riv";
const stateMachine = "State Machine 1";

export const Persona = memo(({ className, state }: PersonaProps) => {
	const { RiveComponent } = useRive({
		artboard: "Artboard",
		autoplay: true,
		src: muzaCatRiv,
		stateMachines: stateMachine,
	});

	return (
		<RiveComponent
			className={cn(
				"size-14 shrink-0 transition duration-300",
				state === "writing" && "scale-105 animate-pulse",
				className,
			)}
		/>
	);
});

Persona.displayName = "Persona";
