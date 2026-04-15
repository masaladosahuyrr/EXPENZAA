"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { useState } from "react";

const COLORS = ["#22c55e", "#3b82f6", "#f97316", "#ef4444", "#a855f7"];

export default function ExpenseChart({ expenses }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const data = Object.values(
    expenses.reduce((acc, item) => {
      acc[item.category] = acc[item.category] || {
        name: item.category,
        value: 0,
      };
      acc[item.category].value += Number(item.amount);
      return acc;
    }, {})
  );

  const total = data.reduce((sum, item) => sum + item.value, 0);
  /* =========================
   FIND TOP CATEGORY
========================= */

let topCategory = "";
let topAmount = 0;

data.forEach((item) => {
  if (item.value > topAmount) {
    topAmount = item.value;
    topCategory = item.name;
  }
});

  const renderTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {

    const percent = ((payload[0].value / total) * 100).toFixed(1);

    return (
      <div
        style={{
          background: "rgba(15,23,42,0.95)",
          padding: "10px 14px",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "white",
        }}
      >
        <strong>{payload[0].name}</strong>

        <div>₹ {payload[0].value.toLocaleString()}</div>

        <div style={{ opacity: 0.7 }}>
          {percent}% of spending
        </div>
      </div>
    );
  }

  return null;
};

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      style={{ height: 350, position: "relative" }}
    >
      {/* CENTER TOTAL */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <div style={{ fontSize: 14, opacity: 0.6 }}>Total</div>
        <div
          style={{
            fontSize: 24,
            fontWeight: 800,
            background: "linear-gradient(90deg,#22c55e,#3b82f6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          ₹ {total.toLocaleString()}
        </div>
        <div style={{ fontSize: 12, opacity: 0.5 }}>
Top: {topCategory}
</div>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={80}
            outerRadius={130}
            paddingAngle={4}
            animationDuration={1200}
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
                style={{
                  filter:
                    activeIndex === index
                      ? "drop-shadow(0 0 15px rgba(139,92,246,0.8))"
                      : "none",
                  transform:
                    activeIndex === index ? "scale(1.05)" : "scale(1)",
                  transformOrigin: "center",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </Pie>

          <Tooltip content={renderTooltip} />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}