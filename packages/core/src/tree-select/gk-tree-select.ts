import { LitElement, html, nothing, svg, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { computeFixedPanelPosition } from "../date-picker/date-utils.js";
import { markOwnedSize, prefersZh } from "../internal/field.js";
import { PANEL_Z_BASE, Z_STEP } from "../overlay/stack.js";
import {
  TREE_PANEL_STYLE_ID,
  treeSelectPanelCssText,
  treeSelectStyles,
} from "./gk-tree-select.styles.js";

export type GkTreeSelectSize = "sm" | "md" | "lg";
export type GkTreeSelectStatus = "success" | "warning" | "error" | "";
export type GkTreeSelectCheckStrategy = "child" | "parent" | "all";
export type GkTreeSelectPlacement = "bottom-start" | "top-start";

export type TreeNode = {
  label: string;
  value?: string | number;
  key?: string | number;
  children?: TreeNode[];
  disabled?: boolean;
  isLeaf?: boolean;
};

type FlatNode = {
  node: TreeNode;
  level: number;
  path: TreeNode[];
};

const flag = {
  fromAttribute(value: string | null) {
    return value !== "false" && value !== "0";
  },
  toAttribute(value: boolean) {
    return value ? "" : "false";
  },
};

function parseKeys(value: string | null): Array<string | number> {
  if (value == null || value.trim() === "") return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.map((item) => (typeof item === "number" ? item : String(item)));
    }
  } catch {
    /* comma-separated */
  }
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

const nullableValue = {
  fromAttribute(value: string | null): string | number | null {
    if (value == null || value === "" || value === "null") return null;
    return value;
  },
  toAttribute(value: string | number | null) {
    return value == null || value === "" ? null : String(value);
  },
};

let uid = 0;

@customElement("gk-tree-select")
export class GkTreeSelect extends LitElement {
  static styles = treeSelectStyles;

  @property({ reflect: true, converter: nullableValue })
  value: string | number | null = null;

  @property({ attribute: false })
  options: TreeNode[] = [];

  /** Alias of `options`. */
  @property({ attribute: false })
  data: TreeNode[] | null = null;

  @property()
  placeholder = "";

  @property()
  separator = " / ";

  @property({ reflect: true })
  size: GkTreeSelectSize = "md";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  clearable = false;

  @property({ reflect: true })
  status: GkTreeSelectStatus = "";

  @property({ attribute: "default-expanded-keys", converter: { fromAttribute: parseKeys } })
  defaultExpandedKeys: Array<string | number> = [];

  /** `null` keeps expansion uncontrolled. */
  @property({
    attribute: "expanded-keys",
    converter: {
      fromAttribute(value: string | null): Array<string | number> | null {
        if (value == null || value.trim() === "") return null;
        return parseKeys(value);
      },
    },
  })
  expandedKeys: Array<string | number> | null = null;

  @property({ reflect: true, attribute: "expand-on-click-node", converter: flag })
  expandOnClickNode = true;

  @property({ attribute: false })
  selectable?: (node: TreeNode) => boolean;

  @property({ reflect: true, attribute: "show-path", converter: flag })
  showPath = true;

  /** Deferred. No search field in v1. */
  @property({ type: Boolean, reflect: true })
  filterable = false;

  /** Deferred. v1 commits a single node. */
  @property({ type: Boolean, reflect: true })
  multiple = false;

  /** Deferred until multiple selection ships. */
  @property({ reflect: true, attribute: "check-strategy" })
  checkStrategy: GkTreeSelectCheckStrategy = "child";

  @property({ reflect: true })
  placement: GkTreeSelectPlacement = "bottom-start";

  @property({
    attribute: "dropdown-width",
    converter: {
      fromAttribute(value: string | null): number | "trigger" {
        if (value == null || value === "" || value === "trigger") return "trigger";
        const width = Number(value);
        return Number.isFinite(width) ? width : "trigger";
      },
    },
  })
  dropdownWidth: number | "trigger" = "trigger";

  @property({ type: Boolean, reflect: true })
  open = false;

  @state()
  private uncontrolledKeys: Array<string | number> = [];

  @state()
  private activeKey = "";

  private readonly panelId = `gk-tree-select-${++uid}`;
  private panel: HTMLDivElement | null = null;
  private dismissBound = false;
  private positionBound = false;
  private positionFrame = 0;
  private positionTimer = 0;

