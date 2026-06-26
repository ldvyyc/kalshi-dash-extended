"use client";
import { useEffect, useState } from "react";
import { Chart } from "chart.js";

const STORAGE_KEY = "ldvyyc-theme";

function applyChartTheme(theme: "dark" | "light") {
  if (theme === "dark") {
    Chart.defaults.color = "#A0AEC0";
    Chart.defaults.borderColor = "rgba(255,255,255,0.08)";
    Chart.defaults.plugins.legend.labels.color = "#A0AEC0";
    Chart.defaults.plugins.title.color = "#EDF2F7";
    Chart.defaults.scale.grid.color = "rgba(255,255,255,0.06)";
    Chart.defaults.scale.ticks.color = "#718096";
  } else {
    Chart.defaults.color = "#374151";
    Chart.defaults.borderColor = "rgba(0,0,0,0.08)";
    Chart.defaults.plugins.legend.labels.color = "#374151";
    Chart.defaults.plugins.title.color = "#111827";
    Chart.defaults.scale.grid.color = "rgba(0,0,0,0.06)";
    Chart.defaults.scale.ticks.color = "#6B7280";
  }
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as "dark" | "light" | null;
    const initial = saved ?? "dark";
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
    applyChartTheme(initial);
    setMounted(true);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(STORAGE_KEY, next);
    applyChartTheme(next);
  };

  if (!mounted) return null;
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        position: "fixed",
        bottom: "1.5rem",
        left: "1.5rem",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.55rem 1rem",
        borderRadius: "999px",
        border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(0,0,0,0.12)",
        background: isDark ? "rgba(13,16,24,0.85)" : "rgba(255,255,255,0.90)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        color: isDark ? "#A0AEC0" : "#4A5568",
        fontSize: "0.78rem",
        fontFamily: "'Inter', sans-serif",
        fontWeight: 500,
        letterSpacing: "0.03em",
        cursor: "pointer",
        boxShadow: isDark ? "0 2px 12px rgba(0,0,0,0.4)" : "0 2px 12px rgba(0,0,0,0.12)",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "#5BB8E8";
        e.currentTarget.style.color = "#5BB8E8";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)";
        e.currentTarget.style.color = isDark ? "#A0AEC0" : "#4A5568";
      }}
    >
      <span style={{ fontSize: "0.95rem", lineHeight: 1 }}>{isDark ? "☀" : "☾"}</span>
      <span>{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}
