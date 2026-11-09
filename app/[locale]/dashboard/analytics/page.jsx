'use client';

import { useState, useMemo } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import {
  DollarSign, TrendingUp, TrendingDown, ShoppingCart, BarChart3,
  PieChart as PieChartIcon, Calendar, Package, ArrowUp, ArrowDown,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { formatETB } from '@/lib/utils';
import {
  ANALYTICS_STATS, REVENUE_CHART, ORDERS_CHART,
  CATEGORY_CHART, BRANCH_PERFORMANCE, TOP_PRODUCTS, TIME_RANGES,
} from '@/lib/mockAnalytics';
import Card from '@/components/ui/Card';

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('month');

  // ✅ Admin ብቻ
  const canView = user?.role === 'admin';

  const stats = ANALYTICS_STATS[timeRange] || ANALYTICS_STATS.month;

  if (!canView) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <BarChart3 size={40} className="text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">ፍቃድ የለዎትም</h1>
        <p className="text-gray-600">የትንተና ገጽ ለአስተዳዳሪ ብቻ ነው።</p>
      </div>
    );
  }

  const profitMargin = stats.revenue > 0
    ? ((stats.profit / stats.revenue) * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">ትንተና</h1>
          <p className="text-sm text-gray-500 mt-1">
            የሽያጭ፣ የወጪ እና የትርፍ ሪፖርት
          </p>
        </div>

        {/* Time Range Filter */}
        <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-gray-100">
          {TIME_RANGES.map((r) => (
            <button
              key={r.key}
              onClick={() => setTimeRange(r.key)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                timeRange === r.key
                  ? 'bg-white text-brand shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <BigStat
          label="ጠቅላላ ገቢ"
          value={formatETB(stats.revenue)}
          icon={DollarSign}
          color="bg-green-500"
          trend={12}
          trendLabel="ካለፈው ጊዜ"
        />
        <BigStat
          label="ጠቅላላ ወጪ"
          value={formatETB(stats.expense)}
          icon={TrendingDown}
          color="bg-red-500"
          trend={-5}
          trendLabel="ካለፈው ጊዜ"
        />
        <BigStat
          label="ጠቅላላ ትርፍ"
          value={formatETB(stats.profit)}
          icon={TrendingUp}
          color="bg-brand"
          trend={18}
          trendLabel="ካለፈው ጊዜ"
        />
        <BigStat
          label="ትዕዛዞች"
          value={stats.orders}
          icon={ShoppingCart}
          color="bg-purple-500"
          trend={8}
          trendLabel="ካለፈው ጊዜ"
        />
      </div>

      {/* Profit Margin Summary */}
      <Card padding="md">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
              <TrendingUp size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">የትርፍ መጠን (Profit Margin)</p>
              <p className="text-2xl font-bold text-gray-800">{profitMargin}%</p>
            </div>
          </div>
          <div className="flex-1 max-w-md">
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(profitMargin, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1.5">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Revenue & Expense Chart */}
      <Card padding="md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <BarChart3 size={18} className="text-brand" />
              ገቢ vs ወጪ
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">የ6 ወራት አዝማሚያ</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-brand" />
              ገቢ
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              ወጪ
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={REVENUE_CHART}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1d4ed8" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} />
            <YAxis stroke="#9ca3af" fontSize={11} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
              formatter={(v) => formatETB(v)}
            />
            <Area type="monotone" dataKey="revenue" stroke="#1d4ed8" strokeWidth={2} fill="url(#revenueGradient)" />
            <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} fill="url(#expenseGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Orders + Category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monthly Orders */}
        <Card padding="md">
          <div className="mb-4">
            <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <ShoppingCart size={18} className="text-purple-500" />
              ወርሃዊ ትዕዛዞች
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">የ6 ወራት ትዕዛዞች</p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ORDERS_CHART}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} />
              <YAxis stroke="#9ca3af" fontSize={11} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
                formatter={(v) => [`${v}`, 'ትዕዛዞች']}
              />
              <Bar dataKey="orders" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Category Sales */}
        <Card padding="md">
          <div className="mb-4">
            <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <PieChartIcon size={18} className="text-blue-500" />
              የምድብ ሽያጭ
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">የምርት ምድብ ድርሻ</p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={CATEGORY_CHART}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={50}
                paddingAngle={3}
                label={(e) => `${e.name} ${e.value}%`}
              >
                {CATEGORY_CHART.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
                formatter={(v) => [`${v}%`, 'ድርሻ']}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Branch Performance */}
      <Card padding="md">
        <div className="mb-4">
          <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
            <BarChart3 size={18} className="text-brand" />
            የቅርንጫፍ አፈጻጸም
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">ገቢ vs ወጪ በቅርንጫፍ</p>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={BRANCH_PERFORMANCE} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" stroke="#9ca3af" fontSize={11} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
            <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={11} width={70} />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
              formatter={(v) => formatETB(v)}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="revenue" fill="#1d4ed8" name="ገቢ" radius={[0, 6, 6, 0]} />
            <Bar dataKey="expense" fill="#ef4444" name="ወጪ" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Top Products */}
      <Card padding="md">
        <div className="mb-4">
          <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
            <Package size={18} className="text-purple-500" />
            ምርጥ ምርቶች
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">በሽያጭ መጠን የተደረገ ደረጃ</p>
        </div>
        <div className="space-y-2">
          {TOP_PRODUCTS.map((product, i) => {
            const maxRevenue = TOP_PRODUCTS[0].revenue;
            const percent = (product.revenue / maxRevenue) * 100;
            return (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                  i === 0 ? 'bg-yellow-100 text-yellow-700' :
                  i === 1 ? 'bg-gray-100 text-gray-700' :
                  i === 2 ? 'bg-orange-100 text-orange-700' :
                  'bg-blue-50 text-blue-600'
                }`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                    <p className="text-xs text-gray-500 ml-2 flex-shrink-0">{product.sold} ተሽጧል</p>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-brand rounded-full transition-all" style={{ width: `${percent}%` }} />
                  </div>
                </div>
                <p className="text-sm font-semibold text-brand flex-shrink-0 ml-2">
                  {formatETB(product.revenue)}
                </p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Summary Footer */}
      <Card padding="md" className="bg-gradient-to-br from-brand to-brand-dark text-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold">{profitMargin}%</p>
            <p className="text-xs text-blue-100 mt-1">የትርፍ መጠን</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{stats.orders}</p>
            <p className="text-xs text-blue-100 mt-1">ትዕዛዞች</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{formatETB(stats.profit)}</p>
            <p className="text-xs text-blue-100 mt-1">ትርፍ</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{formatETB(stats.revenue)}</p>
            <p className="text-xs text-blue-100 mt-1">ገቢ</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ============ Big Stat Card ============
function BigStat({ label, value, icon: Icon, color, trend, trendLabel }) {
  return (
    <Card padding="md">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-xl md:text-2xl font-bold text-gray-800 mt-1 truncate">{value}</p>
          {trend !== undefined && (
            <p className={`text-xs mt-2 flex items-center gap-1 ${
              trend > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend > 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
              <span className="font-medium">{Math.abs(trend)}%</span>
              <span className="text-gray-400">{trendLabel}</span>
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color} flex-shrink-0`}>
          <Icon size={22} className="text-white" />
        </div>
      </div>
    </Card>
  );
}
