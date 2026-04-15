"use client";

import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";
import { motion } from "framer-motion";

export default function MonthlyTrendChart({ expenses }) {

  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  const data = months.map((month, index) => {

    const total = expenses
      .filter((exp) => {
        const d = new Date(exp.date || exp.created_at);
        return d.getMonth() === index;
      })
      .reduce((sum, exp) => sum + Number(exp.amount), 0);

    return { month, total };

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
          <strong>{payload[0].payload.month}</strong>
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
        <AreaChart data={data}>
          <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />

          <XAxis dataKey="month" stroke="#94a3b8" tickLine={false} axisLine={false} />

          <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />

          <Tooltip content={renderTooltip} />

          <Area
            type="monotone"
            dataKey="total"
            stroke="#3b82f6"
            strokeWidth={3}
            fillOpacity={0.3}
            fill="#3b82f6"
            animationDuration={1400}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}