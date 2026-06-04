"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface FloatingCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  status: string;
  statusColor: "blue" | "green" | "amber";
  delay?: number;
}

export default function FloatingCard({
  icon: Icon,
  title,
  value,
  status,
  statusColor,
  delay = 0,
}: FloatingCardProps) {
  const statusColors = {
    blue: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    green: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    amber: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className="glass-card p-6 hover:bg-white/[0.07] transition-all duration-300 group animate-float"
      style={{
        animationDelay: `${delay * 1000}ms`,
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-xl bg-white/5 border border-white/8 group-hover:bg-blue-primary/10 group-hover:border-blue-primary/30 transition-all duration-300">
          <Icon className="w-5 h-5 text-blue-glow" />
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[statusColor]}`}
        >
          {status}
        </span>
      </div>

      <div className="space-y-1">
        <p className="text-text-secondary text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold text-text-primary">{value}</p>
      </div>
    </motion.div>
  );
}
