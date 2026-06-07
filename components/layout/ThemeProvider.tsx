"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { ThemeName, themes, ThemeConfig } from "@/lib/themes";

type ThemeMode = "light" | "dark";

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
  mode: ThemeMode;
  toggleMode: () => void;
  config: ThemeConfig;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(name: ThemeName, mode: ThemeMode) {
  const config = themes[name];
  const palette = mode === "dark" ? config.dark : config.light;
  const root = document.documentElement;
  root.style.setProperty("--color-primary", palette.primary);
  root.style.setProperty("--color-primary-hover", palette.primaryHover);
  root.style.setProperty("--color-bg", palette.bg);
  root.style.setProperty("--color-sidebar-bg", palette.sidebarBg);
  root.style.setProperty("--color-card-bg", palette.cardBg);
  root.style.setProperty("--color-text", palette.text);
  root.style.setProperty("--color-text-secondary", palette.textSecondary);
  root.style.setProperty("--color-border", palette.border);
  root.classList.toggle("dark", mode === "dark");
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>("blue");
  const [mode, setMode] = useState<ThemeMode>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("blog-theme") as ThemeName | null;
    const savedMode = localStorage.getItem("blog-mode") as ThemeMode | null;
    const sysDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const t = savedTheme || "blue";
    const m = savedMode || (sysDark ? "dark" : "light");
    setThemeState(t);
    setMode(m);
    applyTheme(t, m);
    setMounted(true);
  }, []);

  const setTheme = (t: ThemeName) => {
    setThemeState(t);
    localStorage.setItem("blog-theme", t);
    applyTheme(t, mode);
  };

  const toggleMode = () => {
    const next = mode === "light" ? "dark" : "light";
    setMode(next);
    localStorage.setItem("blog-mode", next);
    applyTheme(theme, next);
  };

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, mode, toggleMode, config: themes[theme] }}
    >
      {mounted ? children : <div style={{ visibility: "hidden" }}>{children}</div>}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
