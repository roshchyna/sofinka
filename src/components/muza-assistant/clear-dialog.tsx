import { Trash2 } from "lucide-react";

import { Button } from "@/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/ui/dialog";

interface ClearDialogProps {
	cancelLabel: string;
	confirmLabel: string;
	disabled: boolean;
	isClearLoading: boolean;
	label: string;
	message: string;
	onClear: () => void;
}

export function ClearDialog({
	cancelLabel,
	confirmLabel,
	disabled,
	isClearLoading,
	label,
	message,
	onClear,
}: ClearDialogProps) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					aria-label={label}
					disabled={disabled}
					isLoading={isClearLoading}
					size="icon"
					title={label}
					type="button"
					variant="ghost"
				>
					<Trash2 />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{label}</DialogTitle>
					<DialogDescription>{message}</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<DialogClose asChild>
						<Button type="button" variant="outline">
							{cancelLabel}
						</Button>
					</DialogClose>
					<DialogClose asChild>
						<Button onClick={onClear} type="button" variant="default">
							{confirmLabel}
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
