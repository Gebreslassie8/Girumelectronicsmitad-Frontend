'use client';

import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'ማረጋገጫ',
  message = 'ይህን መሰረዝ ይፈልጋሉ?',
  itemName,
  itemType = 'ንጥል',
  confirmLabel = 'አዎ፣ ሰርዝ',
  cancelLabel = 'ሰርዝ',
  loading = false,
  variant = 'danger', // 'danger' | 'warning' | 'info'
}) {
  if (!isOpen) return null;

  const variants = {
    danger: {
      icon: Trash2,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      buttonBg: 'bg-red-600 hover:bg-red-700',
      borderColor: 'border-red-200',
    },
    warning: {
      icon: AlertTriangle,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      buttonBg: 'bg-yellow-600 hover:bg-yellow-700',
      borderColor: 'border-yellow-200',
    },
    info: {
      icon: AlertTriangle,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      buttonBg: 'bg-blue-600 hover:bg-blue-700',
      borderColor: 'border-blue-200',
    },
  };

  const style = variants[variant] || variants.danger;
  const Icon = style.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition disabled:opacity-50"
        >
          <X size={20} />
        </button>

        <div className="p-6">
          {/* Icon */}
          <div className={`w-14 h-14 rounded-full ${style.iconBg} flex items-center justify-center mx-auto mb-4`}>
            <Icon size={28} className={style.iconColor} />
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
            {title}
          </h3>

          {/* Message */}
          <p className="text-sm text-gray-600 text-center mb-1">
            {message}
          </p>

          {/* Item name */}
          {itemName && (
            <div className={`mt-3 p-3 rounded-lg ${style.borderColor} border bg-gray-50 text-center`}>
              <p className="text-sm font-semibold text-gray-800">{itemName}</p>
              <p className="text-xs text-gray-500 mt-0.5">{itemType}</p>
            </div>
          )}

          {/* Warning */}
          <p className="text-xs text-gray-500 text-center mt-4">
            ⚠️ ይህ ተግባር መመለስ አይቻልም!
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-white transition disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-white font-semibold transition disabled:opacity-50 ${style.buttonBg}`}
          >
            {loading ? (
              <>
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
                በመሰረዝ ላይ...
              </>
            ) : (
              <>
                <Trash2 size={16} /> {confirmLabel}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
