'use client';

import { useState, useMemo } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import {
  Plus, Search, Edit, Trash2, Eye, Users, DollarSign,
  UserCheck, UserX, Phone, Mail, Building2, Shield, Briefcase,
} from 'lucide-react';
import { formatETB, formatDate } from '@/lib/utils';
import {
  MOCK_EMPLOYEES, EMPLOYEE_STATUS, POSITIONS, DEPARTMENTS,
  PERMISSIONS_LIST, BRANCHES,
} from '@/lib/mockEmployees';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import toast from 'react-hot-toast';

export default function EmployeesPage() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState(MOCK_EMPLOYEES);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [branchFilter, setBranchFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [viewEmployee, setViewEmployee] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const canManage = user?.role === 'admin';

  // Filter
  const filtered = useMemo(() => {
    return employees.filter((e) => {
      const q = search.toLowerCase();
      const matchSearch =
        e.user.fullName.toLowerCase().includes(q) ||
        e.employeeCode.toLowerCase().includes(q) ||
        e.user.phone.includes(q) ||
        e.position.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'all' || e.status === statusFilter;
      const matchBranch = branchFilter === 'all' || e.branch?._id === branchFilter;
      return matchSearch && matchStatus && matchBranch;
    });
  }, [employees, search, statusFilter, branchFilter]);

  // Stats
  const stats = useMemo(() => {
    const total = employees.length;
    const active = employees.filter((e) => e.status === 'active').length;
    const onLeave = employees.filter((e) => e.status === 'on_leave').length;
    const totalSalary = employees
      .filter((e) => e.status === 'active')
      .reduce((s, e) => s + e.salary, 0);
    return { total, active, onLeave, totalSalary };
  }, [employees]);

  // ✅ Delete handlers
  const handleDeleteClick = (employee) => {
    setDeleteTarget(employee);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      setEmployees(employees.filter((e) => e._id !== deleteTarget._id));
      toast.success('ሠራተኛ ተሰርዟል');
      setDeleteTarget(null);
    } catch (_) {
      toast.error('ስህተት ተፈጥሯል');
    } finally {
      setDeleting(false);
    }
  };

  const handleSave = (data) => {
    if (editingEmployee) {
      setEmployees(employees.map((e) => e._id === editingEmployee._id ? { ...e, ...data } : e));
      toast.success('ሠራተኛ ተስተካክሏል');
    } else {
      const newEmployee = {
        ...data,
        _id: 'e' + (employees.length + 1),
        employeeCode: `EMP-2026-${String(employees.length + 1).padStart(4, '0')}`,
        hireDate: new Date().toISOString().split('T')[0],
      };
      setEmployees([newEmployee, ...employees]);
      toast.success('ሠራተኛ ተጨምሯል');
    }
    setShowModal(false);
    setEditingEmployee(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">ሠራተኞች</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filtered.length} ሠራተኞች · ጠቅላላ ደመወዝ {formatETB(stats.totalSalary)}
          </p>
        </div>
        {canManage && (
          <Button onClick={() => { setEditingEmployee(null); setShowModal(true); }}>
            <Plus size={18} /> አዲስ ሠራተኛ
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="ጠቅላላ ሠራተኞች" value={stats.total} icon={Users} color="bg-blue-500" />
        <StatCard label="ንቁ" value={stats.active} icon={UserCheck} color="bg-green-500" />
        <StatCard label="ፈቃድ ላይ" value={stats.onLeave} icon={UserX} color="bg-yellow-500" />
        <StatCard label="ጠቅላላ ደመወዝ" value={formatETB(stats.totalSalary)} icon={DollarSign} color="bg-purple-500" />
      </div>

      {/* Filters */}
      <Card padding="sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="ፈልግ (ስም፣ ኮድ፣ ስልክ፣ የስራ መደብ)..."
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
            {Object.entries(EMPLOYEE_STATUS).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm bg-white"
          >
            <option value="all">ሁሉም ቅርንጫፎች</option>
            {BRANCHES.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
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
                <th className="px-4 py-3 text-left font-semibold text-gray-700">ስልክ</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">የስራ መደብ</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">ክፍል</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">ደመወዝ</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">ቅርንጫፍ</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">ሁኔታ</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">ተግባር</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                        <Users size={28} className="text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-sm">ምንም ሠራተኛ አልተገኘም</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((emp) => {
                  const status = EMPLOYEE_STATUS[emp.status];
                  return (
                    <tr key={emp._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs text-brand font-medium">{emp.employeeCode}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-semibold text-xs flex-shrink-0">
                            {emp.user.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{emp.user.fullName}</p>
                            <p className="text-xs text-gray-500">{emp.user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{emp.user.phone}</td>
                      <td className="px-4 py-3 text-gray-800">{emp.position}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs">
                          {emp.department}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-800">{formatETB(emp.salary)}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs">
                          {emp.branch?.name || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge color={status.color}>{status.label}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => setViewEmployee(emp)} className="p-1.5 rounded text-gray-500 hover:text-brand hover:bg-blue-50 transition" title="ይመልከቱ">
                            <Eye size={16} />
                          </button>
                          {canManage && (
                            <>
                              <button
                                onClick={() => { setEditingEmployee(emp); setShowModal(true); }}
                                className="p-1.5 rounded text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition"
                                title="አስተካክል"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(emp)}
                                className="p-1.5 rounded text-gray-500 hover:text-red-600 hover:bg-red-50 transition"
                                title="ሰርዝ"
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          )}
                        </div>
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
        onClose={() => { setShowModal(false); setEditingEmployee(null); }}
        title={editingEmployee ? 'ሠራተኛ አስተካክል' : 'አዲስ ሠራተኛ'}
        size="lg"
      >
        <EmployeeForm
          employee={editingEmployee}
          onSave={handleSave}
          onCancel={() => { setShowModal(false); setEditingEmployee(null); }}
        />
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={!!viewEmployee}
        onClose={() => setViewEmployee(null)}
        title="የሠራተኛ ዝርዝር"
      >
        {viewEmployee && <EmployeeView employee={viewEmployee} />}
      </Modal>

      {/* ✅ Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="ሠራተኛ ይሰረዝ?"
        message="ይህን ሠራተኛ መሰረዝ ይፈልጋሉ?"
        itemName={deleteTarget?.user?.fullName}
        itemType={`${deleteTarget?.position || ''} · ${deleteTarget?.employeeCode || ''}`}
        confirmLabel="አዎ፣ ሰርዝ"
        cancelLabel="ተወው"
        loading={deleting}
        variant="danger"
      />
    </div>
  );
}

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

function EmployeeForm({ employee, onSave, onCancel }) {
  const [form, setForm] = useState({
    fullName: employee?.user?.fullName || '',
    phone: employee?.user?.phone || '',
    email: employee?.user?.email || '',
    position: employee?.position || 'ሻጭ',
    department: employee?.department || 'ሽያጭ',
    salary: employee?.salary || 0,
    status: employee?.status || 'active',
    branch: employee?.branch?._id || 'b1',
    emergencyName: employee?.emergencyContact?.name || '',
    emergencyPhone: employee?.emergencyContact?.phone || '',
    permissions: employee?.permissions || {
      canSell: true,
      canManageInventory: false,
      canManageOrders: true,
      canIssueReceipts: true,
      canViewAnalytics: false,
      canManageEmployees: false,
    },
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'salary' ? Number(value) : value });
  };

  const togglePermission = (key) => {
    setForm({
      ...form,
      permissions: { ...form.permissions, [key]: !form.permissions[key] },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const branch = BRANCHES.find((b) => b._id === form.branch);
    onSave({
      user: { fullName: form.fullName, phone: form.phone, email: form.email },
      position: form.position,
      department: form.department,
      salary: form.salary,
      status: form.status,
      branch: branch || { _id: form.branch, name: 'ቦሌ ቅርንጫፍ' },
      emergencyContact: { name: form.emergencyName, phone: form.emergencyPhone },
      permissions: form.permissions,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <Users size={14} /> የግል መረጃ
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField label="ሙሉ ስም *">
            <input name="fullName" value={form.fullName} onChange={onChange} required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm"
            />
          </FormField>
          <FormField label="ስልክ *">
            <input name="phone" value={form.phone} onChange={onChange} required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm"
            />
          </FormField>
          <FormField label="ኢሜይል" full>
            <input type="email" name="email" value={form.email} onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm"
            />
          </FormField>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <Briefcase size={14} /> የስራ መረጃ
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField label="የስራ መደብ *">
            <select name="position" value={form.position} onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm bg-white"
            >
              {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </FormField>
          <FormField label="ክፍል">
            <select name="department" value={form.department} onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm bg-white"
            >
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </FormField>
          <FormField label="ደመወዝ (ETB) *">
            <input type="number" name="salary" value={form.salary} onChange={onChange} required min={0}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm"
            />
          </FormField>
          <FormField label="ቅርንጫፍ *">
            <select name="branch" value={form.branch} onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm bg-white"
            >
              {BRANCHES.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
            </select>
          </FormField>
          <FormField label="ሁኔታ" full>
            <select name="status" value={form.status} onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm bg-white"
            >
              {Object.entries(EMPLOYEE_STATUS).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </FormField>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <Shield size={14} /> ፈቃዶች
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 rounded-lg bg-gray-50">
          {PERMISSIONS_LIST.map((perm) => (
            <label key={perm.key} className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="checkbox"
                checked={form.permissions[perm.key]}
                onChange={() => togglePermission(perm.key)}
                className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand"
              />
              <span className="text-gray-700">{perm.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <Phone size={14} /> የአደጋ ጊዜ እውቂያ
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField label="ስም">
            <input name="emergencyName" value={form.emergencyName} onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm"
            />
          </FormField>
          <FormField label="ስልክ">
            <input name="emergencyPhone" value={form.emergencyPhone} onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm"
            />
          </FormField>
        </div>
      </div>

      <div className="flex gap-2 pt-2 border-t border-gray-200">
        <button type="button" onClick={onCancel}
          className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
        >
          ሰርዝ
        </button>
        <button type="submit"
          className="flex-1 px-4 py-2.5 rounded-lg bg-brand text-white font-semibold hover:bg-brand-dark transition"
        >
          {employee ? 'አስተካክል' : 'ጨምር'}
        </button>
      </div>
    </form>
  );
}

function FormField({ label, children, full }) {
  return (
    <div className={full ? 'md:col-span-2' : ''}>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      {children}
    </div>
  );
}

function EmployeeView({ employee }) {
  const status = EMPLOYEE_STATUS[employee.status];
  return (
    <div>
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-14 h-14 rounded-full bg-brand text-white flex items-center justify-center font-bold text-xl">
          {employee.user.fullName.charAt(0)}
        </div>
        <div>
          <p className="font-bold text-gray-800 text-lg">{employee.user.fullName}</p>
          <p className="text-sm text-gray-500">{employee.position}</p>
        </div>
      </div>

      <div className="space-y-3 pt-4 text-sm">
        <Row label="ኮድ" value={employee.employeeCode} mono />
        <Row label="ስልክ" value={employee.user.phone} />
        <Row label="ኢሜይል" value={employee.user.email || '-'} />
        <Row label="ክፍል" value={employee.department} />
        <Row label="ደመወዝ" value={formatETB(employee.salary)} bold color="text-brand" />
        <Row label="ቅርንጫፍ" value={employee.branch?.name || '-'} />
        <Row label="ተቀጠረ" value={formatDate(employee.hireDate)} />
        <div className="flex justify-between items-center">
          <span className="text-gray-500">ሁኔታ:</span>
          <Badge color={status.color}>{status.label}</Badge>
        </div>
      </div>

      {employee.emergencyContact?.name && (
        <div className="pt-4 border-t border-gray-100 mt-4">
          <p className="text-xs font-semibold text-gray-600 mb-2">የአደጋ ጊዜ እውቂያ</p>
          <Row label="ስም" value={employee.emergencyContact.name} />
          <Row label="ስልክ" value={employee.emergencyContact.phone} />
        </div>
      )}

      <div className="pt-4 border-t border-gray-100 mt-4">
        <p className="text-xs font-semibold text-gray-600 mb-2">ፈቃዶች</p>
        <div className="grid grid-cols-2 gap-1.5">
          {PERMISSIONS_LIST.map((perm) => (
            <div key={perm.key} className="flex items-center gap-1.5 text-xs">
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                employee.permissions[perm.key] ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
              }`}>
                {employee.permissions[perm.key] ? '✓' : '✕'}
              </span>
              <span className={employee.permissions[perm.key] ? 'text-gray-700' : 'text-gray-400'}>
                {perm.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, mono, bold, color }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-gray-500 flex-shrink-0">{label}:</span>
      <span className={`text-right ${bold ? 'font-semibold' : ''} ${mono ? 'font-mono text-xs' : ''} ${color || 'text-gray-800'}`}>
        {value}
      </span>
    </div>
  );
}
