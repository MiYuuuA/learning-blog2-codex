"use client";

import { useTheme } from "./ThemeProvider";
import { ThemeName, themes, ThemeConfig } from "@/lib/themes";

export function ThemeToggle() {
  const { theme, setTheme, mode, toggleMode } = useTheme();

  return (
    <div className="flex items-center gap-2 px-3 py-2">
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value as ThemeName)}
        className="text-xs rounded border px-2 py-1"
        style={{
          backgroundColor: "var(--color-card-bg)",
          color: "var(--color-text)",
          borderColor: "var(--color-border)",
        }}
      >
        {(Object.values(themes) as ThemeConfig[]).map((t) => (
          <option key={t.name} value={t.name}>
            {t.label}
          </option>
        ))}
      </select>
      <button
        onClick={toggleMode}
        className="text-sm px-2 py-1 rounded border"
        style={{
          backgroundColor: "var(--color-card-bg)",
          color: "var(--color-text)",
          borderColor: "var(--color-border)",
        }}
        aria-label={mode === "light" ? "切换暗色模式" : "切换亮色模式"}
      >
        {mode === "light" ? "🌙" : "☀️"}
      </button>
    </div>
  );
}
