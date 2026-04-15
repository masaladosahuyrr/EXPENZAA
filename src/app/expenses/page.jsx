"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);

  // 🔥 Fetch expenses from Supabase
  const fetchExpenses = async () => {
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching expenses:", error);
    } else {
      setExpenses(data);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div className="dashboard-container">
      <h1>All Expenses</h1>

      {expenses.length === 0 ? (
        <p>No expenses yet.</p>
      ) : (
        <table className="expense-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {expenses.map((exp) => (
              <tr key={exp.id}>
                <td>{exp.title}</td>
                <td>₹ {exp.amount}</td>
                <td>{exp.category}</td>
                <td>
                  {new Date(exp.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}