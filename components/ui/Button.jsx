'use client';

import { cn } from '@/lib/utils';

export default function Button({
  children,
  variant = 'primary',
  className = '',
  loading = false,
  ...props
}) {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
  };
  return (
    <button
      className={cn(variants[variant], className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
      ) : null}
      {children}
    </button>
  );
}