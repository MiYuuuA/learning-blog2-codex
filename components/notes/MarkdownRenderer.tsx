import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose max-w-none" style={{ color: "var(--color-text)" }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h2: ({ children, ...props }) => {
            const text = String(children);
            return (
              <h2 id={slugify(text)} {...props}>
                {children}
              </h2>
            );
          },
          h3: ({ children, ...props }) => {
            const text = String(children);
            return (
              <h3 id={slugify(text)} {...props}>
                {children}
              </h3>
            );
          },
          code: ({ className, children, ...props }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code
                  className="px-1 py-0.5 rounded text-sm"
                  style={{
                    backgroundColor: "var(--color-sidebar-bg)",
                    color: "var(--color-primary)",
                  }}
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
