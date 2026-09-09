import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitepress";

const root = path.resolve(fileURLToPath(new URL(".", import.meta.url)), "../../..");

export default defineConfig({
  title: "gk-ui",
  description: "Brand-forward Web Components for Vue and Alpine",
  themeConfig: {
    nav: [
      { text: "Guide", link: "/guide/getting-started" },
      { text: "Components", link: "/components/button" },
    ],
    sidebar: [
      {
        text: "Guide",
        items: [
          { text: "Getting started", link: "/guide/getting-started" },
          { text: "Tokens", link: "/guide/tokens" },
          { text: "Vue", link: "/guide/vue" },
          { text: "Alpine", link: "/guide/alpine" },
        ],
      },
      {
        text: "Components",
        items: [{ text: "Button", link: "/components/button" }],
      },
    ],
  },
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => tag.startsWith("gk-"),
      },
    },
  },
  vite: {
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
      fs: { allow: ["../.."] },
    },
  },
});
