'use client';

import { formatDay } from '@/lib/activity';
import ActivityItem from './ActivityItem';
import Card from '@/components/ui/Card';

export default function ActivityTimeline({ events }) {
  if (events.length === 0) {
    return (
      <Card padding="md" className="text-center py-16">
        <p className="text-gray-500 font-medium">ምንም እንቅስቃሴ አልተገኘም</p>
        <p className="text-xs text-gray-400 mt-1">ሌላ ማጣሪያ ይሞክሩ</p>
      </Card>
    );
  }

  const groups = {};
  for (const e of events) {
    const key = new Date(e.timestamp).toDateString();
    if (!groups[key]) groups[key] = [];
    groups[key].push(e);
  }

  return (
    <div className="space-y-6">
      {Object.entries(groups).map(([dayKey, dayEvents]) => (
        <div key={dayKey}>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3 pl-1">
            {formatDay(dayEvents[0].timestamp)}
          </h3>
          <ul className="space-y-3">
            {dayEvents.map((e, i) => (
              <ActivityItem
                key={e.id}
                event={e}
                isLast={i === dayEvents.length - 1}
              />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}