'use client';

import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Card from '@/components/ui/Card';

export default function ActivityFilters({
  search,
  onSearch,
  activeGroup,
  onGroup,
  groups,
  labels,
  onReset,
  hasFilters,
}) {
  return (
    <Card padding="md">
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="እንቅስቃሴ ይፈልጉ..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-12 pr-10 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-brand text-sm"
          />
          {search && (
            <button
              onClick={() => onSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100 text-gray-400"
              aria-label="ፍለጋ አጽዳ"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl overflow-x-auto">
          <button
            onClick={() => onGroup('all')}
            className={cn(
              'px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition',
              activeGroup === 'all'
                ? 'bg-white text-brand shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            ሁሉም
          </button>
          {groups.map((g) => (
            <button
              key={g}
              onClick={() => onGroup(g)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition',
                activeGroup === g
                  ? 'bg-white text-brand shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {labels[g] || g}
            </button>
          ))}
        </div>

        {hasFilters && (
          <button
            onClick={onReset}
            className="self-start text-xs text-gray-500 hover:text-brand font-medium"
          >
            ሁሉንም ማጣሪያዎች አጽዳ
          </button>
        )}
      </div>
    </Card>
  );
}