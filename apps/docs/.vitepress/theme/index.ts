import DefaultTheme from "vitepress/theme";
import "@gk-ui/tokens/tokens.css";
import "@gk-ui/core";
import type { Theme } from "vitepress";
import ButtonDemo from "../../components/button.demo.vue";
import DemoCard from "../../components/DemoCard.vue";
import "./custom.css";

const theme: Theme = {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("ButtonDemo", ButtonDemo);
    app.component("DemoCard", DemoCard);
    if (typeof window === "undefined") return;
    void import("alpinejs").then((mod) => {
      const Alpine = mod.default;
      window.Alpine = Alpine;
      Alpine.start();
    });
  },
};

export default theme;