  override attributeChangedCallback(name: string, old: string | null, value: string | null) {
    super.attributeChangedCallback(name, old, value);
    markOwnedSize(this, name);
  }

  override connectedCallback() {
    super.connectedCallback();
    if (this.open) this.ensurePanel();
  }

  override disconnectedCallback() {
    this.teardownPanel();
    super.disconnectedCallback();
  }

  protected override willUpdate(changed: PropertyValues<this>) {
    if (this.data && this.data !== this.options) this.options = this.data;
    if (changed.has("defaultExpandedKeys") && this.expandedKeys == null) {
      this.uncontrolledKeys = [...this.defaultExpandedKeys];
    }
    if (this.open) this.revealSelection();
  }

  /** Keep ancestors of the current value expanded so the selection is visible. */
  private revealSelection() {
    if (this.value == null || this.expandedKeys != null) return;
    const path = this.findPath(this.nodes(), this.value);
    if (!path || path.length < 2) return;
    const missing = path
      .slice(0, -1)
      .map((node) => nodeKey(node))
      .filter((key) => !this.uncontrolledKeys.some((item) => String(item) === String(key)));
    if (!missing.length) return;
    this.uncontrolledKeys = [...this.uncontrolledKeys, ...missing];
  }

  protected override updated(changed: PropertyValues) {
    if (!this.open) {
      if (changed.has("open")) this.teardownPanel();
      return;
    }
    if (changed.has("open") || !this.panel) this.ensurePanel();
    else {
      this.renderPanel();
      this.positionPanel();
    }
  }

  private nodes() {
    return this.options ?? [];
  }

  private keys() {
    return this.expandedKeys ?? this.uncontrolledKeys;
  }

  private isExpanded(node: TreeNode) {
    const key = String(nodeKey(node));
    return this.keys().some((item) => String(item) === key);
  }

  private isBranch(node: TreeNode) {
    if (node.isLeaf) return false;
    return Boolean(node.children?.length);
  }

  private isSelectable(node: TreeNode) {
    if (node.disabled || this.disabled) return false;
    if (this.selectable) return Boolean(this.selectable(node));
    return true;
  }

  private findPath(nodes: TreeNode[], value: string | number, trail: TreeNode[] = []): TreeNode[] | null {
    for (const node of nodes) {
      const next = [...trail, node];
      if (String(nodeKey(node)) === String(value)) return next;
      if (node.children?.length) {
        const found = this.findPath(node.children, value, next);
        if (found) return found;
      }
    }
    return null;
  }

  private flat(nodes: TreeNode[] = this.nodes(), level = 1, trail: TreeNode[] = []): FlatNode[] {
    const rows: FlatNode[] = [];
    for (const node of nodes) {
      const path = [...trail, node];
      rows.push({ node, level, path });
      if (this.isBranch(node) && this.isExpanded(node) && !node.disabled && node.children) {
        rows.push(...this.flat(node.children, level + 1, path));
      }
    }
    return rows;
  }

  private toggleExpand(node: TreeNode) {
    if (!this.isBranch(node) || node.disabled) return;
    const key = nodeKey(node);
    const current = this.keys();
    const open = current.some((item) => String(item) === String(key));
    const next = open ? current.filter((item) => String(item) !== String(key)) : [...current, key];
    if (this.expandedKeys == null) this.uncontrolledKeys = next;
    else this.expandedKeys = next;
    const detail = { keys: next, node, expanded: !open };
    this.dispatchEvent(new CustomEvent("expand", { detail, bubbles: true, composed: true }));
    this.dispatchEvent(
      new CustomEvent("update:expanded-keys", { detail, bubbles: true, composed: true }),
    );
  }

