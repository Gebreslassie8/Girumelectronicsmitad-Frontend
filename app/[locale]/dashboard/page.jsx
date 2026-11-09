'use client';

import { Package, ShoppingCart, FileText, TrendingUp, TrendingDown, DollarSign, Users } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const STATS = {
  todayRevenue: 45200,
  todayExpense: 18700,
  todayProfit: 26500,
  todayOrders: 12,
  totalProducts: 48,
  totalCustomers: 156,
  monthlyRevenue: 1245600,
};

const WEEKLY_SALES = [
  { day: 'ሰኞ',  sales: 12500 },
  { day: 'ማክሰ', sales: 18900 },
  { day: 'ረቡዕ', sales: 15200 },
  { day: 'ሐሙስ', sales: 22100 },
  { day: 'አርብ', sales: 28500 },
  { day: 'ቅዳሜ', sales: 34200 },
  { day: 'እሁድ', sales: 19800 },
];

const CATEGORY_SALES = [
  { name: 'ምጣድ',    value: 45, color: '#1d4ed8' },
  { name: 'ቆጣቢ',    value: 30, color: '#3b82f6' },
  { name: 'አክሰሰሪ',  value: 15, color: '#60a5fa' },
  { name: 'ሌላ',     value: 10, color: '#93c5fd' },
];

const BRANCH_PERF = [
  { name: 'ቦሌ',    income: 420000, expense: 150000 },
  { name: 'መርካቶ',  income: 380000, expense: 180000 },
  { name: 'ፒያሳ',   income: 290000, expense: 120000 },
  { name: 'ሱሚት',   income: 155600, expense: 28900 },
];

const RECENT_ORDERS = [
  { id: '1', number: 'ORD-2026-0012', customer: 'አበበ ከበደ',  item: 'ምጣድ',    total: 2500, status: 'በመጠባበቅ',  color: 'yellow' },
  { id: '2', number: 'ORD-2026-0011', customer: 'ሳራ ሀብታሙ',  item: 'ቆጣቢ',    total: 1800, status: 'በምርት ላይ',  color: 'blue' },
  { id: '3', number: 'ORD-2026-0010', customer: 'ዳዊት ተስፋዬ', item: 'ምጣድ',    total: 3200, status: 'ተዘጋጅቷል', color: 'green' },
  { id: '4', number: 'ORD-2026-0009', customer: 'ግርማ አለሙ',  item: 'አክሰሰሪ',  total: 950,  status: 'ተላልፏል',   color: 'gray' },
  { id: '5', number: 'ORD-2026-0008', customer: 'ሜሮን ተስፋ',  item: 'ምጣድ',    total: 2700, status: 'በመጠባበቅ',  color: 'yellow' },
];

const formatETB = (amount) =>
  new Intl.NumberFormat('am-ET', { style: 'currency', currency: 'ETB' }).format(amount || 0);

const BADGE_COLORS = {
  yellow: 'bg-yellow-100 text-yellow-800',
  blue:   'bg-blue-100 text-blue-800',
  green:  'bg-green-100 text-green-800',
  gray:   'bg-gray-100 text-gray-800',
  red:    'bg-red-100 text-red-800',
};

function StatCard({ label, value, icon: Icon, color, trend }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
          {trend !== undefined && (
            <p className={`text-xs mt-2 flex items-center gap-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {Math.abs(trend)}% ካለፈው ሳምንት
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon size={22} className="text-white" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">ዳሽቦርድ</h1>
        <p className="text-sm text-gray-500 mt-1">አጠቃላይ ስርዓት ሁኔታ</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="የዕለት ገቢ"      value={formatETB(STATS.todayRevenue)} icon={DollarSign}  color="bg-green-500"  trend={12} />
        <StatCard label="የዕለት ወጪ"      value={formatETB(STATS.todayExpense)} icon={TrendingDown} color="bg-red-500"    trend={-5} />
        <StatCard label="የዕለት ትርፍ"     value={formatETB(STATS.todayProfit)}  icon={TrendingUp}  color="bg-brand"      trend={18} />
        <StatCard label="የዕለት ትዕዛዞች" value={STATS.todayOrders}             icon={ShoppingCart} color="bg-purple-500" trend={8} />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="ጠቅላላ ምርቶች"     value={STATS.totalProducts}          icon={Package}   color="bg-indigo-500" />
        <StatCard label="ጠቅላላ ደንበኞች"   value={STATS.totalCustomers}         icon={Users}     color="bg-teal-500" />
        <StatCard label="የወር ገቢ"        value={formatETB(STATS.monthlyRevenue)} icon={FileText} color="bg-orange-500" trend={22} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">የሳምንት ሽያጭ</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={WEEKLY_SALES}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb' }} formatter={(v) => [formatETB(v), 'ሽያጭ']} />
              <Bar dataKey="sales" fill="#1d4ed8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">የምድብ ሽያጭ</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={CATEGORY_SALES} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={(e) => `${e.name} ${e.value}%`}>
                {CATEGORY_SALES.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Branch + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">የቅርንጫፍ አፈጻጸም</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={BRANCH_PERF} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" stroke="#9ca3af" fontSize={12} />
              <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={12} width={70} />
              <Tooltip formatter={(v) => formatETB(v)} />
              <Legend />
              <Bar dataKey="income"  fill="#1d4ed8" name="ገቢ"  radius={[0, 6, 6, 0]} />
              <Bar dataKey="expense" fill="#ef4444" name="ወጪ" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">የቅርብ ጊዜ ትዕዛዞች</h3>
          <div className="space-y-3">
            {RECENT_ORDERS.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{order.customer}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{order.number} · {order.item}</p>
                </div>
                <div className="text-right ml-3">
                  <p className="text-sm font-semibold text-gray-800">{formatETB(order.total)}</p>
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${BADGE_COLORS[order.color]}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
