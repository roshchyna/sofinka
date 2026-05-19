import { Copy } from "lucide-react";
import type { ComponentProps, HTMLAttributes } from "react";
import { memo } from "react";
import { toast } from "sonner";
import { Streamdown } from "streamdown";

import { Button } from "@/ui/button";
import { cn } from "@/utils/twMerge";

export type MessageRole = "user" | "assistant";

export type MessageProps = HTMLAttributes<HTMLDivElement> & {
	from: MessageRole;
};

export function Message({ className, from, ...props }: MessageProps) {
	return (
		<div
			className={cn(
				"group flex w-full max-w-[92%] flex-col gap-2",
				from === "user" ? "is-user ml-auto items-end" : "is-assistant",
				className,
			)}
			{...props}
		/>
	);
}

export function MessageContent({
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn(
				"min-w-0 max-w-full overflow-hidden rounded-lg text-sm leading-6",
				"group-[.is-user]:bg-pink-100 group-[.is-user]:px-3 group-[.is-user]:py-2 group-[.is-user]:text-zinc-950 dark:group-[.is-user]:bg-pink-950/60 dark:group-[.is-user]:text-zinc-100",
				"group-[.is-assistant]:border group-[.is-assistant]:border-zinc-200 group-[.is-assistant]:bg-white group-[.is-assistant]:p-3 group-[.is-assistant]:text-zinc-900 group-[.is-assistant]:shadow-sm dark:group-[.is-assistant]:border-zinc-800 dark:group-[.is-assistant]:bg-zinc-900 dark:group-[.is-assistant]:text-zinc-200",
				className,
			)}
			{...props}
		/>
	);
}

export function MessageActions({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			className={cn("mt-2 flex items-center justify-end gap-1", className)}
			{...props}
		/>
	);
}

interface MessageCopyActionProps {
	content: string;
	label: string;
	successMessage: string;
}

export function MessageCopyAction({
	content,
	label,
	successMessage,
}: MessageCopyActionProps) {
	return (
		<Button
			aria-label={label}
			onClick={() => {
				void navigator.clipboard.writeText(content).then(() => {
					toast.success(successMessage);
				});
			}}
			size="icon"
			title={label}
			type="button"
			variant="ghost"
		>
			<Copy />
		</Button>
	);
}

export type MessageResponseProps = ComponentProps<typeof Streamdown>;

export const MessageResponse = memo(
	({ className, ...props }: MessageResponseProps) => {
		return (
			<Streamdown
				className={cn(
					"max-w-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_a]:font-medium [&_a]:underline [&_code]:rounded [&_code]:bg-zinc-100 [&_code]:px-1 [&_code]:py-0.5 dark:[&_code]:bg-zinc-800 [&_ol]:my-2 [&_ol]:pl-5 [&_p]:my-2 [&_pre]:overflow-auto [&_pre]:rounded-md [&_pre]:bg-zinc-100 [&_pre]:p-3 dark:[&_pre]:bg-zinc-950 [&_ul]:my-2 [&_ul]:pl-5",
					className,
				)}
				{...props}
			/>
		);
	},
	(prevProps, nextProps) => prevProps.children === nextProps.children,
);

MessageResponse.displayName = "MessageResponse";
