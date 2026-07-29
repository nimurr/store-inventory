"use client";

import { useState } from "react";
import { Eye, EyeOff, ShieldCheck, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Enter your email and password to continue.");
      return;
    }

    setLoading(true);
    // TODO: replace with real auth call
    setTimeout(() => setLoading(false), 1200);

    navigate.push("/dashboard");

  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6 font-sans">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-10 h-10 rounded-card bg-primary flex items-center justify-center mb-4">
            <ShieldCheck className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-xl font-semibold text-text">Welcome back</h1>
          <p className="text-text-muted text-sm mt-1">
            Sign in to your admin account
          </p>
        </div>

        {/* Card */}
        <div className="bg-surface border border-border rounded-card p-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="block text-text text-sm font-medium mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@company.com"
                className="w-full bg-white border border-border rounded-lg px-3.5 py-2.5 text-text text-sm placeholder:text-text-muted outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-text text-sm font-medium">
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs text-primary hover:text-primary-dark transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="••••••••"
                  className="w-full bg-white border border-border rounded-lg px-3.5 py-2.5 pr-10 text-text text-sm placeholder:text-text-muted outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <label className="flex items-center gap-2 cursor-pointer select-none pt-1">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-border bg-white accent-orange-500"
              />
              <span className="text-sm text-text-muted">
                Keep me signed in
              </span>
            </label>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-medium text-sm rounded-lg py-2.5 flex items-center justify-center gap-2 transition-colors mt-2"
            >
              {loading ? "Signing in..." : "Sign in"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <p className="text-text-muted text-xs text-center mt-6 font-mono">
          Access restricted to authorized administrators.
        </p>
      </div>
    </div>
  );
}