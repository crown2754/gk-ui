/** CSS custom property names for gk-ui tokens (values are the variable names). */
export const tokens = {
  colorBrand: "--gk-color-brand",
  colorBrandHover: "--gk-color-brand-hover",
  colorBrandPressed: "--gk-color-brand-pressed",
  colorBrandOn: "--gk-color-brand-on",
  colorInfo: "--gk-color-info",
  colorSuccess: "--gk-color-success",
  colorWarning: "--gk-color-warning",
  colorAccent: "--gk-color-accent",
  colorDanger: "--gk-color-danger",
  colorText: "--gk-color-text",
  colorSurface: "--gk-color-surface",
  fontFamilySans: "--gk-font-family-sans",
  fontFamilyDisplay: "--gk-font-family-display",
  space2: "--gk-space-2",
  space3: "--gk-space-3",
  space4: "--gk-space-4",
  radiusMd: "--gk-radius-md",
  shadowSm: "--gk-shadow-sm",
} as const;

export type TokenName = (typeof tokens)[keyof typeof tokens];
