import { MessageCircle, Sparkles } from "lucide-react";
import { type ButtonHTMLAttributes, forwardRef } from "react";

import { cn } from "@/utils/twMerge";

interface MuzaBadgeProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	betaLabel: string;
	title: string;
}

export const MuzaBadge = forwardRef<HTMLButtonElement, MuzaBadgeProps>(
	({ betaLabel, className, title, ...props }, ref) => {
		return (
			<button
				className={cn(
					"inline-flex h-12 items-center gap-2 rounded-full border border-pink-200 bg-white px-4 font-medium text-sm text-zinc-950 shadow-lg shadow-zinc-950/10 transition hover:-translate-y-0.5 hover:bg-pink-50 focus-visible:outline-2 focus-visible:outline-zinc-950 focus-visible:outline-offset-2 dark:border-pink-900/70 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800 dark:focus-visible:outline-zinc-50",
					className,
				)}
				ref={ref}
				type="button"
				{...props}
			>
				<MessageCircle className="size-4 text-pink-600 dark:text-pink-300" />
				<span>{title}</span>
				<span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2 py-0.5 text-[10px] text-sky-900 uppercase dark:bg-sky-950 dark:text-sky-200">
					<Sparkles className="size-3" />
					{betaLabel}
				</span>
			</button>
		);
	},
);

MuzaBadge.displayName = "MuzaBadge";
