import { formatDate } from '@/lib/blog';
import { cn } from '@adopt-ai/ui-web';

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
      className={cn(
        'font-mono text-eyebrow uppercase tracking-[0.18em] text-accent',
        className,
      )}
    >
      {formatDate(date)} · {category} · {readMinutes} min
    </div>
  );
}
