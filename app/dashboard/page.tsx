'use client'

import React, { useMemo, useState } from 'react'
import {
  Package,
  AlertTriangle,
  DollarSign,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  X,
} from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts'

type Range = '7d' | '30d' | '90d'

// ---- Mock data generation (swap for real API data) ----
function generateSeries(range: Range) {
  const points = range === '7d' ? 7 : range === '30d' ? 30 : 90
  const labelFmt = (i: number) =>
    range === '7d'
      ? `Day ${i + 1}`
      : range === '30d'
      ? `${i + 1}`
      : `W${Math.ceil((i + 1) / 7)}`

  return Array.from({ length: points }, (_, i) => ({
    label: labelFmt(i),
    stockIn: Math.round(20 + Math.random() * 60),
    stockOut: Math.round(10 + Math.random() * 45),
  }))
}

const initialStats = [
  {
    label: 'Total Products',
    value: '1,284',
    change: '+4.2%',
    trend: 'up' as const,
    icon: Package,
    gradient: 'from-orange-50 to-white',
    iconBg: 'bg-gradient-to-br from-orange-500 to-orange-600',
    border: 'border-orange-100',
  },
  {
    label: 'Low Stock Items',
    value: '23',
    change: '+3',
    trend: 'down' as const,
    icon: AlertTriangle,
    gradient: 'from-red-50 to-white',
    iconBg: 'bg-gradient-to-br from-red-500 to-red-600',
    border: 'border-red-100',
  },
  {
    label: 'Inventory Value',
    value: '$142,890',
    change: '+8.1%',
    trend: 'up' as const,
    icon: DollarSign,
    gradient: 'from-emerald-50 to-white',
    iconBg: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    border: 'border-emerald-100',
  },
  {
    label: 'Categories',
    value: '18',
    change: '0',
    trend: 'neutral' as const,
    icon: Layers,
    gradient: 'from-blue-50 to-white',
    iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
    border: 'border-blue-100',
  },
]

const initialLowStock = [
  { name: 'Wireless Mouse M100', sku: 'SKU-2291', qty: 4, threshold: 10 },
  { name: 'USB-C Cable 1m', sku: 'SKU-1187', qty: 6, threshold: 15 },
  { name: 'A4 Paper Ream', sku: 'SKU-4402', qty: 8, threshold: 20 },
  { name: 'Laptop Stand Alu', sku: 'SKU-3390', qty: 2, threshold: 10 },
]

const initialActivity = [
  { action: 'Stock In', item: 'HDMI Cable 2m', qty: '+50', time: '2h ago', type: 'in' as const },
  { action: 'Stock Out', item: 'Office Chair Pro', qty: '-3', time: '4h ago', type: 'out' as const },
  { action: 'Stock In', item: 'Keyboard Mechanical', qty: '+25', time: '6h ago', type: 'in' as const },
  { action: 'Adjustment', item: 'Monitor 24"', qty: '-1', time: '1d ago', type: 'out' as const },
  { action: 'Stock In', item: 'Desk Lamp LED', qty: '+40', time: '1d ago', type: 'in' as const },
]

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-card border border-border bg-surface p-3 shadow-sm">
      <p className="mb-1 text-xs font-medium text-text-muted">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} className="text-sm font-medium text-text">
          <span
            className="mr-1.5 inline-block h-2 w-2 rounded-full align-middle"
            style={{ backgroundColor: p.color }}
          />
          {p.dataKey === 'stockIn' ? 'Stock In' : 'Stock Out'}: {p.value}
        </p>
      ))}
    </div>
  )
}

