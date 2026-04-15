"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { auth } from "../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [mobile, setMobile] = useState(false);
  const [open, setOpen] = useState(false);

  // Detect mobile screen
  useEffect(() => {
    const handleResize = () => {
      setMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auth check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);

      if (!u) {
        router.push("/signup");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/signup");
  };

  return (
    <>
      {/* ☰ Mobile Button */}
      {mobile && (
        <button
          onClick={() => setOpen(!open)}
          style={{
            position: "fixed",
            top: 20,
            left: 20,
            zIndex: 100,
            background: "#111827",
            color: "white",
            padding: "10px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
          }}
        >
          ☰
        </button>
      )}

      {/* Sidebar */}
      <motion.aside
        className="sidebar"
        initial={{ x: -100, opacity: 0 }}
        animate={{
          x: mobile ? (open ? 0 : -260) : 0,
          opacity: 1,
        }}
        transition={{ duration: 0.3 }}
        style={{
          position: mobile ? "fixed" : "relative",
          top: 0,
          left: 0,
          height: "100%",
          width: "240px",
          background: "#111827",
          zIndex: 50,
          padding: "20px",
        }}
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          EXPENZAA
        </motion.h1>

        {/* USER EMAIL */}
        {user && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.4 }}
            style={{ marginBottom: "20px", fontSize: "13px" }}
          >
            {user.email}
          </motion.p>
        )}

        <nav style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <SidebarLink href="/" label="Dashboard" active={pathname === "/"} onClick={() => setOpen(false)} />
          <SidebarLink
            href="/expenses"
            label="Expenses"
            active={pathname === "/expenses"}
            onClick={() => setOpen(false)}
          />
          <SidebarLink
            href="/reports"
            label="Reports"
            active={pathname === "/reports"}
            onClick={() => setOpen(false)}
          />
          <SidebarLink
            href="/settings"
            label="Settings"
            active={pathname === "/settings"}
            onClick={() => setOpen(false)}
          />
        </nav>

        {/* LOGOUT */}
        {user && (
          <button
            onClick={handleLogout}
            style={{
              marginTop: "30px",
              padding: "10px",
              background: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        )}
      </motion.aside>

      {/* Overlay */}
      {mobile && open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            zIndex: 40,
          }}
        />
      )}
    </>
  );
}

function SidebarLink({ href, label, active, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      style={{
        textDecoration: "none",
        fontSize: "15px",
        color: active ? "#8b5cf6" : "#cbd5e1",
        fontWeight: active ? "600" : "400",
        transition: "all 0.3s ease",
        transform: active ? "translateX(6px)" : "translateX(0)",
      }}
    >
      {label}
    </Link>
  );
}




