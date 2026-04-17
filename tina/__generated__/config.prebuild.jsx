// tina/config.ts
import { defineConfig } from "tinacms";
var config_default = defineConfig({
  branch: process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.HEAD || "main",
  clientId: process.env.TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",
  build: {
    outputFolder: "admin",
    publicFolder: "public"
  },
  media: {
    tina: {
      mediaRoot: "images/uploads",
      publicFolder: "public"
    }
  },
  schema: {
    collections: [
      {
        label: "\u6587\u7AE0",
        name: "blog",
        path: "src/data/blog",
        format: "md",
        ui: {
          filename: {
            slugify: (values) => {
              return values?.slug || "";
            }
          }
        },
        fields: [
          { name: "title", label: "\u6A19\u984C", type: "string", required: true },
          { name: "slug", label: "Slug\uFF08\u82F1\u6587\u7DB2\u5740\uFF09", type: "string", required: true },
          { name: "description", label: "\u6458\u8981", type: "string", required: true },
          { name: "date", label: "\u767C\u5E03\u65E5\u671F", type: "datetime", required: true },
          {
            name: "category",
            label: "\u5206\u985E",
            type: "string",
            options: ["\u8077\u5834\u98A8\u571F", "\u98A8\u571F\u7B46\u8A18"],
            required: true
          },
          {
            name: "tags",
            label: "\u6A19\u7C64",
            type: "string",
            list: true
          },
          { name: "image", label: "\u5C01\u9762\u5716", type: "image" },
          { name: "draft", label: "\u8349\u7A3F", type: "boolean" },
          {
            name: "body",
            label: "\u5167\u6587",
            type: "rich-text",
            isBody: true
          }
        ]
      },
      {
        label: "\u9801\u9762",
        name: "pages",
        path: "src/data/pages",
        format: "md",
        fields: [
          { name: "title", label: "\u6A19\u984C", type: "string", required: true },
          {
            name: "body",
            label: "\u5167\u6587",
            type: "rich-text",
            isBody: true
          }
        ]
      }
    ]
  }
});
export {
  config_default as default
};
