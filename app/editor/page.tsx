"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { EditorMetaForm } from "@/components/editor/EditorMetaForm";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

function EditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const saved = searchParams.get("saved");
  const ghStatus = searchParams.get("gh");

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    if (saved === "1") {
      if (ghStatus === "ok") {
        setSuccess("已保存并同步到 GitHub！Vercel 重新部署后即可查看。");
      } else if (ghStatus) {
        setError(`GitHub 同步失败: ${decodeURIComponent(ghStatus)}`);
      } else {
        setSuccess("笔记已保存！");
      }
    }
  }, [saved, ghStatus]);

  useEffect(() => {
    fetch("/api/notes").then(r => r.json()).then(d => {
      if (d.categories) setCategories(d.categories.map((c: {name:string}) => c.name));
    }).catch(() => setCategories(["编程","语言","课程"]));
  }, []);

  const handleSave = async () => {
    if (!title.trim()) { setError("请输入标题"); return; }
    if (!category || category === "__new__") { setError("请选择或输入分类"); return; }
    setSaving(true); setError(""); setSuccess("");
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), category, tags: tags.split(",").map(t => t.trim()).filter(Boolean), content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "保存失败");
      const ghParam = data.github === "已同步" ? "ok" : encodeURIComponent(data.github || "unknown");
      router.push(`/editor?saved=1&gh=${ghParam}`);
    } catch (err) { setError(err instanceof Error ? err.message : "保存失败"); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">写笔记</h1>
      <EditorMetaForm title={title} setTitle={setTitle} category={category} setCategory={setCategory} tags={tags} setTags={setTags} categories={categories} />
      {error && <div className="px-4 py-2 rounded mb-4 text-sm" style={{backgroundColor:"#fee2e2",color:"#dc2626"}}>{error}</div>}
      {success && <div className="px-4 py-2 rounded mb-4 text-sm" style={{backgroundColor:"#dcfce7",color:"#16a34a"}}>{success}</div>}
      <div data-color-mode="light"><MDEditor value={content} onChange={(v) => setContent(v||"")} height={500} preview="live" /></div>
      <div className="flex gap-3 mt-4">
        <button onClick={handleSave} disabled={saving} className="px-6 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50" style={{backgroundColor:"var(--color-primary)",color:"#ffffff"}}>{saving?"保存中...":"保存笔记"}</button>
        <button onClick={()=>router.push("/")} className="px-6 py-2 rounded-lg text-sm font-medium border transition-colors" style={{backgroundColor:"var(--color-card-bg)",color:"var(--color-text-secondary)",borderColor:"var(--color-border)"}}>返回首页</button>
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <EditorContent />
    </Suspense>
  );
}
