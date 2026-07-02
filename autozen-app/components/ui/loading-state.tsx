import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  text?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingState({ text, className, size = 'md' }: LoadingStateProps) {
  const iconSize = size === 'sm' ? 'w-5 h-5' : size === 'lg' ? 'w-10 h-10' : 'w-7 h-7';
  return (
    <div className={cn('flex flex-col items-center justify-center py-16', className)}>
      <Loader2 className={cn('animate-spin text-primary', iconSize)} />
      {text && <p className="text-sm text-muted-foreground mt-3">{text}</p>}
    </div>
  );
}
