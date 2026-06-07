# 学习笔记 Blog — 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个基于 Next.js 15 的公开学习笔记 Blog，支持侧边栏导航、Markdown 文件存储、在线编辑器、亮暗主题切换和 4 套预设主题。

**Architecture:** Next.js App Router，Server Component 直接读取文件系统，API Route 处理笔记写入。左侧固定 240px 侧边栏，右侧主内容区最大行宽 720px。笔记以 `content/notes/{分类}/{slug}.md` 形式存储，frontmatter 管理元数据。

**Tech Stack:** Next.js 15 (App Router), Tailwind CSS, gray-matter, react-markdown, rehype-highlight, @uiw/react-md-editor, Vitest (测试)

---

## 文件结构

```
app/
├── layout.tsx                  # 根布局：ThemeProvider + Sidebar + 内容区
├── page.tsx                    # 首页：笔记时间线列表
├── globals.css                 # Tailwind 指令 + 主题 CSS 变量
├── notes/[category]/[slug]/page.tsx   # 笔记详情页
├── category/[category]/page.tsx       # 分类列表页
├── tag/[tag]/page.tsx                 # 标签列表页
├── editor/page.tsx                    # 编辑器页
└── api/notes/route.ts                 # API：读写笔记

components/
├── layout/
│   ├── Sidebar.tsx              # 侧边栏：标题、分类、标签、新建入口
│   ├── ThemeToggle.tsx          # 亮暗切换按钮
│   └── ThemeProvider.tsx        # 主题 Context Provider
├── notes/
│   ├── NoteCard.tsx             # 笔记卡片（标题、日期、分类、标签、摘要）
│   ├── NoteMeta.tsx             # 笔记元信息栏
│   ├── MarkdownRenderer.tsx     # react-markdown 渲染器（含代码高亮）
│   └── TableOfContents.tsx      # 自动目录（从 h2/h3 生成）
├── editor/
│   └── EditorMetaForm.tsx       # 编辑器元数据表单（标题、分类、标签）
└── ui/
    ├── TagBadge.tsx             # 标签徽章
    └── CategoryItem.tsx         # 分类列表项（支持高亮）

lib/
├── notes.ts                     # 笔记数据层：读/写/列表/分类/标签
├── themes.ts                    # 4 套主题定义 + ThemeConfig 类型
└── utils.ts                     # slug 生成、日期格式化

content/notes/                   # 用户笔记存放目录（git 跟踪）
```

---

### Task 1: 项目脚手架

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, `app/globals.css`, `app/layout.tsx`, `app/page.tsx`

- [ ] **Step 1: 初始化 Next.js 项目**

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --no-turbopack
```

安装完毕后确认 `npm run dev` 可启动。

- [ ] **Step 2: 安装依赖**

```bash
npm install gray-matter react-markdown rehype-highlight remark-gfm @uiw/react-md-editor
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 3: 配置 Tailwind 内容扫描**

修改 `tailwind.config.ts`，确保扫描所有组件：

```ts
import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
```

- [ ] **Step 4: 创建初始 content 目录和示例笔记**

```bash
mkdir -p content/notes/编程
mkdir -p content/notes/语言
```

创建 `content/notes/编程/hello-world.md`:

```markdown
---
title: 我的第一篇笔记
date: 2026-06-07
category: 编程
tags: [入门, 笔记]
description: 这是我的第一篇学习笔记
---

## 欢迎

这是我的学习笔记 Blog。这里会记录编程、语言和其他学习内容。

### 代码示例

\`\`\`javascript
console.log("Hello, World!");
\`\`\`
```

- [ ] **Step 5: 验证**

```bash
npm run dev
```

打开 http://localhost:3000，确认 Next.js 默认页面正常显示。

---

### Task 2: 主题系统

**Files:**
- Create: `lib/themes.ts`, `components/layout/ThemeProvider.tsx`, `components/layout/ThemeToggle.tsx`
- Modify: `app/globals.css`, `app/layout.tsx`

- [ ] **Step 1: 定义 4 套主题 (lib/themes.ts)**

```ts
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
```

- [ ] **Step 2: CSS 变量 (app/globals.css)**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-primary: #2563eb;
  --color-primary-hover: #1d4ed8;
  --color-bg: #ffffff;
  --color-sidebar-bg: #f8fafc;
  --color-card-bg: #ffffff;
  --color-text: #0f172a;
  --color-text-secondary: #475569;
  --color-border: #e2e8f0;
  --sidebar-width: 240px;
}

