'use client';

import { useState, useMemo } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import {
  Plus, Search, FileText, CheckCircle2, Clock, AlertTriangle,
  User, Phone, Calendar, Building2, DollarSign,
  FileCheck, Eye, Printer,
} from 'lucide-react';
import { formatETB, formatDate } from '@/lib/utils';
import { MOCK_RECEIPTS, RECEIPT_STATUS, RECEIPT_BRANCHES, DEFAULT_RECEIPT_NOTE } from '@/lib/mockReceipts';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import ActionButtons from '@/components/ui/ActionButtons';
import toast from 'react-hot-toast';

export default function ReceiptsPage() {
  const { user } = useAuth();
  const [receipts, setReceipts] = useState(MOCK_RECEIPTS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [branchFilter, setBranchFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingReceipt, setEditingReceipt] = useState(null);
  const [viewReceipt, setViewReceipt] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const canManage = user?.role === 'admin' || user?.role === 'seller';

  // ✅ Get user's branch ID
  const userBranchId = useMemo(() => {
    if (!user?.branch) return null;
    return typeof user.branch === 'object' ? user.branch._id : user.branch;
  }, [user]);

  // ✅ Role-based base data
  const roleFiltered = useMemo(() => {
    let result = receipts;

    // Seller — የራሱ ቅርንጫፍ ብቻ
    if (user?.role === 'seller' && userBranchId) {
      result = result.filter((r) => r.branch?._id === userBranchId);
    }

    // ✅ Customer — የራሱ ደረሰኞች ብቻ
    if (user?.role === 'customer') {
      result = result.filter((r) => r.customerPhone === user.phone);
    }

    return result;
  }, [receipts, user, userBranchId]);

  // Filter
  const filtered = useMemo(() => {
    return roleFiltered.filter((r) => {
      const q = search.toLowerCase();
      const matchSearch =
        r.receiptNumber.toLowerCase().includes(q) ||
        r.customerName.toLowerCase().includes(q) ||
        r.customerPhone.includes(q) ||
        (r.order?.orderNumber || '').toLowerCase().includes(q);
      const matchStatus = statusFilter === 'all' || r.status === statusFilter;
      const matchBranch = branchFilter === 'all' || r.branch?._id === branchFilter;
      return matchSearch && matchStatus && matchBranch;
    });
  }, [roleFiltered, search, statusFilter, branchFilter]);

  // ✅ Stats — ሚና-ተኮር
  const stats = useMemo(() => {
    const total = roleFiltered.length;
    const active = roleFiltered.filter((r) => r.status === 'active').length;
    const completed = roleFiltered.filter((r) => r.status === 'completed').length;
    const totalPrepaid = roleFiltered.reduce((s, r) => s + r.prepayment, 0);
    const totalRemaining = roleFiltered.reduce((s, r) => s + r.remainingPayment, 0);
    return { total, active, completed, totalPrepaid, totalRemaining };
  }, [roleFiltered]);

  // Delete
  const handleDeleteClick = (receipt) => setDeleteTarget(receipt);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      setReceipts(receipts.filter((r) => r._id !== deleteTarget._id));
      toast.success('ደረሰኝ ተሰርዟል');
      setDeleteTarget(null);
    } catch (_) {
      toast.error('ስህተት ተፈጥሯል');
    } finally {
      setDeleting(false);
    }
  };

  // Save
  const handleSave = (data) => {
    if (editingReceipt) {
      setReceipts(receipts.map((r) => r._id === editingReceipt._id ? { ...r, ...data } : r));
      toast.success('ደረሰኝ ተስተካክሏል');
    } else {
      const newReceipt = {
        ...data,
        _id: 'r' + (receipts.length + 1),
        receiptNumber: `RCP-2026-${String(receipts.length + 1).padStart(4, '0')}`,
        createdAt: new Date().toISOString().split('T')[0],
        issuedBy: { fullName: user?.fullName || 'User' },
      };
      setReceipts([newReceipt, ...receipts]);
      toast.success('ደረሰኝ ተፈጥሯል');
    }
    setShowModal(false);
    setEditingReceipt(null);
  };

  const handlePrint = (receipt) => {
    toast.success(`ደረሰኝ ${receipt.receiptNumber} ታትሟል`);
    // TODO: PDF generation
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">ደረሰኞች</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filtered.length} ደረሰኞች · {formatETB(stats.totalPrepaid)} የተከፈለ
          </p>
          {/* ✅ Seller — branch display */}
          {user?.role === 'seller' && userBranchId && (
            <p className="text-xs text-brand font-medium mt-1 flex items-center gap-1">
              <Building2 size={12} />
              {typeof user.branch === 'object' ? user.branch.name : 'ቅርንጫፍ'}
            </p>
          )}
          {/* ✅ Customer — "የእኔ ደረሰኞች" */}
          {user?.role === 'customer' && (
            <p className="text-xs text-brand font-medium mt-1 flex items-center gap-1">
              <User size={12} />
              የእኔ ደረሰኞች
            </p>
          )}
        </div>
        {canManage && (
          <Button onClick={() => { setEditingReceipt(null); setShowModal(true); }}>
            <Plus size={18} /> አዲስ ደረሰኝ
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="ጠቅላላ ደረሰኞች" value={stats.total} icon={FileText} color="bg-blue-500" />
        <StatCard label="ንቁ" value={stats.active} icon={Clock} color="bg-green-500" />
        <StatCard label="ተጠናቋል" value={stats.completed} icon={CheckCircle2} color="bg-purple-500" />
        <StatCard label="የተከፈለ" value={formatETB(stats.totalPrepaid)} icon={DollarSign} color="bg-orange-500" />
      </div>

      {/* Filters */}
      <Card padding="sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="ፈልግ (ደረሰኝ፣ ደንበኛ፣ ስልክ፣ ትዕዛዝ)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm bg-white"
          >
            <option value="all">ሁሉም ሁኔታዎች</option>
            {Object.entries(RECEIPT_STATUS).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>

          {/* ✅ Branch filter — Admin ብቻ */}
          {user?.role === 'admin' ? (
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm bg-white"
            >
              <option value="all">ሁሉም ቅርንጫፎች</option>
              {RECEIPT_BRANCHES.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
            </select>
          ) : (
            <div className="px-3 py-2 rounded-lg bg-blue-50 text-blue-700 text-sm flex items-center gap-2">
              <Building2 size={14} />
              <span className="font-medium truncate">
                {user?.branch
                  ? (typeof user.branch === 'object' ? user.branch.name : 'ቅርንጫፍ')
                  : 'ሁሉም ቅርንጫፎች'}
              </span>
            </div>
          )}
        </div>
      </Card>

      {/* Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">ደረሰኝ ቁጥር</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">ደንበኛ</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">ዕቃ</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">ጠቅላላ</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">ቅድመ</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">ቀሪ</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">ሁኔታ</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">ቀን</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">ተግባር</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                        <FileText size={28} className="text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-sm">
                        {user?.role === 'customer' ? 'የእርስዎ ደረሰኝ የለም' : 'ምንም ደረሰኝ አልተገኘም'}
                      </p>
                      {user?.role === 'customer' && (
                        <p className="text-xs text-gray-400">
                          ትዕዛዝ ካዘዙ በኋላ ደረሰኝ እዚህ ይታያል
                        </p>
                      )}
                      {user?.role === 'seller' && userBranchId && (
                        <p className="text-xs text-gray-400">
                          ቅርንጫፍ: {typeof user.branch === 'object' ? user.branch.name : 'ቅርንጫፍ'}
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((receipt) => {
                  const status = RECEIPT_STATUS[receipt.status];
                  return (
                    <tr key={receipt._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs text-brand font-medium">
                        {receipt.receiptNumber}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800">{receipt.customerName}</p>
                        <p className="text-xs text-gray-500">{receipt.customerPhone}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs">
                          {receipt.itemType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-800">
                        {formatETB(receipt.totalPrice)}
                      </td>
                      <td className="px-4 py-3 text-right text-green-600 font-medium">
                        {formatETB(receipt.prepayment)}
                      </td>
                      <td className="px-4 py-3 text-right text-red-600 font-medium">
                        {formatETB(receipt.remainingPayment)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge color={status.color}>{status.label}</Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {formatDate(receipt.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <ActionButtons
                          onView={() => setViewReceipt(receipt)}
                          onEdit={() => { setEditingReceipt(receipt); setShowModal(true); }}
                          onDelete={() => handleDeleteClick(receipt)}
                          canEdit={canManage}
                          canDelete={canManage}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingReceipt(null); }}
        title={editingReceipt ? 'ደረሰኝ አስተካክል' : 'አዲስ ደረሰኝ'}
        size="lg"
      >
        <ReceiptForm
          receipt={editingReceipt}
          onSave={handleSave}
          onCancel={() => { setShowModal(false); setEditingReceipt(null); }}
          currentUser={user}
        />
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={!!viewReceipt}
        onClose={() => setViewReceipt(null)}
        title="የደረሰኝ ዝርዝር"
      >
        {viewReceipt && (
          <ReceiptView
            receipt={viewReceipt}
            onPrint={() => handlePrint(viewReceipt)}
          />
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="ደረሰኝ ይሰረዝ?"
        message="ይህን ደረሰኝ መሰረዝ ይፈልጋሉ?"
        itemName={deleteTarget?.customerName}
        itemType={`${deleteTarget?.receiptNumber || ''} · ${deleteTarget?.itemType || ''}`}
        confirmLabel="አዎ፣ ሰርዝ"
        cancelLabel="ተወው"
        loading={deleting}
        variant="danger"
      />
    </div>
  );
}

// ============ Sub-components ============

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <Card padding="sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <div className={`p-2.5 rounded-lg ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
    </Card>
  );
}

function ReceiptForm({ receipt, onSave, onCancel, currentUser }) {
  const isSeller = currentUser?.role === 'seller';

  const defaultBranch = isSeller && currentUser?.branch
    ? (typeof currentUser.branch === 'object' ? currentUser.branch._id : currentUser.branch)
    : (receipt?.branch?._id || 'b1');

  const [form, setForm] = useState({
    orderNumber: receipt?.order?.orderNumber || '',
    productCode: receipt?.productCode || '',
    itemType: receipt?.itemType || 'ምጣድ',
    customerName: receipt?.customerName || '',
    customerPhone: receipt?.customerPhone || '',
    prepayment: receipt?.prepayment || 0,
    remainingPayment: receipt?.remainingPayment || 0,
    totalPrice: receipt?.totalPrice || 0,
    appointmentDate: receipt?.appointmentDate || '',
    note: receipt?.note || DEFAULT_RECEIPT_NOTE,
    status: receipt?.status || 'active',
    branch: defaultBranch,
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: ['prepayment', 'remainingPayment', 'totalPrice'].includes(name) ? Number(value) : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const branch = RECEIPT_BRANCHES.find((b) => b._id === form.branch);
    onSave({
      ...form,
      order: { orderNumber: form.orderNumber },
      branch: branch || { _id: form.branch, name: 'ቦሌ ቅርንጫፍ' },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <User size={14} /> የደንበኛ መረጃ
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField label="ስም *">
            <input name="customerName" value={form.customerName} onChange={onChange} required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm"
            />
          </FormField>
          <FormField label="ስልክ">
            <input name="customerPhone" value={form.customerPhone} onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm"
            />
          </FormField>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <FileText size={14} /> የትዕዛዝ መረጃ
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField label="የትዕዛዝ ቁጥር">
            <input name="orderNumber" value={form.orderNumber} onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm"
            />
          </FormField>
          <FormField label="የምርት ኮድ">
            <input name="productCode" value={form.productCode} onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm"
            />
          </FormField>
          <FormField label="የዕቃ ዓይነት *">
            <input name="itemType" value={form.itemType} onChange={onChange} required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm"
            />
          </FormField>
          <FormField label="ቀጠሮ ቀን *">
            <input type="date" name="appointmentDate" value={form.appointmentDate} onChange={onChange} required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm"
            />
          </FormField>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <DollarSign size={14} /> ክፍያ
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <FormField label="ጠቅላላ ዋጋ *">
            <input type="number" name="totalPrice" value={form.totalPrice} onChange={onChange} required min={0}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm"
            />
          </FormField>
          <FormField label="ቅድመ ክፍያ *">
            <input type="number" name="prepayment" value={form.prepayment} onChange={onChange} required min={0}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm"
            />
          </FormField>
          <FormField label="ቀሪ ክፍያ *">
            <input type="number" name="remainingPayment" value={form.remainingPayment} onChange={onChange} required min={0}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm"
            />
          </FormField>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FormField label="ሁኔታ">
          <select name="status" value={form.status} onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand text-sm">
            {Object.entries(RECEIPT_STATUS).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </FormField>

        {/* ✅ Seller — branch ቋሚ */}
        <FormField label="ቅርንጫፍ *">
          {isSeller ? (
            <div className="w-full px-3 py-2 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium">
              {typeof currentUser.branch === 'object' ? currentUser.branch?.name : 'ቅርንጫፍ'}
            </div>
          ) : (
            <select name="branch" value={form.branch} onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand text-sm">
              {RECEIPT_BRANCHES.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
            </select>
          )}
        </FormField>
      </div>

      <FormField label="ማስታወሻ">
        <textarea name="note" value={form.note} onChange={onChange} rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm resize-none"
        />
      </FormField>

      <div className="flex gap-2 pt-2 border-t border-gray-200">
        <button type="button" onClick={onCancel}
          className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition">
          ሰርዝ
        </button>
        <button type="submit"
          className="flex-1 px-4 py-2.5 rounded-lg bg-brand text-white font-semibold hover:bg-brand-dark transition">
          {receipt ? 'አስተካክል' : 'ፍጠር'}
        </button>
      </div>
    </form>
  );
}

function FormField({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      {children}
    </div>
  );
}

function ReceiptView({ receipt, onPrint }) {
  const status = RECEIPT_STATUS[receipt.status];
  return (
    <div>
      <div className="text-center pb-4 border-b-2 border-dashed border-gray-300">
        <h3 className="font-bold text-gray-800 text-lg">ግሩም ምጣድ</h3>
        <p className="text-xs text-gray-500">Grum Stove</p>
        <p className="text-xs text-gray-400 mt-1">አዲስ አበባ, ኢትዮጵያ</p>
        <p className="text-xs text-gray-400">0924 254 988 / 0903 284 493</p>
      </div>

      <div className="flex items-center justify-between py-3 bg-gray-50 rounded-lg px-3 my-3">
        <div>
          <p className="text-xs text-gray-500">ደረሰኝ ቁጥር</p>
          <p className="font-mono font-bold text-brand">{receipt.receiptNumber}</p>
        </div>
        <Badge color={status.color}>{status.label}</Badge>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">ደንበኛ:</span>
          <span className="font-medium text-gray-800">{receipt.customerName}</span>
        </div>
        {receipt.customerPhone && (
          <div className="flex justify-between">
            <span className="text-gray-500">ስልክ:</span>
            <span className="text-gray-800">{receipt.customerPhone}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-500">ዕቃ:</span>
          <span className="text-gray-800">{receipt.itemType}</span>
        </div>
        {receipt.order?.orderNumber && (
          <div className="flex justify-between">
            <span className="text-gray-500">ትዕዛዝ:</span>
            <span className="font-mono text-xs text-gray-800">{receipt.order.orderNumber}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-500">ቀጠሮ:</span>
          <span className="text-gray-800">{formatDate(receipt.appointmentDate)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">ቅርንጫፍ:</span>
          <span className="text-gray-800">{receipt.branch?.name || '-'}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">ጠቅላላ ዋጋ:</span>
          <span className="font-semibold text-gray-800">{formatETB(receipt.totalPrice)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">ቅድመ ክፍያ:</span>
          <span className="font-semibold text-green-600">{formatETB(receipt.prepayment)}</span>
        </div>
        <div className="flex justify-between pt-2 border-t border-gray-200">
          <span className="font-semibold text-gray-700">ቀሪ ክፍያ:</span>
          <span className="font-bold text-red-600 text-lg">{formatETB(receipt.remainingPayment)}</span>
        </div>
      </div>

      {receipt.note && (
        <div className="mt-4 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
          <p className="text-xs text-yellow-800 leading-relaxed">⚠️ {receipt.note}</p>
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-dashed border-gray-300 text-center">
        <p className="text-xs text-gray-500">ያዘጋጀው: {receipt.issuedBy?.fullName || '-'}</p>
        <p className="text-xs text-gray-400 mt-1">ቀን: {formatDate(receipt.createdAt)}</p>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={onPrint}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-brand text-white font-semibold hover:bg-brand-dark transition"
        >
          <Printer size={16} /> አትም
        </button>
      </div>
    </div>
  );
}
