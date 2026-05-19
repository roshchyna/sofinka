import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type * as React from "react";
import { useTranslation } from "react-i18next";

import { cn } from "@/utils/twMerge";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogClose = DialogPrimitive.Close;

function DialogPortal(
	props: React.ComponentProps<typeof DialogPrimitive.Portal>,
) {
	return <DialogPrimitive.Portal {...props} />;
}

function DialogOverlay({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
	return (
		<DialogPrimitive.Overlay
			className={cn(
				"fixed inset-0 z-50 bg-black/45 data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
				className,
			)}
			{...props}
		/>
	);
}

function DialogContent({
	children,
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
	const { t } = useTranslation();

	return (
		<DialogPortal>
			<DialogOverlay />
			<DialogPrimitive.Content
				className={cn(
					"fixed top-1/2 left-1/2 z-50 grid w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 gap-5 rounded-lg border border-zinc-200 bg-white p-6 shadow-lg outline-none data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 dark:border-zinc-800 dark:bg-zinc-950",
					className,
				)}
				{...props}
			>
				{children}
				<DialogPrimitive.Close className="absolute top-4 right-4 rounded-sm text-zinc-500 opacity-70 outline-none transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-zinc-950/10 dark:focus-visible:ring-zinc-50/10">
					<X className="size-4" />
					<span className="sr-only">{t("common.close")}</span>
				</DialogPrimitive.Close>
			</DialogPrimitive.Content>
		</DialogPortal>
	);
}

function DialogSideContent({
	children,
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
	const { t } = useTranslation();

	return (
		<DialogPortal>
			<DialogOverlay />
			<DialogPrimitive.Content
				className={cn(
					"fixed top-0 right-0 z-50 grid h-dvh w-[min(22rem,calc(100vw-2rem))] content-start gap-5 overflow-y-auto border-zinc-200 border-l bg-white p-6 shadow-xl outline-none data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right dark:border-zinc-800 dark:bg-zinc-950",
					className,
				)}
				{...props}
			>
				{children}
				<DialogPrimitive.Close className="absolute top-4 right-4 rounded-sm text-zinc-500 opacity-70 outline-none transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-zinc-950/10 dark:focus-visible:ring-zinc-50/10">
					<X className="size-4" />
					<span className="sr-only">{t("common.close")}</span>
				</DialogPrimitive.Close>
			</DialogPrimitive.Content>
		</DialogPortal>
	);
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
	return <div className={cn("grid gap-1.5", className)} {...props} />;
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			className={cn(
				"flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
				className,
			)}
			{...props}
		/>
	);
}

function DialogTitle({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
	return (
		<DialogPrimitive.Title
			className={cn(
				"font-semibold text-lg text-zinc-950 dark:text-zinc-50",
				className,
			)}
			{...props}
		/>
	);
}

function DialogDescription({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
	return (
		<DialogPrimitive.Description
			className={cn("text-sm text-zinc-500 dark:text-zinc-400", className)}
			{...props}
		/>
	);
}

export {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogSideContent,
	DialogTitle,
	DialogTrigger,
};
