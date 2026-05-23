import { cn } from '../utils/cn';

interface MetricProps {
  value: string | number;
  label: string;
  accent?: boolean;
  dark?: boolean;
}

export function Metric({ value, label, accent = false, dark = false }: MetricProps) {
  return (
    <div>
      <div
        className={cn(
          'font-display font-semibold leading-none tracking-[-0.04em]',
          accent
            ? 'bg-ember bg-clip-text text-transparent'
            : dark
              ? 'text-cream'
              : 'text-ink',
        )}
        style={{ fontSize: 56 }}
      >
        {value}
      </div>
      <div
        className={cn(
          'mt-2.5 font-mono text-eyebrow uppercase tracking-[0.18em]',
          dark ? 'text-cream/55' : 'text-ink/55',
        )}
      >
        {label}
      </div>
    </div>
  );
}
