import { getNotesByTag } from "@/lib/notes";
import { NoteCard } from "@/components/notes/NoteCard";
import type { Metadata } from "next";

interface Props { params: Promise<{ tag: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  return { title: `#${decodeURIComponent(tag)}` };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const t = decodeURIComponent(tag);
  const notes = getNotesByTag(t);
  return (<div><h1 className="text-2xl font-bold mb-2"><span style={{color:"var(--color-primary)"}}>#</span> {t}</h1><p className="text-sm mb-6" style={{color:"var(--color-text-secondary)"}}>共 {notes.length} 篇笔记</p>{notes.length===0?<p style={{color:"var(--color-text-secondary)"}}>该标签下暂无笔记。</p>:<div className="flex flex-col gap-4">{notes.map(n=><NoteCard key={`${n.category}/${n.slug}`} note={n} />)}</div>}</div>);
}
