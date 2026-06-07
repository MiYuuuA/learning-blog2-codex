# 学习笔记 Blog — 设计文档

**日期**: 2026-06-07  
**状态**: 已确认

---

## 1. 项目概述

一个面向公开分享的个人学习笔记 Blog，支持混合内容类型（编程、语言、学科笔记等）。用户通过本地 Markdown 文件或内嵌在线编辑器撰写笔记，以本地文件系统存储，通过 Next.js 动态渲染。

---

## 2. 技术选型

| 层级 | 选型 | 说明 |
|------|------|------|
| 框架 | Next.js 15 (App Router) | 生态成熟，SSR/SSG 灵活 |
| 样式 | Tailwind CSS | 原子化样式，配合预设主题 |
| Markdown 解析 | gray-matter + react-markdown | frontmatter 解析 + 正文渲染 |
| 语法高亮 | rehype-highlight | 代码块语法高亮 |
| 在线编辑器 | @uiw/react-md-editor | 分栏 Markdown 编辑+预览 |
| 存储 | 本地文件系统 | `content/notes/{分类}/{slug}.md` |
| 版本管理 | Git | 笔记历史可追溯 |

---

## 3. 文件结构

```
content/
  notes/
    编程/
      react-advanced-patterns.md
      rust-ownership.md
    语言/
      japanese-n1-grammar.md
      english-phrasal-verbs.md
    课程/
      cs61a-notes.md

每篇笔记的 Frontmatter:
---
title: Rust 所有权深入理解
date: 2026-06-05
category: 编程
tags: [Rust, 系统编程, 内存管理]
description: 理解 Rust 的所有权模型和借用检查器
---
```

---

## 4. 页面结构

### 面向读者

- **首页 (`/`)**: 最新笔记时间线列表，侧边栏展示分类和标签入口
- **笔记详情页 (`/notes/[category]/[slug]`)**: Markdown 渲染正文 + 自动目录导航
- **分类页 (`/category/[category]`)**: 该分类下全部笔记列表
- **标签页 (`/tag/[tag]`)**: 打该标签的笔记列表

### 面向作者

- **编辑器页 (`/editor`)**: 分栏 Markdown 编辑+预览，新建/编辑笔记
  - 新建时指定标题、选择分类、输入标签
  - 保存到 `content/notes/`，自动生成 slug
  - 编辑已有笔记：通过 `?path=content/notes/编程/react-hooks.md` 查询参数加载
  - POST 到 `app/api/notes/route.ts`，同步写入文件系统

---

## 5. 布局方案

侧边栏导航型：

```
┌──────────┬──────────────────────────────────┐
│ Site     │                                  │
│ Title    │         主内容区                  │
│          │   最大行宽 720px                  │
│ ─────── │                                  │
│ 📂 分类  │   首页: 笔记时间线列表            │
│   编程   │   详情: Markdown 正文 + 目录      │
│   语言   │   编辑: 分栏编辑器                │
│   课程   │                                  │
│ ─────── │                                  │
│ 🏷 标签  │                                  │
│ ─────── │                                  │
│ ✏ 写笔记 │                                  │
│          │                        [🌙☀]    │
└──────────┴──────────────────────────────────┘
```

- 侧边栏固定 240px，响应式移动端收起为汉堡菜单
- 右上角亮暗切换按钮
- 当前所在分类/标签在侧边栏高亮

---

## 6. 组件树

```
Layout
├── Sidebar (240px, 响应式折叠)
│   ├── SiteTitle
│   ├── CategoryList → CategoryItem (高亮当前)
│   ├── TagCloud → TagBadge
│   └── NewNoteLink → /editor
├── ThemeToggle (右上角)
└── main
    ├── HomePage → NoteCard × N
    ├── NotePage
    │   ├── NoteMeta
    │   ├── TableOfContents (h2/h3 自动生成)
    │   └── MarkdownRenderer
    ├── CategoryPage (同 HomePage 过滤)
    ├── TagPage (同 HomePage 过滤)
    └── EditorPage
        ├── EditorMetaForm
        └── MDEditor (@uiw/react-md-editor)
```

---

## 7. 数据流

```
读取: content/notes/ → fs.readFileSync → gray-matter → 页面渲染
写入: 编辑器 → POST /api/notes → fs.writeFile → content/notes/{cat}/{slug}.md
索引: fs.readdirSync → 分类列表 + 标签集合
```

- 读取走 Server Component，无额外网络请求
- 写入走 API Route，同步写入文件系统
- 分类由目录结构定义，标签由所有 frontmatter 的 tags 合并去重
- API Route 路径: `app/api/notes/route.ts` (POST 写笔记, GET 列表/标签)

---

## 8. 预设主题

4 套预设主题，每套包含亮色和暗色两套色板：

| 主题 | 风格 | 亮色主色 | 暗色主色 |
|------|------|----------|----------|
| 经典蓝 (默认) | 清爽通用 | #2563eb | #60a5fa |
| 墨绿学术 | 沉稳学术 | #059669 | #34d399 |
| 暖灰极简 | 低调少干扰 | #6b7280 | #9ca3af |
| 琥珀暗金 | 温暖个性 | #d97706 | #fbbf24 |

主题切换存储在 localStorage，亮暗切换独立运作（支持跟随系统偏好）。

---

## 9. 非功能需求

- 首页和笔记列表数据从文件系统扫描，不做静态生成预渲染
- 移动端响应式：侧边栏折叠，主内容区全宽
- SEO: 笔记详情页生成合适的 `<title>` 和 `<meta description>`
- 性能: 笔记列表分页（每页 20 篇），避免单次扫描过多文件

---

## 10. 不在范围内

- 用户登录 / 鉴权系统
- 评论功能
- RSS 订阅
- 全文搜索（可后续通过静态 JSON 索引实现）
- MDX / 组件嵌入
- 图片上传（Markdown 中使用相对路径引用本地图片即可）
