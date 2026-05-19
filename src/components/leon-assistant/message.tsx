import { Button } from '@components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@components/ui/tooltip';
import { code } from '@streamdown/code';
import type { ComponentProps, HTMLAttributes } from 'react';
import { memo } from 'react';
import { Streamdown } from 'streamdown';
import { cn } from '@/src/utils';

export type MessageRole = 'user' | 'assistant';

export type MessageProps = HTMLAttributes<HTMLDivElement> & {
  from: MessageRole;
};

export const Message = ({ className, from, ...props }: MessageProps) => {
  return (
    <div
      className={cn(
        'group flex w-full max-w-[95%] flex-col gap-2',
        from === 'user' ? 'is-user ml-auto justify-end' : 'is-assistant',
        className,
      )}
      {...props}
    />
  );
};

export type MessageContentProps = HTMLAttributes<HTMLDivElement>;

export const MessageContent = ({ children, className, ...props }: MessageContentProps) => {
  return (
    <div
      className={cn(
        'flex w-fit max-w-full min-w-0 flex-col gap-2 overflow-hidden rounded-lg text-sm',
        'group-[.is-user]:ml-auto group-[.is-user]:bg-mono-200 group-[.is-user]:px-2 group-[.is-user]:py-1.5 group-[.is-user]:text-text-primary dark:group-[.is-user]:bg-shark-600 black:group-[.is-user]:bg-mono-650',
        'group-[.is-assistant]:bg-mono-150 group-[.is-assistant]:p-3 group-[.is-assistant]:text-text-primary group-[.is-assistant]:shadow-sm group-[.is-assistant]:shadow-mono-250 dark:group-[.is-assistant]:bg-shark-900 dark:group-[.is-assistant]:shadow-shark-950 black:group-[.is-assistant]:bg-mono-850 black:group-[.is-assistant]:shadow-mono-950',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export type MessageActionsProps = ComponentProps<'div'>;

export const MessageActions = ({ className, children, ...props }: MessageActionsProps) => {
  return (
    <div className={cn('flex items-center gap-1 p-1', className)} {...props}>
      {children}
    </div>
  );
};

export type MessageActionProps = ComponentProps<typeof Button> & {
  tooltip?: string;
  label?: string;
};

export const MessageAction = ({
  tooltip,
  children,
  label,
  className,
  variant = 'surface',
  size = 'sm',
  ...props
}: MessageActionProps) => {
  const button = (
    <Button
      size={size}
      type="button"
      variant={variant}
      className={cn(
        'size-8 bg-transparent p-1.5 text-mono-500 dark:text-shark-100 black:text-mono-300 hover:bg-mono-150 dark:hover:bg-shark-950 black:hover:bg-mono-800 hover:text-mono-950 dark:hover:text-shark-10 black:hover:text-mono-200',
        className,
      )}
      {...props}
    >
      {children}
      <span className="sr-only">{label || tooltip}</span>
    </Button>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
};

export type MessageResponseProps = ComponentProps<typeof Streamdown>;

export const MessageResponse = memo(
  ({ className, ...props }: MessageResponseProps) => {
    return (
      <Streamdown
        plugins={{
          code,
        }}
        className={cn(
          'size-full [&_pre]:m-0 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0',
          '**:data-[streamdown=code-block]:border-mono-200 dark:**:data-[streamdown=code-block]:border-shark-muted-700 black:**:data-[streamdown=code-block]:border-mono-700 **:data-[streamdown=code-block-body]:border-mono-200 dark:**:data-[streamdown=code-block-body]:border-shark-muted-700 black:**:data-[streamdown=code-block-body]:border-mono-700 **:data-[streamdown=code-block-body]:bg-transparent!',
          '[&_[data-streamdown=code-block-body]_code]:rounded-none! [&_[data-streamdown=code-block-body]_code]:bg-transparent! [&_[data-streamdown=code-block-body]_code]:p-0! [&_[data-streamdown=code-block-body]_code]:break-normal!',
          'dark:[&_[data-streamdown=code-block-body]_span[style*="--shiki-dark"]]:text-(--shiki-dark)! black:[&_[data-streamdown=code-block-body]_span[style*="--shiki-dark"]]:text-(--shiki-dark)!',
          className,
        )}
        {...props}
      />
    );
  },
  (prevProps, nextProps) => {
    return prevProps.children === nextProps.children;
  },
);

MessageResponse.displayName = 'MessageResponse';
