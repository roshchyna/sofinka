import { Loader2 } from "lucide-react";
import type * as React from "react";

import { cn } from "@/utils/twMerge";

function Loader({ className, ...props }: React.ComponentProps<typeof Loader2>) {
	return (
		<Loader2
			aria-label="Loading"
			className={cn(
				"size-6 animate-spin text-zinc-500 dark:text-zinc-400",
				className,
			)}
			{...props}
		/>
	);
}

export { Loader };