  private commit(node: TreeNode, path: TreeNode[]) {
    const value = nodeKey(node);
    this.value = value;
    this.open = false;
    const detail = { value, option: node, path };
    this.dispatchEvent(new CustomEvent("change", { detail, bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent("update:value", { detail, bubbles: true, composed: true }));
    this.focusTrigger();
  }

  private activate(node: TreeNode, path: TreeNode[]) {
    if (this.disabled || node.disabled) return;
    const branch = this.isBranch(node);
    if (branch && this.expandOnClickNode && !this.isExpanded(node)) this.toggleExpand(node);
    if (this.isSelectable(node)) {
      this.commit(node, path);
      return;
    }
    if (branch && this.expandOnClickNode) this.toggleExpand(node);
  }

  private clear(event?: Event) {
    event?.stopPropagation();
    event?.preventDefault();
    if (this.disabled) return;
    this.value = null;
    this.open = false;
    this.dispatchEvent(new CustomEvent("clear", { bubbles: true, composed: true }));
    const detail = { value: null, option: null, path: [] as TreeNode[] };
    this.dispatchEvent(new CustomEvent("change", { detail, bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent("update:value", { detail, bubbles: true, composed: true }));
  }

  private onTriggerClick = () => {
    if (this.disabled) return;
    this.open = !this.open;
    if (this.open) this.seedActive();
  };

  private seedActive() {
    if (this.value != null) {
      this.activeKey = String(this.value);
      return;
    }
    const first = this.flat().find((row) => !row.node.disabled);
    this.activeKey = first ? String(nodeKey(first.node)) : "";
  }

  private onKeyDown = (event: KeyboardEvent) => {
    if (this.disabled) return;
    if (!this.open) {
      if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        this.open = true;
        this.seedActive();
      }
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      this.open = false;
      this.focusTrigger();
      return;
    }
    const rows = this.flat();
    if (!rows.length) return;
    const index = Math.max(
      0,
      rows.findIndex((row) => String(nodeKey(row.node)) === this.activeKey),
    );
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const next = nextEnabled(rows, index, event.key === "ArrowDown" ? 1 : -1);
      this.activeKey = String(nodeKey(rows[next].node));
      return;
    }
    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      const next =
        event.key === "Home" ? nextEnabled(rows, -1, 1) : nextEnabled(rows, rows.length, -1);
      this.activeKey = String(nodeKey(rows[next].node));
      return;
    }
    const current = rows[index];
    if (!current) return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      if (this.isBranch(current.node) && !this.isExpanded(current.node)) this.toggleExpand(current.node);
      return;
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      if (this.isBranch(current.node) && this.isExpanded(current.node)) {
        this.toggleExpand(current.node);
        return;
      }
      const parent = current.path[current.path.length - 2];
      if (parent) this.activeKey = String(nodeKey(parent));
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      this.activate(current.node, current.path);
    }
  };

  private onDocClick = (event: MouseEvent) => {
    if (!this.open) return;
    const path = event.composedPath();
    if (path.includes(this) || (this.panel && path.includes(this.panel))) return;
    this.open = false;
  };

  private bindDismiss() {
    if (this.dismissBound || typeof document === "undefined") return;
    document.addEventListener("click", this.onDocClick, true);
    this.dismissBound = true;
  }

  private unbindDismiss() {
    if (!this.dismissBound || typeof document === "undefined") return;
    document.removeEventListener("click", this.onDocClick, true);
    this.dismissBound = false;
  }

  private bindPosition() {
    if (this.positionBound || typeof window === "undefined") return;
    window.addEventListener("scroll", this.onViewportChange, true);
    window.addEventListener("resize", this.onViewportChange);
    this.positionBound = true;
  }

  private unbindPosition() {
    if (!this.positionBound || typeof window === "undefined") return;
    window.removeEventListener("scroll", this.onViewportChange, true);
    window.removeEventListener("resize", this.onViewportChange);
    this.positionBound = false;
  }

  private onViewportChange = () => {
    if (this.open) this.positionPanel();
  };

  private ensurePanelStyle() {
    if (document.getElementById(TREE_PANEL_STYLE_ID)) return;
    const styleEl = document.createElement("style");
    styleEl.id = TREE_PANEL_STYLE_ID;
    styleEl.textContent = treeSelectPanelCssText;
    document.head.appendChild(styleEl);
  }

  private ensurePanel() {
    if (typeof document === "undefined") return;
    this.ensurePanelStyle();
    if (!this.panel) {
      this.panel = document.createElement("div");
      this.panel.className = "gk-tree-select-panel";
      this.panel.id = this.panelId;
      this.panel.setAttribute("part", "panel");
      document.body.appendChild(this.panel);
    }
    this.renderPanel();
    this.positionPanel();
    this.armSettle();
    this.bindDismiss();
    this.bindPosition();
  }

