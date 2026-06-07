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
        border: "1px solid var(--color-border)",
      }}
    >
      <div
        className="flex items-center gap-2 text-xs mb-2"
        style={{ color: "var(--color-text-secondary)" }}
      >
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
        <p
          className="text-sm mb-3"
          style={{ color: "var(--color-text-secondary)" }}
        >
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
