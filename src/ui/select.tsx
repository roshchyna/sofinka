import type * as React from "react";

import { cn } from "@/utils/twMerge";

function Select({ className, ...props }: React.ComponentProps<"select">) {
	return (
		<select
			className={cn(
				"h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-base text-zinc-950 shadow-sm outline-none focus-visible:border-zinc-950 focus-visible:ring-2 focus-visible:ring-zinc-950/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:focus-visible:border-zinc-50 dark:focus-visible:ring-zinc-50/10",
				className,
			)}
			{...props}
		/>
	);
}

export { Select };
