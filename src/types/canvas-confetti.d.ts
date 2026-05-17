declare module "canvas-confetti" {
	interface ConfettiOptions {
		angle?: number;
		colors?: string[];
		origin?: {
			x?: number;
			y?: number;
		};
		particleCount?: number;
		scalar?: number;
		spread?: number;
		startVelocity?: number;
	}

	export default function confetti(options?: ConfettiOptions): Promise<null>;
}
