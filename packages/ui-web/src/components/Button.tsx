import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { cn } from '../utils/cn';

type Variant = 'primary' | 'dark' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  /** Use `dark` ghost on void backgrounds. */
  dark?: boolean;
  /** Custom trailing icon. Defaults to a right arrow. Pass `null` to omit. */
  trailingIcon?: ReactNode | null;
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-[14px] py-[8px] text-[13px]',
  md: 'px-[18px] py-[12px] text-[14px]',
  lg: 'px-[24px] py-[16px] text-[15px]',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  dark = false,
  trailingIcon,
  className,
  type = 'button',
  ...rest
}: ButtonProps) {
  const base = cn(
    'inline-flex items-center gap-2 rounded-full font-display font-medium',
    'tracking-tight transition-[transform,box-shadow] duration-150 ease-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
    'disabled:cursor-not-allowed disabled:opacity-60',
    sizeClasses[size],
  );

  const variantClasses: Record<Variant, string> = {
    primary: cn(
      'bg-ember-cta text-[#FFF8F0] shadow-cta',
      'hover:scale-[1.02] active:scale-[0.99]',
    ),
    dark: cn('bg-ink text-cream hover:opacity-90'),
    ghost: cn(
      'bg-transparent border',
      dark ? 'border-hairline-dark text-cream' : 'border-hairline text-ink',
      'hover:bg-[rgba(248,244,238,0.04)]',
    ),
  };

  const icon =
    trailingIcon === null
      ? null
      : (trailingIcon ?? <span className="ml-0.5">→</span>);

  return (
    <button type={type} className={cn(base, variantClasses[variant], className)} {...rest}>
      {children}
      {icon}
    </button>
  );
}
