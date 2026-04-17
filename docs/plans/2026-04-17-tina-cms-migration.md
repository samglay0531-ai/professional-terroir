# Tina CMS 遷移實作計畫

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 將部落格後台從 Sveltia CMS 遷移至 Tina CMS（Tina Cloud），實現所見即所得的編輯體驗。

**Architecture:** Tina CMS 管理內容 schema 與編輯 UI，內容以 .md 檔存於 GitHub repo，Astro 5 在 build 時讀取 .md 檔產生靜態頁面，Cloudflare Pages 自動部署。

**Tech Stack:** Astro 5, Tina CMS (Tina Cloud), Cloudflare Pages, GitHub

---

### Task 1: 初始化 Tina CMS

**Files:**
- Create: `tina/config.ts`
- Modify: `package.json`

**Step 1: 安裝 Tina CMS**

```bash
cd /Users/chenchewei/professional-terroir
npx @tinacms/cli@latest init
```

CLI 會詢問：
- 框架選 "Other"
- public assets 目錄輸入 `public`
- 這會建立 `tina/` 目錄和相關設定

**Step 2: 確認 tina 目錄已建立**

```bash
ls tina/
```

Expected: 看到 `config.ts` 等檔案

**Step 3: Commit**

```bash
git add tina/ package.json package-lock.json
git commit -m "feat: initialize Tina CMS"
```

---

### Task 2: 設定 Tina Schema

**Files:**
- Modify: `tina/config.ts`

**Step 1: 設定 blog collection schema**

```typescript
import { defineConfig } from "tinacms";

export default defineConfig({
  branch:
    process.env.GITHUB_BRANCH ||
    process.env.VERCEL_GIT_COMMIT_REF ||
    process.env.HEAD ||
    "main",
  clientId: process.env.TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",
  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "images/uploads",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      {
        label: "文章",
        name: "blog",
        path: "src/data/blog",
        format: "md",
        ui: {
          filename: {
            slugify: (values) => {
              return values?.slug || "";
            },
          },
        },
        fields: [
          { name: "title", label: "標題", type: "string", required: true },
          { name: "slug", label: "Slug（英文網址）", type: "string", required: true },
          { name: "description", label: "摘要", type: "string", required: true },
          { name: "date", label: "發布日期", type: "datetime", required: true },
          {
            name: "category",
            label: "分類",
            type: "string",
            options: ["職場風土", "風土筆記"],
            required: true,
          },
          {
            name: "tags",
            label: "標籤",
            type: "string",
            list: true,
          },
          { name: "image", label: "封面圖", type: "image" },
          { name: "draft", label: "草稿", type: "boolean" },
          {
            name: "body",
            label: "內文",
            type: "rich-text",
            isBody: true,
          },
        ],
      },
      {
        label: "頁面",
        name: "pages",
        path: "src/data/pages",
        format: "md",
        fields: [
          { name: "title", label: "標題", type: "string", required: true },
          {
            name: "body",
            label: "內文",
            type: "rich-text",
            isBody: true,
          },
        ],
      },
    ],
  },
});
```

**Step 2: 確認 dev server 啟動正常**

```bash
npx tinacms dev -c "astro dev"
```

Expected: 看到 Tina 和 Astro 都啟動，可以在 `http://localhost:4321/admin` 看到 Tina 後台

**Step 3: Commit**

```bash
git add tina/
git commit -m "feat: configure Tina schema for blog and pages"
```

---

### Task 3: 遷移現有文章

**Files:**
- Modify: `src/data/blog/*.md`（4 篇文章重新命名 + 清理）

**Step 1: 重新命名為英文 slug 並加入 slug 欄位**

每篇文章需要：
1. 檔名改為英文 slug（例如 `parker-curse.md`）
2. frontmatter 加入 `slug` 欄位
3. 移除 `<span style="color:...">` 標記，保留內文文字

四篇文章對應：
- `別讓標準磨平了每一年的風土...` → `terroir-standards.md`
- `滿分的詛咒...` → `parker-curse.md`
- `《熟成後的變異...》` → `aged-talent.md`
- `當年巴黎審判...` → `paris-tasting-ai.md`

**Step 2: 確認 Tina dev server 能讀取所有文章**

```bash
npx tinacms dev -c "astro dev"
```

到 `http://localhost:4321/admin` 確認 4 篇文章都出現

**Step 3: Commit**

```bash
git add src/data/blog/
git commit -m "feat: migrate blog posts to English slugs and clean up formatting"
```

---

### Task 4: 更新 Astro 頁面使用 slug 路由

**Files:**
- Modify: `src/pages/blog/[...slug].astro`
- Modify: `src/pages/blog/[...page].astro`
- Modify: `src/pages/index.astro`
- Modify: `src/components/PostCard.astro`
- Modify: `src/components/Sidebar.astro`
- Modify: `src/content.config.ts`

**Step 1: 更新 content.config.ts schema 加入 slug**

在 blog schema 加入 `slug: z.string()`

**Step 2: 更新 [...slug].astro 用 slug 欄位產生路由**

改用 `post.data.slug` 作為路由 params 而非 `post.id`

**Step 3: 更新 PostCard、Sidebar、index 的文章連結**

所有 `/blog/${post.id}` 改為 `/blog/${post.data.slug}`

**Step 4: Build 測試**

```bash
npm run build
```

Expected: 8 pages built，路由為英文 slug

**Step 5: Commit**

```bash
git add src/
git commit -m "feat: update routing to use English slug field"
```

---

### Task 5: 移除 Sveltia CMS 和舊 OAuth

**Files:**
- Delete: `public/admin/config.yml`
- Delete: `public/admin/index.html`
- Delete: `functions/auth.js`
- Delete: `functions/callback.js`
- Modify: `package.json`（移除 remark-breaks）
- Modify: `astro.config.mjs`（移除 remark-breaks plugin）
- Modify: `src/layouts/PostLayout.astro`（移除 br CSS hack）

**Step 1: 移除檔案和套件**

```bash
rm -rf public/admin functions/
npm uninstall remark-breaks
```

**Step 2: 更新 astro.config.mjs**

移除 `remarkBreaks` import 和 `markdown.remarkPlugins`

**Step 3: 移除 PostLayout.astro 的 br CSS**

刪除 `.post-content br` 相關樣式

**Step 4: Build 測試**

```bash
npm run build
```

Expected: 成功 build，無錯誤

**Step 5: Commit**

```bash
git add -A
git commit -m "chore: remove Sveltia CMS, OAuth functions, and remark-breaks"
```

---

### Task 6: 設定 Tina Cloud 並部署

**Files:**
- Modify: Cloudflare Pages 環境變數

**Step 1: 在 Tina Cloud 建立專案**

1. 到 https://app.tina.io 註冊/登入
2. 建立新專案，連結 GitHub repo `samglay0531-ai/professional-terroir`
3. 取得 `TINA_CLIENT_ID` 和 `TINA_TOKEN`

**Step 2: 在 Cloudflare Pages 設定環境變數**

加入：
- `TINA_CLIENT_ID` = （從 Tina Cloud 取得）
- `TINA_TOKEN` = （從 Tina Cloud 取得）

移除舊的：
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`

**Step 3: 推送並驗證部署**

```bash
git push origin main
```

部署完成後確認：
- 前台文章正常顯示，段落有間距
- `/admin` 可透過 Tina Cloud 登入
- 可編輯文章，按 Enter 有段落效果
- 存檔後 GitHub 有新 commit，Cloudflare 自動重建

**Step 4: Commit 環境設定紀錄**

```bash
git commit --allow-empty -m "chore: configure Tina Cloud production environment"
```
