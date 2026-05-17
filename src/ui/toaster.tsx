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
						"relative flex items-center gap-3 rounded-lg border p-4 shadow-lg",
					closeButton:
						"absolute top-0 left-0 flex size-6 cursor-pointer -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300",
					icon: "text-emerald-600 dark:text-emerald-400",
					success:
						"border-emerald-500 bg-emerald-50 text-emerald-950 dark:border-emerald-500 dark:bg-emerald-950 dark:text-zinc-300",
					title: "font-semibold",
				},
				duration: 5000,
			}}
			{...props}
		/>
	);
}

export { Toaster };
