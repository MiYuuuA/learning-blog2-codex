"use client";

import { useState, useEffect, useRef, useMemo } from "react";

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
  const [newCategory, setNewCategory] = useState("");
  const [showNewInput, setShowNewInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Merge the committed new category into the options list so it shows in the select
  const allCategories = useMemo(() => {
    if (category && category !== "__new__" && !categories.includes(category)) {
      return [category, ...categories];
    }
    return categories;
  }, [categories, category]);

  useEffect(() => {
    if (category === "__new__") {
      setShowNewInput(true);
      setNewCategory("");
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setShowNewInput(false);
    }
  }, [category]);

  const handleCategoryChange = (value: string) => {
    if (value === "__new__") {
      setCategory("__new__");
    } else {
      setCategory(value);
    }
  };

  const commitNewCategory = () => {
    const trimmed = newCategory.trim();
    if (trimmed) {
      setCategory(trimmed);
    } else {
      setCategory("");
      setShowNewInput(false);
    }
  };

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
        value={showNewInput ? "__new__" : category}
        onChange={(e) => handleCategoryChange(e.target.value)}
        className="px-3 py-2 rounded text-sm border"
        style={{
          backgroundColor: "var(--color-card-bg)",
          color: "var(--color-text)",
          borderColor: "var(--color-border)",
        }}
      >
        <option value="">选择分类</option>
        {allCategories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
        <option value="__new__">+ 新建分类</option>
      </select>
      {showNewInput && (
        <input
          ref={inputRef}
          type="text"
          value={newCategory}
          placeholder="新分类名称"
          onChange={(e) => setNewCategory(e.target.value)}
          onBlur={commitNewCategory}
          onKeyDown={(e) => { if (e.key === "Enter") commitNewCategory(); }}
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
