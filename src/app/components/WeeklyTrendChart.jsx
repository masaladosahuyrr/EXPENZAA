"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { motion } from "framer-motion";

export default function WeeklyTrendChart({ expenses }) {

  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  const data = days.map((day, index) => {
    const total = expenses
      .filter((exp) => {
        const d = new Date(exp.date || exp.created_at);
        return d.getDay() === index;
      })
      .reduce((sum, exp) => sum + Number(exp.amount), 0);

    return { day, total };
  });

  const renderTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
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
          <strong>{payload[0].payload.day}</strong>
          <div>₹ {payload[0].value.toLocaleString()}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      style={{ height: 320 }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barCategoryGap={20}>
          <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />

          <XAxis dataKey="day" stroke="#94a3b8" tickLine={false} axisLine={false} />

          <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />

          <Tooltip content={renderTooltip} />

          <Bar dataKey="total" radius={[12,12,0,0]} animationDuration={1200}>
            {data.map((entry, index) => (
              <Cell key={index} fill="#6366f1" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}