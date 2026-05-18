import { Toaster as Sonner } from "sonner";
import "sonner/dist/styles.css";
import type * as React from "react";

type ToasterProps = React.ComponentProps<typeof Sonner>;

function Toaster(props: ToasterProps) {
	return (
		<Sonner
			closeButton
			expand
			position="bottom-right"
			visibleToasts={5}
			toastOptions={{
				unstyled: true,
				classNames: {
					toast:
						"relative flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-4 text-zinc-950 shadow-xl dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100",
					closeButton:
						"absolute top-0 left-0 flex size-6 cursor-pointer -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300",
					icon: "text-emerald-600 dark:text-emerald-400",
					success:
						"border-emerald-500 bg-emerald-50 text-emerald-950 dark:border-emerald-500 dark:bg-emerald-950 dark:text-zinc-300",
					error:
						"border-red-500 bg-red-50 text-red-950 dark:border-red-500 dark:bg-red-950 dark:text-red-50",
					warning:
						"border-amber-500 bg-amber-50 text-amber-950 dark:border-amber-500 dark:bg-amber-950 dark:text-amber-50",
					info: "border-sky-500 bg-sky-50 text-sky-950 dark:border-sky-500 dark:bg-sky-950 dark:text-sky-50",
					title: "font-semibold",
				},
				duration: 5000,
			}}
			{...props}
		/>
	);
}

export { Toaster };
