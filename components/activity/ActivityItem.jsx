'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  EVENT_META,
  SEVERITY_STYLES,
  formatRelative,
  formatCurrency,
} from '@/lib/activity';

export default function ActivityItem({ event, isLast }) {
  const meta = EVENT_META[event.type];
  const sev = SEVERITY_STYLES[event.severity];
  const Icon = meta.icon;

  const Wrapper = event.link ? Link : 'div';
  const wrapperProps = event.link ? { href: event.link } : {};

  return (
    <li className="relative pl-10 sm:pl-12">
      {!isLast && (
        <span
          className="absolute left-4 sm:left-5 top-10 bottom-0 w-px bg-gray-200"
          aria-hidden
        />
      )}

      <span
        className={cn(
          'absolute left-0 top-1 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ring-4 ring-white',
          meta.bg
        )}
      >
        <Icon size={16} className={meta.color} />
      </span>

      <Wrapper
        {...wrapperProps}
        className={cn(
          'block group rounded-xl border border-gray-100 bg-white p-3 sm:p-4 transition-all',
          event.link && 'hover:border-brand/40 hover:shadow-sm cursor-pointer'
        )}
      >
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-semibold text-gray-800">{event.title}</p>
              <span
                className={cn(
                  'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium',
                  sev.badge
                )}
              >
                <span className={cn('w-1.5 h-1.5 rounded-full', sev.dot)} />
                {sev.label}
              </span>
              {event.amount != null && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-700">
                  {formatCurrency(event.amount, event.currency)}
                </span>
              )}
            </div>

            {event.description && (
              <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                {event.description}
              </p>
            )}

            <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-400 flex-wrap">
              <span>{meta.label}</span>
              {event.actor?.name && (
                <>
                  <span>·</span>
                  <span>በ {event.actor.name}</span>
                </>
              )}
              {event.target && (
                <>
                  <span>·</span>
                  <span className="truncate">{event.target}</span>
                </>
              )}
              <span>·</span>
              <time dateTime={event.timestamp}>
                {formatRelative(event.timestamp)}
              </time>
            </div>
          </div>

          {event.link && (
            <ChevronRight
              size={16}
              className="text-gray-300 group-hover:text-brand transition flex-shrink-0 mt-0.5"
            />
          )}
        </div>
      </Wrapper>
    </li>
  );
}