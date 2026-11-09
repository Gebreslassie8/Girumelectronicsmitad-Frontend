'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Input = forwardRef(({ label, error, className, ...props }, ref) => (
  <div>
    {label && <label className="label">{label}</label>}
    <input ref={ref} className={cn('input', error && 'border-red-500', className)} {...props} />
    {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
  </div>
));

Input.displayName = 'Input';
export default Input;