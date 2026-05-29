import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { Loader } from "@/ui/loader";
import { cn } from "@/utils/twMerge";
import type { WithRef } from "@/utils/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-zinc-950 focus-visible:outline-offset-2 dark:focus-visible:outline-zinc-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				default:
					"bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200",
				surface:
					"bg-zinc-100 text-zinc-950 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700",
				outline:
					"border border-zinc-200 bg-white text-zinc-950 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800",
				ghost:
					"text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-300",
			},

			size: {
				xs: "h-6 px-2 text-xs",
				sm: "h-8 px-3 text-xs",
				md: "h-9 px-4 text-sm",
				lg: "h-10 px-5 text-sm",
				xl: "h-11 px-6 text-base",
				icon: "h-10 w-10",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "lg",
		},
	},
);

interface BaseButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	isLoading?: boolean;
}

type ButtonProps = WithRef<BaseButtonProps, HTMLButtonElement>;

const Button = ({
	ref,
	className,
	children,
	variant,
	size,
	asChild = false,
	isLoading = false,
	...props
}: ButtonProps) => {
	const Comp = asChild ? Slot : "button";
	const childProps = asChild ? props : { type: "button" as const, ...props };

	return (
		<Comp
			className={cn(buttonVariants({ variant, size, className }))}
			ref={ref}
			{...childProps}
		>
			{isLoading ? <Loader className="h-4 w-4" /> : children}
		</Comp>
	);
};
Button.displayName = "Button";

export { Button, buttonVariants };
