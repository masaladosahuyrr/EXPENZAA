"use client";

import { useEffect, useState } from "react";
import ExpenseChart from "../components/ExpenseChart";
import MonthlyTrendChart from "../components/MonthlyTrendChart";
import WeeklyTrendChart from "../components/WeeklyTrendChart";
import { supabase } from "../lib/supabase";

export default function ReportsPage() {
  const [expenses, setExpenses] = useState([]);

  /* =========================
     FETCH EXPENSES FROM SUPABASE
  ========================= */

  const fetchExpenses = async () => {
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error("Error loading reports:", error);
    } else {
      setExpenses(data);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  if (expenses.length === 0) {
    return <p style={{ padding: 20 }}>No expenses to show</p>;
  }

  /* =========================
     EXPORT CSV
  ========================= */

  function exportCSV() {
    if (typeof window === "undefined") return;

    const headers = ["Title", "Amount", "Category", "Date"];

    const rows = expenses.map((e) => [
      e.title,
      e.amount,
      e.category,
      new Date(e.date || e.created_at).toLocaleDateString(),
    ]);

    let csv = headers.join(",") + "\n";

    rows.forEach((row) => {
      csv += row.join(",") + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "expenses-report.csv";
    a.click();

    window.URL.revokeObjectURL(url);
  }

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 24 }}>Reports</h1>

      <button
        onClick={exportCSV}
        style={{
          marginBottom: "32px",
          padding: "10px 16px",
          background: "#22c55e",
          color: "#000",
          borderRadius: "8px",
          fontWeight: "bold",
          cursor: "pointer",
          border: "none",
        }}
      >
        Export CSV
      </button>

      <div
        style={cardStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-6px)";
          e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <h3>Expense Breakdown</h3>
        <ExpenseChart expenses={expenses} />
      </div>

      <div
        style={cardStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-6px)";
          e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <h3>Monthly Trend</h3>
        <MonthlyTrendChart expenses={expenses} />
      </div>

      <div
        style={cardStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-6px)";
          e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <h3>Weekly Trend</h3>
        <WeeklyTrendChart expenses={expenses} />
      </div>
    </div>
  );
}

const cardStyle = {
  background: "#020617",
  borderRadius: "16px",
  padding: "24px",
  marginBottom: "32px",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
};