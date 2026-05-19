import {
  ConfirmPopoverRoot as ConfirmPopover,
  ConfirmPopoverActions,
  ConfirmPopoverCancel,
  ConfirmPopoverConfirm,
  ConfirmPopoverContent,
  ConfirmPopoverMessage,
  ConfirmPopoverTrigger,
} from '@components/ui/confirm-popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '@components/ui/tooltip';
import { LoaderCircle, Trash } from 'lucide-react';
import { cn } from '@/src/utils';

/**
 * Creates a Button and dialog for cleaing Leon chat history
 */
export default function ClearDialog({
  isClearLoading,
  disabled,
  onClear,
}: {
  isClearLoading: boolean;
  disabled: boolean;
  onClear: () => void;
}) {
  return (
    <ConfirmPopover isLoading={isClearLoading}>
      <Tooltip>
        <ConfirmPopoverTrigger>
          <TooltipTrigger disabled={disabled} data-testid="clear-button">
            {isClearLoading ? (
              <LoaderCircle className="size-5 animate-spin stroke-sunglo-400 dark:stroke-sunglo-500 black:stroke-sunglo-700" />
            ) : (
              <Trash
                className={cn('size-5 stroke-sunglo-400 dark:stroke-sunglo-500 black:stroke-sunglo-700', {
                  'stroke-sunglo-505/50 dark:stroke-sunglo-505/50 black:stroke-sunglo-560/50': disabled,
                })}
              />
            )}
          </TooltipTrigger>
        </ConfirmPopoverTrigger>
        <TooltipContent>Clear History</TooltipContent>
      </Tooltip>

      <ConfirmPopoverContent side="top" sideOffset={20} data-testid="clear-dialog-content">
        <ConfirmPopoverMessage>Are you sure you want to clear your chat history?</ConfirmPopoverMessage>
        <ConfirmPopoverActions>
          <ConfirmPopoverConfirm intent="danger" onConfirm={onClear}>
            Yes
          </ConfirmPopoverConfirm>
          <ConfirmPopoverCancel />
        </ConfirmPopoverActions>
      </ConfirmPopoverContent>
    </ConfirmPopover>
  );
}
