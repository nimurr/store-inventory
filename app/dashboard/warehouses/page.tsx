"use client"

import React, { useState, useMemo } from "react"
import { Search, Plus, X, Pencil, Trash2, Warehouse, MapPin, User, Package } from "lucide-react"

type WarehouseItem = {
  id: string
  name: string
  location: string
  capacity: number
  currentStock: number
  manager: string
}

type FormState = Omit<WarehouseItem, "id">

const emptyForm: FormState = {
  name: "",
  location: "",
  capacity: 0,
  currentStock: 0,
  manager: "",
}

const initialData: WarehouseItem[] = [
  { id: "1", name: "North Distribution Center", location: "Dhaka, BD", capacity: 5000, currentStock: 3200, manager: "Rafiq Islam" },
  { id: "2", name: "Central Warehouse", location: "Chattogram, BD", capacity: 8000, currentStock: 7600, manager: "Nadia Karim" },
  { id: "3", name: "South Storage Facility", location: "Khulna, BD", capacity: 3000, currentStock: 900, manager: "Tanvir Ahmed" },
  { id: "4", name: "East Regional Hub", location: "Sylhet, BD", capacity: 4500, currentStock: 4400, manager: "Farhana Rahman" },
]

function getUtilization(w: Pick<WarehouseItem, "capacity" | "currentStock">) {
  if (w.capacity === 0) return 0
  return Math.min(100, Math.round((w.currentStock / w.capacity) * 100))
}

function UtilizationBar({ percent }: { percent: number }) {
  const barColor =
    percent >= 90 ? "bg-red-500" : percent >= 70 ? "bg-yellow-500" : "bg-primary"
  return (
    <div className="w-full h-2 bg-border rounded-full overflow-hidden">
      <div className={`h-full ${barColor} transition-all`} style={{ width: `${percent}%` }} />
    </div>
  )
}

