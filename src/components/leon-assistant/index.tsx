import LoadingSpinner from '@components/common/loading-spinner';
import { useAuthContext } from '@components/contexts/AuthContext';
import { FloatingWindow, FloatingWindowContent, FloatingWindowTrigger } from '@components/ui/floating-window';
import { Form } from '@components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearch } from '@tanstack/react-router';
import { type LeonidasInformStatus, type ResponseTuple, Role } from '@typedefs/api/RespPostLeonidasCommunicate';
import type { ResponseData } from '@typedefs/util';
import { $fetch } from '@utils/fetch-client';
import { CopyIcon } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { cn } from '@/src/utils';
import { Conversation, ConversationContent, ConversationScrollButton } from './conversation';
import { Greeting } from './greeting';
import { LeonBadge } from './leon-badge';
import LeonFeedback from './leon-feedback';
import { Message, MessageAction, MessageActions, MessageContent, MessageResponse } from './message';
import { Persona, type PersonaState } from './persona';
import {
  PromptInput,
  PromptInputActions,
  PromptInputBody,
  PromptInputClear,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from './prompt-input';
import { Tool, ToolContent, ToolHeader, ToolInput, ToolOutput, type ToolUIState } from './tool';

const schema = z.object({
  prompt: z.string().min(1, 'Prompt cannot be empty.'),
});

const getActiveTenantName = () => {
  return sessionStorage.getItem('active_tenant_name') ?? '';
};

type LeonSyncMsg =
  | { type: 'request_state' }
  | {
      type: 'state';
      isStreamLoading: boolean;
      isClearLoading: boolean;
      isPartialResponse: boolean;
      messages: ResponseTuple[];
      tenantName: string;
      userName: string;
    };

const LeonAssistant = () => {
  return (
    <FloatingWindow popupUrl="/leon">
      <FloatingWindowTrigger>
        <LeonBadge />
      </FloatingWindowTrigger>
      <FloatingWindowContent title="LEON AI Assistant">
        <LeonPage />
      </FloatingWindowContent>
    </FloatingWindow>
  );
};

export default LeonAssistant;

export const LeonPage = () => {
  const auth = useAuthContext();
  const currentUserName = auth.whoami.name;
  const locationSearch = useSearch({
    strict: false,
    select: (search) => {
      return search.tenant_name;
    },
  });

  const [isGetLoading, setIsGetLoading] = useState(true);
  const [isStreamLoading, setIsStreamLoading] = useState(false);
  const [isClearLoading, setIsClearLoading] = useState(false);
  const [isPartialResponse, setIsPartialResponse] = useState(false);
  const [messages, setMessages] = useState<ResponseTuple[]>([]);
  const [isSyncReady, setIsSyncReady] = useState(false);
  const [showWorkingOnIt, setShowWorkingOnIt] = useState(false);

  const personaState: PersonaState = getPersonaState(isStreamLoading, messages);
  const personaStatus = getPersonaStatusLabel[personaState];

  const channelRef = useRef<BroadcastChannel | null>(null);
  const skipNextBroadcastRef = useRef(false);
  const hydratedRef = useRef(false);
  const contextKeyRef = useRef('');
  const currentStateRef = useRef({
    isStreamLoading,
    isClearLoading,
    isPartialResponse,
    messages,
    tenantName: getActiveTenantName(),
    userName: currentUserName,
  });
  const abortRef = useRef<AbortController>(new AbortController());

  const methods = useForm<z.infer<typeof schema>>({
    defaultValues: {
      prompt: '',
    },
    resolver: zodResolver(schema),
  });

  // Show "Working on it…" when the user has been waiting for more than 5 seconds with no tools or model content yet visible
  useEffect(() => {
    if (!isStreamLoading) {
      setShowWorkingOnIt(false);
      return;
    }
    const hasModelContent = messages.some(([, msg]) => {
      return msg?.role === Role.MODEL && Boolean(msg.content?.trim());
    });
    const hasToolContent = messages.some(([tool]) => {
      return (tool?.content ?? []).length > 0;
    });

    if (hasModelContent || hasToolContent) {
      setShowWorkingOnIt(false);
      return;
    }
    const timer = window.setTimeout(() => {
      return setShowWorkingOnIt(true);
    }, 5_000);
    return () => {
      return window.clearTimeout(timer);
    };
  }, [isStreamLoading, messages]);

  // Keep currentStateRef relevant for onmessage
  useEffect(() => {
    currentStateRef.current = {
      isStreamLoading,
      isClearLoading,
      isPartialResponse,
      messages,
      tenantName: getActiveTenantName(),
      userName: currentUserName,
    };
  }, [isStreamLoading, isClearLoading, isPartialResponse, messages, currentUserName]);

  // Sync chat state between floating and popup via BroadcastChannel
  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') {
      setIsSyncReady(true);
      return;
    }

    const channel = new BroadcastChannel('leon');
    channelRef.current = channel;

    const timeout = window.setTimeout(() => {
      return setIsSyncReady(true);
    }, 150);

    channel.onmessage = ({ data }: MessageEvent<LeonSyncMsg>) => {
      if (data.type === 'request_state') {
        channel.postMessage({ type: 'state', ...currentStateRef.current } satisfies LeonSyncMsg);
        return;
      }
      if (data.userName !== currentUserName || data.tenantName !== getActiveTenantName()) {
        return;
      }

      window.clearTimeout(timeout);
      skipNextBroadcastRef.current = true;
      hydratedRef.current = true;
      setIsGetLoading(false);
      setIsStreamLoading(data.isStreamLoading);
      setIsClearLoading(data.isClearLoading);
      setIsPartialResponse(data.isPartialResponse);
      setMessages(data.messages);
      setIsSyncReady(true);
    };

    channel.postMessage({ type: 'request_state' } satisfies LeonSyncMsg);

    return () => {
      window.clearTimeout(timeout);
      channel.close();
      channelRef.current = null;
    };
  }, [currentUserName]);

  // Broadcast when state changes
  useEffect(() => {
    if (!isSyncReady) {
      return;
    }
    if (skipNextBroadcastRef.current) {
      skipNextBroadcastRef.current = false;
      return;
    }
    channelRef.current?.postMessage({
      type: 'state',
      isStreamLoading,
      isClearLoading,
      isPartialResponse,
      messages,
      tenantName: getActiveTenantName(),
      userName: currentUserName,
    } satisfies LeonSyncMsg);
  }, [isSyncReady, isStreamLoading, isClearLoading, isPartialResponse, messages, currentUserName]);

  // Refetch when tenant or user changed
  useEffect(() => {
    const refetch = (tenant: string) => {
      if (tenant) {
        sessionStorage.setItem('active_tenant_name', tenant);
      }
      const nextKey = `${currentUserName}:${tenant}`;
      if (!contextKeyRef.current) {
        contextKeyRef.current = nextKey;
        return;
      }
      if (nextKey === contextKeyRef.current) {
        return;
      }
      contextKeyRef.current = nextKey;
      hydratedRef.current = false;

      // abort previous request
      abortRef.current?.abort();
      abortRef.current = new AbortController();
      setIsStreamLoading(false);
      setIsPartialResponse(false);
      setMessages([]);
      setIsGetLoading(true);
      void getChat({
        signal: abortRef.current.signal,
        onComplete: (response) => {
          setMessages(
            response.entries.map((message) => {
              return [null, message] as ResponseTuple;
            }),
          );
          setIsGetLoading(false);
        },
        onError: () => {
          setMessages([]);
          setIsGetLoading(false);
        },
      });
    };

    refetch(locationSearch || getActiveTenantName());

    const onStorage = ({ key, newValue }: StorageEvent) => {
      if (key === 'last_active_tenant_name' && newValue) {
        refetch(newValue);
      }
    };

    addEventListener('storage', onStorage);
    return () => {
      return removeEventListener('storage', onStorage);
    };
  }, [currentUserName, locationSearch]);

  // On mount, fetch chat history
  useEffect(() => {
    if (!isSyncReady) {
      return;
    }
    if (hydratedRef.current) {
      return;
    }
    setIsGetLoading(true);
    void getChat({
      signal: abortRef.current.signal,
      onComplete: (response) => {
        setMessages(
          response.entries.map((message) => {
            return [null, message] as ResponseTuple;
          }),
        );
        setIsGetLoading(false);
      },
      onError: () => {
        setIsGetLoading(false);
        setMessages([]);
      },
    });
  }, [isSyncReady]);

  /**
   * Submit handler for form
   */
  const onSubmit = useCallback(
    (data: z.infer<typeof schema>) => {
      if (!data.prompt) {
        return;
      }
      setIsStreamLoading(true);
      setIsPartialResponse(false);
      abortRef.current.abort();
      abortRef.current = new AbortController();
      const signal = abortRef.current?.signal;
      void streamChat(data.prompt, {
        onChunk: (responseText) => {
          if (signal?.aborted) {
            return;
          }
          const tuples = processResponse(responseText);
          setMessages((prev) => {
            let next = [...prev];
            for (const tuple of tuples) {
              const [, message] = tuple;
              if (message?.role === Role.USER) {
                next.push(tuple);
              } else {
                const last = next[next.length - 1];
                if (last && last[1]?.role === Role.USER) {
                  next.push(tuple);
                } else {
                  next = [...next.slice(0, -1), tuple];
                }
              }
            }
            return next;
          });
        },
        onComplete: (isPartial) => {
          if (signal?.aborted) {
            return;
          }
          setIsStreamLoading(false);
          setIsPartialResponse(isPartial);
          if (isPartial) {
            return;
          }
          void getChat({
            signal,
            onComplete: (response) => {
              setMessages((prev) => {
                return response.entries.map((fetchedMsg, idx) => {
                  const [existingTool] = prev[idx] ?? [null];
                  return [existingTool, fetchedMsg] as ResponseTuple;
                });
              });
            },
            onError: (e) => {
              throw e;
            },
          });
        },
        onError: (error) => {
          if (signal?.aborted) {
            return;
          }
          setIsStreamLoading(false);
          setIsPartialResponse(false);
          toast.error(error.message);
        },
        signal,
      });
      // Clear user prompt
      methods.reset({}, { keepDefaultValues: true });
    },
    [methods], // Remove 'messages' from dependencies
  );

  /**
   * handler for Clear History button
   */
  const onClear = useCallback(() => {
    setIsClearLoading(true);
    void deleteChat({
      onComplete: () => {
        methods.reset({}, { keepDefaultValues: true });
        setIsClearLoading(false);
        setIsPartialResponse(false);
        setMessages([]);
      },
      onError: () => {
        setIsClearLoading(false);
      },
    });
  }, [methods]);

  return (
    <div
      className={cn(
        'mx-auto flex h-full w-full flex-1 flex-col bg-linear-to-b from-mono-50 via-mono-150 to-mono-200 p-4 dark:from-shark-800 dark:via-shark-900 dark:to-shark-950 black:from-mono-700 black:via-mono-850 black:to-mono-900',
        { 'min-h-0': messages.length, 'items-center justify-center': !messages.length },
      )}
    >
      {isGetLoading ? (
        <LoadingSpinner fullScreen />
      ) : (
        <>
          {messages.length ? (
            <Conversation className="relative size-full py-4">
              <ConversationContent>
                {messages.map((tuple, idx) => {
                  const [tool, message] = tuple;
                  const toolEntries = tool?.content ?? [];
                  const isAssistantMessage = message?.role !== Role.USER;
                  const isModelMessage = message?.role === Role.MODEL;
                  const isStreamingLatestModelMessage = isModelMessage && isStreamLoading && !message?.id;

                  return (
                    // biome-ignore lint/suspicious/noArrayIndexKey: its possible to have duplicate, repeated messages
                    <Message from={message?.role === Role.USER ? 'user' : 'assistant'} key={idx}>
                      {isAssistantMessage &&
                        toolEntries.map((entry, entryIdx) => {
                          return (
                            <Tool
                              key={`${
                                // biome-ignore lint/suspicious/noArrayIndexKey: its possible to have duplicate, repeated tools
                                idx
                              }-${entryIdx}-${entry.tool}`}
                            >
                              <ToolHeader
                                title={entry.title}
                                type={`tool-${entry.tool}`}
                                state={getToolState(entry.status)}
                              />
                              <ToolContent>
                                <ToolInput input={entry.inputs ?? {}} />
                                <ToolOutput
                                  output={{
                                    about: entry.about,
                                    action: entry.action,
                                    status: entry.status,
                                    group: entry.group,
                                  }}
                                  errorText={entry.status === 'failure' ? entry.about : undefined}
                                />
                              </ToolContent>
                            </Tool>
                          );
                        })}
                      {message && (
                        <MessageContent>
                          <div
                            data-testid="leon-content"
                            className="prose-md prose-brand prose overflow-auto rounded-lg text-wrap"
                          >
                            <MessageResponse>{message.content}</MessageResponse>
                            {isModelMessage && !isStreamingLatestModelMessage && (
                              <MessageActions>
                                <MessageAction
                                  data-testid="copy-to-clipboard"
                                  onClick={() => {
                                    return void navigator.clipboard.writeText(message.content).then(() => {
                                      return toast.success('Copied to clipboard', { duration: 5_000 });
                                    });
                                  }}
                                  tooltip="Copy to clipboard"
                                >
                                  <CopyIcon className="size-4" />
                                </MessageAction>
                                <LeonFeedback id={message.id} />
                              </MessageActions>
                            )}
                          </div>
                        </MessageContent>
                      )}
                    </Message>
                  );
                })}
                {showWorkingOnIt && (
                  <span className="animate-pulse text-xs text-mono-450 dark:text-shark-muted-350 black:text-mono-400">
                    Working on it…
                  </span>
                )}
                {isPartialResponse && (
                  <Message from="assistant">
                    <MessageContent className="bg-transparent p-0 shadow-none">
                      <span className="text-gold-600 dark:text-gold-500 black:text-gold-700">
                        Response may be incomplete
                      </span>
                    </MessageContent>
                  </Message>
                )}
              </ConversationContent>

              <ConversationScrollButton />
            </Conversation>
          ) : (
            <div className="flex flex-col items-center justify-center pb-10 text-center">
              <div className="p-2 text-mono-450 dark:text-shark-muted-350 black:text-mono-400">
                LEON AI Assistant · BETA
              </div>
              <Greeting />
            </div>
          )}

          <div className="mx-auto w-full max-w-226 rounded-xl bg-mono-200 p-4 ring-1 ring-mono-250 transition-all focus-within:ring-indigo-400 dark:bg-shark-800 dark:ring-shark-600 dark:focus-within:ring-indigo-400/50 black:bg-mono-800 black:ring-mono-650 black:focus-within:ring-indigo-500/30">
            <Form {...methods}>
              <form
                onSubmit={(e) => {
                  return void methods.handleSubmit(onSubmit)(e);
                }}
              >
                <PromptInput
                  methods={methods}
                  onClear={onClear}
                  hasMessages={messages.length > 0}
                  isGetLoading={isGetLoading}
                  isStreamLoading={isStreamLoading}
                  isClearLoading={isClearLoading}
                >
                  <PromptInputBody>
                    <PromptInputTextarea />
                  </PromptInputBody>
                  <PromptInputFooter>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                        <Persona state={personaState} className="size-10" />
                        <div className="flex min-w-0 flex-col">
                          <span className="text-sm font-medium text-mono-950/80 dark:text-shark-10/80 black:text-mono-200/80">
                            LEON AI Assistant
                          </span>
                          <span className="text-xs text-mono-450 dark:text-shark-muted-350 black:text-mono-400">
                            {personaStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                    <PromptInputActions className="flex items-center">
                      <PromptInputClear />
                      <PromptInputSubmit />
                    </PromptInputActions>
                  </PromptInputFooter>
                </PromptInput>
              </form>
            </Form>
          </div>
        </>
      )}
    </div>
  );
};

