"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Wallet,
  Settings,
} from "lucide-react";
import Link from "next/link";

export default function SidebarLayout({ children }) {

  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/signup");
  };

  const getPageTitle = () => {
    if (pathname === "/") return "Dashboard";
    if (pathname === "/reports") return "Reports";
    if (pathname === "/expenses") return "Expenses";
    if (pathname === "/settings") return "Settings";
    return "EXPENZAA";
  };

  return (
    <div className="flex h-screen overflow-hidden">

      {/* Sidebar */}
      <motion.div
        animate={{ width: collapsed ? 80 : 240 }}
        transition={{ duration: 0.3 }}
        className="bg-[#111827] border-r border-white/5 p-4 flex flex-col justify-between"
      >

        <div>

          <h1 className="text-xl font-bold mb-10 tracking-wide">
            {collapsed ? "E" : "EXPENZAA"}
          </h1>

          {/* USER INFO */}
          {user && !collapsed && (
            <div className="mb-6 text-sm text-gray-300">
              {user.email}
            </div>
          )}

          <nav className="space-y-2">
            <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" href="/" pathname={pathname} collapsed={collapsed} />
            <SidebarItem icon={<BarChart3 size={20} />} label="Reports" href="/reports" pathname={pathname} collapsed={collapsed} />
            <SidebarItem icon={<Wallet size={20} />} label="Expenses" href="/expenses" pathname={pathname} collapsed={collapsed} />
            <SidebarItem icon={<Settings size={20} />} label="Settings" href="/settings" pathname={pathname} collapsed={collapsed} />
          </nav>

        </div>

        <div>

          {/* LOGOUT BUTTON */}
          {!collapsed && (
            <button
              onClick={handleLogout}
              className="w-full mb-4 p-2 bg-red-500 hover:bg-red-600 rounded-lg text-sm"
            >
              Logout
            </button>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-xs text-gray-400 hover:text-white transition"
          >
            {collapsed ? "Expand" : "Collapse"}
          </button>

        </div>

      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-[#0f172a] to-[#111827]">

        {/* Header */}
        <div className="h-16 border-b border-white/5 flex items-center justify-between px-8">
          <h2 className="text-lg font-semibold">{getPageTitle()}</h2>
          <div className="w-8 h-8 bg-indigo-500 rounded-full" />
        </div>

        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  );
}

function SidebarItem({ icon, label, href, pathname, collapsed }) {

  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200
        ${
          isActive
            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
            : "text-gray-400 hover:bg-white/5 hover:text-white"
        }`}
    >
      {icon}
      {!collapsed && <span>{label}</span>}
    </Link>
  );
}
