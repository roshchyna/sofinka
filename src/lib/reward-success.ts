import confetti from "canvas-confetti";
import { toast } from "sonner";

import i18n from "@/i18n";

function randomInRange(min: number, max: number) {
	return Math.random() * (max - min) + min;
}

function fireRandomDirectionConfetti() {
	const burstCount = 3 + Math.floor(Math.random() * 3);

	for (let index = 0; index < burstCount; index += 1) {
		confetti({
			angle: randomInRange(45, 135),
			colors: ["#22c55e", "#facc15", "#38bdf8", "#fb7185", "#a78bfa"],
			origin: {
				x: randomInRange(0.15, 0.85),
				y: randomInRange(0.2, 0.65),
			},
			particleCount: Math.floor(randomInRange(24, 42)),
			scalar: randomInRange(0.8, 1.2),
			spread: randomInRange(45, 95),
			startVelocity: randomInRange(24, 42),
		});
	}
}

export function rewardCorrectAnswer() {
	fireRandomDirectionConfetti();
	toast.success(i18n.t("reward.correctAnswerToast"));
}
