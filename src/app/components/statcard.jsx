"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function StatCard({ label, value }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    let startTime = null;

    if (!value) {
      setDisplayValue(0);
      return;
    }

    const animateCounter = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;

      const percentage = Math.min(progress / duration, 1);
      const currentValue = Math.floor(percentage * value);

      setDisplayValue(currentValue);

      if (percentage < 1) {
        requestAnimationFrame(animateCounter);
      }
    };

    requestAnimationFrame(animateCounter);
  }, [value]);

  return (
    <motion.div
      className="stat-card"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05, rotateX: 6, rotateY: -6 }}
      transition={{ duration: 0.6 }}
    >
      <p className="stat-label">{label}</p>

      <motion.h2
        className="stat-value"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        ₹ {displayValue.toLocaleString()}
      </motion.h2>
    </motion.div>
  );
}