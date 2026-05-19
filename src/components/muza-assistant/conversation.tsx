import { ArrowDown } from "lucide-react";
import {
	type HTMLAttributes,
	type ReactNode,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";

import { Button } from "@/ui/button";
import { cn } from "@/utils/twMerge";

interface ConversationProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

export function Conversation({
	children,
	className,
	...props
}: ConversationProps) {
	const viewportRef = useRef<HTMLDivElement>(null);
	const [isAtBottom, setIsAtBottom] = useState(true);

	const scrollToBottom = useCallback(() => {
		const viewport = viewportRef.current;
		if (!viewport) return;

		viewport.scrollTo({
			behavior: "smooth",
			top: viewport.scrollHeight,
		});
	}, []);

	useEffect(() => {
		if (isAtBottom) scrollToBottom();
	});

	function handleScroll() {
		const viewport = viewportRef.current;
		if (!viewport) return;

		const bottomDistance =
			viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;
		setIsAtBottom(bottomDistance < 48);
	}

	return (
		<div className={cn("relative min-h-0 flex-1", className)} {...props}>
			<div
				className="h-full overflow-y-auto"
				onScroll={handleScroll}
				ref={viewportRef}
				role="log"
			>
				<div className="flex min-h-full flex-col gap-3 p-4">{children}</div>
			</div>

			{!isAtBottom && (
				<Button
					aria-label="Scroll to latest message"
					className="absolute right-4 bottom-4 rounded-full shadow-md"
					onClick={scrollToBottom}
					size="icon"
					title="Scroll to latest message"
					type="button"
					variant="outline"
				>
					<ArrowDown />
				</Button>
			)}
		</div>
	);
}
