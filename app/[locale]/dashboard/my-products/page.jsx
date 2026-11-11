'use client';

import { useState, useMemo } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import {
  ShoppingCart, Package, History, DollarSign, Clock, CheckCircle2,
  Search, Calendar, Filter, TrendingUp, Eye, X, Building2, Phone,
  MapPin, FileText, ChevronDown,
} from 'lucide-react';
import { formatETB, formatDate } from '@/lib/utils';
import { MOCK_ORDERS, ORDER_STATUS } from '@/lib/mockOrders';
import { MOCK_PRODUCTS } from '@/lib/mockProducts';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import toast from 'react-hot-toast';

const DATE_RANGES = [
  { key: 'all',   label: 'ሁሉም' },
  { key: 'week',  label: 'ሳምንት' },
  { key: 'month', label: 'ወር' },
  { key: 'year',  label: 'ዓመት' },
];

const STATUS_FILTERS = [
  { key: 'all',           label: 'ሁሉም' },
  { key: 'pending',       label: 'በመጠባበቅ' },
  { key: 'in_production', label: 'በምርት ላይ' },
  { key: 'ready',         label: 'ተዘጋጅቷል' },
  { key: 'delivered',     label: 'ተላልፏል' },
];

function filterByDate(dateStr, range) {
  if (range === 'all') return true;
  const now = new Date();
  const date = new Date(dateStr);
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  switch (range) {
    case 'week':  return diffDays <= 7;
    case 'month': return diffDays <= 30;
    case 'year':  return diffDays <= 365;
    default: return true;
  }
}

