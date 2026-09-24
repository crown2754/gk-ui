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
            text: "General",
            items: [{ text: "Button", link: "/components/button" }],
          },
          {
            text: "Data Entry",
            items: [
              { text: "Date Picker", link: "/components/date-picker" },
              { text: "Input", link: "/components/input" },
              { text: "Switch", link: "/components/switch" },
              { text: "Checkbox", link: "/components/checkbox" },
              { text: "Radio", link: "/components/radio" },
              { text: "Select", link: "/components/select" },
              { text: "Dropdown", link: "/components/dropdown" },
            ],
          },
          {
            text: "Data Display",
            items: [
              { text: "Avatar", link: "/components/avatar" },
              { text: "Card", link: "/components/card" },
            ],
          },
          {
            text: "Feedback",
            items: [
              { text: "Alert", link: "/components/alert" },
              { text: "Message", link: "/components/message" },
              { text: "Modal", link: "/components/modal" },
              { text: "Tooltip", link: "/components/tooltip" },
              { text: "Drawer", link: "/components/drawer" },
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
            text: "通用",
            items: [{ text: "Button 按鈕", link: "/zh-TW/components/button" }],
          },
          {
            text: "資料輸入",
            items: [
              { text: "Date Picker 日期選擇", link: "/zh-TW/components/date-picker" },
              { text: "Input 輸入", link: "/zh-TW/components/input" },
              { text: "Switch 開關", link: "/zh-TW/components/switch" },
              { text: "Checkbox 核取方塊", link: "/zh-TW/components/checkbox" },
              { text: "Radio 單選", link: "/zh-TW/components/radio" },
              { text: "Select 選擇器", link: "/zh-TW/components/select" },
              { text: "Dropdown 下拉選單", link: "/zh-TW/components/dropdown" },
            ],
          },
          {
            text: "資料展示",
            items: [
              { text: "Avatar 頭像", link: "/zh-TW/components/avatar" },
              { text: "Card 卡片", link: "/zh-TW/components/card" },
            ],
          },
          {
            text: "回饋",
            items: [
              { text: "Alert 警示", link: "/zh-TW/components/alert" },
              { text: "Message 訊息", link: "/zh-TW/components/message" },
              { text: "Modal 對話框", link: "/zh-TW/components/modal" },
              { text: "Tooltip 提示", link: "/zh-TW/components/tooltip" },
              { text: "Drawer 抽屜", link: "/zh-TW/components/drawer" },
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
