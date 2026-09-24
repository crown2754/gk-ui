import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { PropertyValues } from "lit";
import { falseableBoolean } from "../overlay/boolean.js";
import { tabsStyles } from "./gk-tabs.styles.js";
import { GkTabPane } from "./gk-tab-pane.js";

export type GkTabsType = "line" | "segment";
export type GkTabsSize = "sm" | "md" | "lg";
export type GkTabsPlacement = "top";

let uid = 0;

@customElement("gk-tabs")
export class GkTabs extends LitElement {
  static styles = tabsStyles;

  @property({ reflect: true })
  value = "";

  @property({ attribute: "default-value" })
  defaultValue = "";

  /** v1 is `line` (default) and `segment`. Card tabs are intentionally omitted. */
  @property({ reflect: true })
  type: GkTabsType = "line";

  @property({ reflect: true })
  size: GkTabsSize = "md";

  @property({ type: Boolean, reflect: true, converter: falseableBoolean })
  animated = true;

  /** v1 is top only. Vertical placement is deferred. */
  @property({ reflect: true })
  placement: GkTabsPlacement = "top";

  @state()
  private panes: GkTabPane[] = [];

  private readonly uid = ++uid;
  private readonly watched = new WeakSet<GkTabPane>();
  private resizeObserver?: ResizeObserver;

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener("keydown", this.onKeyDown);
    this.syncPanes();
  }

  override disconnectedCallback() {
    this.removeEventListener("keydown", this.onKeyDown);
    this.resizeObserver?.disconnect();
    super.disconnectedCallback();
  }

  protected override firstUpdated() {
    this.syncPanes();
    const list = this.renderRoot.querySelector("[part='tablist']");
    if (list && typeof ResizeObserver !== "undefined") {
      this.resizeObserver = new ResizeObserver(() => this.positionIndicator());
      this.resizeObserver.observe(list);
    }
    this.positionIndicator();
    requestAnimationFrame(() => this.positionIndicator());
  }

  protected override updated(changed: PropertyValues) {
    if (changed.has("value") || changed.has("type") || changed.has("panes")) {
      this.positionIndicator();
    }
  }

  private collectPanes(): GkTabPane[] {
    return [...this.children].filter((node): node is GkTabPane => node instanceof GkTabPane);
  }

  private safe(name: string) {
    return name.replace(/[^A-Za-z0-9_-]/g, "_");
  }

  private tabSlot(pane: GkTabPane) {
    return `tab-${this.uid}-${this.safe(pane.name)}`;
  }

  private panelSlot(pane: GkTabPane, index: number) {
    return `panel-${this.uid}-${this.safe(pane.name || String(index))}`;
  }

  private tabId(pane: GkTabPane) {
    return `gk-tab-${this.uid}-${this.safe(pane.name)}`;
  }

  private panelId(pane: GkTabPane) {
    return `gk-panel-${this.uid}-${this.safe(pane.name)}`;
  }

  private watch(pane: GkTabPane) {
    if (this.watched.has(pane)) return;
    this.watched.add(pane);
    pane.addEventListener("gk-pane-change", this.onPaneChange);
  }

  private onPaneChange = () => {
    this.syncPanes();
    this.requestUpdate();
  };

  private onSlotChange = () => {
    this.syncPanes();
  };

  private syncPanes() {
    const panes = this.collectPanes();
    this.forwardTabSlots(panes);
    for (const [index, pane] of panes.entries()) {
      const slot = this.panelSlot(pane, index);
      if (pane.slot !== slot) pane.slot = slot;
      this.watch(pane);
    }
    this.ensureValue(panes);
    const same =
      panes.length === this.panes.length && panes.every((pane, i) => pane === this.panes[i]);
    if (!same) this.panes = panes;
  }

  private directChildren(root: Element) {
    return [...root.children] as HTMLElement[];
  }

  private forwardTabSlots(panes: GkTabPane[]) {
    const names = new Set(panes.map((pane) => pane.name));
    for (const el of this.directChildren(this)) {
      const name = el.getAttribute("data-gk-forwarded-tab");
      if (name == null) continue;
      if (!names.has(name)) el.remove();
    }
    for (const pane of panes) {
      const already = this.directChildren(this).some(
        (el) => el.getAttribute("data-gk-forwarded-tab") === pane.name,
      );
      if (already) continue;
      const label = this.directChildren(pane).find((el) => el.getAttribute("slot") === "tab");
      if (!label) continue;
      label.setAttribute("data-gk-forwarded-tab", pane.name);
      label.slot = this.tabSlot(pane);
      this.append(label);
    }
  }

  private hasForwardedTab(pane: GkTabPane) {
    return this.directChildren(this).some(
      (el) => el.getAttribute("data-gk-forwarded-tab") === pane.name,
    );
  }

  private ensureValue(panes: GkTabPane[]) {
    if (!panes.length) return;
    if (this.value && panes.some((pane) => pane.name === this.value)) return;
    const enabled = panes.filter((pane) => !pane.disabled);
    if (!enabled.length) return;
    const preferred =
      enabled.find((pane) => pane.name === this.defaultValue) ?? enabled[0];
    this.value = preferred.name;
  }

  private select(name: string) {
    const pane = this.collectPanes().find((item) => item.name === name);
    if (!pane || pane.disabled || pane.name === this.value) return;
    this.value = pane.name;
    const detail = { value: pane.name };
    this.dispatchEvent(
      new CustomEvent("update:value", {
        detail,
        bubbles: true,
        composed: true,
      }),
    );
    this.dispatchEvent(
      new CustomEvent("change", {
        detail,
        bubbles: true,
        composed: true,
      }),
    );
    void this.updateComplete.then(() => this.focusTab(pane.name));
  }

  private focusTab(name: string) {
    const pane = this.panes.find((item) => item.name === name);
    if (!pane) return;
    const tab = this.renderRoot.querySelector<HTMLElement>(`#${this.tabId(pane)}`);
    tab?.focus();
    try {
      tab?.scrollIntoView({ block: "nearest", inline: "nearest" });
    } catch {
      /* layout may be unavailable in tests */
    }
  }

  private onKeyDown = (event: KeyboardEvent) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    if (
      event.composedPath().some(
        (node) => node instanceof Element && node.getAttribute("role") === "tabpanel",
      )
    ) {
      return;
    }
    const enabled = this.panes.filter((pane) => !pane.disabled);
    if (!enabled.length) return;
    event.preventDefault();
    let index = enabled.findIndex((pane) => pane.name === this.value);
    if (index < 0) index = 0;
    if (event.key === "Home") index = 0;
    else if (event.key === "End") index = enabled.length - 1;
    else if (event.key === "ArrowRight") index = (index + 1) % enabled.length;
    else index = (index - 1 + enabled.length) % enabled.length;
    this.select(enabled[index].name);
  };

  private positionIndicator() {
    if (this.type !== "line") return;
    const list = this.renderRoot.querySelector<HTMLElement>("[part='tablist']");
    const tab = this.renderRoot.querySelector<HTMLElement>(
      '[role="tab"][aria-selected="true"]',
    );
    const indicator = this.renderRoot.querySelector<HTMLElement>("[part='indicator']");
    if (!list || !tab || !indicator) return;
    const inset = 8;
    const left = tab.offsetLeft + inset;
    const width = Math.max(0, tab.offsetWidth - inset * 2);
    indicator.style.width = `${width}px`;
    indicator.style.transform = `translateX(${left}px)`;
  }

  private onTabClick = (event: Event) => {
    const name = (event.currentTarget as HTMLElement).dataset.name ?? "";
    this.select(name);
  };

  override render() {
    const label = this.getAttribute("aria-label");
    return html`
      <div
        part="tablist"
        role="tablist"
        aria-orientation="horizontal"
        aria-label=${label || nothing}
      >
        ${this.panes.map((pane) => {
          const selected = pane.name === this.value;
          return html`
            <button
              type="button"
              part="tab"
              role="tab"
              id=${this.tabId(pane)}
              data-name=${pane.name}
              aria-selected=${selected ? "true" : "false"}
              aria-disabled=${pane.disabled ? "true" : "false"}
              aria-controls=${this.panelId(pane)}
              tabindex=${selected && !pane.disabled ? "0" : "-1"}
              @click=${this.onTabClick}
            >
              <slot name=${this.tabSlot(pane)}></slot>
              ${this.hasForwardedTab(pane) ? nothing : pane.text}
            </button>
          `;
        })}
        <span part="indicator" aria-hidden="true"></span>
      </div>
      <div part="panels">
        ${this.panes.map((pane, index) => {
          const selected = pane.name === this.value;
          return html`
            <div
              part="panel"
              role="tabpanel"
              id=${this.panelId(pane)}
              aria-labelledby=${this.tabId(pane)}
              aria-hidden=${selected ? "false" : "true"}
              ?hidden=${!selected}
            >
              <slot name=${this.panelSlot(pane, index)}></slot>
            </div>
          `;
        })}
      </div>
      <slot hidden @slotchange=${this.onSlotChange}></slot>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gk-tabs": GkTabs;
  }
}
