import { getNotesByCategory } from "@/lib/notes";
import { NoteCard } from "@/components/notes/NoteCard";
import type { Metadata } from "next";

interface Props { params: Promise<{ category: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  return { title: `${decodeURIComponent(category)} 分类` };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = decodeURIComponent(category);
  const notes = getNotesByCategory(cat);
  return (<div><h1 className="text-2xl font-bold mb-2">📂 {cat}</h1><p className="text-sm mb-6" style={{color:"var(--color-text-secondary)"}}>共 {notes.length} 篇笔记</p>{notes.length===0?<p style={{color:"var(--color-text-secondary)"}}>该分类下暂无笔记。</p>:<div className="flex flex-col gap-4">{notes.map(n=><NoteCard key={`${n.category}/${n.slug}`} note={n} />)}</div>}</div>);
}
