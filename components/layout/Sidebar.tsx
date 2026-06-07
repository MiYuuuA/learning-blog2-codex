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
        borderRight: "1px solid var(--color-border)",
      }}
    >
      <div className="px-4">
        <Link
          href="/"
          className="text-lg font-bold no-underline"
          style={{ color: "var(--color-text)" }}
        >
          📝 学习笔记
        </Link>
      </div>

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

      <div className="px-4 mt-auto">
        <Link
          href="/editor"
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium no-underline transition-colors"
          style={{
            backgroundColor: "var(--color-primary)",
            color: "#ffffff",
          }}
        >
          ✏ 写笔记
        </Link>
      </div>

      <ThemeToggle />
    </aside>
  );
}
