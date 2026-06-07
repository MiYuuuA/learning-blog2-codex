import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h1 className="text-6xl font-bold mb-4" style={{ color: "var(--color-text-secondary)" }}>404</h1>
      <p className="text-lg mb-6" style={{ color: "var(--color-text-secondary)" }}>页面不存在</p>
      <Link href="/" className="px-6 py-2 rounded-lg text-sm font-medium no-underline" style={{ backgroundColor: "var(--color-primary)", color: "#ffffff" }}>返回首页</Link>
    </div>
  );
}
