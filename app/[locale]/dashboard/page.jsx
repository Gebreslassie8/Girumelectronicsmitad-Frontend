'use client';

import { useState, useMemo } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from '@/i18n/navigation';
import Link from 'next/link';
import {
  Package, ShoppingCart, FileText, TrendingUp, TrendingDown,
  DollarSign, Users, Shield, Briefcase, ArrowRight, Plus,
  BarChart3, Building2, Clock, CheckCircle2, AlertTriangle,
  Activity, Calendar, Filter, X, ChevronDown,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from 'recharts';

// ============ Mock Data ============
const WEEKLY_SALES = [
  { day: 'ሰኞ',  sales: 12500, orders: 4 },
  { day: 'ማክሰ', sales: 18900, orders: 6 },
  { day: 'ረቡዕ', sales: 15200, orders: 5 },
  { day: 'ሐሙስ', sales: 22100, orders: 8 },
  { day: 'አርብ', sales: 28500, orders: 10 },
  { day: 'ቅዳሜ', sales: 34200, orders: 13 },
  { day: 'እሁድ', sales: 19800, orders: 7 },
];

const MONTHLY_ORDERS = [
  { month: 'ሴፕ',  orders: 45 },
  { month: 'ኦክቶ', orders: 62 },
  { month: 'ኖቬም', orders: 78 },
  { month: 'ዲሴም', orders: 55 },
  { month: 'ጃን',  orders: 89 },
  { month: 'ፌብ',  orders: 92 },
];

const RECENT_ORDERS = [
  { id: 1, customer: 'አበበ ከበደ',  item: 'ምጣድ',    total: 2500, status: 'pending',       statusLabel: 'በመጠባበቅ',  color: 'yellow', branch: 'b1', date: '2026-11-10' },
  { id: 2, customer: 'ሳራ ሀብታሙ',  item: 'ቆጣቢ',    total: 1800, status: 'in_production', statusLabel: 'በምርት ላይ',  color: 'blue',   branch: 'b1', date: '2026-11-10' },
  { id: 3, customer: 'ዳዊት ተስፋዬ', item: 'ምጣድ',    total: 3200, status: 'ready',         statusLabel: 'ተዘጋጅቷል', color: 'green',  branch: 'b2', date: '2026-11-09' },
  { id: 4, customer: 'ግርማ አለሙ',  item: 'አክሰሰሪ',  total: 950,  status: 'delivered',     statusLabel: 'ተላልፏል',   color: 'gray',   branch: 'b2', date: '2026-11-09' },
  { id: 5, customer: 'ሜሮን ተስፋ',  item: 'ምጣድ',    total: 2700, status: 'pending',       statusLabel: 'በመጠባበቅ',  color: 'yellow', branch: 'b3', date: '2026-11-08' },
  { id: 6, customer: 'ሰለሞን ገብረ', item: 'ምጣድ',    total: 3500, status: 'delivered',     statusLabel: 'ተላልፏል',   color: 'gray',   branch: 'b1', date: '2026-10-15' },
  { id: 7, customer: 'ሀና ተስፋዬ',  item: 'ቆጣቢ',    total: 2100, status: 'delivered',     statusLabel: 'ተላልፏል',   color: 'gray',   branch: 'b3', date: '2026-09-20' },
];

const LOW_STOCK = [
  { name: 'ማገዶ ቆጣቢ ምጣድ', quantity: 5, min: 10 },
  { name: 'ትልቅ ምጣድ',      quantity: 3, min: 10 },
  { name: 'አክሰሰሪ',        quantity: 0, min: 10 },
];

const BRANCHES = [
  { _id: 'all', name: 'ሁሉም ቅርንጫፎች' },
  { _id: 'b1',  name: 'ቦሌ ቅርንጫፍ' },
  { _id: 'b2',  name: 'መርካቶ ቅርንጫፍ' },
  { _id: 'b3',  name: 'ፒያሳ ቅርንጫፍ' },
];

const DATE_RANGES = [
  { key: 'today', label: 'ዛሬ' },
  { key: 'week',  label: 'ሳምንት' },
  { key: 'month', label: 'ወር' },
  { key: 'year',  label: 'ዓመት' },
  { key: 'all',   label: 'ሁሉም' },
];

const ROLE_INFO = {
  admin:    { icon: Shield,    label: 'አስተዳዳሪ', color: 'from-purple-600 via-purple-500 to-indigo-600', desc: 'ሙሉ ስርዓት ቁጥጥር እና ትንተና' },
  seller:   { icon: Briefcase, label: 'ሻጭ',      color: 'from-blue-600 via-blue-500 to-cyan-600',       desc: 'ትዕዛዞች እና ሽያጭ አስተዳደር' },
  customer: { icon: Users,     label: 'ደንበኛ',   color: 'from-green-600 via-green-500 to-emerald-600',  desc: 'የእኔ ትዕዛዞች እና ግዢዎች' },
};

const QUICK_ACTIONS = {
  admin: [
    { label: 'አዲስ ምርት',   icon: Plus,      href: '/dashboard/products',  color: 'bg-blue-500' },
    { label: 'አዲስ ሠራተኛ',  icon: Users,     href: '/dashboard/employees', color: 'bg-purple-500' },
    { label: 'አዲስ ቅርንጫፍ', icon: Building2, href: '/dashboard/branches',  color: 'bg-orange-500' },
    { label: 'ሪፖርት',       icon: BarChart3, href: '/dashboard/analytics', color: 'bg-green-500' },
  ],
  seller: [
    { label: 'አዲስ ትዕዛዝ',  icon: Plus,     href: '/dashboard/orders',   color: 'bg-blue-500' },
    { label: 'አዲስ ደረሰኝ',  icon: FileText, href: '/dashboard/receipts', color: 'bg-purple-500' },
    { label: 'ምርቶች',      icon: Package,  href: '/dashboard/products', color: 'bg-green-500' },
  ],
  customer: [
    { label: 'ምርቶችን ይመልከቱ', icon: Package,  href: '/dashboard/products', color: 'bg-green-500' },
    { label: 'የእኔ ትዕዛዞች',    icon: FileText, href: '/dashboard/orders',   color: 'bg-blue-500' },
    { label: 'ደረሰኞች',        icon: FileText, href: '/dashboard/receipts', color: 'bg-purple-500' },
  ],
};

// ============ Helper: Date Filter ============
function filterByDate(dateStr, range) {
  if (range === 'all') return true;
  const now = new Date();
  const date = new Date(dateStr);
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  switch (range) {
    case 'today': return diffDays === 0;
    case 'week':  return diffDays <= 7;
    case 'month': return diffDays <= 30;
    case 'year':  return diffDays <= 365;
    default: return true;
  }
}

// ============ Main ============
export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  const role = user?.role || 'customer';
  const info = ROLE_INFO[role] || ROLE_INFO.customer;
  const RoleIcon = info.icon;

  // Filter state
  const [dateRange, setDateRange] = useState('week');
  const [branchFilter, setBranchFilter] = useState('all');
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return RECENT_ORDERS.filter((o) => {
      const matchDate = filterByDate(o.date, dateRange);
      const matchBranch = branchFilter === 'all' || o.branch === branchFilter;
      return matchDate && matchBranch;
    });
  }, [dateRange, branchFilter]);

  // Dynamic stats based on filters
  const dynamicStats = useMemo(() => {
    const orderCount = filteredOrders.length;
    const totalRevenue = filteredOrders.reduce((s, o) => s + o.total, 0);
    const totalProfit = Math.round(totalRevenue * 0.58);
    const pending = filteredOrders.filter((o) => o.status === 'pending').length;
    const delivered = filteredOrders.filter((o) => o.status === 'delivered').length;

    if (role === 'admin') {
      return [
        { label: 'የዕለት ገቢ',    value: `ETB ${totalRevenue.toLocaleString()}`,  icon: DollarSign,   color: 'bg-green-500',  trend: 12,  change: 'ካለፈው ቀን' },
        { label: 'የዕለት ትርፍ',   value: `ETB ${totalProfit.toLocaleString()}`,   icon: TrendingUp,   color: 'bg-brand',      trend: 18,  change: 'ካለፈው ቀን' },
        { label: 'ትዕዛዞች',      value: String(orderCount),                       icon: ShoppingCart, color: 'bg-purple-500', trend: 8,   change: 'ካለፈው ቀን' },
        { label: 'ሠራተኞች',      value: '30',                                       icon: Users,        color: 'bg-orange-500' },
      ];
    }
    if (role === 'seller') {
      return [
        { label: 'የእኔ ትዕዛዞች',  value: String(orderCount),                       icon: ShoppingCart, color: 'bg-blue-500' },
        { label: 'የዕለት ሽያጭ',   value: `ETB ${totalRevenue.toLocaleString()}`,   icon: DollarSign,   color: 'bg-green-500',  trend: 5 },
        { label: 'ተጠባባቂ',      value: String(pending),                          icon: Clock,        color: 'bg-yellow-500' },
        { label: 'ተላልፈዋል',     value: String(delivered),                        icon: CheckCircle2, color: 'bg-brand' },
      ];
    }
    return [
      { label: 'የእኔ ትዕዛዞች',  value: String(orderCount),                       icon: ShoppingCart, color: 'bg-blue-500' },
      { label: 'በመጠባበቅ',     value: String(pending),                          icon: Clock,        color: 'bg-yellow-500' },
      { label: 'ተዘጋጅቷል',    value: String(filteredOrders.filter((o) => o.status === 'ready').length), icon: Package, color: 'bg-green-500' },
      { label: 'ተላልፏል',      value: String(delivered),                        icon: CheckCircle2, color: 'bg-gray-500' },
    ];
  }, [filteredOrders, role]);

  // Active filter count
  const activeFilters = (dateRange !== 'week' ? 1 : 0) + (branchFilter !== 'all' ? 1 : 0);

  const clearFilters = () => {
    setDateRange('week');
    setBranchFilter('all');
  };

  const showAnalytics = role === 'admin';
  const showLowStock = role === 'admin' || role === 'seller';

  return (
    <div className="space-y-6">
      {/* ============ Welcome Hero ============ */}
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${info.color} p-6 md:p-8 text-white shadow-lg`}>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center">
              <RoleIcon size={22} />
            </div>
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur text-xs font-semibold uppercase tracking-wide">
              {info.label}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">
            እንኳን ደህና መጡ, {user?.fullName || 'ተጠቃሚ'}! 👋
          </h1>
          <p className="text-white/85 text-sm md:text-base">{info.desc}</p>
          <div className="mt-4 flex items-center gap-2 text-white/70 text-xs">
            <Calendar size={14} />
            <span>{new Date().toLocaleDateString('am-ET', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
        <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-white/10" />
        <div className="absolute top-4 right-8 w-32 h-32 rounded-full bg-white/10" />
      </div>

      {/* ============ Filter Bar ============ */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />
            <span className="text-sm font-semibold text-gray-700">ማጣሪያዎች</span>
            {activeFilters > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand text-white text-[10px] font-bold">
                {activeFilters}
              </span>
            )}
          </div>

          <button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition sm:hidden"
          >
            <Filter size={14} />
            {showFilterPanel ? 'ዝጋ' : 'ክፈት'}
          </button>

          {/* Desktop filters */}
          <div className="hidden sm:flex items-center gap-3 flex-wrap">
            <DateRangeFilter value={dateRange} onChange={setDateRange} />
            {(role === 'admin' || role === 'seller') && (
              <BranchFilter value={branchFilter} onChange={setBranchFilter} />
            )}
            {activeFilters > 0 && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 text-xs text-red-600 hover:underline font-medium"
              >
                <X size={12} /> አጽዳ
              </button>
            )}
          </div>
        </div>

        {/* Mobile filter panel */}
        {showFilterPanel && (
          <div className="sm:hidden mt-3 pt-3 border-t border-gray-200 space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">የቀን ክልል</label>
              <DateRangeFilter value={dateRange} onChange={setDateRange} full />
            </div>
            {(role === 'admin' || role === 'seller') && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">ቅርንጫፍ</label>
                <BranchFilter value={branchFilter} onChange={setBranchFilter} full />
              </div>
            )}
            {activeFilters > 0 && (
              <button
                onClick={clearFilters}
                className="w-full inline-flex items-center justify-center gap-1 text-sm text-red-600 font-medium py-2 rounded-lg border border-red-200 hover:bg-red-50"
              >
                <X size={14} /> ሁሉንም አጽዳ
              </button>
            )}
          </div>
        )}
      </div>

      {/* ============ Stats Grid (Dynamic) ============ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dynamicStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="group bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md hover:border-brand/30 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-500 truncate">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                  {stat.trend !== undefined && (
                    <p className={`text-xs mt-2 flex items-center gap-1 ${stat.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      <span className="font-medium">{Math.abs(stat.trend)}%</span>
                      <span className="text-gray-400">{stat.change || 'ካለፈው ሳምንት'}</span>
                    </p>
                  )}
                </div>
                <div className={`p-3 rounded-lg ${stat.color} shadow-sm group-hover:scale-110 transition-transform`}>
                  <Icon size={22} className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ============ Quick Actions ============ */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-gray-800">ፈጣን ተግባራት</h2>
            <p className="text-xs text-gray-500 mt-0.5">በአንድ ጠቅታ ይጀምሩ</p>
          </div>
          <Activity size={18} className="text-gray-400" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(QUICK_ACTIONS[role] || QUICK_ACTIONS.customer).map((action, i) => {
            const Icon = action.icon;
            return (
              <button
                key={i}
                onClick={() => router.push(action.href)}
                className="group flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-brand hover:bg-gray-50 transition-all text-left"
              >
                <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <Icon size={18} className="text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-brand transition">
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ============ Charts (Admin) ============ */}
      {showAnalytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-800">የሳምንት ሽያጭ</h3>
                <p className="text-xs text-gray-500 mt-0.5">7 ቀናት</p>
              </div>
              <div className="px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold">+12%</div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={WEEKLY_SALES}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1d4ed8" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#9ca3af" fontSize={11} />
                <YAxis stroke="#9ca3af" fontSize={11} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }} formatter={(v) => [`ETB ${v.toLocaleString()}`, 'ሽያጭ']} />
                <Area type="monotone" dataKey="sales" stroke="#1d4ed8" strokeWidth={2} fill="url(#salesGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-800">የወርሃዊ ትዕዛዞች</h3>
                <p className="text-xs text-gray-500 mt-0.5">6 ወራት</p>
              </div>
              <div className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">+18%</div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={MONTHLY_ORDERS}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} />
                <YAxis stroke="#9ca3af" fontSize={11} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }} formatter={(v) => [`${v}`, 'ትዕዛዞች']} />
                <Bar dataKey="orders" fill="#1d4ed8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ============ Recent Orders + Low Stock ============ */}
      <div className={`grid grid-cols-1 ${showLowStock ? 'lg:grid-cols-3' : ''} gap-4`}>
        <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-5 ${showLowStock ? 'lg:col-span-2' : ''}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-gray-800">የቅርብ ጊዜ ትዕዛዞች</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {filteredOrders.length} ትዕዛዞች {activeFilters > 0 && '· የተጣራ'}
              </p>
            </div>
            <Link href="/dashboard/orders" className="text-xs font-medium text-brand hover:underline flex items-center gap-1">
              ሁሉንም <ArrowRight size={12} />
            </Link>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Filter size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm">ምንም ትዕዛዝ አልተገኘም</p>
              <button onClick={clearFilters} className="mt-2 text-xs text-brand hover:underline font-medium">
                ማጣሪያዎችን አጽዳ
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredOrders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => router.push('/dashboard/orders')}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-brand/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-brand font-semibold text-xs">{order.customer.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{order.customer}</p>
                      <p className="text-xs text-gray-500">{order.item}</p>
                    </div>
                  </div>
                  <div className="text-right ml-3">
                    <p className="text-sm font-bold text-gray-800">{order.total.toLocaleString()} ETB</p>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium bg-${order.color}-100 text-${order.color}-700`}>
                      {order.statusLabel}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showLowStock && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                  <AlertTriangle size={16} className="text-yellow-500" />
                  ዝቅተኛ ክምችት
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">አስቸኳይ ትኩረት ይፈልጋል</p>
              </div>
            </div>
            <div className="space-y-3">
              {LOW_STOCK.map((item, i) => (
                <div key={i} className="p-3 rounded-lg bg-yellow-50/50 border border-yellow-100">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                    <span className={`text-xs font-bold ${item.quantity === 0 ? 'text-red-600' : 'text-yellow-600'}`}>
                      {item.quantity}/{item.min}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.quantity === 0 ? 'bg-red-500' : 'bg-yellow-500'} transition-all`}
                      style={{ width: `${Math.min((item.quantity / item.min) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <Link href="/dashboard/products" className="mt-4 w-full flex items-center justify-center gap-1 text-xs font-medium text-brand hover:underline">
              ሁሉንም ምርቶች <ArrowRight size={12} />
            </Link>
          </div>
        )}
      </div>

      {/* ============ Permissions ============ */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-gray-800">የእርስዎ ፈቃዶች</h2>
            <p className="text-xs text-gray-500 mt-0.5">በስርዓቱ ውስጥ ምን ማድረግ እንደሚችሉ</p>
          </div>
          <Shield size={18} className="text-gray-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {role === 'admin' && (
            <>
              <PermItem label="ሁሉንም ቅርንጫፎች ማስተዳደር" allowed />
              <PermItem label="ሠራተኞች መቅጠር" allowed />
              <PermItem label="ሂሳብ ትንተና ማየት" allowed />
              <PermItem label="ሁሉንም ትዕዛዞች ማስተዳደር" allowed />
            </>
          )}
          {role === 'seller' && (
            <>
              <PermItem label="ትዕዛዞች መቀበል" allowed />
              <PermItem label="ዕቃ መሸጥ" allowed />
              <PermItem label="ደረሰኝ ማውጣት" allowed />
              <PermItem label="ሠራተኞች መቅጠር" />
            </>
          )}
          {role === 'customer' && (
            <>
              <PermItem label="የራሴን ትዕዛዞች ማየት" allowed />
              <PermItem label="ደረሰኝ ማየት" allowed />
              <PermItem label="ምርቶችን መመልከት" allowed />
              <PermItem label="ትዕዛዝ ማስተዳደር" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ============ Sub-components ============
function DateRangeFilter({ value, onChange, full }) {
  return (
    <div className={`inline-flex items-center gap-1 p-1 rounded-lg bg-gray-100 ${full ? 'w-full' : ''}`}>
      {DATE_RANGES.map((r) => (
        <button
          key={r.key}
          onClick={() => onChange(r.key)}
          className={`px-3 py-1 rounded-md text-xs font-medium transition ${
            value === r.key
              ? 'bg-white text-brand shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          } ${full ? 'flex-1' : ''}`}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}

function BranchFilter({ value, onChange, full }) {
  return (
    <div className={`relative ${full ? 'w-full' : ''}`}>
      <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`pl-8 pr-8 py-1.5 border border-gray-300 rounded-lg text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-brand appearance-none cursor-pointer ${full ? 'w-full' : ''}`}
      >
        {BRANCHES.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
      </select>
      <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  );
}

function PermItem({ label, allowed }) {
  return (
    <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-50 transition">
      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
        allowed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
      }`}>
        {allowed ? '✓' : '✕'}
      </span>
      <span className={allowed ? 'text-gray-700 font-medium' : 'text-gray-400 line-through'}>
        {label}
      </span>
    </div>
  );
}
