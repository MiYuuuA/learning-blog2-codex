export type ThemeName = "blue" | "green" | "gray" | "amber";

export interface ThemeConfig {
  name: string;
  label: string;
  light: {
    primary: string;
    primaryHover: string;
    bg: string;
    sidebarBg: string;
    cardBg: string;
    text: string;
    textSecondary: string;
    border: string;
  };
  dark: {
    primary: string;
    primaryHover: string;
    bg: string;
    sidebarBg: string;
    cardBg: string;
    text: string;
    textSecondary: string;
    border: string;
  };
}

export const themes: Record<ThemeName, ThemeConfig> = {
  blue: {
    name: "blue",
    label: "经典蓝",
    light: {
      primary: "#2563eb",
      primaryHover: "#1d4ed8",
      bg: "#ffffff",
      sidebarBg: "#f8fafc",
      cardBg: "#ffffff",
      text: "#0f172a",
      textSecondary: "#475569",
      border: "#e2e8f0",
    },
    dark: {
      primary: "#60a5fa",
      primaryHover: "#93bbfd",
      bg: "#0f172a",
      sidebarBg: "#1e293b",
      cardBg: "#1e293b",
      text: "#f1f5f9",
      textSecondary: "#94a3b8",
      border: "#334155",
    },
  },
  green: {
    name: "green",
    label: "墨绿学术",
    light: {
      primary: "#059669",
      primaryHover: "#047857",
      bg: "#ffffff",
      sidebarBg: "#f0fdf4",
      cardBg: "#ffffff",
      text: "#0f172a",
      textSecondary: "#475569",
      border: "#dcfce7",
    },
    dark: {
      primary: "#34d399",
      primaryHover: "#6ee7b7",
      bg: "#0f1f17",
      sidebarBg: "#0f1f17",
      cardBg: "#1a2f1f",
      text: "#f1f5f9",
      textSecondary: "#94a3b8",
      border: "#1e3a2a",
    },
  },
  gray: {
    name: "gray",
    label: "暖灰极简",
    light: {
      primary: "#6b7280",
      primaryHover: "#4b5563",
      bg: "#ffffff",
      sidebarBg: "#f9fafb",
      cardBg: "#ffffff",
      text: "#111827",
      textSecondary: "#6b7280",
      border: "#e5e7eb",
    },
    dark: {
      primary: "#9ca3af",
      primaryHover: "#d1d5db",
      bg: "#111827",
      sidebarBg: "#1f2937",
      cardBg: "#1f2937",
      text: "#f9fafb",
      textSecondary: "#9ca3af",
      border: "#374151",
    },
  },
  amber: {
    name: "amber",
    label: "琥珀暗金",
    light: {
      primary: "#d97706",
      primaryHover: "#b45309",
      bg: "#ffffff",
      sidebarBg: "#fff7ed",
      cardBg: "#ffffff",
      text: "#0f172a",
      textSecondary: "#475569",
      border: "#fed7aa",
    },
    dark: {
      primary: "#fbbf24",
      primaryHover: "#fcd34d",
      bg: "#1c1917",
      sidebarBg: "#1c1917",
      cardBg: "#292524",
      text: "#f5f5f4",
      textSecondary: "#a8a29e",
      border: "#44403c",
    },
  },
};
