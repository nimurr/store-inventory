"use client";

import {
  Search,
  Filter,
  Plus,
  Download,
  MoreVertical,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  X,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Printer,
  Trash2,
} from "lucide-react";
import { useState, useMemo } from "react";

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

interface Order {
  id: string;
  customer: string;
  email: string;
  date: string;
  items: number;
  total: number;
  status: OrderStatus;
  payment: "paid" | "unpaid" | "refunded";
}

const initialOrders: Order[] = [
  { id: "ORD-2024", customer: "Rahim Uddin", email: "rahim@mail.com", date: "2026-07-28", items: 4, total: 12500, status: "pending", payment: "paid" },
  { id: "ORD-2023", customer: "Nusrat Jahan", email: "nusrat@mail.com", date: "2026-07-27", items: 2, total: 4800, status: "processing", payment: "paid" },
  { id: "ORD-2022", customer: "Kamal Hossain", email: "kamal@mail.com", date: "2026-07-27", items: 7, total: 23400, status: "shipped", payment: "paid" },
  { id: "ORD-2021", customer: "Sadia Islam", email: "sadia@mail.com", date: "2026-07-26", items: 1, total: 1200, status: "delivered", payment: "paid" },
  { id: "ORD-2020", customer: "Tanvir Ahmed", email: "tanvir@mail.com", date: "2026-07-26", items: 3, total: 8900, status: "cancelled", payment: "refunded" },
  { id: "ORD-2019", customer: "Farzana Akter", email: "farzana@mail.com", date: "2026-07-25", items: 5, total: 15600, status: "delivered", payment: "paid" },
  { id: "ORD-2018", customer: "Imran Khan", email: "imran@mail.com", date: "2026-07-25", items: 2, total: 3200, status: "pending", payment: "unpaid" },
  { id: "ORD-2017", customer: "Mou Rahman", email: "mou@mail.com", date: "2026-07-24", items: 6, total: 19800, status: "shipped", payment: "paid" },
  { id: "ORD-2016", customer: "Sabbir Alam", email: "sabbir@mail.com", date: "2026-07-24", items: 1, total: 950, status: "processing", payment: "paid" },
  { id: "ORD-2015", customer: "Nadia Sultana", email: "nadia@mail.com", date: "2026-07-23", items: 3, total: 6700, status: "delivered", payment: "paid" },
  { id: "ORD-2014", customer: "Zahid Hasan", email: "zahid@mail.com", date: "2026-07-23", items: 8, total: 27300, status: "cancelled", payment: "refunded" },
  { id: "ORD-2013", customer: "Ruma Begum", email: "ruma@mail.com", date: "2026-07-22", items: 2, total: 4100, status: "delivered", payment: "paid" },
];

const statusConfig: Record<OrderStatus, { label: string; icon: typeof Clock; className: string }> = {
  pending: { label: "Pending", icon: Clock, className: "bg-yellow-500/10 text-yellow-600" },
  processing: { label: "Processing", icon: Package, className: "bg-blue-500/10 text-blue-600" },
  shipped: { label: "Shipped", icon: Truck, className: "bg-purple-500/10 text-purple-600" },
  delivered: { label: "Delivered", icon: CheckCircle2, className: "bg-green-500/10 text-green-600" },
  cancelled: { label: "Cancelled", icon: XCircle, className: "bg-red-500/10 text-red-600" },
};

const statusOrder: OrderStatus[] = ["pending", "processing", "shipped", "delivered", "cancelled"];

const paymentConfig: Record<Order["payment"], string> = {
  paid: "bg-primary/10 text-primary",
  unpaid: "bg-red-500/10 text-red-600",
  refunded: "bg-gray-500/10 text-gray-500",
};

type SortKey = "date" | "total" | "items";

