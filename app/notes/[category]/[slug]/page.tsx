import { notFound } from "next/navigation";
import { getNote } from "@/lib/notes";
import { NoteMeta } from "@/components/notes/NoteMeta";
import { MarkdownRenderer } from "@/components/notes/MarkdownRenderer";
import { TableOfContents } from "@/components/notes/TableOfContents";
import type { Metadata } from "next";

interface Props { params: Promise<{ category: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const note = getNote(decodeURIComponent(category), decodeURIComponent(slug));
  if (!note) return { title: "笔记不存在" };
  return { title: note.title, description: note.description };
}

export default async function NotePage({ params }: Props) {
  const { category, slug } = await params;
  const note = getNote(decodeURIComponent(category), decodeURIComponent(slug));
  if (!note) notFound();
  return (<article><NoteMeta note={note} /><TableOfContents content={note.content} /><MarkdownRenderer content={note.content} /></article>);
}
