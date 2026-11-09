'use client';

import { cn } from '@/lib/utils';

const VARIANTS = {
  default: 'bg-white border border-gray-200 shadow-sm',
  elevated: 'bg-white border border-gray-100 shadow-md',
  outlined: 'bg-white border-2 border-gray-200',
  ghost: 'bg-transparent',
  gradient: 'bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-sm',
};

const PADDINGS = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-6',
  xl: 'p-8',
};

export default function Card({
  children,
  className = '',
  title,
  subtitle,
  action,
  icon: Icon,
  variant = 'default',
  padding = 'md',
  hover = false,
  onClick,
}) {
  const hasHeader = title || subtitle || action || Icon;

  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-xl transition-all duration-200',
        VARIANTS[variant],
        PADDINGS[padding],
        hover && 'hover:shadow-lg hover:-translate-y-0.5 cursor-pointer',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {hasHeader && (
        <div className={cn(
          'flex items-start justify-between gap-3',
          (children) && 'mb-4',
          !children && 'mb-0'
        )}>
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {Icon && (
              <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0">
                <Icon size={20} className="text-brand" />
              </div>
            )}
            {(title || subtitle) && (
              <div className="flex-1 min-w-0">
                {title && (
                  <h3 className="text-base md:text-lg font-semibold text-gray-800 leading-tight">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="text-xs md:text-sm text-gray-500 mt-1">
                    {subtitle}
                  </p>
                )}
              </div>
            )}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}

      {children}
    </div>
  );
}

// Sub-components for better composition
Card.Header = function CardHeader({ children, className = '' }) {
  return <div className={cn('mb-4', className)}>{children}</div>;
};

Card.Body = function CardBody({ children, className = '' }) {
  return <div className={cn('', className)}>{children}</div>;
};

Card.Footer = function CardFooter({ children, className = '' }) {
  return (
    <div className={cn('mt-4 pt-4 border-t border-gray-100', className)}>
      {children}
    </div>
  );
};
