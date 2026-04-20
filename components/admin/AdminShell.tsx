"use client";

import { useEffect, useState, useCallback } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: "□" },
  { href: "/admin/blog", label: "Blog Posts", icon: "✎" },
  { href: "/admin/events", label: "Markets", icon: "★" },
  { href: "/admin/trucks", label: "Food Trucks", icon: "◉" },
  { href: "/admin/photos", label: "Photo Gallery", icon: "▤" },
  { href: "/admin/pages", label: "Page Content", icon: "☰" },
  { href: "/admin/contacts", label: "Contact Inbox", icon: "✉" },
  { href: "/admin/vendors", label: "Vendor Requests", icon: "⊞" },
];

function NavLink({ href, label, icon }: { href: string; label: string; icon: string }) {
  const pathname = usePathname();
  const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-sm transition-colors ${
        active
          ? "bg-white/10 text-white font-medium"
          : "text-slate-300 hover:bg-white/5 hover:text-white"
      }`}
    >
      <span className="text-base">{icon}</span>
      {label}
    </Link>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) setError(authError.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold text-slate-900 text-center mb-1">
          HTP Admin
        </h1>
        <p className="text-slate-500 text-sm text-center mb-6">
          Sign in to manage your site
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2.5 mb-4">
            {error}
          </div>
        )}

        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="you@example.com"
        />

        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="••••••••"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-slate-800 text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-slate-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "Please wait..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}

function NotAuthorized({ email, onLogout }: { email: string; onLogout: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h1>
        <p className="text-slate-500 text-sm mb-1">
          <span className="font-medium text-slate-700">{email}</span> is not
          authorized to manage this site.
        </p>
        <p className="text-slate-400 text-xs mb-6">
          Contact your administrator to request access.
        </p>
        <button
          onClick={onLogout}
          className="bg-slate-800 text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-slate-700 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCmsAdmin, setIsCmsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (!s) setIsCmsAdmin(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;

    supabase
      .from("cms_admins")
      .select("user_id, sites")
      .eq("user_id", session.user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) { setIsCmsAdmin(false); return; }
        const sites: string[] = data.sites ?? [];
        setIsCmsAdmin(sites.includes("hilltop") || sites.includes("all"));
      });
  }, [session]);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-slate-500 text-sm">Loading...</div>
      </div>
    );
  }

  if (!session) return <LoginForm />;

  if (isCmsAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-slate-500 text-sm">Checking access...</div>
      </div>
    );
  }

  if (!isCmsAdmin) {
    return (
      <NotAuthorized
        email={session.user.email ?? "Unknown"}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Sidebar */}
      <aside className="w-60 bg-slate-800 text-white flex flex-col shrink-0">
        <div className="px-5 py-5 border-b border-white/10">
          <Link href="/admin" className="text-lg font-bold tracking-tight">
            HTP Admin
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <div className="text-xs text-slate-400 px-4 mb-2 truncate">
            {session.user.email}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 rounded-md text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors w-full"
          >
            Sign Out
          </button>
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2 rounded-md text-sm text-slate-400 hover:bg-white/5 hover:text-white transition-colors mt-1"
          >
            ← View Site
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
