/** Treats the attribute string "false" as false so Alpine/Vue can bind booleans. */
export const falseableBoolean = {
  fromAttribute(value: string | null): boolean {
    return value !== null && value !== "false" && value !== "0";
  },
  toAttribute(value: boolean): string | null {
    return value ? "" : null;
  },
};
