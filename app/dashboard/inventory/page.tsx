"use client"

import React, { useState, useMemo } from "react"
import { Search, Filter, Plus, MoreVertical, Package, AlertTriangle, TrendingUp, DollarSign, X, Pencil, Trash2 } from "lucide-react"

type InventoryItem = {
  id: string
  name: string
  sku: string
  category: string
  stock: number
  lowStockThreshold: number
  price: number
}

type FormState = Omit<InventoryItem, "id">

const emptyForm: FormState = {
  name: "",
  sku: "",
  category: "",
  stock: 0,
  lowStockThreshold: 10,
  price: 0,
}

const initialData: InventoryItem[] = [
  { id: "1", name: "Wireless Mouse", sku: "WM-1001", category: "Electronics", stock: 128, lowStockThreshold: 20, price: 24.99 },
  { id: "2", name: "Mechanical Keyboard", sku: "MK-2045", category: "Electronics", stock: 8, lowStockThreshold: 15, price: 89.99 },
  { id: "3", name: "USB-C Cable 2m", sku: "UC-3390", category: "Accessories", stock: 0, lowStockThreshold: 30, price: 9.99 },
  { id: "4", name: "Laptop Stand", sku: "LS-4412", category: "Accessories", stock: 54, lowStockThreshold: 10, price: 34.5 },
  { id: "5", name: "27\" Monitor", sku: "MN-5501", category: "Electronics", stock: 12, lowStockThreshold: 5, price: 219.0 },
  { id: "6", name: "Desk Lamp", sku: "DL-6120", category: "Office", stock: 3, lowStockThreshold: 10, price: 19.99 },
]

function getStatus(item: Pick<InventoryItem, "stock" | "lowStockThreshold">) {
  if (item.stock === 0) return "Out of Stock" as const
  if (item.stock <= item.lowStockThreshold) return "Low Stock" as const
  return "In Stock" as const
}