function WarehouseModal({
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
    const numericKeys: (keyof FormState)[] = ["capacity", "currentStock"]
    setForm((prev) => ({
      ...prev,
      [key]: numericKeys.includes(key) ? Number(value) : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.location.trim()) return
    onSave(form)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative bg-bg border border-border rounded-card w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border sticky top-0 bg-bg">
          <h2 className="text-lg font-semibold text-text">
            {mode === "add" ? "Add Warehouse" : "Edit Warehouse"}
          </h2>
          <button onClick={onClose} className="text-text-muted hover:text-text p-1 rounded-card hover:bg-surface transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Warehouse Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full bg-surface border border-border rounded-card px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="e.g. North Distribution Center"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Location</label>
            <input
              type="text"
              required
              value={form.location}
              onChange={(e) => handleChange("location", e.target.value)}
              className="w-full bg-surface border border-border rounded-card px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="e.g. Dhaka, BD"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">Capacity (units)</label>
              <input
                type="number"
                min={0}
                required
                value={form.capacity}
                onChange={(e) => handleChange("capacity", e.target.value)}
                className="w-full bg-surface border border-border rounded-card px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">Current Stock</label>
              <input
                type="number"
                min={0}
                required
                value={form.currentStock}
                onChange={(e) => handleChange("currentStock", e.target.value)}
                className="w-full bg-surface border border-border rounded-card px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Manager</label>
            <input
              type="text"
              required
              value={form.manager}
              onChange={(e) => handleChange("manager", e.target.value)}
              className="w-full bg-surface border border-border rounded-card px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="e.g. Rafiq Islam"
            />
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
              {mode === "add" ? "Add Warehouse" : "Save Changes"}
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
  const [warehouses, setWarehouses] = useState<WarehouseItem[]>(initialData)
  const [search, setSearch] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"add" | "edit">("add")
  const [activeId, setActiveId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<WarehouseItem | null>(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return warehouses
    return warehouses.filter(
      (w) => w.name.toLowerCase().includes(q) || w.location.toLowerCase().includes(q)
    )
  }, [warehouses, search])

  const totalWarehouses = warehouses.length
  const totalCapacity = warehouses.reduce((acc, w) => acc + w.capacity, 0)
  const totalStock = warehouses.reduce((acc, w) => acc + w.currentStock, 0)
  const avgUtilization = warehouses.length
    ? Math.round(warehouses.reduce((acc, w) => acc + getUtilization(w), 0) / warehouses.length)
    : 0

  const openAddModal = () => {
    setModalMode("add")
    setActiveId(null)
    setModalOpen(true)
  }

  const openEditModal = (item: WarehouseItem) => {
    setModalMode("edit")
    setActiveId(item.id)
    setModalOpen(true)
  }

  const handleSave = (values: FormState) => {
    if (modalMode === "add") {
      setWarehouses((prev) => [...prev, { ...values, id: crypto.randomUUID() }])
    } else if (activeId) {
      setWarehouses((prev) => prev.map((w) => (w.id === activeId ? { ...values, id: activeId } : w)))
    }
    setModalOpen(false)
  }

  const activeItem = warehouses.find((w) => w.id === activeId)
  const formInitialValues: FormState = activeItem
    ? { name: activeItem.name, location: activeItem.location, capacity: activeItem.capacity, currentStock: activeItem.currentStock, manager: activeItem.manager }
    : emptyForm

  const handleDelete = () => {
    if (!deleteTarget) return
    setWarehouses((prev) => prev.filter((w) => w.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  return (
    <div className="min-h-screen bg-bg text-text ">
      <div className=" space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-text">Warehouses</h1>
            <p className="text-sm text-text-muted mt-1">Manage warehouse locations and capacity</p>
          </div>
          <button
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-medium text-sm px-4 py-2.5 rounded-card transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Warehouse
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-surface border border-border rounded-card p-4 sm:p-5 flex items-start justify-between">
            <div>
              <p className="text-sm text-text-muted">Total Warehouses</p>
              <p className="text-2xl font-semibold text-text mt-1">{totalWarehouses}</p>
              <p className="text-xs text-text-muted mt-1">Active locations</p>
            </div>
            <div className="bg-primary/10 text-primary p-2.5 rounded-card">
              <Warehouse className="w-5 h-5" />
            </div>
          </div>
          <div className="bg-surface border border-border rounded-card p-4 sm:p-5 flex items-start justify-between">
            <div>
              <p className="text-sm text-text-muted">Total Capacity</p>
              <p className="text-2xl font-semibold text-text mt-1">{totalCapacity.toLocaleString()}</p>
              <p className="text-xs text-text-muted mt-1">Units, all sites combined</p>
            </div>
            <div className="bg-primary/10 text-primary p-2.5 rounded-card">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="bg-surface border border-border rounded-card p-4 sm:p-5 flex items-start justify-between">
            <div>
              <p className="text-sm text-text-muted">Current Stock</p>
              <p className="text-2xl font-semibold text-text mt-1">{totalStock.toLocaleString()}</p>
              <p className="text-xs text-text-muted mt-1">Units stored right now</p>
            </div>
            <div className="bg-primary/10 text-primary p-2.5 rounded-card">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="bg-surface border border-border rounded-card p-4 sm:p-5 flex items-start justify-between">
            <div>
              <p className="text-sm text-text-muted">Avg. Utilization</p>
              <p className="text-2xl font-semibold text-text mt-1">{avgUtilization}%</p>
              <p className="text-xs text-text-muted mt-1">Across all warehouses</p>
            </div>
            <div className="bg-primary/10 text-primary p-2.5 rounded-card">
              <TrendingIcon percent={avgUtilization} />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or location..."
            className="w-full bg-surface border border-border rounded-card pl-9 pr-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((w) => {
            const percent = getUtilization(w)
            return (
              <div key={w.id} className="bg-surface border border-border rounded-card p-5 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 text-primary p-2.5 rounded-card shrink-0">
                      <Warehouse className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text leading-tight">{w.name}</h3>
                      <p className="text-xs text-text-muted mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {w.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openEditModal(w)}
                      className="text-text-muted hover:text-primary p-1.5 rounded-card hover:bg-bg transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(w)}
                      className="text-text-muted hover:text-red-600 p-1.5 rounded-card hover:bg-bg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-text-muted mb-1.5">
                    <span>{w.currentStock.toLocaleString()} / {w.capacity.toLocaleString()} units</span>
                    <span className="font-medium text-text">{percent}%</span>
                  </div>
                  <UtilizationBar percent={percent} />
                </div>

                <div className="flex items-center gap-1.5 text-sm text-text-muted pt-1 border-t border-border">
                  <User className="w-3.5 h-3.5" />
                  <span>{w.manager}</span>
                </div>
              </div>
            )
          })}

          {filtered.length === 0 && (
            <div className="col-span-full text-center text-text-muted py-10">
              No warehouses match your search.
            </div>
          )}
        </div>
      </div>

      <WarehouseModal
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

function TrendingIcon({ percent }: { percent: number }) {
  return <Package className="w-5 h-5" style={{ opacity: percent >= 90 ? 1 : 0.7 }} />
}