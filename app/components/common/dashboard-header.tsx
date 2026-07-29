"use client";

import {
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Package,
  AlertTriangle,
  ShoppingCart,
  X,
} from "lucide-react";
import { useState } from "react";

const notifications = [
  {
    id: 1,
    icon: AlertTriangle,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    title: "Low stock alert",
    message: "Wireless Mouse (SKU-2291) has only 4 units left",
    time: "5m ago",
    unread: true,
  },
  {
    id: 2,
    icon: ShoppingCart,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
    title: "New order received",
    message: "Order #ORD-1082 placed by Rahim Traders",
    time: "1h ago",
    unread: true,
  },
  {
    id: 3,
    icon: Package,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
    title: "Shipment arrived",
    message: "PO #4521 from Apex Suppliers has been received",
    time: "3h ago",
    unread: false,
  },
];

export default function DashboardHeader() {
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="h-16 bg-surface  border-b border-border flex items-center justify-between px-6 font-sans sticky top-0 z-10">
      {/* Search */}
      <div className="relative w-full max-w-sm">
        <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="w-full bg-surface border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-text placeholder:text-text-muted outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifOpen(!notifOpen);
              setMenuOpen(false);
            }}
            className="relative w-9 h-9 flex items-center justify-center rounded-lg text-text-muted hover:bg-surface hover:text-text transition-colors"
          >
            <Bell className="w-[18px] h-[18px]" strokeWidth={2} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-bg border border-border rounded-lg shadow-sm z-20 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <p className="text-sm font-semibold text-text">
                  Notifications
                </p>
                <button
                  onClick={() => setNotifOpen(false)}
                  className="text-text-muted hover:text-text transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.map((n) => {
                  const Icon = n.icon;
                  return (
                    <button
                      key={n.id}
                      className="w-full flex items-start gap-3 px-4 py-3 hover:bg-surface transition-colors text-left border-b border-border last:border-b-0"
                    >
                      <div
                        className={`w-8 h-8 rounded-full ${n.iconBg} flex items-center justify-center shrink-0`}
                      >
                        <Icon className={`w-4 h-4 ${n.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-text truncate">
                            {n.title}
                          </p>
                          {n.unread && (
                            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-text-muted mt-0.5 line-clamp-2">
                          {n.message}
                        </p>
                        <p className="text-xs text-text-muted mt-1">
                          {n.time}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <button className="w-full text-center text-xs font-medium text-primary py-2.5 hover:bg-surface transition-colors">
                View all notifications
              </button>
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-border mx-1" />

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => {
              setMenuOpen(!menuOpen);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2 px-1.5 py-1 rounded-lg hover:bg-surface transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-semibold">
              NR
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-text text-sm font-medium leading-tight">
                Nirob
              </p>
              <p className="text-text-muted text-xs leading-tight">Admin</p>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-text-muted transition-transform ${
                menuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-bg border border-border rounded-lg shadow-sm py-1 z-20">
              <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-text hover:bg-surface transition-colors">
                <User className="w-4 h-4 text-text-muted" />
                Profile
              </button>
              <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-text hover:bg-surface transition-colors">
                <Settings className="w-4 h-4 text-text-muted" />
                Settings
              </button>
              <div className="h-px bg-border my-1" />
              <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-500 hover:bg-surface transition-colors">
                <LogOut className="w-4 h-4" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}