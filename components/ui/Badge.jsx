import { cn } from '@/lib/utils';

const COLORS = {
  yellow: 'bg-yellow-100 text-yellow-800',
  blue:   'bg-blue-100 text-blue-800',
  green:  'bg-green-100 text-green-800',
  gray:   'bg-gray-100 text-gray-800',
  red:    'bg-red-100 text-red-800',
};

export default function Badge({ children, color = 'gray' }) {
  return (
    <span className={cn('inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium', COLORS[color])}>
      {children}
    </span>
  );
}