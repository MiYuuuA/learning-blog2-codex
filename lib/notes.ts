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
      date: data.date ? String(data.date instanceof Date ? data.date.toISOString().slice(0, 10) : data.date) : "",
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

export function getAllNotes(): {
  notes: NoteMeta[];
  categories: CategoryInfo[];
  tags: TagInfo[];
} {
  const notes: NoteMeta[] = [];
  const categoryCount: Record<string, number> = {};
  const tagCount: Record<string, number> = {};

  if (!fs.existsSync(CONTENT_DIR)) {
    return { notes: [], categories: [], tags: [] };
  }

  const categoryDirs = fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory());

  for (const catDir of categoryDirs) {
    const catPath = path.join(CONTENT_DIR, catDir.name);
    const files = fs.readdirSync(catPath).filter((f) => f.endsWith(".md"));

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

  notes.sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
  const categories: CategoryInfo[] = Object.entries(categoryCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const tags: TagInfo[] = Object.entries(tagCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return { notes, categories, tags };
}

export function getNotesByCategory(category: string): NoteMeta[] {
  return getAllNotes().notes.filter((n) => n.category === category);
}

export function getNotesByTag(tag: string): NoteMeta[] {
  return getAllNotes().notes.filter((n) => n.tags.includes(tag));
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
