"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AddExpenseForm() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !amount || !category || !date) return;

    const { error } = await supabase.from("expenses").insert([
      {
        title,
        amount: parseFloat(amount),
        category,
        created_at: new Date(date),
      },
    ]);

    if (error) {
      console.error("Insert error:", error);
      return;
    }

    setTitle("");
    setAmount("");
    setCategory("");
    setDate("");

    // optional: reload page to refresh table
    window.location.reload();
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        width: "300px",
      }}
    >
      <input
        type="text"
        placeholder="Expense Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <button type="submit">Add Expense</button>
    </form>
  );
}