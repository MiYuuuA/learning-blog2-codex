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
      className="flex items-center justify-between px-3 py-1.5 rounded text-sm no-underline transition-colors"
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