.dark {
  --color-primary: #60a5fa;
  --color-primary-hover: #93bbfd;
  --color-bg: #0f172a;
  --color-sidebar-bg: #1e293b;
  --color-card-bg: #1e293b;
  --color-text: #f1f5f9;
  --color-text-secondary: #94a3b8;
  --color-border: #334155;
}

body {
  background-color: var(--color-bg);
  color: var(--color-text);
}
```

- [ ] **Step 3: ThemeProvider (components/layout/ThemeProvider.tsx)**

```tsx
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
```

- [ ] **Step 4: ThemeToggle (components/layout/ThemeToggle.tsx)**

```tsx
"use client";

import { useTheme } from "./ThemeProvider";
import { ThemeName, themes } from "@/lib/themes";

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
        {(Object.values(themes) as typeof themes[keyof typeof themes][]).map((t) => (
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
```

- [ ] **Step 5: 包裹 layout (app/layout.tsx)**

```tsx
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "学习笔记",
  description: "个人学习笔记 Blog",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 6: 验证**

```bash
npm run dev
```

打开浏览器，确认无报错，CSS 变量加载正常。

---

### Task 3: 布局 — Sidebar

**Files:**
- Create: `components/layout/Sidebar.tsx`, `components/ui/CategoryItem.tsx`, `components/ui/TagBadge.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: TagBadge (components/ui/TagBadge.tsx)**

```tsx
import Link from "next/link";

interface TagBadgeProps {
  tag: string;
  count?: number;
}

export function TagBadge({ tag, count }: TagBadgeProps) {
  return (
    <Link
      href={`/tag/${encodeURIComponent(tag)}`}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs no-underline
        transition-colors hover:opacity-80"
      style={{
        backgroundColor: "var(--color-primary)",
        color: "#ffffff",
      }}
    >
      {tag}
      {count !== undefined && (
        <span className="opacity-70">({count})</span>
      )}
    </Link>
  );
}
```

- [ ] **Step 2: CategoryItem (components/ui/CategoryItem.tsx)**

```tsx
import Link from "next/link";

interface CategoryItemProps {
  category: string;
  count: number;
  active?: boolean;
}

export function CategoryItem({ category, count, active }: CategoryItemProps) {
  return (
    <Link
      href={`/category/${encodeURIComponent(category)}`}
      className="flex items-center justify-between px-3 py-1.5 rounded text-sm no-underline
        transition-colors"
      style={{
        backgroundColor: active ? "var(--color-primary)" : "transparent",
        color: active ? "#ffffff" : "var(--color-text-secondary)",
        fontWeight: active ? 600 : 400,
      }}
    >
      <span>📂 {category}</span>
      <span className="text-xs opacity-70">{count}</span>
    </Link>
  );
}
```

- [ ] **Step 3: Sidebar (components/layout/Sidebar.tsx)**

```tsx
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { CategoryItem } from "@/components/ui/CategoryItem";
import { TagBadge } from "@/components/ui/TagBadge";
import { getAllNotes } from "@/lib/notes";

export function Sidebar() {
  const { categories, tags } = getAllNotes();

  return (
    <aside
      className="fixed left-0 top-0 h-screen overflow-y-auto flex flex-col gap-4 py-6"
      style={{
        width: "var(--sidebar-width)",
        backgroundColor: "var(--color-sidebar-bg)",
        borderRight: `1px solid var(--color-border)`,
      }}
    >
      {/* 站点标题 */}
      <div className="px-4">
        <Link
          href="/"
          className="text-lg font-bold no-underline"
          style={{ color: "var(--color-text)" }}
        >
          📝 学习笔记
        </Link>
      </div>

      {/* 分类 */}
      <div className="px-2">
        <div
          className="px-3 py-1 text-xs font-semibold uppercase tracking-wide"
          style={{ color: "var(--color-text-secondary)" }}
        >
          分类
        </div>
        <div className="flex flex-col gap-0.5 mt-1">
          {categories.map(({ name, count }) => (
            <CategoryItem key={name} category={name} count={count} />
          ))}
        </div>
      </div>

      {/* 标签 */}
      <div className="px-2">
        <div
          className="px-3 py-1 text-xs font-semibold uppercase tracking-wide"
          style={{ color: "var(--color-text-secondary)" }}
        >
          标签
        </div>
        <div className="flex flex-wrap gap-1.5 mt-1 px-3">
          {tags.slice(0, 15).map(({ name, count }) => (
            <TagBadge key={name} tag={name} count={count} />
          ))}
        </div>
      </div>

      {/* 新建笔记 */}
      <div className="px-4 mt-auto">
        <Link
          href="/editor"
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm
            font-medium no-underline transition-colors"
          style={{
            backgroundColor: "var(--color-primary)",
            color: "#ffffff",
          }}
        >
          ✏ 写笔记
        </Link>
      </div>

      {/* 主题切换 */}
      <ThemeToggle />
    </aside>
  );
}
```

- [ ] **Step 4: 更新 layout (app/layout.tsx)**

```tsx
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Sidebar } from "@/components/layout/Sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "学习笔记",
  description: "个人学习笔记 Blog",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main
              className="flex-1"
              style={{ marginLeft: "var(--sidebar-width)" }}
            >
              <div className="max-w-[720px] mx-auto px-6 py-8">
                {children}
              </div>
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 5: 验证**

```bash
npm run dev
```

确认侧边栏正常渲染，左右布局正确。（`lib/notes.ts` 尚未创建，Sidebar 暂时会有导入错误——Task 4 解决。）

---

### Task 4: 数据层 — lib/notes.ts

**Files:**
- Create: `lib/notes.ts`, `lib/utils.ts`

- [ ] **Step 1: 工具函数 (lib/utils.ts)**

```ts
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}
```

- [ ] **Step 2: 数据层 (lib/notes.ts)**

```ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content", "notes");

export interface NoteMeta {
  slug: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
  description: string;
  path: string;
}

export interface Note extends NoteMeta {
  content: string;
}

export interface CategoryInfo {
  name: string;
  count: number;
}

export interface TagInfo {
  name: string;
  count: number;
}

function readNoteFile(filePath: string, category: string): Note | null {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);
    const slug = path.basename(filePath, ".md");
    return {
      slug,
      title: data.title || slug,
      date: data.date || "",
      category: data.category || category,
      tags: data.tags || [],
      description: data.description || "",
      path: filePath,
      content,
    };
  } catch {
    return null;
  }
}

export function getNote(category: string, slug: string): Note | null {
  const filePath = path.join(CONTENT_DIR, category, `${slug}.md`);
  return readNoteFile(filePath, category);
}

export function getAllNotes(): { notes: NoteMeta[]; categories: CategoryInfo[]; tags: TagInfo[] } {
  const notes: NoteMeta[] = [];
  const categoryCount: Record<string, number> = {};
  const tagCount: Record<string, number> = {};

  if (!fs.existsSync(CONTENT_DIR)) {
    return { notes: [], categories: [], tags: [] };
  }

  const categoryDirs = fs.readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory());

  for (const catDir of categoryDirs) {
    const catPath = path.join(CONTENT_DIR, catDir.name);
    const files = fs.readdirSync(catPath).filter(f => f.endsWith(".md"));

    categoryCount[catDir.name] = files.length;

    for (const file of files) {
      const filePath = path.join(catPath, file);
      const note = readNoteFile(filePath, catDir.name);
      if (note) {
        notes.push({
          slug: note.slug,
          title: note.title,
          date: note.date,
          category: note.category,
          tags: note.tags,
          description: note.description,
          path: note.path,
        });
        for (const tag of note.tags) {
          tagCount[tag] = (tagCount[tag] || 0) + 1;
        }
      }
    }
  }

  notes.sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  const categories: CategoryInfo[] = Object.entries(categoryCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const tags: TagInfo[] = Object.entries(tagCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return { notes, categories, tags };
}

export function getNotesByCategory(category: string): NoteMeta[] {
  return getAllNotes().notes.filter(n => n.category === category);
}

export function getNotesByTag(tag: string): NoteMeta[] {
  return getAllNotes().notes.filter(n => n.tags.includes(tag));
}

export function saveNote(note: {
  title: string;
  category: string;
  tags: string[];
  content: string;
  description?: string;
}): { slug: string; filePath: string } {
  const slug = note.title
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  const catDir = path.join(CONTENT_DIR, note.category);
  if (!fs.existsSync(catDir)) {
    fs.mkdirSync(catDir, { recursive: true });
  }

  const today = new Date().toISOString().slice(0, 10);
  const frontmatter = [
    "---",
    `title: ${note.title}`,
    `date: ${today}`,
    `category: ${note.category}`,
    `tags: [${note.tags.join(", ")}]`,
    `description: ${note.description || ""}`,
    "---",
    "",
  ].join("\n");

  const filePath = path.join(catDir, `${slug}.md`);
  fs.writeFileSync(filePath, frontmatter + note.content, "utf-8");

  return { slug, filePath };
}
```

- [ ] **Step 4: 验证**

在 Node 环境中手动测试：

```bash
node -e "const { getAllNotes, getNote } = require('./lib/notes'); console.log(JSON.stringify(getAllNotes(), null, 2))"
```

确认示例笔记被正确解析，categories 和 tags 汇总正确。

---

### Task 5: 首页 — NoteCard + 笔记列表

**Files:**
- Create: `components/notes/NoteCard.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: NoteCard (components/notes/NoteCard.tsx)**

```tsx
import Link from "next/link";
import { NoteMeta } from "@/lib/notes";
import { formatDate } from "@/lib/utils";
import { TagBadge } from "@/components/ui/TagBadge";

export function NoteCard({ note }: { note: NoteMeta }) {
  return (
    <article
      className="rounded-lg p-5 transition-shadow hover:shadow-md"
      style={{
        backgroundColor: "var(--color-card-bg)",
        border: `1px solid var(--color-border)`,
      }}
    >
      <div className="flex items-center gap-2 text-xs mb-2" style={{ color: "var(--color-text-secondary)" }}>
        <Link
          href={`/category/${encodeURIComponent(note.category)}`}
          className="no-underline"
          style={{ color: "var(--color-primary)" }}
        >
          {note.category}
        </Link>
        <span>·</span>
        <time>{formatDate(note.date)}</time>
      </div>
      <Link
        href={`/notes/${encodeURIComponent(note.category)}/${encodeURIComponent(note.slug)}`}
        className="no-underline"
      >
        <h2
          className="text-xl font-semibold mb-2 mt-0 transition-colors hover:opacity-80"
          style={{ color: "var(--color-text)" }}
        >
          {note.title}
        </h2>
      </Link>
      {note.description && (
        <p className="text-sm mb-3" style={{ color: "var(--color-text-secondary)" }}>
          {note.description}
        </p>
      )}
      <div className="flex flex-wrap gap-1.5">
        {note.tags.map((tag) => (
          <TagBadge key={tag} tag={tag} />
        ))}
      </div>
    </article>
  );
}
```

- [ ] **Step 2: 首页 (app/page.tsx)**

```tsx
import { getAllNotes } from "@/lib/notes";
import { NoteCard } from "@/components/notes/NoteCard";

const PAGE_SIZE = 20;

export default function HomePage() {
  const { notes } = getAllNotes();
  const displayedNotes = notes.slice(0, PAGE_SIZE);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">最新笔记</h1>
      {displayedNotes.length === 0 ? (
        <p style={{ color: "var(--color-text-secondary)" }}>
          还没有笔记，点击侧边栏「写笔记」开始记录吧。
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {displayedNotes.map((note) => (
            <NoteCard key={`${note.category}/${note.slug}`} note={note} />
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: 验证**

```bash
npm run dev
```

确认首页渲染示例笔记卡片，分类和标签链接可点击。

---

### Task 6: 笔记详情页

**Files:**
- Create: `components/notes/MarkdownRenderer.tsx`, `components/notes/TableOfContents.tsx`, `components/notes/NoteMeta.tsx`, `app/notes/[category]/[slug]/page.tsx`

- [ ] **Step 1: MarkdownRenderer (components/notes/MarkdownRenderer.tsx)**

```tsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose max-w-none" style={{ color: "var(--color-text)" }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          a: ({ href, children }) => (
            <a href={href} style={{ color: "var(--color-primary)" }}>
              {children}
            </a>
          ),
          code: ({ className, children, ...props }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code
                  className="px-1 py-0.5 rounded text-sm"
                  style={{
                    backgroundColor: "var(--color-sidebar-bg)",
                    color: "var(--color-primary)",
                  }}
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
```

- [ ] **Step 2: TableOfContents (components/notes/TableOfContents.tsx)**

```tsx
"use client";

import { useMemo } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

function extractToc(content: string): TocItem[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const items: TocItem[] = [];
  let match: RegExpExecArray | null;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")
      .replace(/^-+|-+$/g, "");
    items.push({ id, text, level });
  }
  return items;
}

export function TableOfContents({ content }: { content: string }) {
  const items = useMemo(() => extractToc(content), [content]);

  if (items.length === 0) return null;

  return (
    <nav
      className="p-4 rounded-lg mb-6"
      style={{
        backgroundColor: "var(--color-sidebar-bg)",
        border: `1px solid var(--color-border)`,
      }}
    >
      <h3
        className="text-sm font-semibold mb-2"
        style={{ color: "var(--color-text)" }}
      >
        目录
      </h3>
      <ul className="list-none m-0 p-0">
        {items.map((item) => (
          <li
            key={item.id}
            className="my-1"
            style={{ paddingLeft: item.level === 3 ? "1rem" : "0" }}
          >
            <a
              href={`#${item.id}`}
              className="text-sm no-underline hover:underline"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

- [ ] **Step 3: NoteMeta (components/notes/NoteMeta.tsx)**

```tsx
import Link from "next/link";
import { NoteMeta as NoteMetaType } from "@/lib/notes";
import { formatDate } from "@/lib/utils";
import { TagBadge } from "@/components/ui/TagBadge";

export function NoteMeta({ note }: { note: NoteMetaType | { title: string; date: string; category: string; tags: string[] } }) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold mb-3" style={{ color: "var(--color-text)" }}>
        {note.title}
      </h1>
      <div className="flex items-center gap-3 text-sm flex-wrap">
        <Link
          href={`/category/${encodeURIComponent(note.category)}`}
          className="no-underline font-medium"
          style={{ color: "var(--color-primary)" }}
        >
          📂 {note.category}
        </Link>
        <time style={{ color: "var(--color-text-secondary)" }}>
          {formatDate(note.date)}
        </time>
        <div className="flex gap-1.5">
          {note.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: MarkdownRenderer 添加 id 锚点支持**

修改 `components/notes/MarkdownRenderer.tsx`，给标题添加 id：

```tsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose max-w-none" style={{ color: "var(--color-text)" }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h2: ({ children, ...props }) => {
            const text = String(children);
            const id = slugify(text);
            return <h2 id={id} {...props}>{children}</h2>;
          },
          h3: ({ children, ...props }) => {
            const text = String(children);
            const id = slugify(text);
            return <h3 id={id} {...props}>{children}</h3>;
          },
          a: ({ href, children }) => (
            <a href={href} style={{ color: "var(--color-primary)" }}>
              {children}
            </a>
          ),
          code: ({ className, children, ...props }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code
                  className="px-1 py-0.5 rounded text-sm"
                  style={{
                    backgroundColor: "var(--color-sidebar-bg)",
                    color: "var(--color-primary)",
                  }}
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          blockquote: ({ children, ...props }) => (
            <blockquote
              style={{
                borderLeftColor: "var(--color-primary)",
                borderLeftWidth: "3px",
                paddingLeft: "1rem",
              }}
              {...props}
            >
              {children}
            </blockquote>
          ),
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto">
              <table
                style={{ borderColor: "var(--color-border)" }}
                {...props}
              >
                {children}
              </table>
            </div>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
```

- [ ] **Step 5: 笔记详情页 (app/notes/[category]/[slug]/page.tsx)**

```tsx
import { notFound } from "next/navigation";
import { getNote } from "@/lib/notes";
import { NoteMeta } from "@/components/notes/NoteMeta";
import { MarkdownRenderer } from "@/components/notes/MarkdownRenderer";
import { TableOfContents } from "@/components/notes/TableOfContents";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const note = getNote(decodeURIComponent(category), decodeURIComponent(slug));
  if (!note) return { title: "笔记不存在" };
  return {
    title: `${note.title} — 学习笔记`,
    description: note.description,
  };
}

export default async function NotePage({ params }: Props) {
  const { category, slug } = await params;
  const note = getNote(decodeURIComponent(category), decodeURIComponent(slug));

  if (!note) notFound();

  return (
    <article>
      <NoteMeta note={note} />
      <TableOfContents content={note.content} />
      <MarkdownRenderer content={note.content} />
    </article>
  );
}
```

- [ ] **Step 6: 验证**

```bash
npm run dev
```

打开 http://localhost:3000/notes/编程/hello-world，确认笔记渲染正常，目录、代码高亮生效。

---

### Task 7: 分类页 + 标签页

**Files:**
- Create: `app/category/[category]/page.tsx`, `app/tag/[tag]/page.tsx`

- [ ] **Step 1: 分类页 (app/category/[category]/page.tsx)**

```tsx
import { getNotesByCategory } from "@/lib/notes";
import { NoteCard } from "@/components/notes/NoteCard";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = decodeURIComponent(category);
  return {
    title: `${cat} — 学习笔记`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = decodeURIComponent(category);
  const notes = getNotesByCategory(cat);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">📂 {cat}</h1>
      <p className="text-sm mb-6" style={{ color: "var(--color-text-secondary)" }}>
        共 {notes.length} 篇笔记
      </p>
      {notes.length === 0 ? (
        <p style={{ color: "var(--color-text-secondary)" }}>该分类下暂无笔记。</p>
      ) : (
        <div className="flex flex-col gap-4">
          {notes.map((note) => (
            <NoteCard key={`${note.category}/${note.slug}`} note={note} />
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: 标签页 (app/tag/[tag]/page.tsx)**

```tsx
import { getNotesByTag } from "@/lib/notes";
import { NoteCard } from "@/components/notes/NoteCard";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ tag: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const t = decodeURIComponent(tag);
  return {
    title: `#${t} — 学习笔记`,
  };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const t = decodeURIComponent(tag);
  const notes = getNotesByTag(t);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">
        <span style={{ color: "var(--color-primary)" }}>#</span> {t}
      </h1>
      <p className="text-sm mb-6" style={{ color: "var(--color-text-secondary)" }}>
        共 {notes.length} 篇笔记
      </p>
      {notes.length === 0 ? (
        <p style={{ color: "var(--color-text-secondary)" }}>该标签下暂无笔记。</p>
      ) : (
        <div className="flex flex-col gap-4">
          {notes.map((note) => (
            <NoteCard key={`${note.category}/${note.slug}`} note={note} />
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: 验证**

```bash
npm run dev
```

访问 `/category/编程` 和 `/tag/入门`，确认列表正常渲染。

---

### Task 8: 编辑器页

**Files:**
- Create: `components/editor/EditorMetaForm.tsx`, `app/editor/page.tsx`

- [ ] **Step 1: EditorMetaForm (components/editor/EditorMetaForm.tsx)**

```tsx
"use client";

import { getNote } from "@/lib/notes";

interface EditorMetaFormProps {
  title: string;
  setTitle: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  tags: string;
  setTags: (v: string) => void;
  categories: string[];
}

export function EditorMetaForm({
  title,
  setTitle,
  category,
  setCategory,
  tags,
  setTags,
  categories,
}: EditorMetaFormProps) {
  return (
    <div
      className="flex flex-wrap gap-3 p-4 rounded-lg mb-4"
      style={{
        backgroundColor: "var(--color-sidebar-bg)",
        border: `1px solid var(--color-border)`,
      }}
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="笔记标题"
        className="flex-1 min-w-[200px] px-3 py-2 rounded text-sm border"
        style={{
          backgroundColor: "var(--color-card-bg)",
          color: "var(--color-text)",
          borderColor: "var(--color-border)",
        }}
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="px-3 py-2 rounded text-sm border"
        style={{
          backgroundColor: "var(--color-card-bg)",
          color: "var(--color-text)",
          borderColor: "var(--color-border)",
        }}
      >
        <option value="">选择分类</option>
        {categories.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
        <option value="__new__">+ 新建分类</option>
      </select>
      {category === "__new__" && (
        <input
          type="text"
          value={category === "__new__" ? "" : category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="新分类名称"
          className="px-3 py-2 rounded text-sm border"
          style={{
            backgroundColor: "var(--color-card-bg)",
            color: "var(--color-text)",
            borderColor: "var(--color-border)",
          }}
        />
      )}
      <input
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="标签（逗号分隔）"
        className="flex-1 min-w-[200px] px-3 py-2 rounded text-sm border"
        style={{
          backgroundColor: "var(--color-card-bg)",
          color: "var(--color-text)",
          borderColor: "var(--color-border)",
        }}
      />
    </div>
  );
}
```

- [ ] **Step 2: 编辑器页 (app/editor/page.tsx)**

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { EditorMetaForm } from "@/components/editor/EditorMetaForm";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function EditorPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // categories 由 Sidebar 传入的数据获取，这里用硬编码默认值
  const categories = ["编程", "语言", "课程"];

  const handleSave = async () => {
    if (!title.trim()) { setError("请输入标题"); return; }
    if (!category || category === "__new__") { setError("请选择或输入分类"); return; }

    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          category,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
          content,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "保存失败");
      }

      const { slug } = await res.json();
      router.push(`/notes/${encodeURIComponent(category)}/${encodeURIComponent(slug)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存失败");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">写笔记</h1>

      <EditorMetaForm
        title={title}
        setTitle={setTitle}
        category={category}
        setCategory={setCategory}
        tags={tags}
        setTags={setTags}
        categories={categories}
      />

      {error && (
        <div
          className="px-4 py-2 rounded mb-4 text-sm"
          style={{ backgroundColor: "#fee2e2", color: "#dc2626" }}
        >
          {error}
        </div>
      )}

      <div data-color-mode="light">
        <MDEditor
          value={content}
          onChange={(val) => setContent(val || "")}
          height={500}
          preview="live"
        />
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          style={{
            backgroundColor: "var(--color-primary)",
            color: "#ffffff",
          }}
        >
          {saving ? "保存中..." : "保存笔记"}
        </button>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-2 rounded-lg text-sm font-medium border transition-colors"
          style={{
            backgroundColor: "var(--color-card-bg)",
            color: "var(--color-text-secondary)",
            borderColor: "var(--color-border)",
          }}
        >
          取消
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: 验证**

```bash
npm run dev
```

打开 `/editor`，确认编辑器渲染、分栏预览、元数据表单正常。

---

### Task 9: API Route — 笔记保存

**Files:**
- Create: `app/api/notes/route.ts`

- [ ] **Step 1: API Route (app/api/notes/route.ts)**

```ts
import { NextRequest, NextResponse } from "next/server";
import { saveNote, getAllNotes } from "@/lib/notes";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, category, tags, content, description } = body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "标题不能为空" }, { status: 400 });
    }
    if (!category || typeof category !== "string" || !category.trim()) {
      return NextResponse.json({ error: "分类不能为空" }, { status: 400 });
    }
    if (!content || typeof content !== "string") {
      return NextResponse.json({ error: "内容不能为空" }, { status: 400 });
    }

    const tagsArray = Array.isArray(tags)
      ? tags.filter((t: unknown) => typeof t === "string" && t.trim())
      : [];

    const result = saveNote({
      title: title.trim(),
      category: category.trim(),
      tags: tagsArray,
      content,
      description: description || "",
    });

    return NextResponse.json({ slug: result.slug, filePath: result.filePath });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "服务器错误" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { notes, categories, tags } = getAllNotes();
    return NextResponse.json({ notes, categories, tags });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "服务器错误" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: 验证**

用 curl 测试保存：

```bash
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"API 测试笔记","category":"编程","tags":["test"],"content":"## 测试\n\n通过 API 创建的笔记。"}'
```

确认返回 slug 和 filePath，然后访问对应页面验证渲染。

---

### Task 10: 收尾 — SEO + 移动端响应式 + 404

**Files:**
- Modify: `app/layout.tsx`, `app/globals.css`
- Create: `app/not-found.tsx`

- [ ] **Step 1: 移动端响应式 (app/globals.css 追加)**

```css
@media (max-width: 768px) {
  :root {
    --sidebar-width: 0px;
  }

  aside {
    transform: translateX(-100%);
    transition: transform 0.2s ease;
    z-index: 50;
  }

  aside.open {
    transform: translateX(0);
  }
}
```

- [ ] **Step 2: Sidebar 添加移动端汉堡菜单**

修改 `components/layout/Sidebar.tsx`，在顶部添加一个汉堡按钮（仅移动端显示，通过 CSS class 控制）：

在 Sidebar 返回的 `<aside>` 最前面插入：

```tsx
{/* 移动端汉堡菜单按钮 — 添加到 aside 内的最前面，紧跟 <aside> 标签 */}
<button
  className="md:hidden absolute top-4 right-4 text-xl p-1"
  onClick={/* 触发侧边栏展开/关闭 */} 
  style={{ color: "var(--color-text)" }}
  aria-label="菜单"
>
  ☰
</button>
```

由于 Sidebar 是 Server Component，需要将移动端 toggle 逻辑提取为 Client Component。创建 `components/layout/MobileMenuToggle.tsx`:

```tsx
"use client";

import { useState } from "react";

export function MobileMenuToggle() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-50 px-3 py-2 rounded-lg text-sm border"
        style={{
          backgroundColor: "var(--color-card-bg)",
          color: "var(--color-text)",
          borderColor: "var(--color-border)",
        }}
        onClick={() => setOpen(!open)}
        aria-label="菜单"
      >
        ☰
      </button>
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/30"
          onClick={() => setOpen(false)}
        />
      )}
      <style jsx global>{`
        @media (max-width: 768px) {
          aside { transform: translateX(-100%); transition: transform 0.2s; z-index: 50; }
          aside.open { transform: translateX(0); }
        }
      `}</style>
      {open && (
        <script
          dangerouslySetInnerHTML={{
            __html: `document.querySelector('aside')?.classList.add('open');`,
          }}
        />
      )}
      {!open && (
        <script
          dangerouslySetInnerHTML={{
            __html: `document.querySelector('aside')?.classList.remove('open');`,
          }}
        />
      )}
    </>
  );
}
```

在 `app/layout.tsx` 的 `<body>` 内引入 `<MobileMenuToggle />`。

- [ ] **Step 3: 404 页面 (app/not-found.tsx)**

```tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h1 className="text-6xl font-bold mb-4" style={{ color: "var(--color-text-secondary)" }}>
        404
      </h1>
      <p className="text-lg mb-6" style={{ color: "var(--color-text-secondary)" }}>
        页面不存在
      </p>
      <Link
        href="/"
        className="px-6 py-2 rounded-lg text-sm font-medium no-underline"
        style={{ backgroundColor: "var(--color-primary)", color: "#ffffff" }}
      >
        返回首页
      </Link>
    </div>
  );
}
```

- [ ] **Step 4: 全局 SEO metadata (app/layout.tsx 追加)**

```tsx
export const metadata: Metadata = {
  title: {
    default: "学习笔记",
    template: "%s — 学习笔记",
  },
  description: "个人学习笔记 Blog — 记录编程、语言和学科知识",
};
```

- [ ] **Step 5: 验证**

```bash
npm run dev
```

- 缩小浏览器窗口到 768px 以下，确认汉堡菜单可用
- 访问不存在的路径，确认 404 页面显示
- 查看页面 `<title>`，确认 SEO metadata 正确

---

### Task 11: 编辑器页 — 预填分类列表

**Files:**
- Modify: `app/editor/page.tsx`

- [ ] **Step 1: 从 API 获取实时分类列表**

修改 `app/editor/page.tsx`，用 `useEffect` 从 `GET /api/notes` 获取分类列表替代硬编码：

```tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { EditorMetaForm } from "@/components/editor/EditorMetaForm";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function EditorPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/notes")
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) {
          setCategories(data.categories.map((c: { name: string }) => c.name));
        }
      })
      .catch(() => setCategories(["编程", "语言", "课程"]));
  }, []);

  const handleSave = async () => {
    if (!title.trim()) { setError("请输入标题"); return; }
    if (!category || category === "__new__") { setError("请选择或输入分类"); return; }

    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          category,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
          content,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "保存失败");
      }

      const { slug } = await res.json();
      router.push(`/notes/${encodeURIComponent(category)}/${encodeURIComponent(slug)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存失败");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">写笔记</h1>

      <EditorMetaForm
        title={title}
        setTitle={setTitle}
        category={category}
        setCategory={setCategory}
        tags={tags}
        setTags={setTags}
        categories={categories}
      />

      {error && (
        <div
          className="px-4 py-2 rounded mb-4 text-sm"
          style={{ backgroundColor: "#fee2e2", color: "#dc2626" }}
        >
          {error}
        </div>
      )}

      <div data-color-mode="light">
        <MDEditor
          value={content}
          onChange={(val) => setContent(val || "")}
          height={500}
          preview="live"
        />
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          style={{
            backgroundColor: "var(--color-primary)",
            color: "#ffffff",
          }}
        >
          {saving ? "保存中..." : "保存笔记"}
        </button>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-2 rounded-lg text-sm font-medium border transition-colors"
          style={{
            backgroundColor: "var(--color-card-bg)",
            color: "var(--color-text-secondary)",
            borderColor: "var(--color-border)",
          }}
        >
          取消
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 验证**

```bash
npm run dev
```

打开 `/editor`，确认分类下拉从 API 获取数据。

---

## 实现顺序

Task 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11

每个 Task 完成后验证 `npm run dev` 无报错再进行下一个。
