import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import type * as React from "react";

import { cn } from "@/utils/twMerge";

interface SelectOption {
	disabled?: boolean;
	label: React.ReactNode;
	value: string;
}

interface SelectProps
	extends Omit<
		React.ComponentProps<typeof SelectPrimitive.Trigger>,
		"children" | "defaultValue" | "onValueChange" | "value"
	> {
	defaultValue?: string;
	name?: string;
	onValueChange?: (value: string) => void;
	options: SelectOption[];
	required?: boolean;
	value?: string;
}

function Select({
	className,
	defaultValue,
	disabled,
	name,
	onValueChange,
	options,
	required,
	value,
	...props
}: SelectProps) {
	return (
		<SelectPrimitive.Root
			defaultValue={defaultValue}
			disabled={disabled}
			name={name}
			onValueChange={onValueChange}
			required={required}
			value={value}
		>
			<SelectPrimitive.Trigger
				className={cn(
					"flex h-10 w-full items-center justify-between gap-2 rounded-md border border-zinc-200 bg-white px-3 text-base text-zinc-950 shadow-sm outline-none focus-visible:border-zinc-950 focus-visible:ring-2 focus-visible:ring-zinc-950/30 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus-visible:border-zinc-50 dark:focus-visible:ring-zinc-50/30",
					className,
				)}
				disabled={disabled}
				{...props}
			>
				<SelectPrimitive.Value />
				<SelectPrimitive.Icon asChild>
					<ChevronDown
						aria-hidden="true"
						className="size-4 shrink-0 opacity-70"
					/>
				</SelectPrimitive.Icon>
			</SelectPrimitive.Trigger>

			<SelectPrimitive.Portal>
				<SelectPrimitive.Content
					align="end"
					className="z-[80] max-h-64 min-w-[var(--radix-select-trigger-width)] overflow-y-auto rounded-md border border-zinc-200 bg-white p-1 text-sm text-zinc-950 shadow-lg dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
					position="popper"
					side="bottom"
					sideOffset={4}
				>
					<SelectPrimitive.Viewport>
						{options.map((option) => (
							<SelectPrimitive.Item
								className="relative flex cursor-default select-none items-center rounded-sm py-1.5 pr-2 pl-7 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-zinc-100 data-[disabled]:opacity-50 dark:data-[highlighted]:bg-zinc-800 dark:data-[highlighted]:text-zinc-50"
								disabled={option.disabled}
								key={option.value}
								value={option.value}
							>
								<SelectPrimitive.ItemIndicator className="absolute left-2">
									<Check aria-hidden="true" className="size-4" />
								</SelectPrimitive.ItemIndicator>
								<SelectPrimitive.ItemText>
									{option.label}
								</SelectPrimitive.ItemText>
							</SelectPrimitive.Item>
						))}
					</SelectPrimitive.Viewport>
				</SelectPrimitive.Content>
			</SelectPrimitive.Portal>
		</SelectPrimitive.Root>
	);
}

export { Select };
