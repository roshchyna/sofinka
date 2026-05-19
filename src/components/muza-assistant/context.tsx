import {
	createContext,
	type PropsWithChildren,
	useContext,
	useMemo,
	useState,
} from "react";

interface MuzaAssistantContextValue {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
}

const MuzaAssistantContext = createContext<MuzaAssistantContextValue | null>(
	null,
);

export function MuzaAssistantProvider({ children }: PropsWithChildren) {
	const [isOpen, setIsOpen] = useState(false);
	const value = useMemo(() => ({ isOpen, setIsOpen }), [isOpen]);

	return (
		<MuzaAssistantContext.Provider value={value}>
			{children}
		</MuzaAssistantContext.Provider>
	);
}

export function useMuzaAssistantContext() {
	const context = useContext(MuzaAssistantContext);
	if (!context) {
		throw new Error(
			"useMuzaAssistantContext must be used within MuzaAssistantProvider",
		);
	}

	return context;
}