  private teardownPanel() {
    if (this.positionFrame) {
      cancelAnimationFrame(this.positionFrame);
      this.positionFrame = 0;
    }
    if (this.positionTimer) {
      clearTimeout(this.positionTimer);
      this.positionTimer = 0;
    }
    this.unbindDismiss();
    this.unbindPosition();
    if (this.panel) {
      this.panel.replaceChildren();
      this.panel.remove();
      this.panel = null;
    }
    if (typeof document !== "undefined" && !document.querySelector(".gk-tree-select-panel")) {
      document.getElementById(TREE_PANEL_STYLE_ID)?.remove();
    }
  }

  private renderPanel() {
    if (!this.panel) return;
    this.panel.dataset.size = this.size;
    this.panel.replaceChildren();
    const rows = this.flat();
    if (!rows.length) {
      const empty = document.createElement("div");
      empty.setAttribute("part", "empty");
      empty.setAttribute("role", "status");
      const source = this.querySelector("[slot='empty']");
      if (source) empty.append(source.cloneNode(true));
      else empty.textContent = prefersZh(this) ? "沒有資料" : "No data";
      this.panel.append(empty);
      return;
    }
    const tree = document.createElement("div");
    tree.setAttribute("part", "tree");
    tree.setAttribute("role", "tree");
    tree.setAttribute("aria-label", prefersZh(this) ? "樹選擇" : "Tree select");
    const selected = this.value == null ? "" : String(this.value);
    for (const row of rows) {
      const key = String(nodeKey(row.node));
      const branch = this.isBranch(row.node);
      const expanded = branch && this.isExpanded(row.node);
      const item = document.createElement("div");
      item.setAttribute("part", "node");
      item.setAttribute("role", "treeitem");
      item.setAttribute("aria-level", String(row.level));
      item.setAttribute("aria-selected", key === selected ? "true" : "false");
      item.setAttribute("aria-disabled", row.node.disabled ? "true" : "false");
      if (branch) item.setAttribute("aria-expanded", expanded ? "true" : "false");
      if (key === this.activeKey) item.setAttribute("data-active", "");
      const indent = document.createElement("span");
      indent.setAttribute("part", "indent");
      indent.style.width = `${(row.level - 1) * 16}px`;
      item.append(indent);
      item.append(this.switcher(row.node, branch, expanded));
      const label = document.createElement("span");
      label.setAttribute("part", "label");
      label.textContent = row.node.label;
      item.append(label);
      item.addEventListener("click", (event) => {
        event.stopPropagation();
        this.activeKey = key;
        this.activate(row.node, row.path);
      });
      tree.append(item);
    }
    this.panel.append(tree);
  }

