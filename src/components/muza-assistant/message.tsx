import { Copy } from "lucide-react";
import type { ComponentProps, HTMLAttributes } from "react";
import { memo } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";

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

export type MessageResponseProps = ComponentProps<typeof Markdown> & {
	className?: string;
};

export const MessageResponse = memo(
	({ className, ...props }: MessageResponseProps) => {
		return (
			<div
				className={cn(
					"max-w-full overflow-x-auto [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_a]:font-medium [&_a]:underline [&_blockquote]:my-2 [&_blockquote]:border-zinc-300 [&_blockquote]:border-l-2 [&_blockquote]:pl-3 [&_code]:rounded [&_code]:bg-zinc-100 [&_code]:px-1 [&_code]:py-0.5 dark:[&_code]:bg-zinc-800 [&_h1]:my-3 [&_h1]:font-semibold [&_h1]:text-xl [&_h2]:my-3 [&_h2]:font-semibold [&_h2]:text-lg [&_h3]:my-2 [&_h3]:font-semibold [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-2 [&_pre]:overflow-auto [&_pre]:rounded-md [&_pre]:bg-zinc-100 [&_pre]:p-3 dark:[&_pre]:bg-zinc-950 [&_table]:my-2 [&_table]:border-collapse [&_td]:border [&_td]:border-zinc-300 [&_td]:px-2 [&_td]:py-1 dark:[&_td]:border-zinc-700 [&_th]:border [&_th]:border-zinc-300 [&_th]:px-2 [&_th]:py-1 dark:[&_th]:border-zinc-700 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5",
					className,
				)}
			>
				<Markdown remarkPlugins={[remarkGfm]} {...props} />
			</div>
		);
	},
	(prevProps, nextProps) => prevProps.children === nextProps.children,
);

MessageResponse.displayName = "MessageResponse";
