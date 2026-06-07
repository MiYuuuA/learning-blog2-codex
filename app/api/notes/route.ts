import { NextRequest, NextResponse } from "next/server";
import { saveNote, getAllNotes, NoteMeta } from "@/lib/notes";
import { commitAndPush } from "@/lib/github";

const isVercel = !!process.env.VERCEL;

function buildNoteContent(title: string, category: string, tags: string[], content: string, description?: string): string {
  const today = new Date().toISOString().slice(0, 10);
  const frontmatter = [
    "---",
    `title: ${title}`,
    `date: ${today}`,
    `category: ${category}`,
    `tags: [${tags.join(", ")}]`,
    `description: ${description || ""}`,
    "---",
    "",
  ].join("\n");
  return frontmatter + content;
}

function makeSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, category, tags, content, description } = body;
    if (!title || typeof title !== "string" || !title.trim())
      return NextResponse.json({ error: "标题不能为空" }, { status: 400 });
    if (!category || typeof category !== "string" || !category.trim())
      return NextResponse.json({ error: "分类不能为空" }, { status: 400 });
    if (!content || typeof content !== "string")
      return NextResponse.json({ error: "内容不能为空" }, { status: 400 });

    const tagsArray = Array.isArray(tags)
      ? tags.filter((t: unknown) => typeof t === "string" && t.trim())
      : [];
    const slug = makeSlug(title.trim());
    const fullContent = buildNoteContent(title.trim(), category.trim(), tagsArray, content, description);

    // Local dev: write to filesystem
    if (!isVercel) {
      saveNote({
        title: title.trim(),
        category: category.trim(),
        tags: tagsArray,
        content,
        description: description || "",
      });
    }

    // GitHub CMS: always commit
    const ghResult = await commitAndPush(
      `content/notes/${category.trim()}/${slug}.md`,
      fullContent,
      `📝 ${title.trim()}`
    );

    return NextResponse.json({
      slug,
      github: ghResult.success ? "已同步" : ghResult.error,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "服务器错误" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { notes, categories, tags } = getAllNotes();
    return NextResponse.json({ notes, categories, tags });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "服务器错误" },
      { status: 500 }
    );
  }
}
