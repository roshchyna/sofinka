import type { ReactNode } from "react";

interface FieldLabelProps {
	children: ReactNode;
	htmlFor: string;
}

export function FieldLabel({ children, htmlFor }: FieldLabelProps) {
	return (
		<label className="font-medium text-sm" htmlFor={htmlFor}>
			{children}
		</label>
	);
}