export default function MyProductsPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [viewItem, setViewItem] = useState(null);

  // ✅ የ Customer ትዕዛዞች ብቻ
  const myOrders = useMemo(() => {
    return MOCK_ORDERS.filter((o) => o.customerPhone === user?.phone);
  }, [user]);

  // ✅ የገዛቸው ምርቶች ዝርዝር
  const purchasedItems = useMemo(() => {
    return myOrders.map((o) => {
      const product = MOCK_PRODUCTS.find(
        (p) => p.category === o.itemType || p.name === o.itemType
      );
      return { ...o, product };
    });
  }, [myOrders]);

  // ✅ Filter + Search
  const filtered = useMemo(() => {
    return purchasedItems.filter((item) => {
      const q = search.toLowerCase();
      const matchSearch =
        item.orderNumber.toLowerCase().includes(q) ||
        item.itemType.toLowerCase().includes(q) ||
        (item.product?.name || '').toLowerCase().includes(q);
      const matchStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchDate = filterByDate(item.createdAt, dateRange);
      return matchSearch && matchStatus && matchDate;
    });
  }, [purchasedItems, search, statusFilter, dateRange]);

  // ✅ Stats
  const stats = useMemo(() => {
    const total = purchasedItems.length;
    const totalSpent = purchasedItems.reduce((s, o) => s + o.totalPrice, 0);
    const delivered = purchasedItems.filter((o) => o.status === 'delivered').length;
    const pending = purchasedItems.filter((o) => o.status === 'pending').length;
    return { total, totalSpent, delivered, pending };
  }, [purchasedItems]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">ምርቶች ታሪክ</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filtered.length} የገዙት ምርቶች · {formatETB(stats.totalSpent)} ጠቅላላ ወጪ
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="ጠቅላላ ግዢዎች"
          value={stats.total}
          icon={ShoppingCart}
          color="bg-blue-500"
        />
        <StatCard
          label="ጠቅላላ ወጪ"
          value={formatETB(stats.totalSpent)}
          icon={DollarSign}
          color="bg-green-500"
        />
        <StatCard
          label="የተላለፉ"
          value={stats.delivered}
          icon={CheckCircle2}
          color="bg-purple-500"
        />
        <StatCard
          label="በመጠባበቅ"
          value={stats.pending}
          icon={Clock}
          color="bg-yellow-500"
        />
      </div>

      {/* Filters */}
      <Card padding="sm">
        <div className="space-y-3">
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="ፈልግ (ትዕዛዝ ቁጥር፣ ዕቃ፣ ምርት)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm"
            />
          </div>

          {/* Status + Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Status Filter */}
            <div className="flex items-center gap-1 overflow-x-auto p-1 rounded-lg bg-gray-100">
              <Filter size={14} className="text-gray-500 ml-2 flex-shrink-0" />
              {STATUS_FILTERS.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setStatusFilter(s.key)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition whitespace-nowrap ${
                    statusFilter === s.key
                      ? 'bg-white text-brand shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Date Range */}
            <div className="flex items-center gap-1 p-1 rounded-lg bg-gray-100">
              <Calendar size={14} className="text-gray-500 ml-2 flex-shrink-0" />
              {DATE_RANGES.map((r) => (
                <button
                  key={r.key}
                  onClick={() => setDateRange(r.key)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition flex-1 ${
                    dateRange === r.key
                      ? 'bg-white text-brand shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">ትዕዛዝ ቁጥር</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">ዕቃ</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">ብዛት</th>
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
                        <ShoppingCart size={28} className="text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-sm">ምንም የተገዛ ምርት አልተገኘም</p>
                      <p className="text-xs text-gray-400">
                        {search || statusFilter !== 'all' || dateRange !== 'all'
                          ? 'ማጣሪያዎችዎን ያስተካክሉ'
                          : 'እስካሁን ምንም አልገዙም'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const status = ORDER_STATUS[item.status];
                  return (
                    <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs text-brand font-medium">
                        {item.orderNumber}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0">
                            <ShoppingCart size={16} className="text-brand" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{item.itemType}</p>
                            {item.product?.name && (
                              <p className="text-xs text-gray-500 truncate max-w-xs">
                                {item.product.name}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center font-semibold text-gray-800">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-800">
                        {formatETB(item.totalPrice)}
                      </td>
                      <td className="px-4 py-3 text-right text-green-600 font-medium">
                        {formatETB(item.prepayment)}
                      </td>
                      <td className="px-4 py-3 text-right text-red-600 font-medium">
                        {formatETB(item.remainingPayment)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge color={status.color}>{status.label}</Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => setViewItem(item)}
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                            title="ይመልከቱ"
                          >
                            <Eye size={16} />
                          </button>
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

      {/* View Modal */}
      <Modal
        isOpen={!!viewItem}
        onClose={() => setViewItem(null)}
        title="የግዢ ዝርዝር"
      >
        {viewItem && <OrderDetailView item={viewItem} />}
      </Modal>
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

function OrderDetailView({ item }) {
  const status = ORDER_STATUS[item.status];
  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-14 h-14 rounded-xl bg-brand/10 flex items-center justify-center">
          <ShoppingCart size={28} className="text-brand" />
        </div>
        <div>
          <p className="font-bold text-gray-800 text-lg">{item.itemType}</p>
          <p className="text-sm text-gray-500 font-mono">{item.orderNumber}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 py-4">
        <StatBox
          label="ጠቅላላ"
          value={formatETB(item.totalPrice)}
          icon={DollarSign}
          color="text-blue-600 bg-blue-50"
        />
        <StatBox
          label="ቅድመ"
          value={formatETB(item.prepayment)}
          icon={CheckCircle2}
          color="text-green-600 bg-green-50"
        />
        <StatBox
          label="ቀሪ"
          value={formatETB(item.remainingPayment)}
          icon={Clock}
          color="text-red-600 bg-red-50"
        />
      </div>

      {/* Info */}
      <div className="space-y-3 pt-3 border-t border-gray-100 text-sm">
        <Row label="ዕቃ" value={`${item.itemType} × ${item.quantity}`} icon={Package} />
        <Row label="ቀን" value={formatDate(item.createdAt)} icon={Calendar} />
        <Row label="ቀጠሮ" value={formatDate(item.appointmentDate)} icon={Calendar} />
        <Row label="ቅርንጫፍ" value={item.branch?.name || '-'} icon={Building2} />
        {item.measurements?.width && (
          <Row
            label="ልኬት"
            value={`${item.measurements.width} × ${item.measurements.height} ${item.measurements.unit}`}
          />
        )}
        {item.note && <Row label="ማስታወሻ" value={item.note} />}
        <div className="flex justify-between items-center">
          <span className="text-gray-500">ሁኔታ:</span>
          <Badge color={status.color}>{status.label}</Badge>
        </div>
      </div>

      {/* Product Details */}
      {item.product && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-600 mb-2">የምርት ዝርዝር</p>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
            <div className="w-12 h-12 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0">
              <ShoppingCart size={20} className="text-brand" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 truncate">{item.product.name}</p>
              <p className="text-xs text-gray-500">{item.product.category}</p>
            </div>
            <p className="text-sm font-semibold text-brand flex-shrink-0">
              {formatETB(item.product.sellingPrice)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value, icon: Icon, color }) {
  return (
    <div className={`rounded-lg p-2.5 text-center ${color.split(' ')[1]}`}>
      <div className="flex items-center justify-center mb-1">
        <Icon size={16} className={color.split(' ')[0]} />
      </div>
      <p className="text-xs font-bold text-gray-800">{value}</p>
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
