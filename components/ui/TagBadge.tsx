import Link from "next/link";

interface TagBadgeProps {
  tag: string;
  count?: number;
}

export function TagBadge({ tag, count }: TagBadgeProps) {
  return (
    <Link
      href={`/tag/${encodeURIComponent(tag)}`}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs no-underline transition-colors hover:opacity-80"
      style={{
        backgroundColor: "var(--color-primary)",
        color: "#ffffff",
      }}
    >
      {tag}
      {count !== undefined && <span className="opacity-70">({count})</span>}
    </Link>
  );
}
