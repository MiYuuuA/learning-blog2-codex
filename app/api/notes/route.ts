import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { saveNote, getAllNotes } from "@/lib/notes";
import { commitAndPush } from "@/lib/github";

const CONTENT_DIR = path.join(process.cwd(), "content", "notes");

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

    const result = saveNote({
      title: title.trim(),
      category: category.trim(),
      tags: tagsArray,
      content,
      description: description || "",
    });

    // GitHub CMS: auto commit + push
    const fullPath = path.join(CONTENT_DIR, category.trim(), `${result.slug}.md`);
    const raw = fs.readFileSync(fullPath, "utf-8");

    const ghResult = await commitAndPush(
      `content/notes/${category.trim()}/${result.slug}.md`,
      raw,
      `📝 ${title.trim()}`
    );

    return NextResponse.json({
      slug: result.slug,
      filePath: result.filePath,
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