export default function Page() {
  const [range, setRange] = useState<Range>('7d')
  const chartData = useMemo(() => generateSeries(range), [range])

  const [lowStock, setLowStock] = useState(initialLowStock)
  const [activity, setActivity] = useState(initialActivity)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState({ name: '', sku: '', qty: '', price: '' })
  const [toast, setToast] = useState<string | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.sku || !form.qty) return

    setActivity((prev) => [
      {
        action: 'Stock In',
        item: form.name,
        qty: `+${form.qty}`,
        time: 'Just now',
        type: 'in',
      },
      ...prev,
    ])

    setToast(`${form.name} added to inventory`)
    setForm({ name: '', sku: '', qty: '', price: '' })
    setIsModalOpen(false)
    setTimeout(() => setToast(null), 3000)
  }

  function dismissLowStock(sku: string) {
    setLowStock((prev) => prev.filter((item) => item.sku !== sku))
  }

  return (
    <div className="min-h-screen bg-bg ">
      {/* Toast */}
      {toast && (
        <div className="fixed right-4 top-4 z-50 flex items-center gap-2 rounded-card border border-border bg-surface px-4 py-3 text-sm font-medium text-text shadow-lg">
          {toast}
        </div>
      )}

      {/* Page header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text">Dashboard</h1>
          <p className="mt-1 text-sm text-text-muted">
            Overview of your inventory performance
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-card bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {initialStats.map((stat) => {
        const Icon = stat.icon
        return (
        <div
            key={stat.label}
            className={`rounded-card border ${stat.border} bg-gradient-to-br ${stat.gradient} p-5 shadow-sm`}
        >
            <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text-muted">{stat.label}</span>
            <span
                className={`flex h-9 w-9 items-center justify-center rounded-card ${stat.iconBg} shadow-sm`}
            >
                <Icon className="h-4.5 w-4.5 text-white" />
            </span>
            </div>
            <div className="mt-3 flex items-end justify-between">
            <span className="text-2xl font-semibold text-text">{stat.value}</span>
            {stat.trend !== 'neutral' && (
                <span
                className={`flex items-center gap-1 text-xs font-medium ${
                    stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                }`}
                >
                {stat.trend === 'up' ? (
                    <ArrowUpRight className="h-3.5 w-3.5" />
                ) : (
                    <ArrowDownRight className="h-3.5 w-3.5" />
                )}
                {stat.change}
                </span>
            )}
            </div>
        </div>
        )
    })}
    </div>

      {/* Main content: chart (3/4) + low stock (1/4) */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-4">
        {/* Chart — Recharts, 3/4 width */}
        <div className="rounded-card border border-border bg-surface p-5 shadow-sm lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-text">Stock Movement</h2>
            <div className="flex gap-1 rounded-card border border-border bg-bg p-1">
              {(['7d', '30d', '90d'] as Range[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                    range === r
                      ? 'bg-primary text-white'
                      : 'text-text-muted hover:text-text'
                  }`}
                >
                  {r === '7d' ? '7 days' : r === '30d' ? '30 days' : '90 days'}
                </button>
              ))}
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="stockInGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="stockOutGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
                  axisLine={{ stroke: 'var(--color-border)' }}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={(value) => (
                    <span className="text-xs text-text-muted">
                      {value === 'stockIn' ? 'Stock In' : 'Stock Out'}
                    </span>
                  )}
                />
                <Area
                  type="monotone"
                  dataKey="stockIn"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  fill="url(#stockInGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="stockOut"
                  stroke="#dc2626"
                  strokeWidth={2}
                  fill="url(#stockOutGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Low stock alerts — 1/4 width */}
        <div className="rounded-card border border-border bg-surface p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-text">Low Stock</h2>
            <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
              {lowStock.length}
            </span>
          </div>
          {lowStock.length === 0 ? (
            <p className="py-6 text-center text-sm text-text-muted">All stocked up</p>
          ) : (
            <ul className="space-y-3">
              {lowStock.map((item) => (
                <li
                  key={item.sku}
                  className="flex items-center justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-text">{item.name}</p>
                    <p className="text-xs text-text-muted">{item.sku}</p>
                  </div>
                  <button
                    onClick={() => dismissLowStock(item.sku)}
                    className="shrink-0 rounded-md bg-red-50 px-2 py-1 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100"
                    title="Mark as restocked"
                  >
                    {item.qty} left
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Recent activity table */}
      <div className="rounded-card border border-border bg-surface shadow-sm">
        <div className="flex items-center justify-between border-b border-border p-5">
          <h2 className="text-base font-semibold text-text">Recent Activity</h2>
          <button className="text-sm font-medium text-primary hover:underline">View all</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-text-muted">
                <th className="px-5 py-3 font-medium">Action</th>
                <th className="px-5 py-3 font-medium">Item</th>
                <th className="px-5 py-3 font-medium">Quantity</th>
                <th className="px-5 py-3 font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {activity.map((entry, idx) => (
                <tr key={idx} className="border-b border-border last:border-0 hover:bg-bg">
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        entry.type === 'in'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-red-50 text-red-600'
                      }`}
                    >
                      {entry.action}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-text">{entry.item}</td>
                  <td
                    className={`px-5 py-3 font-medium ${
                      entry.type === 'in' ? 'text-emerald-600' : 'text-red-600'
                    }`}
                  >
                    {entry.qty}
                  </td>
                  <td className="px-5 py-3 text-text-muted">{entry.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-card border border-border bg-surface p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text">Add Product</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-md p-1 text-text-muted hover:bg-bg hover:text-text"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-text-muted">
                  Product name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. Wireless Keyboard"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-text-muted">SKU</label>
                  <input
                    name="sku"
                    value={form.sku}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="SKU-0000"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-text-muted">Quantity</label>
                  <input
                    name="qty"
                    type="number"
                    min="0"
                    value={form.qty}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-text-muted">
                  Price (optional)
                </label>
                <input
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="0.00"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-card border border-border py-2 text-sm font-medium text-text hover:bg-bg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-card bg-primary py-2 text-sm font-medium text-white hover:bg-primary-dark"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}