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