  private switcher(node: TreeNode, branch: boolean, expanded: boolean) {
    const zh = prefersZh(this);
    if (!branch) {
      const leaf = document.createElement("span");
      leaf.setAttribute("part", "switcher");
      leaf.setAttribute("data-leaf", "");
      leaf.setAttribute("aria-hidden", "true");
      return leaf;
    }
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("part", "switcher");
    if (expanded) button.setAttribute("data-expanded", "");
    button.setAttribute(
      "aria-label",
      `${expanded ? (zh ? "收合" : "Collapse") : zh ? "展開" : "Expand"} ${node.label}`,
    );
    button.append(chevronSvg());
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      event.preventDefault();
      this.toggleExpand(node);
    });
    return button;
  }

  private positionPanel(follow = true) {
    if (!this.panel || typeof window === "undefined") return;
    const trigger = this.renderRoot.querySelector<HTMLElement>("[part='trigger']");
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const measured = this.panel.offsetWidth || rect.width || 220;
    const width =
      typeof this.dropdownWidth === "number"
        ? this.dropdownWidth
        : Math.min(320, Math.max(measured, rect.width || 220));
    const height = this.panel.offsetHeight || 40;
    const pos = computeFixedPanelPosition({
      trigger: rect,
      panelWidth: width,
      panelHeight: height,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
    });
    let top = pos.top;
    if (this.placement === "top-start") {
      const above = rect.top - 4 - height;
      if (above >= 4) top = above;
    }
    this.panel.style.top = `${top}px`;
    this.panel.style.left = `${pos.left}px`;
    this.panel.style.width = `${width}px`;
    this.panel.style.zIndex = String(PANEL_Z_BASE + this.nestLevel() * Z_STEP);
    if (follow) this.schedulePosition();
  }

  private armSettle() {
    if (this.positionTimer || typeof window === "undefined") return;
    this.positionTimer = window.setTimeout(() => {
      this.positionTimer = 0;
      if (this.open && this.panel) this.positionPanel(false);
    }, 220);
  }

  private schedulePosition() {
    if (this.positionFrame || typeof requestAnimationFrame === "undefined") return;
    this.positionFrame = requestAnimationFrame(() => {
      this.positionFrame = 0;
      if (this.open && this.panel) this.positionPanel(false);
    });
  }

  private nestLevel() {
    const names = new Set([
      "GK-MODAL",
      "GK-DRAWER",
      "GK-CASCADER",
      "GK-SELECT",
      "GK-TREE-SELECT",
      "GK-DROPDOWN",
      "GK-TOOLTIP",
      "GK-POPCONFIRM",
      "GK-DATE-PICKER",
    ]);
    let level = 0;
    let node: HTMLElement | null = this.parentElement;
    while (node) {
      if (names.has(node.tagName)) level += 1;
      node = node.parentElement;
    }
    return level;
  }

  private focusTrigger() {
    this.renderRoot.querySelector<HTMLElement>("[part='trigger']")?.focus();
  }

  private icons() {
    return {
      clear: svg`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"></path></svg>`,
      chevron: svg`<svg part="chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10l5 5 5-5H7z"></path></svg>`,
    };
  }

  private onEmptySlot = () => {
    if (this.open) this.renderPanel();
  };

  override render() {
    const zh = prefersZh(this);
    const path = this.value == null ? null : this.findPath(this.nodes(), this.value);
    const labels = path?.map((node) => node.label) ?? [];
    const text = this.showPath ? labels.join(this.separator) : (labels.at(-1) ?? "");
    const showClear = this.clearable && !this.disabled && this.value != null && this.value !== "";
    const icons = this.icons();
    const labelledBy = this.getAttribute("aria-labelledby");
    const describedBy = this.getAttribute("aria-describedby");
    return html`
      <div
        part="trigger"
        tabindex=${this.disabled ? -1 : 0}
        role="combobox"
        aria-haspopup="tree"
        aria-expanded=${this.open ? "true" : "false"}
        aria-controls=${this.panelId}
        aria-disabled=${this.disabled ? "true" : "false"}
        aria-labelledby=${labelledBy || nothing}
        aria-describedby=${describedBy || nothing}
        aria-required=${this.getAttribute("aria-required") === "true" ? "true" : nothing}
        aria-invalid=${this.getAttribute("aria-invalid") === "true" ? "true" : nothing}
        @click=${this.onTriggerClick}
        @keydown=${this.onKeyDown}
      >
        ${text
          ? html`<span part="value">${text}</span>`
          : html`<span part="placeholder">${this.placeholder || "\u00a0"}</span>`}
        <span part="suffix">
          ${showClear
            ? html`<button type="button" part="clear" aria-label=${zh ? "清除" : "Clear"} @click=${this.clear}>
                ${icons.clear}
              </button>`
            : nothing}
          ${icons.chevron}
        </span>
      </div>
      <slot name="empty" hidden @slotchange=${this.onEmptySlot}></slot>
    `;
  }
}

function nodeKey(node: TreeNode): string | number {
  if (node.value != null && node.value !== "") return node.value;
  if (node.key != null && node.key !== "") return node.key;
  return node.label;
}

function nextEnabled(rows: FlatNode[], from: number, direction: 1 | -1) {
  if (!rows.length) return 0;
  let index = from;
  for (let i = 0; i < rows.length; i += 1) {
    index += direction;
    if (index < 0) index = rows.length - 1;
    if (index >= rows.length) index = 0;
    if (!rows[index]?.node.disabled) return index;
  }
  return from;
}

function chevronSvg() {
  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  icon.setAttribute("viewBox", "0 0 16 16");
  icon.setAttribute("aria-hidden", "true");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M6 3.2 10.8 8 6 12.8l-1.2-1.2L8.4 8 4.8 4.4z");
  icon.append(path);
  return icon;
}

declare global {
  interface HTMLElementTagNameMap {
    "gk-tree-select": GkTreeSelect;
  }
}
