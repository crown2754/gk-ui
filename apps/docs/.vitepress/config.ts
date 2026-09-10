import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitepress";

const root = path.resolve(fileURLToPath(new URL(".", import.meta.url)), "../../..");

const sharedVite = {
  resolve: {
    alias: {
      "@gk-ui/core": path.join(root, "packages/core/src/index.ts"),
      "@gk-ui/tokens/tokens.css": path.join(root, "packages/tokens/tokens.css"),
    },
  },
  optimizeDeps: {
    exclude: ["@gk-ui/core"],
  },
  server: {
    port: 5193,
    strictPort: true,
    fs: { allow: ["../.."] },
  },
};

export default defineConfig({
  title: "gk-ui",
  description: "Brand-forward Web Components for Vue and Alpine",
  base: "/gk-ui/",
  lastUpdated: true,
  locales: {
    root: {
      label: "English",
      lang: "en",
      description: "Brand-forward Web Components for Vue and Alpine",
      themeConfig: {
        nav: [
          { text: "Guide", link: "/guide/getting-started" },
          { text: "Components", link: "/components/alert" },
        ],
        sidebar: [
          {
            text: "Guide",
            items: [
              { text: "Alpine", link: "/guide/alpine" },
              { text: "Getting started", link: "/guide/getting-started" },
              { text: "Tokens", link: "/guide/tokens" },
              { text: "Vue", link: "/guide/vue" },
            ],
          },
          {
            text: "Components",
            items: [
              { text: "Alert", link: "/components/alert" },
              { text: "Avatar", link: "/components/avatar" },
              { text: "Button", link: "/components/button" },
              { text: "Card", link: "/components/card" },
              { text: "Message", link: "/components/message" },
            ],
          },
        ],
        outline: { label: "On this page" },
        docFooter: { prev: "Previous page", next: "Next page" },
        returnToTopLabel: "Return to top",
        sidebarMenuLabel: "Menu",
        darkModeSwitchLabel: "Appearance",
        lightModeSwitchTitle: "Switch to light theme",
        darkModeSwitchTitle: "Switch to dark theme",
        langMenuLabel: "Change language",
      },
    },
    "zh-TW": {
      label: "繁體中文",
      lang: "zh-TW",
      link: "/zh-TW/",
      description: "面向品牌的 Web Components，同時支援 Vue 與 Alpine",
      themeConfig: {
        nav: [
          { text: "指南", link: "/zh-TW/guide/getting-started" },
          { text: "元件", link: "/zh-TW/components/alert" },
        ],
        sidebar: [
          {
            text: "指南",
            items: [
              { text: "Alpine", link: "/zh-TW/guide/alpine" },
              { text: "快速開始", link: "/zh-TW/guide/getting-started" },
              { text: "設計權杖", link: "/zh-TW/guide/tokens" },
              { text: "Vue", link: "/zh-TW/guide/vue" },
            ],
          },
          {
            text: "元件",
            items: [
              { text: "Alert 警示", link: "/zh-TW/components/alert" },
              { text: "Avatar 頭像", link: "/zh-TW/components/avatar" },
              { text: "Button 按鈕", link: "/zh-TW/components/button" },
              { text: "Card 卡片", link: "/zh-TW/components/card" },
              { text: "Message 訊息", link: "/zh-TW/components/message" },
            ],
          },
        ],
        outline: { label: "本頁目錄" },
        docFooter: { prev: "上一頁", next: "下一頁" },
        returnToTopLabel: "回到頂部",
        sidebarMenuLabel: "選單",
        darkModeSwitchLabel: "外觀",
        lightModeSwitchTitle: "切換為淺色模式",
        darkModeSwitchTitle: "切換為深色模式",
        langMenuLabel: "切換語言",
      },
    },
  },
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => tag.startsWith("gk-"),
      },
    },
  },
  vite: sharedVite,
});
