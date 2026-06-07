"use client";

import { useMemo } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

function extractToc(content: string): TocItem[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const items: TocItem[] = [];
  let match: RegExpExecArray | null;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")
      .replace(/^-+|-+$/g, "");
    items.push({ id, text, level });
  }
  return items;
}

export function TableOfContents({ content }: { content: string }) {
  const items = useMemo(() => extractToc(content), [content]);

  if (items.length === 0) return null;

  return (
    <nav
      className="p-4 rounded-lg mb-6"
      style={{
        backgroundColor: "var(--color-sidebar-bg)",
        border: "1px solid var(--color-border)",
      }}
    >
      <h3
        className="text-sm font-semibold mb-2"
        style={{ color: "var(--color-text)" }}
      >
        目录
      </h3>
      <ul className="list-none m-0 p-0">
        {items.map((item) => (
          <li
            key={item.id}
            className="my-1"
            style={{ paddingLeft: item.level === 3 ? "1rem" : "0" }}
          >
            <a
              href={`#${item.id}`}
              className="text-sm no-underline hover:underline"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
