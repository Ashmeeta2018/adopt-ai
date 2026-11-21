import { cn } from '@adopt-ai/ui-web';

import { formatDate } from '@/lib/blog';

interface PostMetaProps {
  date: string;
  category: string;
  readMinutes: number;
  /** Additional class names for the wrapper. */
  className?: string;
}

export function PostMeta({ date, category, readMinutes, className }: PostMetaProps) {
  return (
    <div
      className={cn('text-eyebrow text-accent font-mono uppercase tracking-[0.18em]', className)}
    >
      {formatDate(date)} · {category} · {readMinutes} min
    </div>
  );
}
