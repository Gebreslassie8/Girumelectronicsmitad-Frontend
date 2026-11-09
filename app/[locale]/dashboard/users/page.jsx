'use client';

import { useState, useMemo } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import {
  Plus, Search, Users, Shield, UserCheck, UserX, Briefcase,
  Crown, Phone, Mail, Building2, MapPin, Calendar, User,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { MOCK_USERS, USER_ROLES, USER_BRANCHES } from '@/lib/mockUsers';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import ActionButtons from '@/components/ui/ActionButtons';
import toast from 'react-hot-toast';

const ROLE_ICONS = {
  admin:    Shield,
  owner:    Crown,
  seller:   Briefcase,
  customer: User,
};

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState(MOCK_USERS);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewUser, setViewUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const canManage = currentUser?.role === 'admin';

  // Filter
  const filtered = useMemo(() => {
    return users.filter((u) => {
      const q = search.toLowerCase();
      const matchSearch =
        u.fullName.toLowerCase().includes(q) ||
        u.phone.includes(q) ||
        (u.email || '').toLowerCase().includes(q);
      const matchRole = roleFilter === 'all' || u.role === roleFilter;
      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && u.isActive) ||
        (statusFilter === 'inactive' && !u.isActive);
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  // Stats
  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.isActive).length;
    const admins = users.filter((u) => u.role === 'admin' || u.role === 'owner').length;
    const customers = users.filter((u) => u.role === 'customer').length;
    return { total, active, admins, customers };
  }, [users]);

  // Delete
  const handleDeleteClick = (user) => {
    if (user._id === currentUser?._id) {
      toast.error('የራስዎን አካውንት መሰረዝ አይችሉም');
      return;
    }
    setDeleteTarget(user);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      setUsers(users.filter((u) => u._id !== deleteTarget._id));
      toast.success('ተጠቃሚ ተሰርዟል');
      setDeleteTarget(null);
    } catch (_) {
      toast.error('ስህተት ተፈጥሯል');
    } finally {
      setDeleting(false);
    }
  };

  // Save
  const handleSave = (data) => {
    if (editingUser) {
      setUsers(users.map((u) => u._id === editingUser._id ? { ...u, ...data } : u));
      toast.success('ተጠቃሚ ተስተካክሏል');
    } else {
      const newUser = {
        ...data,
        _id: 'u' + (users.length + 1),
        isActive: true,
        lastLogin: null,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setUsers([newUser, ...users]);
      toast.success('ተጠቃሚ ተጨምሯል');
    }
    setShowModal(false);
    setEditingUser(null);
  };

  // Toggle active
  const handleToggleActive = (user) => {
    if (user._id === currentUser?._id) {
      toast.error('የራስዎን አካውንት ማሰናከል አይችሉም');
      return;
    }
    setUsers(users.map((u) => u._id === user._id ? { ...u, isActive: !u.isActive } : u));
    toast.success(user.isActive ? 'ተጠቃሚ ተሰናክሏል' : 'ተጠቃሚ ነቅቷል');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">ተጠቃሚዎች</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filtered.length} ተጠቃሚዎች · {stats.active} ንቁ
          </p>
        </div>
        {canManage && (
          <Button onClick={() => { setEditingUser(null); setShowModal(true); }}>
            <Plus size={18} /> አዲስ ተጠቃሚ
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="ጠቅላላ ተጠቃሚዎች" value={stats.total} icon={Users} color="bg-blue-500" />
        <StatCard label="ንቁ" value={stats.active} icon={UserCheck} color="bg-green-500" />
        <StatCard label="አስተዳዳሪዎች" value={stats.admins} icon={Shield} color="bg-purple-500" />
        <StatCard label="ደንበኞች" value={stats.customers} icon={User} color="bg-orange-500" />
      </div>

      {/* Filters */}
      <Card padding="sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="ፈልግ (ስም፣ ስልክ፣ ኢሜይል)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm bg-white"
          >
            <option value="all">ሁሉም ሚናዎች</option>
            {Object.entries(USER_ROLES).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm bg-white"
          >
            <option value="all">ሁሉም ሁኔታዎች</option>
            <option value="active">ንቁ</option>
            <option value="inactive">ተሰናክሏል</option>
          </select>
        </div>
      </Card>

      {/* Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">ተጠቃሚ</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">ስልክ</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">ኢሜይል</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">ሚና</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">ቅርንጫፍ</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">ሁኔታ</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">የመጨረሻ መግቢያ</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">ተግባር</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                        <Users size={28} className="text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-sm">ምንም ተጠቃሚ አልተገኘም</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((user) => {
                  const roleInfo = USER_ROLES[user.role];
                  const RoleIcon = ROLE_ICONS[user.role] || User;
                  return (
                    <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0 ${
                            user.isActive
                              ? 'bg-brand text-white'
                              : 'bg-gray-300 text-gray-600'
                          }`}>
                            {user.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{user.fullName}</p>
                            <p className="text-xs text-gray-500">
                              {user._id === currentUser?._id ? '(እርስዎ)' : `ID: ${user._id}`}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{user.phone}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{user.email || '-'}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          <RoleIcon size={10} />
                          {roleInfo.label}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        {user.branch?.name || '-'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleToggleActive(user)}
                          disabled={!canManage || user._id === currentUser?._id}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition ${
                            user.isActive
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          } disabled:cursor-not-allowed disabled:opacity-70`}
                        >
                          {user.isActive ? <UserCheck size={10} /> : <UserX size={10} />}
                          {user.isActive ? 'ንቁ' : 'ተሰናክሏል'}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {user.lastLogin ? formatDate(user.lastLogin) : 'አልገባም'}
                      </td>
                      <td className="px-4 py-3">
                        <ActionButtons
                          onView={() => setViewUser(user)}
                          onEdit={() => { setEditingUser(user); setShowModal(true); }}
                          onDelete={() => handleDeleteClick(user)}
                          canEdit={canManage}
                          canDelete={canManage && user._id !== currentUser?._id}
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
        onClose={() => { setShowModal(false); setEditingUser(null); }}
        title={editingUser ? 'ተጠቃሚ አስተካክል' : 'አዲስ ተጠቃሚ'}
        size="md"
      >
        <UserForm
          user={editingUser}
          onSave={handleSave}
          onCancel={() => { setShowModal(false); setEditingUser(null); }}
        />
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={!!viewUser}
        onClose={() => setViewUser(null)}
        title="የተጠቃሚ ዝርዝር"
      >
        {viewUser && <UserView user={viewUser} />}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="ተጠቃሚ ይሰረዝ?"
        message="ይህን ተጠቃሚ መሰረዝ ይፈልጋሉ?"
        itemName={deleteTarget?.fullName}
        itemType={`${deleteTarget?.phone || ''} · ${deleteTarget ? USER_ROLES[deleteTarget.role]?.label : ''}`}
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

function UserForm({ user, onSave, onCancel }) {
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    email: user?.email || '',
    role: user?.role || 'customer',
    branch: user?.branch?._id || '',
    address: user?.address || '',
  });

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const branch = USER_BRANCHES.find((b) => b._id === form.branch);
    onSave({
      ...form,
      branch: branch || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="ሙሉ ስም *">
        <input name="fullName" value={form.fullName} onChange={onChange} required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm"
        />
      </FormField>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="ስልክ *">
          <input name="phone" value={form.phone} onChange={onChange} required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm"
          />
        </FormField>
        <FormField label="ኢሜይል">
          <input type="email" name="email" value={form.email} onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="ሚና *">
          <select name="role" value={form.role} onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand text-sm">
            {Object.entries(USER_ROLES).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </FormField>
        <FormField label="ቅርንጫፍ">
          <select name="branch" value={form.branch} onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand text-sm">
            <option value="">— የለም —</option>
            {USER_BRANCHES.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
          </select>
        </FormField>
      </div>

      <FormField label="አድራሻ">
        <input name="address" value={form.address} onChange={onChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm"
        />
      </FormField>

      {!user && (
        <div className="p-3 rounded-lg bg-blue-50 text-xs text-blue-700">
          ℹ️ አዲስ ተጠቃሚ ሲፈጠር የመጀመሪያ ፓስወርድ በራስ-ሰር ይመነጫል።
        </div>
      )}

      <div className="flex gap-2 pt-2 border-t border-gray-200">
        <button type="button" onClick={onCancel}
          className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition">
          ሰርዝ
        </button>
        <button type="submit"
          className="flex-1 px-4 py-2.5 rounded-lg bg-brand text-white font-semibold hover:bg-brand-dark transition">
          {user ? 'አስተካክል' : 'ጨምር'}
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

function UserView({ user }) {
  const roleInfo = USER_ROLES[user.role];
  const RoleIcon = ROLE_ICONS[user.role] || User;

  return (
    <div>
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl ${
          user.isActive ? 'bg-brand text-white' : 'bg-gray-300 text-gray-600'
        }`}>
          {user.fullName.charAt(0)}
        </div>
        <div>
          <p className="font-bold text-gray-800 text-lg">{user.fullName}</p>
          <div className="flex items-center gap-1 mt-1">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-${roleInfo.color}-100 text-${roleInfo.color}-700`}>
              <RoleIcon size={10} />
              {roleInfo.label}
            </span>
            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
              user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {user.isActive ? 'ንቁ' : 'ተሰናክሏል'}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-4 text-sm">
        <Row label="ስልክ" value={user.phone} icon={Phone} />
        <Row label="ኢሜይል" value={user.email || '-'} icon={Mail} />
        <Row label="ቅርንጫፍ" value={user.branch?.name || '-'} icon={Building2} />
        <Row label="አድራሻ" value={user.address || '-'} icon={MapPin} />
        <Row label="ተፈጠረ" value={formatDate(user.createdAt)} icon={Calendar} />
        <Row label="የመጨረሻ መግቢያ" value={user.lastLogin ? formatDate(user.lastLogin) : 'አልገባም'} icon={Calendar} />
      </div>
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