/**
 * Processes a plain-text response containing newline-separated stringified ChatMessages into parsed ChatMessage objects.
 *
 * @param responseText the response content
 * @param limit How many to consider - only use if the response is too large
 * @returns
 */
function processResponse(responseText: string, limit = Number.MAX_SAFE_INTEGER): ResponseTuple[] {
  try {
    const lines = responseText.split('\n');
    const messages: ResponseTuple[] = lines
      .filter((line) => {
        return line.length > 1;
      })
      .map((j) => {
        return JSON.parse(j) as ResponseTuple;
      })
      .slice(-limit);

    return messages;
  } catch (e) {
    console.error('error adding messages', responseText, e);
    return [];
  }
}

const getPersonaState = (isStreamLoading: boolean, messages: ResponseTuple[]): PersonaState => {
  if (!isStreamLoading) {
    return 'idle';
  }

  const [, message] = messages.at(-1) ?? [];
  const hasModelText = message?.role === Role.MODEL && Boolean(message.content?.trim());

  if (hasModelText) {
    return 'writing';
  }

  return 'tools';
};

const getPersonaStatusLabel: Record<PersonaState, string> = {
  tools: 'Running tools...',
  writing: 'Writing response...',
  idle: 'Ready',
};

const getToolState = (status: LeonidasInformStatus): ToolUIState => {
  switch (status) {
    case 'success':
      return 'completed';
    case 'failure':
      return 'error';
    default:
      return 'running';
  }
};

