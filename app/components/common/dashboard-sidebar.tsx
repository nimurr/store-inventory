"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Warehouse,
  ShoppingCart,
  Truck,
  Tags,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  AlertTriangle,
  X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Inventory", icon: Package, href: "/dashboard/inventory" },
  { label: "Warehouses", icon: Warehouse, href: "/dashboard/warehouses" },
  { label: "Orders", icon: ShoppingCart, href: "/dashboard/orders" },
  { label: "Suppliers", icon: Truck, href: "/dashboard/suppliers" },
  { label: "Categories", icon: Tags, href: "/dashboard/categories" },
  { label: "Reports", icon: BarChart3, href: "/dashboard/reports" },
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const lowStockCount = 7; // wire up to real data

  const handleLogout = () => {
    // wire up real logout logic (clear session/token, redirect, etc.)
    setShowLogoutModal(false);
    console.log("Logged out");
  };

  return (
    <>
      <aside
        className={`h-screen sticky top-0 bg-surface border-r border-border flex flex-col font-sans transition-all duration-200 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          {!collapsed && (
            <span className="text-text font-semibold text-base tracking-tight">
              Stock<span className="text-primary">IQ</span>
            </span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-text-muted hover:bg-bg hover:text-text transition-colors"
          >
            <ChevronLeft
              className={`w-4 h-4 transition-transform ${
                collapsed ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Low stock alert */}
        {!collapsed && lowStockCount > 0 && (
          <button className="mx-3 mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/15 transition-colors">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>{lowStockCount} items low on stock</span>
          </button>
        )}

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-text-muted hover:bg-bg hover:text-text"
                } ${collapsed ? "justify-center" : ""}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="w-[18px] h-[18px] shrink-0" strokeWidth={2} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="border-t border-border p-3">
          <div
            className={`flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-bg transition-colors ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-semibold shrink-0">
              NR
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-text text-sm font-medium truncate">Nirob</p>
                <p className="text-text-muted text-xs truncate">
                  Warehouse Admin
                </p>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={() => setShowLogoutModal(true)}
                className="text-text-muted hover:text-red-500 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Logout confirmation modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm font-sans">
          <div className="bg-surface border border-border rounded-xl shadow-lg w-full max-w-sm mx-4 p-6 relative">
            <button
              onClick={() => setShowLogoutModal(false)}
              className="absolute top-4 right-4 text-text-muted hover:text-text transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-11 h-11 rounded-full bg-red-500/10 flex items-center justify-center">
                <LogOut className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="text-text text-base font-semibold">
                Log out of StockIQ?
              </h3>
              <p className="text-text-muted text-sm">
                You'll need to sign in again to access your dashboard.
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-border text-text text-sm font-medium hover:bg-bg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}