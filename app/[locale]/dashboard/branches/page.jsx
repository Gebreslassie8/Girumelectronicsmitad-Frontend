'use client';

import { useState, useMemo } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import {
  Plus, Search, Building2, Users, CheckCircle2, XCircle,
  Phone, MapPin, User, Package, ShoppingCart,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { MOCK_BRANCHES, BRANCH_STATUS } from '@/lib/mockBranches';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import ActionButtons from '@/components/ui/ActionButtons';
import toast from 'react-hot-toast';

export default function BranchesPage() {
  const { user } = useAuth();
  const [branches, setBranches] = useState(MOCK_BRANCHES);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [viewBranch, setViewBranch] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const canManage = user?.role === 'admin';

  // Filter
  const filtered = useMemo(() => {
    return branches.filter((b) => {
      const q = search.toLowerCase();
      const matchSearch =
        b.name.toLowerCase().includes(q) ||
        b.code.toLowerCase().includes(q) ||
        b.address.toLowerCase().includes(q) ||
        b.phone.includes(q);
      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && b.isActive) ||
        (statusFilter === 'inactive' && !b.isActive);
      return matchSearch && matchStatus;
    });
  }, [branches, search, statusFilter]);

  // Stats
  const stats = useMemo(() => {
    const total = branches.length;
    const active = branches.filter((b) => b.isActive).length;
    const inactive = branches.filter((b) => !b.isActive).length;
    const totalEmployees = branches.reduce((s, b) => s + (b.stats?.employees || 0), 0);
    return { total, active, inactive, totalEmployees };
  }, [branches]);

  // Delete
  const handleDeleteClick = (branch) => setDeleteTarget(branch);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      setBranches(branches.filter((b) => b._id !== deleteTarget._id));
      toast.success('ቅርንጫፍ ተሰርዟል');
      setDeleteTarget(null);
    } catch (_) {
      toast.error('ስህተት ተፈጥሯል');
    } finally {
      setDeleting(false);
    }
  };

  // Save
  const handleSave = (data) => {
    if (editingBranch) {
      setBranches(branches.map((b) => b._id === editingBranch._id ? { ...b, ...data } : b));
      toast.success('ቅርንጫፍ ተስተካክሏል');
    } else {
      const newBranch = {
        ...data,
        _id: 'b' + (branches.length + 1),
        code: `BR-${String(branches.length + 1).padStart(3, '0')}`,
        createdAt: new Date().toISOString().split('T')[0],
        stats: { employees: 0, products: 0, orders: 0 },
      };
      setBranches([newBranch, ...branches]);
      toast.success('ቅርንጫፍ ተጨምሯል');
    }
    setShowModal(false);
    setEditingBranch(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">ቅርንጫፎች</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filtered.length} ቅርንጫፎች · {stats.totalEmployees} ሠራተኞች
          </p>
        </div>
        {canManage && (
          <Button onClick={() => { setEditingBranch(null); setShowModal(true); }}>
            <Plus size={18} /> አዲስ ቅርንጫፍ
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="ጠቅላላ ቅርንጫፎች" value={stats.total} icon={Building2} color="bg-blue-500" />
        <StatCard label="ንቁ" value={stats.active} icon={CheckCircle2} color="bg-green-500" />
        <StatCard label="ተዘግቷል" value={stats.inactive} icon={XCircle} color="bg-red-500" />
        <StatCard label="ጠቅላላ ሠራተኞች" value={stats.totalEmployees} icon={Users} color="bg-purple-500" />
      </div>

      {/* Filters */}
      <Card padding="sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="ፈልግ (ስም፣ ኮድ፣ አድራሻ፣ ስልክ)..."
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
            <option value="active">ንቁ</option>
            <option value="inactive">ተዘግቷል</option>
          </select>
        </div>
      </Card>

      {/* Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">ኮድ</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">ስም</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">አድራሻ</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">ስልክ</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">ሥራ አስኪያጅ</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">ሠራተኞች</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">ሁኔታ</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">ተግባር</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                        <Building2 size={28} className="text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-sm">ምንም ቅርንጫፍ አልተገኘም</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((branch) => {
                  const status = branch.isActive ? BRANCH_STATUS.active : BRANCH_STATUS.inactive;
                  return (
                    <tr key={branch._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs text-brand font-medium">{branch.code}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0">
                            <Building2 size={16} className="text-brand" />
                          </div>
                          <span className="font-medium text-gray-800">{branch.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs max-w-xs truncate">
                        {branch.address}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{branch.phone}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-semibold text-gray-600">
                              {branch.manager?.fullName?.charAt(0) || '-'}
                            </span>
                          </div>
                          <span className="text-gray-700 text-xs">{branch.manager?.fullName || '-'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-medium">
                          <Users size={10} /> {branch.stats?.employees || 0}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge color={status.color}>{status.label}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <ActionButtons
                          onView={() => setViewBranch(branch)}
                          onEdit={() => { setEditingBranch(branch); setShowModal(true); }}
                          onDelete={() => handleDeleteClick(branch)}
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
        onClose={() => { setShowModal(false); setEditingBranch(null); }}
        title={editingBranch ? 'ቅርንጫፍ አስተካክል' : 'አዲስ ቅርንጫፍ'}
        size="md"
      >
        <BranchForm
          branch={editingBranch}
          onSave={handleSave}
          onCancel={() => { setShowModal(false); setEditingBranch(null); }}
        />
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={!!viewBranch}
        onClose={() => setViewBranch(null)}
        title="የቅርንጫፍ ዝርዝር"
      >
        {viewBranch && <BranchView branch={viewBranch} />}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="ቅርንጫፍ ይሰረዝ?"
        message="ይህን ቅርንጫፍ መሰረዝ ይፈልጋሉ?"
        itemName={deleteTarget?.name}
        itemType={`${deleteTarget?.code || ''} · ${deleteTarget?.address || ''}`}
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

function BranchForm({ branch, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: branch?.name || '',
    address: branch?.address || '',
    phone: branch?.phone || '',
    isActive: branch?.isActive ?? true,
  });

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="ስም *">
        <input
          name="name"
          value={form.name}
          onChange={onChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm"
        />
      </FormField>

      <FormField label="አድራሻ *">
        <input
          name="address"
          value={form.address}
          onChange={onChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm"
        />
      </FormField>

      <FormField label="ስልክ *">
        <input
          name="phone"
          value={form.phone}
          onChange={onChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm"
        />
      </FormField>

      <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50">
        <input
          type="checkbox"
          name="isActive"
          checked={form.isActive}
          onChange={onChange}
          className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand"
        />
        <label className="text-sm text-gray-700 cursor-pointer">
          ቅርንጫፍ ንቁ ነው
        </label>
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
          {branch ? 'አስተካክል' : 'ጨምር'}
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

function BranchView({ branch }) {
  const status = branch.isActive ? BRANCH_STATUS.active : BRANCH_STATUS.inactive;
  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-14 h-14 rounded-xl bg-brand/10 flex items-center justify-center">
          <Building2 size={28} className="text-brand" />
        </div>
        <div>
          <p className="font-bold text-gray-800 text-lg">{branch.name}</p>
          <p className="text-sm text-gray-500 font-mono">{branch.code}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 py-4">
        <StatBox label="ሠራተኞች" value={branch.stats?.employees || 0} icon={Users} color="text-purple-600 bg-purple-50" />
        <StatBox label="ምርቶች" value={branch.stats?.products || 0} icon={Package} color="text-blue-600 bg-blue-50" />
        <StatBox label="ትዕዛዞች" value={branch.stats?.orders || 0} icon={ShoppingCart} color="text-green-600 bg-green-50" />
      </div>

      {/* Info */}
      <div className="space-y-3 pt-3 border-t border-gray-100 text-sm">
        <Row label="አድራሻ" value={branch.address} icon={MapPin} />
        <Row label="ስልክ" value={branch.phone} icon={Phone} />
        <Row label="ሥራ አስኪያጅ" value={branch.manager?.fullName || '-'} icon={User} />
        <Row label="ተፈጠረ" value={formatDate(branch.createdAt)} />
        <div className="flex justify-between items-center">
          <span className="text-gray-500">ሁኔታ:</span>
          <Badge color={status.color}>{status.label}</Badge>
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, icon: Icon, color }) {
  return (
    <div className={`rounded-lg p-2.5 text-center ${color.split(' ')[1]}`}>
      <div className="flex items-center justify-center mb-1">
        <Icon size={16} className={color.split(' ')[0]} />
      </div>
      <p className="text-lg font-bold text-gray-800">{value}</p>
      <p className="text-[10px] text-gray-500">{label}</p>
    </div>
  );
}

function Row({ label, value, icon: Icon }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-gray-500 flex-shrink-0 flex items-center gap-1">
        {Icon && <Icon size={12} />} {label}:
      </span>
      <span className="text-right text-gray-800">{value}</span>
    </div>
  );
}