interface DeleteChatOptions {
  onComplete?: (token: ResponseData<'/leonidas/communicate/interact', 'delete'>) => void;
  onError?: (error: Error) => void;
}

/**
 * Makes a DELETE request to delete chat history
 * @param options request callbacks
 */
const deleteChat = async (options: DeleteChatOptions): Promise<void> => {
  const { onComplete, onError } = options;

  try {
    const { data: response, error } = await $fetch.DELETE('/leonidas/communicate/interact', {
      params: {
        query: {
          tenant_name: sessionStorage.getItem('active_tenant_name') ?? '',
        },
      },
    });

    if (error) {
      throw new Error('failed to delete');
    }

    onComplete?.(response);
  } catch (e) {
    console.error(e);
    onError?.(e as Error);
    toast.error((e as Error).message);
  }
};

interface GetChatOptions {
  signal?: AbortSignal;
  onComplete?: (token: ResponseData<'/leonidas/communicate/interact', 'get'>) => void;
  onError?: (error: Error) => void;
}

const getChat = async ({ signal, onComplete, onError }: GetChatOptions): Promise<void> => {
  try {
    const { data: response, error } = await $fetch.GET('/leonidas/communicate/interact', {
      params: {
        query: {
          tenant_name: sessionStorage.getItem('active_tenant_name') ?? '',
        },
      },
      signal,
    });

    if (error) {
      throw new Error('failed to delete');
    }

    onComplete?.(response);
  } catch (e) {
    if (signal?.aborted) {
      return;
    }
    console.error(e);
    onError?.(e as Error);
    toast.error((e as Error).message);
  }
};

