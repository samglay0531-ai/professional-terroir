# Tina CMS 遷移設計

## 目標
將部落格後台從 Sveltia CMS 遷移至 Tina CMS（Tina Cloud），解決段落斷行問題並提升編輯體驗。

## 架構
- **CMS**：Tina Cloud 免費方案（1 位使用者）
- **框架**：Astro 5 靜態輸出（不變）
- **部署**：Cloudflare Pages（不變）
- **內容儲存**：GitHub repo（不變）

## 內容 Schema

| 欄位 | 類型 | 說明 |
|------|------|------|
| title | string | 標題 |
| slug | string | 英文網址路徑 |
| description | string | 摘要 |
| date | datetime | 發布日期 |
| category | select | 職場風土 / 風土筆記 |
| tags | string list | 標籤 |
| image | image | 封面圖 |
| draft | boolean | 草稿 |
| body | rich-text | Tina 富文本編輯器 |

## 移除項目
- `public/admin/`（Sveltia CMS）
- `functions/auth.js`、`functions/callback.js`（OAuth）
- `remark-breaks` 套件
- 文章內 `<span style="color:...">` 標記

## 新增項目
- `tina/` 目錄（config + schema）
- `@tinacms/cli` 開發依賴
- Tina Cloud 帳號連結

## 文章遷移
- 4 篇現有文章轉換為 Tina 格式
- 中文檔名改為英文 slug
- 清除 `<span>` 顏色標記

## 編輯流程
`/admin` → Tina Cloud 登入 → 富文本 WYSIWYG 編輯 → 存檔推送 GitHub → Cloudflare 自動部署
