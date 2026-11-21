import { cn } from '../utils/cn';

import type { ReactNode } from 'react';

interface EmberTextProps {
  children: ReactNode;
  className?: string;
  /** Render as a `span` (default) or a `div`. */
  as?: 'span' | 'div';
}

/**
 * Inline span with the ember gradient applied to text.
 * Used on hero headlines, prices, and metric callouts.
 */
export function EmberText({ children, className, as = 'span' }: EmberTextProps) {
  const Tag = as;
  return <Tag className={cn('bg-ember bg-clip-text text-transparent', className)}>{children}</Tag>;
}
