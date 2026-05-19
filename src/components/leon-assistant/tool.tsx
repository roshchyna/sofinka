import { Badge } from '@components/ui/badge';
import CodeViewer from '@components/ui/code-viewer';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@components/ui/collapsible';
import { CheckCircleIcon, ChevronDownIcon, ClockIcon, WrenchIcon, XCircleIcon } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { isValidElement } from 'react';
import { cn } from '@/src/utils';

const STATUS_META = {
  running: { label: 'Running', icon: <ClockIcon className="size-4 animate-pulse" /> },
  completed: {
    label: 'Completed',
    icon: <CheckCircleIcon className="size-4 text-sage-510 dark:text-sage-505 black:text-sage-550" />,
  },
  error: {
    label: 'Error',
    icon: <XCircleIcon className="size-4 text-sunglo-505 dark:text-sunglo-505 black:text-sunglo-560" />,
  },
} satisfies Record<string, { label: string; icon: ReactNode }>;

export type ToolUIState = keyof typeof STATUS_META;

export type ToolProps = ComponentProps<typeof Collapsible>;

export const Tool = ({ className, ...props }: ToolProps) => {
  return (
    <Collapsible
      className={cn(
        'not-prose mb-1 w-full rounded-md border border-border-normal bg-mono-150 dark:bg-shark-950 black:bg-mono-950',
        className,
      )}
      {...props}
    />
  );
};

export interface ToolHeaderProps extends Omit<ComponentProps<typeof CollapsibleTrigger>, 'type'> {
  title?: string;
  type: string;
  state: ToolUIState;
}

const getStatusBadge = (status: ToolUIState) => {
  const { icon, label } = STATUS_META[status];

  return (
    <Badge className="gap-1.5 rounded-full text-xs">
      {icon}
      {label}
    </Badge>
  );
};

export const ToolHeader = ({ className, title, type, state, ...props }: ToolHeaderProps) => {
  return (
    <CollapsibleTrigger
      className={cn('group flex w-full items-center justify-between gap-4 p-2', className)}
      {...props}
    >
      <div className="flex items-center gap-2">
        <WrenchIcon className="size-4 text-mono-500 dark:text-shark-100 black:text-mono-300" />
        <span className="text-sm font-medium">{title ?? type.split('-').slice(1).join('-')}</span>
        {getStatusBadge(state)}
      </div>
      <ChevronDownIcon className="size-4 text-mono-500 dark:text-shark-100 black:text-mono-300 transition-transform group-data-[state=open]:rotate-180" />
    </CollapsibleTrigger>
  );
};

export type ToolContentProps = ComponentProps<typeof CollapsibleContent>;

export const ToolContent = ({ className, ...props }: ToolContentProps) => {
  return (
    <CollapsibleContent
      className={cn(
        'text-mono-950 dark:text-shark-10 black:text-mono-200 outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:animate-in data-[state=open]:slide-in-from-top-2',
        className,
      )}
      {...props}
    />
  );
};

export type ToolInputProps = ComponentProps<'div'> & {
  input: unknown;
};

export const ToolInput = ({ className, input, ...props }: ToolInputProps) => {
  return (
    <div className={cn('space-y-2 overflow-hidden p-4', className)} {...props}>
      <h4 className="text-xs font-medium tracking-wide text-mono-450 dark:text-shark-muted-350 black:text-mono-400 uppercase">
        Parameters
      </h4>
      <div className="rounded-md bg-mono-150 dark:bg-shark-950 black:bg-mono-800 text-xs">
        <CodeViewer value={JSON.stringify(input, null, 2)} />
      </div>
    </div>
  );
};

export type ToolOutputProps = ComponentProps<'div'> & {
  output: unknown;
  errorText?: string | null;
};

export const ToolOutput = ({ className, output, errorText, ...props }: ToolOutputProps) => {
  if (!(output || errorText)) {
    return null;
  }

  let Output = <div>{output as ReactNode}</div>;

  if (typeof output === 'object' && !isValidElement(output)) {
    Output = <CodeViewer value={JSON.stringify(output, null, 2)} />;
  } else if (typeof output === 'string') {
    Output = <CodeViewer value={output} />;
  }

  return (
    <div className={cn('space-y-2 p-4', className)} {...props}>
      <h4 className="text-xs font-medium tracking-wide text-mono-450 dark:text-shark-muted-350 black:text-mono-400 uppercase">
        {errorText ? 'Error' : 'Result'}
      </h4>
      <div
        className={cn(
          'overflow-x-auto rounded-md text-xs [&_table]:w-full',
          errorText
            ? 'bg-sunglo-505/10 dark:bg-sunglo-505/10 black:bg-sunglo-560/10 text-sunglo-505 dark:text-sunglo-505 black:text-sunglo-560'
            : 'bg-mono-150 dark:bg-shark-950 black:bg-mono-800 text-mono-950 dark:text-shark-10 black:text-mono-200',
        )}
      >
        {errorText && <div>{errorText}</div>}
        {Output}
      </div>
    </div>
  );
};
