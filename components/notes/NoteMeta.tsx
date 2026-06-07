import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { TagBadge } from "@/components/ui/TagBadge";

interface NoteMetaProps {
  note: {
    title: string;
    date: string;
    category: string;
    tags: string[];
  };
}

export function NoteMeta({ note }: NoteMetaProps) {
  return (
    <div className="mb-6">
      <h1
        className="text-3xl font-bold mb-3"
        style={{ color: "var(--color-text)" }}
      >
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
