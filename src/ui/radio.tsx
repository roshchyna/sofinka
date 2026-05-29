import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";
import type * as React from "react";

import { cn } from "@/utils/twMerge";

function RadioGroup({
	className,
	...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
	return (
		<RadioGroupPrimitive.Root
			className={cn("grid gap-3", className)}
			{...props}
		/>
	);
}

function Radio({
	className,
	...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
	return (
		<RadioGroupPrimitive.Item
			className={cn(
				"aspect-square size-4 shrink-0 rounded-full border border-zinc-300 bg-white shadow-sm outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-zinc-950/30 data-[state=checked]:border-zinc-950 data-[state=checked]:text-zinc-950 dark:border-zinc-700 dark:bg-zinc-900 dark:focus-visible:ring-zinc-50/30 dark:data-[state=checked]:border-zinc-50 dark:data-[state=checked]:text-zinc-50",
				className,
			)}
			{...props}
		>
			<RadioGroupPrimitive.Indicator className="flex items-center justify-center">
				<Circle className="size-2 fill-current" />
			</RadioGroupPrimitive.Indicator>
		</RadioGroupPrimitive.Item>
	);
}

export { Radio, RadioGroup };
