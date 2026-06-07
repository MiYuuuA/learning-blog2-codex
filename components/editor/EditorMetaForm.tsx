"use client";

interface EditorMetaFormProps {
  title: string;
  setTitle: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  tags: string;
  setTags: (v: string) => void;
  categories: string[];
}

export function EditorMetaForm({
  title,
  setTitle,
  category,
  setCategory,
  tags,
  setTags,
  categories,
}: EditorMetaFormProps) {
  return (
    <div
      className="flex flex-wrap gap-3 p-4 rounded-lg mb-4"
      style={{
        backgroundColor: "var(--color-sidebar-bg)",
        border: "1px solid var(--color-border)",
      }}
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="笔记标题"
        className="flex-1 min-w-[200px] px-3 py-2 rounded text-sm border"
        style={{
          backgroundColor: "var(--color-card-bg)",
          color: "var(--color-text)",
          borderColor: "var(--color-border)",
        }}
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="px-3 py-2 rounded text-sm border"
        style={{
          backgroundColor: "var(--color-card-bg)",
          color: "var(--color-text)",
          borderColor: "var(--color-border)",
        }}
      >
        <option value="">选择分类</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
        <option value="__new__">+ 新建分类</option>
      </select>
      {category === "__new__" && (
        <input
          type="text"
          placeholder="新分类名称"
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 rounded text-sm border"
          style={{
            backgroundColor: "var(--color-card-bg)",
            color: "var(--color-text)",
            borderColor: "var(--color-border)",
          }}
        />
      )}
      <input
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="标签（逗号分隔）"
        className="flex-1 min-w-[200px] px-3 py-2 rounded text-sm border"
        style={{
          backgroundColor: "var(--color-card-bg)",
          color: "var(--color-text)",
          borderColor: "var(--color-border)",
        }}
      />
    </div>
  );
}
