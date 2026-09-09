import DefaultTheme from "vitepress/theme";
import "@gk-ui/tokens/tokens.css";
import "@gk-ui/core";
import type { Theme } from "vitepress";

const theme: Theme = {
  extends: DefaultTheme,
  enhanceApp() {
    if (typeof window === "undefined") return;
    void import("alpinejs").then((mod) => {
      const Alpine = mod.default;
      window.Alpine = Alpine;
      Alpine.start();
    });
  },
};

export default theme;
