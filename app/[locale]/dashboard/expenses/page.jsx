'use client';

import { useState, useMemo } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import {
  Plus, Search, Wallet, DollarSign, Calendar, CreditCard,
  Banknote, Building2, User,
} from 'lucide-react';
import { formatETB, formatDate } from '@/lib/utils';
import { MOCK_EXPENSES, PAYMENT_METHODS, EXPENSE_BRANCHES } from '@/lib/mockExpenses';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import ActionButtons from '@/components/ui/ActionButtons';
import toast from 'react-hot-toast';

export default function ExpensesPage() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState(MOCK_EXPENSES);
  const [search, setSearch] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [branchFilter, setBranchFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [viewExpense, setViewExpense] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ✅ Admin + Seller ማስተዳደር ይችላሉ
  const canManage = user?.role === 'admin' || user?.role === 'seller';

  // ✅ Get user's branch ID
  const userBranchId = useMemo(() => {
    if (!user?.branch) return null;
    return typeof user.branch === 'object' ? user.branch._id : user.branch;
  }, [user]);

  // ✅ Role-based base data
  const roleFiltered = useMemo(() => {
    let result = expenses;

    // Seller — የራሱ ቅርንጫፍ ብቻ
    if (user?.role === 'seller' && userBranchId) {
      result = result.filter((e) => e.branch?._id === userBranchId);
    }

    return result;
  }, [expenses, user, userBranchId]);

  // Filter
  const filtered = useMemo(() => {
    return roleFiltered.filter((e) => {
      const q = search.toLowerCase();
      const matchSearch =
        e.name.toLowerCase().includes(q) ||
        (e.description || '').toLowerCase().includes(q);
      const matchPayment = paymentFilter === 'all' || e.paymentMethod === paymentFilter;
      const matchBranch = branchFilter === 'all' || e.branch?._id === branchFilter;
      return matchSearch && matchPayment && matchBranch;
    });
  }, [roleFiltered, search, paymentFilter, branchFilter]);

  // ✅ Stats — ሚና-ተኮር
  const stats = useMemo(() => {
    const total = roleFiltered.length;
    const totalAmount = roleFiltered.reduce((s, e) => s + e.amount, 0);
    const cashTotal = roleFiltered
      .filter((e) => e.paymentMethod === 'cash')
      .reduce((s, e) => s + e.amount, 0);
    const transferTotal = roleFiltered
      .filter((e) => e.paymentMethod === 'transfer')
      .reduce((s, e) => s + e.amount, 0);
    return { total, totalAmount, cashTotal, transferTotal };
  }, [roleFiltered]);

  // Delete
  const handleDeleteClick = (expense) => setDeleteTarget(expense);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      setExpenses(expenses.filter((e) => e._id !== deleteTarget._id));
      toast.success('ወጪ ተሰርዟል');
      setDeleteTarget(null);
    } catch (_) {
      toast.error('ስህተት ተፈጥሯል');
    } finally {
      setDeleting(false);
    }
  };

  // Save
  const handleSave = (data) => {
    if (editingExpense) {
      setExpenses(expenses.map((e) => e._id === editingExpense._id ? { ...e, ...data } : e));
      toast.success('ወጪ ተስተካክሏል');
    } else {
      const newExpense = {
        ...data,
        _id: 'ex' + (expenses.length + 1),
        createdBy: { fullName: user?.fullName || 'User' },
      };
      setExpenses([newExpense, ...expenses]);
      toast.success('ወጪ ተጨምሯል');
    }
    setShowModal(false);
    setEditingExpense(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">ወጪዎች</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filtered.length} ወጪዎች · {formatETB(stats.totalAmount)} ጠቅላላ
          </p>
          {/* ✅ Seller — branch display */}
          {user?.role === 'seller' && userBranchId && (
            <p className="text-xs text-brand font-medium mt-1 flex items-center gap-1">
              <Building2 size={12} />
              {typeof user.branch === 'object' ? user.branch.name : 'ቅርንጫፍ'}
            </p>
          )}
        </div>
        {canManage && (
          <Button onClick={() => { setEditingExpense(null); setShowModal(true); }}>
            <Plus size={18} /> አዲስ ወጪ
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="ጠቅላላ ወጪዎች" value={stats.total} icon={Wallet} color="bg-blue-500" />
        <StatCard label="ጠቅላላ ወጪ" value={formatETB(stats.totalAmount)} icon={DollarSign} color="bg-red-500" />
        <StatCard label="ጥሬ ገንዘብ" value={formatETB(stats.cashTotal)} icon={Banknote} color="bg-green-500" />
        <StatCard label="ዝውውር" value={formatETB(stats.transferTotal)} icon={CreditCard} color="bg-purple-500" />
      </div>

      {/* Filters */}
      <Card padding="sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="ፈልግ (ስም፣ መግለጫ)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm"
            />
          </div>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm bg-white"
          >
            <option value="all">ሁሉም የክፍያ ዘዴዎች</option>
            {Object.entries(PAYMENT_METHODS).map(([k, v]) => (
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
              {EXPENSE_BRANCHES.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
            </select>
          ) : (
            <div className="px-3 py-2 rounded-lg bg-blue-50 text-blue-700 text-sm flex items-center gap-2">
              <Building2 size={14} />
              <span className="font-medium truncate">
                {user?.branch ? (typeof user.branch === 'object' ? user.branch.name : 'ቅርንጫፍ') : 'ቅርንጫፍ'}
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
                <th className="px-4 py-3 text-left font-semibold text-gray-700">ስም</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">መጠን (ETB)</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">የክፍያ ዘዴ</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">መግለጫ</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">ቅርንጫፍ</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">ቀን</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">ተግባር</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                        <Wallet size={28} className="text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-sm">ምንም ወጪ አልተገኘም</p>
                      {user?.role === 'seller' && userBranchId && (
                        <p className="text-xs text-gray-400">
                          ቅርንጫፍ: {typeof user.branch === 'object' ? user.branch.name : 'ቅርንጫፍ'}
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((expense) => {
                  const payment = PAYMENT_METHODS[expense.paymentMethod];
                  return (
                    <tr key={expense._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800">{expense.name}</p>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-red-600">
                        {formatETB(expense.amount)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge color={payment.color}>
                          {expense.paymentMethod === 'cash' ? (
                            <span className="inline-flex items-center gap-1">
                              <Banknote size={10} /> {payment.label}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1">
                              <CreditCard size={10} /> {payment.label}
                            </span>
                          )}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600 max-w-xs truncate">
                        {expense.description || '-'}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        {expense.branch?.name || '-'}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {formatDate(expense.date)}
                      </td>
                      <td className="px-4 py-3">
                        <ActionButtons
                          onView={() => setViewExpense(expense)}
                          onEdit={() => { setEditingExpense(expense); setShowModal(true); }}
                          onDelete={() => handleDeleteClick(expense)}
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
        onClose={() => { setShowModal(false); setEditingExpense(null); }}
        title={editingExpense ? 'ወጪ አስተካክል' : 'አዲስ ወጪ'}
        size="md"
      >
        <ExpenseForm
          expense={editingExpense}
          onSave={handleSave}
          onCancel={() => { setShowModal(false); setEditingExpense(null); }}
          currentUser={user}
        />
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={!!viewExpense}
        onClose={() => setViewExpense(null)}
        title="የወጪ ዝርዝር"
      >
        {viewExpense && <ExpenseView expense={viewExpense} />}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="ወጪ ይሰረዝ?"
        message="ይህን ወጪ መሰረዝ ይፈልጋሉ?"
        itemName={deleteTarget?.name}
        itemType={`${deleteTarget ? formatETB(deleteTarget.amount) : ''}`}
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

function ExpenseForm({ expense, onSave, onCancel, currentUser }) {
  const isSeller = currentUser?.role === 'seller';

  // ✅ Seller — branch ቋሚ
  const defaultBranch = isSeller && currentUser?.branch
    ? (typeof currentUser.branch === 'object' ? currentUser.branch._id : currentUser.branch)
    : (expense?.branch?._id || 'b1');

  const [form, setForm] = useState({
    name: expense?.name || '',
    amount: expense?.amount || '',
    paymentMethod: expense?.paymentMethod || 'cash',
    date: expense?.date || new Date().toISOString().split('T')[0],
    description: expense?.description || '',
    branch: defaultBranch,
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const branch = EXPENSE_BRANCHES.find((b) => b._id === form.branch);
    onSave({
      ...form,
      amount: Number(form.amount),
      branch: branch || { _id: form.branch, name: 'ቦሌ ቅርንጫፍ' },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="ስም *">
        <input
          name="name"
          value={form.name}
          onChange={onChange}
          required
          placeholder="ምሳሌ: የቢሮ ኪራይ"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm"
        />
      </FormField>

      <FormField label="መጠን (ETB) *">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
            ETB
          </span>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={onChange}
            required
            min={0}
            step="0.01"
            placeholder="0.00"
            className="w-full pl-14 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm font-semibold"
          />
        </div>
        {form.amount && (
          <p className="text-xs text-gray-500 mt-1">
            {Number(form.amount).toLocaleString('am-ET')} ብር
          </p>
        )}
      </FormField>

      <FormField label="የክፍያ ዘዴ *">
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(PAYMENT_METHODS).map(([key, val]) => (
            <button
              key={key}
              type="button"
              onClick={() => setForm({ ...form, paymentMethod: key })}
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border-2 font-medium text-sm transition ${
                form.paymentMethod === key
                  ? 'border-brand bg-brand/10 text-brand'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {key === 'cash' ? <Banknote size={16} /> : <CreditCard size={16} />}
              {val.label}
            </button>
          ))}
        </div>
      </FormField>

      <FormField label="ቀን *">
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={onChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm"
        />
      </FormField>

      {/* ✅ Seller — branch ቋሚ */}
      <FormField label="ቅርንጫፍ *">
        {isSeller ? (
          <div className="w-full px-3 py-2 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium">
            {typeof currentUser.branch === 'object' ? currentUser.branch?.name : 'ቅርንጫፍ'}
          </div>
        ) : (
          <select
            name="branch"
            value={form.branch}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand text-sm"
          >
            {EXPENSE_BRANCHES.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
          </select>
        )}
      </FormField>

      <FormField label="መግለጫ">
        <textarea
          name="description"
          value={form.description}
          onChange={onChange}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm resize-none"
        />
      </FormField>

      <div className="bg-blue-50 rounded-lg p-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">መጠን:</span>
          <span className="font-bold text-brand">
            {form.amount ? formatETB(Number(form.amount)) : 'ETB 0.00'}
          </span>
        </div>
      </div>

      <div className="flex gap-2 pt-2 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
        >
          ሰርዝ
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2.5 rounded-lg bg-brand text-white font-semibold hover:bg-brand-dark transition"
        >
          {expense ? 'አስተካክል' : 'ጨምር'}
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

function ExpenseView({ expense }) {
  const payment = PAYMENT_METHODS[expense.paymentMethod];
  return (
    <div>
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center">
          <Wallet size={28} className="text-red-600" />
        </div>
        <div>
          <p className="font-bold text-gray-800 text-lg">{expense.name}</p>
          <p className="text-sm text-red-600 font-semibold">{formatETB(expense.amount)}</p>
        </div>
      </div>

      <div className="rounded-lg p-3 text-center bg-green-50 my-4">
        <p className="text-xs text-gray-500 mb-1">የክፍያ ዘዴ</p>
        <p className="text-sm font-bold text-gray-800">{payment.label}</p>
      </div>

      <div className="space-y-3 pt-3 border-t border-gray-100 text-sm">
        <Row label="መጠን" value={formatETB(expense.amount)} icon={DollarSign} bold color="text-red-600" />
        <Row label="ቀን" value={formatDate(expense.date)} icon={Calendar} />
        <Row label="ቅርንጫፍ" value={expense.branch?.name || '-'} icon={Building2} />
        {expense.description && (
          <Row label="መግለጫ" value={expense.description} />
        )}
        <Row label="የፈጠረ" value={expense.createdBy?.fullName || '-'} icon={User} />
      </div>
    </div>
  );
}

function Row({ label, value, icon: Icon, bold, color }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-gray-500 flex-shrink-0 flex items-center gap-1">
        {Icon && <Icon size={12} />} {label}:
      </span>
      <span className={`text-right ${bold ? 'font-semibold' : ''} ${color || 'text-gray-800'}`}>{value}</span>
    </div>
  );
}
