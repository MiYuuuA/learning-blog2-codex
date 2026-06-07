import type { Metadata } from "next";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileMenuToggle } from "@/components/layout/MobileMenuToggle";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "学习笔记",
    template: "%s — 学习笔记",
  },
  description: "个人学习笔记 Blog — 记录编程、语言和学科知识",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <MobileMenuToggle />
          <div className="flex min-h-screen">
            <Sidebar />
            <main
              className="flex-1"
              style={{ marginLeft: "var(--sidebar-width)" }}
            >
              <div className="max-w-[720px] mx-auto px-6 py-8">
                {children}
              </div>
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
