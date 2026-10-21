import { useEffect, useRef } from "react";

// Webgl-fluid-enhanced does not recognize Tailwind colors
const FLUID_COLORS = ["#ec4899", "#8b5cf6", "#22d3ee", "#f59e0b"];

export function FluidCursor({ enabled }: { enabled: boolean }) {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const container = containerRef.current;
		const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
		const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

		if (!enabled || !container || !finePointer.matches || reducedMotion.matches)
			return;

		let disposed = false;
		let frame = 0;
		let simulation: import("webgl-fluid-enhanced").default | undefined;
		let pointer: { x: number; y: number; dx: number; dy: number } | undefined;

		function addSplat() {
			frame = 0;
			if (!simulation || !pointer) return;

			simulation.splatAtLocation(
				pointer.x * (window.devicePixelRatio || 1),
				pointer.y,
				pointer.dx * 18,
				-pointer.dy * 18,
			);
			pointer = undefined;
		}

		function handlePointerMove(event: PointerEvent) {
			if (event.pointerType === "touch") return;

			pointer = {
				x: event.clientX,
				y: event.clientY,
				dx: (pointer?.dx ?? 0) + event.movementX,
				dy: (pointer?.dy ?? 0) + event.movementY,
			};
			if (!frame) frame = requestAnimationFrame(addSplat);
		}

		void import("webgl-fluid-enhanced")
			.then(({ default: WebGLFluidEnhanced }) => {
				if (disposed) return;

				container.replaceChildren();
				simulation = new WebGLFluidEnhanced(container);
				simulation.setConfig({
					bloom: false,
					colorPalette: FLUID_COLORS,
					dyeResolution: 512,
					hover: false,
					splatRadius: 0.003,
					sunrays: false,
					transparent: true,
				});
				simulation.start();

				window.addEventListener("pointermove", handlePointerMove, {
					passive: true,
				});
			})
			.catch(() => {});

		return () => {
			disposed = true;
			if (frame) cancelAnimationFrame(frame);
			window.removeEventListener("pointermove", handlePointerMove);
			simulation?.stop();
			simulation = undefined;
			pointer = undefined;
			container.replaceChildren();
		};
	}, [enabled]);

	return (
		<div
			aria-hidden="true"
			className="pointer-events-none fixed inset-0 z-30 opacity-60 dark:opacity-75"
			hidden={!enabled}
		>
			<div className="h-full w-full" ref={containerRef} />
		</div>
	);
}
