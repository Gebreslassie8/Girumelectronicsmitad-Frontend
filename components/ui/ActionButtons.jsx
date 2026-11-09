'use client';

import { Eye, Edit, Trash2 } from 'lucide-react';

const COLORS = {
  view:   'text-blue-600 hover:text-blue-700 hover:bg-blue-50',
  edit:   'text-amber-600 hover:text-amber-700 hover:bg-amber-50',
  delete: 'text-red-600 hover:text-red-700 hover:bg-red-50',
};

export default function ActionButtons({
  onView,
  onEdit,
  onDelete,
  canEdit = true,
  canDelete = true,
  size = 16,
}) {
  return (
    <div className="flex items-center justify-center gap-1">
      {onView && (
        <button
          onClick={onView}
          className={`p-1.5 rounded-lg transition ${COLORS.view}`}
          title="ይመልከቱ"
        >
          <Eye size={size} />
        </button>
      )}
      {onEdit && canEdit && (
        <button
          onClick={onEdit}
          className={`p-1.5 rounded-lg transition ${COLORS.edit}`}
          title="አስተካክል"
        >
          <Edit size={size} />
        </button>
      )}
      {onDelete && canDelete && (
        <button
          onClick={onDelete}
          className={`p-1.5 rounded-lg transition ${COLORS.delete}`}
          title="ሰርዝ"
        >
          <Trash2 size={size} />
        </button>
      )}
    </div>
  );
}