interface StreamingChatOptions {
  signal?: AbortSignal;
  onChunk?: (token: string) => void;
  onComplete?: (isPartial: boolean) => void;
  onError?: (error: Error) => void;
}

const streamChat = async (
  prompt: string,
  { signal, onChunk, onComplete, onError }: StreamingChatOptions,
): Promise<void> => {
  try {
    const { data, error } = await $fetch.POST('/leonidas/communicate/interact', {
      params: {
        query: {
          tenant_name: sessionStorage.getItem('active_tenant_name') ?? '',
        },
      },
      body: {
        prompt,
      },
      bodySerializer(body) {
        // The endpoint requires multipart form data
        const fd = new FormData();
        fd.append('prompt', body.prompt);
        return fd;
      },
      parseAs: 'stream',
      signal,
    });

    if (error) {
      console.error(error);
      throw new Error(`Error fetching response`);
    }

    const reader = data?.getReader();
    if (!reader) {
      throw new Error('Response body is null');
    }

    const decoder = new TextDecoder();
    let buffer = '';
    let receivedAnyChunk = false;

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        receivedAnyChunk = true;
        buffer += decoder.decode(value, { stream: true });

        // pass only \n terminated strings to onChunk
        // so that JSON.parse never receives a truncated payload
        const lines = buffer.split('\n');

        // The last fragment remains in the buffer
        buffer = lines.pop() ?? '';

        const completeChunk = lines.join('\n');
        if (completeChunk.length > 0) {
          onChunk?.(completeChunk);
        }
      }

      if (buffer.trim().length > 0) {
        try {
          onChunk?.(buffer);
        } catch {
          console.warn('discarding incomplete trailing chunk, if backend closed connection mid-stream', buffer);
        }
      }

      onComplete?.(false);
    } catch (streamError) {
      if (receivedAnyChunk) {
        console.warn('Stream ended prematurely, showing partial response.', streamError);
        onComplete?.(true);
      } else {
        throw streamError;
      }
    }
  } catch (error) {
    console.error(error);
    onError?.(error as Error);
  }
};
