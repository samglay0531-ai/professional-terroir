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
