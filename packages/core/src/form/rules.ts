export type GkFormRule = {
  required?: boolean;
  message?: string;
  pattern?: RegExp;
  min?: number;
  max?: number;
  validator?: (value: unknown) => boolean | string | Promise<unknown>;
};

export type GkFormRules = Record<string, GkFormRule | GkFormRule[]>;

export type GkFormError = { path: string; message: string };

export function normalizeRules(rule: GkFormRule | GkFormRule[] | undefined): GkFormRule[] {
  if (!rule) return [];
  return Array.isArray(rule) ? rule : [rule];
}

export function isEmptyValue(value: unknown, tagName?: string) {
  if (value == null) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "number" && tagName === "GK-RATE") return value === 0;
  return false;
}

export function validateValue(
  value: unknown,
  rules: GkFormRule[],
  options: { required?: boolean; tagName?: string; zh?: boolean },
) {
  const zh = options.zh ?? false;
  const required = options.required || rules.some((rule) => rule.required);
  if (isEmptyValue(value, options.tagName)) {
    if (!required) return null;
    return (
      rules.find((rule) => rule.required && rule.message)?.message ||
      (zh ? "此欄位為必填" : "This field is required")
    );
  }
  for (const rule of rules) {
    if (rule.pattern && typeof value === "string" && !rule.pattern.test(value)) {
      return rule.message || (zh ? "格式不正確" : "Invalid format");
    }
    if (rule.min != null || rule.max != null) {
      const numeric = typeof value === "number";
      const length =
        typeof value === "string" || Array.isArray(value) ? value.length : null;
      const probe = numeric ? value : length;
      if (probe != null && rule.min != null && probe < rule.min) {
        return (
          rule.message ||
          (numeric
            ? zh
              ? `不可小於 ${rule.min}`
              : `Must be at least ${rule.min}`
            : zh
              ? `至少 ${rule.min}`
              : `Must be at least ${rule.min}`)
        );
      }
      if (probe != null && rule.max != null && probe > rule.max) {
        return (
          rule.message ||
          (numeric
            ? zh
              ? `不可大於 ${rule.max}`
              : `Must be at most ${rule.max}`
            : zh
              ? `最多 ${rule.max}`
              : `Must be at most ${rule.max}`)
        );
      }
    }
    if (rule.validator) {
      const result = rule.validator(value) as boolean | string | Promise<unknown>;
      if (result && typeof (result as Promise<unknown>).then === "function") {
        return zh ? "尚不支援非同步驗證" : "Async validators are not supported";
      }
      if (result === false) return rule.message || (zh ? "驗證失敗" : "Validation failed");
      if (typeof result === "string" && result) return result;
    }
  }
  return null;
}

export function getPath(model: object, path: string): unknown {
  return path.split(".").reduce<unknown>((current, key) => {
    if (current == null || typeof current !== "object") return undefined;
    return (current as Record<string, unknown>)[key];
  }, model);
}

export function hasPath(model: object, path: string) {
  const parts = path.split(".");
  let current: unknown = model;
  for (const key of parts) {
    if (current == null || typeof current !== "object" || !(key in current)) return false;
    current = (current as Record<string, unknown>)[key];
  }
  return true;
}

export function setPath(model: object, path: string, value: unknown) {
  const parts = path.split(".");
  let current: Record<string, unknown> = model as Record<string, unknown>;
  for (let index = 0; index < parts.length - 1; index += 1) {
    const key = parts[index];
    const next = current[key];
    if (next == null || typeof next !== "object") current[key] = {};
    current = current[key] as Record<string, unknown>;
  }
  current[parts[parts.length - 1]] = value;
}