function StatusBadge({ status }: { status: ReturnType<typeof getStatus> }) {
  const styles = {
    "In Stock": "bg-primary/10 text-primary",
    "Low Stock": "bg-yellow-500/10 text-yellow-600",
    "Out of Stock": "bg-red-500/10 text-red-600",
  }
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${styles[status]}`}>
      {status}
    </span>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  sublabel,
}: {
  icon: React.ElementType
  label: string
  value: string
  sublabel: string
}) {
  return (
    <div className="bg-surface border border-border rounded-card p-4 sm:p-5 flex items-start justify-between">
      <div>
        <p className="text-sm text-text-muted">{label}</p>
        <p className="text-2xl font-semibold text-text mt-1">{value}</p>
        <p className="text-xs text-text-muted mt-1">{sublabel}</p>
      </div>
      <div className="bg-primary/10 text-primary p-2.5 rounded-card">
        <Icon className="w-5 h-5" />
      </div>
    </div>
  )
}

function ProductModal({
  open,
  onClose,
  onSave,
  initialValues,
  mode,
}: {
  open: boolean
  onClose: () => void
  onSave: (values: FormState) => void
  initialValues: FormState
  mode: "add" | "edit"
}) {
  const [form, setForm] = useState<FormState>(initialValues)

  React.useEffect(() => {
    setForm(initialValues)
  }, [initialValues, open])

  if (!open) return null

  const handleChange = (key: keyof FormState, value: string) => {
    const numericKeys: (keyof FormState)[] = ["stock", "lowStockThreshold", "price"]
    setForm((prev) => ({
      ...prev,
      [key]: numericKeys.includes(key) ? Number(value) : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.sku.trim()) return
    onSave(form)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-bg border border-border rounded-card w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border sticky top-0 bg-bg">
          <h2 className="text-lg font-semibold text-text">
            {mode === "add" ? "Add Product" : "Edit Product"}
          </h2>
          <button onClick={onClose} className="text-text-muted hover:text-text p-1 rounded-card hover:bg-surface transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Product Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full bg-surface border border-border rounded-card px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="e.g. Wireless Mouse"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">SKU</label>
              <input
                type="text"
                required
                value={form.sku}
                onChange={(e) => handleChange("sku", e.target.value)}
                className="w-full bg-surface border border-border rounded-card px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="e.g. WM-1001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">Category</label>
              <input
                type="text"
                required
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className="w-full bg-surface border border-border rounded-card px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="e.g. Electronics"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">Stock Qty</label>
              <input
                type="number"
                min={0}
                required
                value={form.stock}
                onChange={(e) => handleChange("stock", e.target.value)}
                className="w-full bg-surface border border-border rounded-card px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">Low Stock At</label>
              <input
                type="number"
                min={0}
                required
                value={form.lowStockThreshold}
                onChange={(e) => handleChange("lowStockThreshold", e.target.value)}
                className="w-full bg-surface border border-border rounded-card px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">Price ($)</label>
              <input
                type="number"
                min={0}
                step="0.01"
                required
                value={form.price}
                onChange={(e) => handleChange("price", e.target.value)}
                className="w-full bg-surface border border-border rounded-card px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-border text-text font-medium text-sm px-4 py-2.5 rounded-card hover:bg-surface transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary-dark text-white font-medium text-sm px-4 py-2.5 rounded-card transition-colors"
            >
              {mode === "add" ? "Add Product" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function DeleteConfirm({
  open,
  onClose,
  onConfirm,
  itemName,
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  itemName: string
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-bg border border-border rounded-card w-full max-w-sm p-5 shadow-xl">
        <h3 className="text-base font-semibold text-text">Delete "{itemName}"?</h3>
        <p className="text-sm text-text-muted mt-1.5">This action can't be undone.</p>
        <div className="flex gap-3 mt-5">
          <button
            onClick={onClose}
            className="flex-1 border border-border text-text font-medium text-sm px-4 py-2.5 rounded-card hover:bg-surface transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium text-sm px-4 py-2.5 rounded-card transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  const [products, setProducts] = useState<InventoryItem[]>(initialData)
  const [search, setSearch] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"add" | "edit">("add")
  const [activeId, setActiveId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<InventoryItem | null>(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return products
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
    )
  }, [products, search])

  const totalItems = products.length
  const totalStockValue = products.reduce((acc, p) => acc + p.stock * p.price, 0)
  const lowStockCount = products.filter((p) => getStatus(p) === "Low Stock").length
  const outOfStockCount = products.filter((p) => getStatus(p) === "Out of Stock").length

  const openAddModal = () => {
    setModalMode("add")
    setActiveId(null)
    setModalOpen(true)
  }

  const openEditModal = (item: InventoryItem) => {
    setModalMode("edit")
    setActiveId(item.id)
    setModalOpen(true)
  }

  const handleSave = (values: FormState) => {
    if (modalMode === "add") {
      setProducts((prev) => [...prev, { ...values, id: crypto.randomUUID() }])
    } else if (activeId) {
      setProducts((prev) => prev.map((p) => (p.id === activeId ? { ...values, id: activeId } : p)))
    }
    setModalOpen(false)
  }

  const activeItem = products.find((p) => p.id === activeId)
  const formInitialValues: FormState = activeItem
    ? { name: activeItem.name, sku: activeItem.sku, category: activeItem.category, stock: activeItem.stock, lowStockThreshold: activeItem.lowStockThreshold, price: activeItem.price }
    : emptyForm

  const handleDelete = () => {
    if (!deleteTarget) return
    setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  return (
    <div className="min-h-screen bg-bg text-text ">
      <div className=" space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-text">Inventory</h1>
            <p className="text-sm text-text-muted mt-1">Manage and track your product stock</p>
          </div>
          <button
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-medium text-sm px-4 py-2.5 rounded-card transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Package} label="Total Products" value={totalItems.toString()} sublabel="Across all categories" />
          <StatCard icon={DollarSign} label="Stock Value" value={`$${totalStockValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} sublabel="Total inventory worth" />
          <StatCard icon={AlertTriangle} label="Low Stock" value={lowStockCount.toString()} sublabel="Items below threshold" />
          <StatCard icon={TrendingUp} label="Out of Stock" value={outOfStockCount.toString()} sublabel="Needs restocking" />
        </div>

        {/* Table container */}
        <div className="bg-surface border border-border rounded-card overflow-hidden">

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border-b border-border">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or SKU..."
                className="w-full bg-bg border border-border rounded-card pl-9 pr-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <button className="inline-flex items-center justify-center gap-2 border border-border text-text text-sm font-medium px-4 py-2 rounded-card hover:bg-bg transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-text-muted border-b border-border">
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">SKU</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Stock</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-b border-border last:border-0 hover:bg-bg/60 transition-colors">
                    <td className="px-4 py-3 font-medium text-text whitespace-nowrap">{item.name}</td>
                    <td className="px-4 py-3 text-text-muted whitespace-nowrap">{item.sku}</td>
                    <td className="px-4 py-3 text-text-muted whitespace-nowrap">{item.category}</td>
                    <td className="px-4 py-3 text-text whitespace-nowrap">{item.stock}</td>
                    <td className="px-4 py-3 text-text whitespace-nowrap">${item.price.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={getStatus(item)} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(item)}
                          className="text-text-muted hover:text-primary p-1.5 rounded-card hover:bg-bg transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(item)}
                          className="text-text-muted hover:text-red-600 p-1.5 rounded-card hover:bg-bg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-text-muted">
                      No products match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border-t border-border text-sm text-text-muted">
            <span>Showing {filtered.length} of {products.length} products</span>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 border border-border rounded-card hover:bg-bg transition-colors disabled:opacity-50" disabled>
                Previous
              </button>
              <button className="px-3 py-1.5 border border-border rounded-card hover:bg-bg transition-colors disabled:opacity-50" disabled>
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <ProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialValues={formInitialValues}
        mode={modalMode}
      />

      <DeleteConfirm
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemName={deleteTarget?.name ?? ""}
      />
    </div>
  )
}