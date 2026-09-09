import DefaultTheme from "vitepress/theme";
import "@gk-ui/tokens/tokens.css";
import "@gk-ui/core";
import type { Theme } from "vitepress";

const theme: Theme = {
  extends: DefaultTheme,
};

export default theme;
