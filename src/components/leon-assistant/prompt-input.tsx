import { FormControl, FormField, FormItem, FormMessage } from '@components/ui/form';
import { Textarea } from '@components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@components/ui/tooltip';
import { SendHorizontal } from 'lucide-react';
import { type ComponentProps, createContext, type HTMLAttributes, type ReactNode, useContext, useMemo } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { cn } from '@/src/utils';
import ClearDialog from './clear-dialog';

export type PromptFormValues = { prompt: string };

export interface PromptInputContextValue {
  onClear: () => void;
  hasMessages: boolean;
  canSubmit: boolean;
  isAnyLoading: boolean;
  isGetLoading: boolean;
  isStreamLoading: boolean;
  isClearLoading: boolean;
}

const PromptInputContext = createContext<PromptInputContextValue | null>(null);

export const usePromptInput = () => {
  const ctx = useContext(PromptInputContext);
  if (!ctx) {
    throw new Error('usePromptInput must be used within <PromptInput>');
  }
  return ctx;
};

export type PromptInputProps = Omit<HTMLAttributes<HTMLDivElement>, 'onSubmit'> & {
  methods: UseFormReturn<PromptFormValues>;
  onClear: () => void;
  hasMessages: boolean;
  isGetLoading: boolean;
  isStreamLoading: boolean;
  isClearLoading: boolean;
  children: ReactNode;
};

export const PromptInput = ({
  methods,
  onClear,
  hasMessages,
  isGetLoading,
  isStreamLoading,
  isClearLoading,
  children,
  className,
  ...divProps
}: PromptInputProps) => {
  const promptValue = methods.watch('prompt');
  const canSubmit = !!promptValue?.trim();

  const isAnyLoading = isGetLoading || isStreamLoading || isClearLoading;

  const ctx = useMemo<PromptInputContextValue>(() => {
    return {
      onClear,
      hasMessages,
      canSubmit,
      isAnyLoading,
      isGetLoading,
      isStreamLoading,
      isClearLoading,
    };
  }, [onClear, hasMessages, canSubmit, isAnyLoading, isGetLoading, isStreamLoading, isClearLoading]);

  return (
    <PromptInputContext.Provider value={ctx}>
      <div className={cn('mx-auto w-full rounded-xl transition-shadow duration-200', className)} {...divProps}>
        {children}
      </div>
    </PromptInputContext.Provider>
  );
};

export type PromptInputBodyProps = HTMLAttributes<HTMLDivElement>;
export const PromptInputBody = ({ className, ...props }: PromptInputBodyProps) => {
  return <div className={cn('contents', className)} {...props} />;
};

export type PromptInputFooterProps = HTMLAttributes<HTMLDivElement>;
export const PromptInputFooter = ({ className, ...props }: PromptInputFooterProps) => {
  return <div className={cn('mt-1 flex items-center justify-between gap-2', className)} {...props} />;
};

export type PromptInputActionsProps = HTMLAttributes<HTMLDivElement>;
export const PromptInputActions = ({ className, ...props }: PromptInputActionsProps) => {
  return <div className={cn('flex items-center gap-3', className)} {...props} />;
};

export type PromptInputTextareaProps = Omit<ComponentProps<typeof Textarea>, 'name'> & {
  rows?: number;
};

export const PromptInputTextarea = ({
  rows = 2,
  placeholder = 'How can I help you today?',
  className,
  ...rest
}: PromptInputTextareaProps) => {
  const { isAnyLoading } = usePromptInput();

  return (
    <FormField
      name="prompt"
      render={({ field }) => {
        return (
          <FormItem className="w-full">
            <FormControl>
              <Textarea
                rows={rows}
                submitOnEnter={!isAnyLoading}
                placeholder={placeholder}
                className={cn(
                  'min-h-10 w-full resize-none border-0 !bg-transparent p-0 shadow-none outline-none focus-visible:border-0 focus-visible:ring-0 focus-visible:outline-none',
                  className,
                )}
                {...field}
                {...rest}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export const PromptInputClear = () => {
  const { hasMessages, isClearLoading, isAnyLoading, onClear } = usePromptInput();
  if (!hasMessages) {
    return null;
  }
  return <ClearDialog isClearLoading={isClearLoading} disabled={isAnyLoading} onClear={onClear} />;
};

export type PromptInputSubmitProps = ComponentProps<'button'>;

export const PromptInputSubmit = ({ className, ...props }: PromptInputSubmitProps) => {
  const { canSubmit, isAnyLoading, isGetLoading, isStreamLoading } = usePromptInput();
  const isVisible = canSubmit || isGetLoading || isStreamLoading;

  return (
    <div
      className={cn(
        'flex items-center justify-center transition-opacity duration-200 ease-out',
        isVisible ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
      aria-hidden={!isVisible}
    >
      <Tooltip>
        <TooltipTrigger type="submit" disabled={!canSubmit || isAnyLoading} className={className} {...props}>
          {canSubmit && !isAnyLoading ? <SendHorizontal className="size-5" /> : <div className="w-[17.5px]"> </div>}
        </TooltipTrigger>
        <TooltipContent>Submit</TooltipContent>
      </Tooltip>
    </div>
  );
};
