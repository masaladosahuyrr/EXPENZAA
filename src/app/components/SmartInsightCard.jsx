"use client";

import { motion } from "framer-motion";

export default function SmartInsightCard({ income, expenses, balance }) {

  const budgetUsed = income > 0 ? ((expenses / income) * 100).toFixed(1) : 0;

  let message = "You are managing your budget well 👍";

  if (budgetUsed > 70 && budgetUsed < 100) {
    message = "You are nearing your monthly budget ⚠️";
  }

  if (budgetUsed >= 100) {
    message = "You exceeded your budget 🚨";
  }

  return (
    <motion.div
      className="card-glass"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{ padding: "20px" }}
    >
      <h3 className="section-title">💡 Smart Insight</h3>

      <p style={{ marginBottom: "8px" }}>
        Budget used: <strong>{budgetUsed}%</strong>
      </p>

      <p style={{ marginBottom: "8px" }}>
        Total expenses: <strong>₹ {expenses.toLocaleString()}</strong>
      </p>

      <p style={{ marginBottom: "8px" }}>
        Remaining balance: <strong>₹ {balance.toLocaleString()}</strong>
      </p>

      <p style={{ opacity: 0.7 }}>
        {message}
      </p>

    </motion.div>
  );
}