const ROWS_PER_PAGE = 6;

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showStatusPicker, setShowStatusPicker] = useState(false);

  const filtered = useMemo(() => {
    let result = orders.filter((o) => {
      const matchesSearch =
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.customer.toLowerCase().includes(search.toLowerCase()) ||
        o.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    result = [...result].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "date") cmp = a.date.localeCompare(b.date);
      if (sortKey === "total") cmp = a.total - b.total;
      if (sortKey === "items") cmp = a.items - b.items;
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [orders, search, statusFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * ROWS_PER_PAGE, safePage * ROWS_PER_PAGE);

  const stats = useMemo(() => {
    const total = orders.reduce((s, o) => s + o.total, 0);
    const pending = orders.filter((o) => o.status === "pending").length;
    const delivered = orders.filter((o) => o.status === "delivered").length;
    return { total, pending, delivered, count: orders.length };
  }, [orders]);

  const allOnPageSelected = paginated.length > 0 && paginated.every((o) => selected.includes(o.id));

  const toggleSelectAll = () => {
    if (allOnPageSelected) {
      setSelected((prev) => prev.filter((id) => !paginated.some((o) => o.id === id)));
    } else {
      setSelected((prev) => [...new Set([...prev, ...paginated.map((o) => o.id)])]);
    }
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const deleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
    setSelected((prev) => prev.filter((s) => s !== id));
    if (activeOrder?.id === id) setActiveOrder(null);
    setOpenMenuId(null);
  };

  const bulkDelete = () => {
    setOrders((prev) => prev.filter((o) => !selected.includes(o.id)));
    setSelected([]);
  };

  const updateStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    setActiveOrder((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
    setShowStatusPicker(false);
  };

  return (
    <div className="p-6 font-sans space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-text text-xl font-semibold">Orders</h1>
          <p className="text-text-muted text-sm mt-0.5">
            Manage and track all customer orders
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-border text-text text-sm font-medium hover:bg-bg transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" />
            New Order
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Orders" value={stats.count.toString()} sub="All time" />
        <StatCard
          label="Total Revenue"
          value={`৳${stats.total.toLocaleString()}`}
          sub="All time"
        />
        <StatCard label="Pending" value={stats.pending.toString()} sub="Needs action" accent="text-yellow-600" />
        <StatCard label="Delivered" value={stats.delivered.toString()} sub="Completed" accent="text-green-600" />
      </div>

      {/* Toolbar */}
      <div className="bg-surface border border-border rounded-xl p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by order ID, customer, email..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-bg text-text text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="flex items-center gap-2">
            {selected.length > 0 && (
              <div className="flex items-center gap-2 mr-2">
                <span className="text-text-muted text-sm">{selected.length} selected</span>
                <button
                  onClick={bulkDelete}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/30 text-red-600 text-xs font-medium hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            )}

            <div className="relative">
              <button
                onClick={() => setShowFilterMenu((s) => !s)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-border text-text text-sm font-medium hover:bg-bg transition-colors"
              >
                <Filter className="w-4 h-4" />
                {statusFilter === "all" ? "All Status" : statusConfig[statusFilter].label}
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {showFilterMenu && (
                <div className="absolute right-0 mt-2 w-44 bg-surface border border-border rounded-lg shadow-lg py-1 z-20">
                  <button
                    onClick={() => {
                      setStatusFilter("all");
                      setShowFilterMenu(false);
                      setCurrentPage(1);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-text hover:bg-bg transition-colors"
                  >
                    All Status
                  </button>
                  {statusOrder.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setStatusFilter(s);
                        setShowFilterMenu(false);
                        setCurrentPage(1);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-text hover:bg-bg transition-colors"
                    >
                      {statusConfig[s].label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg/50">
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allOnPageSelected}
                    onChange={toggleSelectAll}
                    className="rounded border-border accent-[var(--color-primary)]"
                  />
                </th>
                <th className="text-left px-4 py-3 font-medium text-text-muted">Order</th>
                <th className="text-left px-4 py-3 font-medium text-text-muted">Customer</th>
                <th className="px-4 py-3 font-medium text-text-muted">
                  <button
                    onClick={() => toggleSort("date")}
                    className="flex items-center gap-1 hover:text-text transition-colors"
                  >
                    Date <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="px-4 py-3 font-medium text-text-muted">
                  <button
                    onClick={() => toggleSort("items")}
                    className="flex items-center gap-1 hover:text-text transition-colors"
                  >
                    Items <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="px-4 py-3 font-medium text-text-muted">
                  <button
                    onClick={() => toggleSort("total")}
                    className="flex items-center gap-1 hover:text-text transition-colors"
                  >
                    Total <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-left px-4 py-3 font-medium text-text-muted">Payment</th>
                <th className="text-left px-4 py-3 font-medium text-text-muted">Status</th>
                <th className="w-10 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((order) => {
                const StatusIcon = statusConfig[order.status].icon;
                return (
                  <tr
                    key={order.id}
                    className="border-b border-border last:border-0 hover:bg-bg/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.includes(order.id)}
                        onChange={() => toggleSelect(order.id)}
                        className="rounded border-border accent-[var(--color-primary)]"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setActiveOrder(order)}
                        className="font-medium text-primary hover:underline"
                      >
                        {order.id}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-text font-medium">{order.customer}</p>
                      <p className="text-text-muted text-xs">{order.email}</p>
                    </td>
                    <td className="px-4 py-3 text-text-muted">{order.date}</td>
                    <td className="px-4 py-3 text-text-muted">{order.items}</td>
                    <td className="px-4 py-3 text-text font-medium">
                      ৳{order.total.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium capitalize ${paymentConfig[order.payment]}`}
                      >
                        {order.payment}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[order.status].className}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig[order.status].label}
                      </span>
                    </td>
                    <td className="px-4 py-3 relative">
                      <button
                        onClick={() =>
                          setOpenMenuId(openMenuId === order.id ? null : order.id)
                        }
                        className="text-text-muted hover:text-text transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {openMenuId === order.id && (
                        <div className="absolute right-4 top-10 w-36 bg-surface border border-border rounded-lg shadow-lg py-1 z-20">
                          <button
                            onClick={() => {
                              setActiveOrder(order);
                              setOpenMenuId(null);
                            }}
                            className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm text-text hover:bg-bg transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" /> View
                          </button>
                          <button
                            onClick={() => window.print()}
                            className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm text-text hover:bg-bg transition-colors"
                          >
                            <Printer className="w-3.5 h-3.5" /> Print
                          </button>
                          <button
                            onClick={() => deleteOrder(order.id)}
                            className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm text-red-600 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-text-muted text-sm">
                    No orders match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-text-muted text-xs">
            Showing {paginated.length === 0 ? 0 : (safePage - 1) * ROWS_PER_PAGE + 1}–
            {Math.min(safePage * ROWS_PER_PAGE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-border text-text-muted hover:bg-bg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setCurrentPage(n)}
                className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                  safePage === n
                    ? "bg-primary text-white"
                    : "text-text-muted hover:bg-bg"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-border text-text-muted hover:bg-bg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Order details slide-over */}
      {activeOrder && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => {
              setActiveOrder(null);
              setShowStatusPicker(false);
            }}
          />
          <div className="relative w-full max-w-md h-full bg-surface border-l border-border shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-6 h-16 border-b border-border">
              <h2 className="text-text font-semibold">{activeOrder.id}</h2>
              <button
                onClick={() => {
                  setActiveOrder(null);
                  setShowStatusPicker(false);
                }}
                className="text-text-muted hover:text-text transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[activeOrder.status].className}`}
                >
                  {statusConfig[activeOrder.status].label}
                </span>
                <span
                  className={`inline-flex px-2 py-1 rounded-full text-xs font-medium capitalize ${paymentConfig[activeOrder.payment]}`}
                >
                  {activeOrder.payment}
                </span>
              </div>

              <div>
                <p className="text-text-muted text-xs uppercase tracking-wide mb-2">
                  Customer
                </p>
                <p className="text-text font-medium">{activeOrder.customer}</p>
                <p className="text-text-muted text-sm">{activeOrder.email}</p>
              </div>

              <div>
                <p className="text-text-muted text-xs uppercase tracking-wide mb-2">
                  Order Info
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Date</span>
                    <span className="text-text">{activeOrder.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Items</span>
                    <span className="text-text">{activeOrder.items}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Total</span>
                    <span className="text-text font-semibold">
                      ৳{activeOrder.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-text-muted text-xs uppercase tracking-wide mb-2">
                  Timeline
                </p>
                <ol className="space-y-3 text-sm">
                  {statusOrder
                    .filter((s) => s !== "cancelled")
                    .map((step, i) => {
                      const currentIdx = statusOrder.indexOf(activeOrder.status);
                      const done = i <= currentIdx && activeOrder.status !== "cancelled";
                      return (
                        <li key={step} className="flex items-center gap-3">
                          <span className={`w-2 h-2 rounded-full ${done ? "bg-primary" : "bg-border"}`} />
                          <span className={done ? "text-text" : "text-text-muted"}>
                            {statusConfig[step].label}
                          </span>
                        </li>
                      );
                    })}
                </ol>
              </div>
            </div>

            <div className="p-4 border-t border-border flex gap-2 relative">
              <button
                onClick={() => window.print()}
                className="flex-1 px-4 py-2.5 rounded-lg border border-border text-text text-sm font-medium hover:bg-bg transition-colors"
              >
                Print Invoice
              </button>
              <button
                onClick={() => setShowStatusPicker((s) => !s)}
                className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-colors"
              >
                Update Status
              </button>

              {showStatusPicker && (
                <div className="absolute bottom-14 right-4 w-48 bg-surface border border-border rounded-lg shadow-lg py-1 z-20">
                  {statusOrder.map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(activeOrder.id, s)}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-bg transition-colors ${
                        activeOrder.status === s ? "text-primary font-medium" : "text-text"
                      }`}
                    >
                      {statusConfig[s].label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub: string;
  accent?: string;
}) {
  return (
    <div className="bg-surface border border-border rounded-xl p-4">
      <p className="text-text-muted text-xs font-medium">{label}</p>
      <p className={`text-2xl font-semibold mt-1 ${accent ?? "text-text"}`}>{value}</p>
      <p className="text-text-muted text-xs mt-1">{sub}</p>
    </div>
  );
}