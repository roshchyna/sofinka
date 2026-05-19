import { Badge } from '@components/ui/badge';
import DescriptorDisplay from '@components/ui/descriptor-display';
import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/src/utils';

export const LeonBadge = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'relative inline-flex cursor-pointer items-center gap-2 rounded-full px-3 py-1.5 select-none',
        'overflow-hidden border border-shark-400/20',
        'shadow-sm shadow-shark-800/50',
        'transition-[filter] duration-200 hover:brightness-120',
        className,
      )}
      {...props}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2" />
      <DescriptorDisplay
        value={{ label: 'LEON AI Assistant' }}
        className="hidden text-sm font-semibold text-mono-950 md:flex dark:text-shark-10 black:text-mono-200"
      />
      <Badge variant="surface" size="xs" className="text-[10px] font-semibold tracking-wide">
        BETA
      </Badge>
    </div>
  );
});
