import { cn } from '@/lib/utils';

export default function Card({ children, className = '', title, action }) {
  return (
    <div className={cn('card', className)}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          {title && <h3 className="text-lg font-semibold text-gray-800">{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}