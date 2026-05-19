import { Bot } from "lucide-react";
import {
	type ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { getLanguageName, toLanguage } from "@/i18n/languages";
import { CHILD_AGE_CHANGED_EVENT, getChildAge } from "@/lib/child-age-storage";
import { LANGUAGE_CHANGED_EVENT } from "@/lib/language-storage";
import {
	Dialog,
	DialogSideContent,
	DialogTitle,
	DialogTrigger,
} from "@/ui/dialog";
import { cn } from "@/utils/twMerge";
import { streamMuzaMessage } from "./api";
import { useMuzaAssistantContext } from "./context";
import { Conversation } from "./conversation";
import { getMuzaCopy } from "./copy";
import {
	Message,
	MessageActions,
	MessageContent,
	MessageCopyAction,
	MessageResponse,
} from "./message";
import { MuzaBadge } from "./muza-badge";
import { Persona } from "./persona";
import { PromptInput } from "./prompt-input";
import {
	clearMuzaMessages,
	createMuzaMessage,
	getMuzaStorageKey,
	MUZA_CHANNEL_NAME,
	readMuzaMessages,
	saveMuzaMessages,
} from "./storage";
import type { MuzaMessage, MuzaPersonaState } from "./types";

interface MuzaAssistantProps {
	endpoint?: string;
	trigger?: ReactNode;
}

type MuzaSyncMessage =
	| { storageKey: string; type: "request_state" }
	| {
			isPartialResponse: boolean;
			isStreamLoading: boolean;
			messages: MuzaMessage[];
			storageKey: string;
			type: "state";
	  };

export default function MuzaAssistant({
	endpoint,
	trigger,
}: MuzaAssistantProps) {
	const { i18n } = useTranslation();
	const language = toLanguage(i18n.resolvedLanguage ?? i18n.language);
	const copy = getMuzaCopy(language);
	const [isOpen, setIsOpen] = useState(false);
	const { setIsOpen: setIsAssistantOpen } = useMuzaAssistantContext();

	const handleOpenChange = useCallback(
		(nextOpen: boolean) => {
			setIsOpen(nextOpen);
			setIsAssistantOpen(nextOpen);
		},
		[setIsAssistantOpen],
	);

	useEffect(() => {
		return () => {
			if (isOpen) setIsAssistantOpen(false);
		};
	}, [isOpen, setIsAssistantOpen]);

	return (
		<Dialog onOpenChange={handleOpenChange} open={isOpen}>
			{trigger ? (
				<DialogTrigger asChild>{trigger}</DialogTrigger>
			) : (
				<DialogTrigger asChild>
					<MuzaBadge
						betaLabel={copy.beta}
						className="fixed right-4 bottom-4 z-40 sm:right-6 sm:bottom-6"
						title={copy.title}
					/>
				</DialogTrigger>
			)}
			<DialogSideContent className="w-[min(32rem,calc(100vw-1rem))] gap-0 overflow-hidden p-0">
				<DialogTitle className="sr-only">{copy.title}</DialogTitle>
				<MuzaPage endpoint={endpoint} />
			</DialogSideContent>
		</Dialog>
	);
}

export function MuzaPage({ endpoint }: { endpoint?: string }) {
	const { i18n } = useTranslation();
	const language = toLanguage(i18n.resolvedLanguage ?? i18n.language);
	const copy = getMuzaCopy(language);
	const [age, setAge] = useState(() => getChildAge());
	const [prompt, setPrompt] = useState("");
	const [messages, setMessages] = useState<MuzaMessage[]>([]);
	const [isStreamLoading, setIsStreamLoading] = useState(false);
	const [isClearLoading, setIsClearLoading] = useState(false);
	const [isPartialResponse, setIsPartialResponse] = useState(false);
	const [isSyncReady, setIsSyncReady] = useState(false);
	const abortRef = useRef<AbortController>(new AbortController());
	const channelRef = useRef<BroadcastChannel | null>(null);
	const skipNextBroadcastRef = useRef(false);
	const isHydratingStorageRef = useRef(true);
	const currentStateRef = useRef({
		isPartialResponse,
		isStreamLoading,
		messages,
		storageKey: "",
	});

	const storageKey = useMemo(
		() => getMuzaStorageKey({ age, language }),
		[age, language],
	);
	const latestAssistantMessage = useMemo(() => {
		for (let index = messages.length - 1; index >= 0; index -= 1) {
			const message = messages[index];
			if (message?.role === "assistant") return message;
		}

		return undefined;
	}, [messages]);
	const personaState: MuzaPersonaState = getPersonaState(
		isStreamLoading,
		latestAssistantMessage,
	);
	const personaStatus =
		personaState === "thinking"
			? copy.thinking
			: personaState === "writing"
				? copy.writing
				: copy.ready;

	useEffect(() => {
		currentStateRef.current = {
			isPartialResponse,
			isStreamLoading,
			messages,
			storageKey,
		};
	}, [isPartialResponse, isStreamLoading, messages, storageKey]);

	useEffect(() => {
		const syncPreferences = () => {
			setAge(getChildAge());
		};

		window.addEventListener(CHILD_AGE_CHANGED_EVENT, syncPreferences);
		window.addEventListener(LANGUAGE_CHANGED_EVENT, syncPreferences);
		window.addEventListener("storage", syncPreferences);

		return () => {
			window.removeEventListener(CHILD_AGE_CHANGED_EVENT, syncPreferences);
			window.removeEventListener(LANGUAGE_CHANGED_EVENT, syncPreferences);
			window.removeEventListener("storage", syncPreferences);
		};
	}, []);

	useEffect(() => {
		isHydratingStorageRef.current = true;
		setMessages(readMuzaMessages(storageKey));
		setIsPartialResponse(false);
		abortRef.current.abort();
		abortRef.current = new AbortController();
	}, [storageKey]);

	useEffect(() => {
		if (isHydratingStorageRef.current) {
			isHydratingStorageRef.current = false;
			return;
		}

		saveMuzaMessages(storageKey, messages);
	}, [messages, storageKey]);

	useEffect(() => {
		if (typeof BroadcastChannel === "undefined") {
			setIsSyncReady(true);
			return;
		}

		const channel = new BroadcastChannel(MUZA_CHANNEL_NAME);
		channelRef.current = channel;

		const timeout = window.setTimeout(() => setIsSyncReady(true), 150);

		channel.onmessage = ({ data }: MessageEvent<MuzaSyncMessage>) => {
			if (data.storageKey !== storageKey) return;

			if (data.type === "request_state") {
				const currentState = currentStateRef.current;
				channel.postMessage({
					isPartialResponse: currentState.isPartialResponse,
					isStreamLoading: currentState.isStreamLoading,
					messages: currentState.messages,
					storageKey: currentState.storageKey,
					type: "state",
				} satisfies MuzaSyncMessage);
				return;
			}

			window.clearTimeout(timeout);
			skipNextBroadcastRef.current = true;
			setIsPartialResponse(data.isPartialResponse);
			setIsStreamLoading(data.isStreamLoading);
			setMessages(data.messages);
			setIsSyncReady(true);
		};

		channel.postMessage({
			storageKey,
			type: "request_state",
		} satisfies MuzaSyncMessage);

		return () => {
			window.clearTimeout(timeout);
			channel.close();
			channelRef.current = null;
		};
	}, [storageKey]);

	useEffect(() => {
		if (!isSyncReady) return;
		if (skipNextBroadcastRef.current) {
			skipNextBroadcastRef.current = false;
			return;
		}

		channelRef.current?.postMessage({
			isPartialResponse,
			isStreamLoading,
			messages,
			storageKey,
			type: "state",
		} satisfies MuzaSyncMessage);
	}, [isPartialResponse, isStreamLoading, isSyncReady, messages, storageKey]);

	const clearHistory = useCallback(() => {
		setIsClearLoading(true);
		abortRef.current.abort();
		abortRef.current = new AbortController();
		clearMuzaMessages(storageKey);
		setPrompt("");
		setMessages([]);
		setIsPartialResponse(false);
		setIsStreamLoading(false);
		setIsClearLoading(false);
		toast.success(copy.clearSuccess);
	}, [copy.clearSuccess, storageKey]);

	const submitPrompt = useCallback(() => {
		const trimmedPrompt = prompt.trim();
		if (!trimmedPrompt || isStreamLoading) return;

		const userMessage = createMuzaMessage("user", trimmedPrompt);
		const assistantMessage = createMuzaMessage("assistant", "");
		const nextMessages = [...messages, userMessage, assistantMessage];
		let receivedAnyChunk = false;

		setPrompt("");
		setMessages(nextMessages);
		setIsStreamLoading(true);
		setIsPartialResponse(false);
		abortRef.current.abort();
		abortRef.current = new AbortController();
		const signal = abortRef.current.signal;

		void streamMuzaMessage({
			age,
			endpoint,
			language,
			messages: [...messages, userMessage],
			onChunk: (chunk) => {
				if (!chunk) return;

				receivedAnyChunk = true;
				setMessages((currentMessages) =>
					currentMessages.map((message) =>
						message.id === assistantMessage.id
							? { ...message, content: message.content + chunk }
							: message,
					),
				);
			},
			signal,
		})
			.then(() => {
				setIsStreamLoading(false);
				setIsPartialResponse(false);
			})
			.catch((error: unknown) => {
				setIsStreamLoading(false);

				if (signal.aborted) {
					setIsPartialResponse(receivedAnyChunk);
					return;
				}

				const message = error instanceof Error ? error.message : copy.error;

				if (receivedAnyChunk) {
					setIsPartialResponse(true);
					toast.warning(copy.partial);
					return;
				}

				setMessages((currentMessages) =>
					currentMessages.map((currentMessage) =>
						currentMessage.id === assistantMessage.id
							? { ...currentMessage, content: `${copy.error}\n\n${message}` }
							: currentMessage,
					),
				);
				toast.error(message);
			});
	}, [
		age,
		copy.error,
		copy.partial,
		endpoint,
		isStreamLoading,
		language,
		messages,
		prompt,
	]);

	return (
		<div className="flex h-dvh min-h-0 flex-col bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-100">
			<header className="border-zinc-200 border-b bg-white px-4 py-4 pr-12 dark:border-zinc-800 dark:bg-zinc-950">
				<div className="flex items-center gap-3">
					<div className="flex size-10 items-center justify-center rounded-full bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-200">
						<Bot className="size-5" />
					</div>
					<div className="min-w-0">
						<div className="truncate font-semibold text-base">{copy.title}</div>
						<div className="truncate text-sm text-zinc-500 dark:text-zinc-400">
							{copy.subtitle} · {getLanguageName(language)} · {age}
						</div>
					</div>
				</div>
			</header>

			{messages.length ? (
				<Conversation>
					{messages.map((message) => {
						const isAssistant = message.role === "assistant";
						const isLatestAssistant = message.id === latestAssistantMessage?.id;
						const isStreamingLatest =
							isAssistant && isLatestAssistant && isStreamLoading;

						return (
							<Message from={message.role} key={message.id}>
								<MessageContent
									className={cn(
										isStreamingLatest &&
											!message.content.trim() &&
											"min-h-11 min-w-28 animate-pulse",
									)}
								>
									{message.content.trim() ? (
										<>
											<MessageResponse>{message.content}</MessageResponse>
											{isAssistant && !isStreamingLatest && (
												<MessageActions>
													<MessageCopyAction
														content={message.content}
														label={copy.copy}
														successMessage={copy.copySuccess}
													/>
												</MessageActions>
											)}
										</>
									) : (
										<span className="text-zinc-400">{copy.waiting}</span>
									)}
								</MessageContent>
							</Message>
						);
					})}
					{isPartialResponse && (
						<Message from="assistant">
							<MessageContent className="border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100">
								{copy.partial}
							</MessageContent>
						</Message>
					)}
				</Conversation>
			) : (
				<div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
					<Persona className="size-28" state={personaState} />
					<div>
						<div className="font-semibold text-2xl text-zinc-950 dark:text-zinc-100">
							{copy.greeting}
						</div>
						<div className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
							{copy.placeholder}
						</div>
					</div>
				</div>
			)}

			<PromptInput
				canClear={messages.length > 0}
				clearCancelLabel={copy.clearCancel}
				clearConfirmLabel={copy.clearConfirm}
				clearLabel={copy.clear}
				clearPrompt={copy.clearPrompt}
				isClearLoading={isClearLoading}
				isStreamLoading={isStreamLoading}
				onChange={setPrompt}
				onClear={clearHistory}
				onSubmit={submitPrompt}
				personaState={personaState}
				placeholder={copy.placeholder}
				sendLabel={copy.send}
				status={personaStatus}
				title={copy.title}
				value={prompt}
			/>
		</div>
	);
}

function getPersonaState(
	isStreamLoading: boolean,
	latestAssistantMessage?: MuzaMessage,
): MuzaPersonaState {
	if (!isStreamLoading) return "idle";

	return latestAssistantMessage?.content.trim() ? "writing" : "thinking";
}
