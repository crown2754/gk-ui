import { LitElement, html, nothing, svg, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { markOwnedSize, prefersZh } from "../internal/field.js";
import { uploadStyles } from "./gk-upload.styles.js";

export type UploadStatus = "pending" | "uploading" | "success" | "error";
export type UploadListType = "list" | "picture-card";
export type UploadSize = "sm" | "md" | "lg";

export type UploadFile = {
  id: string;
  name: string;
  size?: number;
  status: UploadStatus;
  percent?: number;
  url?: string;
  thumbnailUrl?: string;
  file?: File;
};

export type UploadRequestOptions = {
  file: File;
  fileItem: UploadFile;
  onProgress: (percent: number) => void;
  onSuccess: (response?: unknown) => void;
  onError: (error?: unknown) => void;
};

const flag = {
  fromAttribute(value: string | null) {
    return value !== "false" && value !== "0";
  },
  toAttribute(value: boolean) {
    return value ? "" : "false";
  },
};

const fileListConverter = {
  fromAttribute(value: string | null): UploadFile[] {
    if (!value) return [];
    try {
      const parsed = JSON.parse(value) as unknown;
      return Array.isArray(parsed) ? (parsed as UploadFile[]) : [];
    } catch {
      return [];
    }
  },
};

let fileSeq = 0;

@customElement("gk-upload")
export class GkUpload extends LitElement {
  static styles = uploadStyles;
  static formAssociated = true;

  /** Controlled file list. Alias of `fileList` / `file-list`. */
  @property({ attribute: false })
  value: UploadFile[] = [];

  @property({ attribute: "file-list", converter: fileListConverter })
  fileList: UploadFile[] = [];

  @property()
  accept = "";

  @property({ type: Boolean, reflect: true })
  multiple = false;

  @property({ type: Number })
  max: number | null = null;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ reflect: true })
  size: UploadSize = "md";

  @property({ reflect: true, attribute: "list-type" })
  listType: UploadListType = "list";

  @property({ reflect: true, attribute: "show-file-list", converter: flag })
  showFileList = true;

  @property({ reflect: true, attribute: "show-remove-button", converter: flag })
  showRemoveButton = true;

  @property({ reflect: true, attribute: "show-retry-button", converter: flag })
  showRetryButton = true;

  @property({ type: Boolean, reflect: true })
  dragger = false;

  @property({ type: Boolean, reflect: true })
  directory = false;

  @property()
  name = "file";

  @property({ reflect: true, attribute: "default-upload", converter: flag })
  defaultUpload = true;

  @property({ attribute: false })
  customRequest?: (options: UploadRequestOptions) => void | Promise<void>;

  @property({ attribute: false })
  beforeUpload?: (file: File) => boolean | Promise<boolean | void>;

  @state()
  private dragOver = false;

  @state()
  private hasTriggerSlot = false;

  @state()
  private hasFileSlot = false;

  @state()
  private hasEmptySlot = false;

  private readonly timers = new Map<string, number>();
  private readonly internals =
    typeof ElementInternals === "undefined" ? undefined : this.createInternals();

  private createInternals() {
    const element = this as unknown as HTMLElement & {
      attachInternals?: () => ElementInternals;
    };
    return element.attachInternals?.();
  }

  override attributeChangedCallback(name: string, old: string | null, value: string | null) {
    super.attributeChangedCallback(name, old, value);
    markOwnedSize(this, name);
  }

  override disconnectedCallback() {
    for (const id of this.timers.keys()) this.clearTimer(id);
    for (const item of this.value) this.revoke(item);
    super.disconnectedCallback();
  }

  protected override willUpdate(changed: PropertyValues<this>) {
    if (changed.has("value") && changed.has("fileList")) {
      const useFileList = this.value.length === 0 && this.fileList.length > 0;
      if (useFileList) this.value = this.normalizeFiles(this.fileList);
      else this.fileList = this.value;
    } else if (changed.has("value") && this.fileList !== this.value) {
      this.fileList = this.value;
    } else if (changed.has("fileList") && this.value !== this.fileList) {
      this.value = this.normalizeFiles(this.fileList);
    }
    if (this.value.some((item) => !item.id || !item.status)) {
      this.value = this.normalizeFiles(this.value);
      this.fileList = this.value;
    }
  }

  protected override updated(changed: PropertyValues<this>) {
    const input = this.renderRoot.querySelector<HTMLInputElement>("input[type='file']");
    if (input) {
      if (this.directory) input.setAttribute("webkitdirectory", "");
      else input.removeAttribute("webkitdirectory");
    }
    if (
      changed.has("value") ||
      changed.has("disabled") ||
      changed.has("name")
    ) {
      this.syncFormValue();
    }
  }

  formResetCallback() {
    for (const id of this.timers.keys()) this.clearTimer(id);
    for (const item of this.value) this.revoke(item);
    this.value = [];
    this.fileList = [];
    this.emitList();
  }

  /** Start pending (or failed) uploads. Pass an id to retry one item. */
  upload(id?: string) {
    if (this.disabled) return;
    for (const item of [...this.value]) {
      if (id && item.id !== id) continue;
      if (item.status === "success") continue;
      this.patch(item.id, { status: "uploading", percent: 0 });
      const current = this.value.find((entry) => entry.id === item.id);
      if (current) this.begin(current);
    }
  }

  private normalizeFiles(list: UploadFile[]) {
    return (list ?? []).map((item) => ({
      ...item,
      id: item.id || `gk-up-${++fileSeq}`,
      status: item.status || "pending",
      percent: item.percent ?? (item.status === "success" ? 100 : 0),
    }));
  }

  private get atMax() {
    return typeof this.max === "number" && Number.isFinite(this.max) && this.value.length >= this.max;
  }

  private chooseLabel(zh: boolean) {
    return zh ? "選擇檔案" : "Choose file";
  }

  private syncFormValue() {
    const internals = this.internals;
    if (!internals?.setFormValue) return;
    if (this.disabled) {
      internals.setFormValue(null);
      return;
    }
    const data = new FormData();
    const field = this.name || "file";
    for (const item of this.value) {
      if (item.file) data.append(field, item.file, item.name);
    }
    internals.setFormValue(data);
  }

  private emitList() {
    const detail = { fileList: this.value, value: this.value };
    for (const type of ["change", "update:file-list", "update:value"] as const) {
      this.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true }));
    }
  }

  private patch(id: string, partial: Partial<UploadFile>, progress = false) {
    const current = this.value.find((item) => item.id === id);
    if (!current) return null;
    const updated = { ...current, ...partial };
    const next = this.value.map((item) => (item.id === id ? updated : item));
    this.value = next;
    this.fileList = next;
    this.emitList();
    if (progress) {
      this.dispatchEvent(
        new CustomEvent("progress", {
          detail: { file: updated, percent: updated.percent ?? 0 },
          bubbles: true,
          composed: true,
        }),
      );
    }
    return updated;
  }

  private async gate(file: File) {
    const event = new CustomEvent("before-upload", {
      detail: { file },
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    this.dispatchEvent(event);
    if (event.defaultPrevented) return false;
    if (!this.beforeUpload) return true;
    try {
      const result = await this.beforeUpload(file);
      return result !== false;
    } catch {
      return false;
    }
  }

  private async ingest(files: File[]) {
    if (this.disabled || !files.length) return;
    const room =
      typeof this.max === "number" && Number.isFinite(this.max)
        ? Math.max(0, this.max - (this.multiple ? this.value.length : 0))
        : this.multiple
          ? Infinity
          : 1;
    const accepted: UploadFile[] = [];
    for (const file of files) {
      if (accepted.length >= room) break;
      if (!(await this.gate(file))) continue;
      const thumb = this.thumbFor(file);
      accepted.push({
        id: `gk-up-${++fileSeq}`,
        name: file.name,
        size: file.size,
        status: this.defaultUpload ? "uploading" : "pending",
        percent: 0,
        url: thumb,
        thumbnailUrl: thumb,
        file,
      });
    }
    if (!accepted.length) return;
    if (!this.multiple) {
      for (const item of this.value) {
        this.clearTimer(item.id);
        this.revoke(item);
      }
    }
    const next = this.multiple ? [...this.value, ...accepted] : accepted;
    this.value = next;
    this.fileList = next;
    this.emitList();
    if (this.defaultUpload) {
      for (const item of accepted) this.begin(item);
    }
  }

  private thumbFor(file: File) {
    if (!file.type.startsWith("image/") || typeof URL === "undefined" || !URL.createObjectURL) {
      return undefined;
    }
    try {
      return URL.createObjectURL(file);
    } catch {
      return undefined;
    }
  }

  private begin(item: UploadFile) {
    if (this.customRequest && item.file) {
      this.runCustom(item);
      return;
    }
    if (item.file) {
      this.simulate(item);
      return;
    }
    const failed = this.patch(item.id, { status: "error" });
    if (failed) {
      this.dispatchEvent(
        new CustomEvent("error", {
          detail: { file: failed, error: new Error("Missing file") },
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  private runCustom(item: UploadFile) {
    const file = item.file;
    if (!file || !this.customRequest) return;
    const options: UploadRequestOptions = {
      file,
      fileItem: item,
      onProgress: (percent: number) => {
        const value = Math.max(0, Math.min(100, Number(percent) || 0));
        this.patch(item.id, { status: "uploading", percent: value }, true);
      },
      onSuccess: (response?: unknown) => {
        const updated = this.patch(item.id, { status: "success", percent: 100 });
        this.dispatchEvent(
          new CustomEvent("success", {
            detail: { file: updated ?? item, response },
            bubbles: true,
            composed: true,
          }),
        );
      },
      onError: (error?: unknown) => {
        const updated = this.patch(item.id, { status: "error" });
        this.dispatchEvent(
          new CustomEvent("error", {
            detail: { file: updated ?? item, error },
            bubbles: true,
            composed: true,
          }),
        );
      },
    };
    try {
      const result = this.customRequest(options);
      if (result && typeof (result as Promise<void>).then === "function") {
        void (result as Promise<void>).catch((error) => options.onError(error));
      }
    } catch (error) {
      options.onError(error);
    }
  }

  private simulate(item: UploadFile) {
    this.clearTimer(item.id);
    let percent = 0;
    const timer = window.setInterval(() => {
      if (!this.value.some((entry) => entry.id === item.id)) {
        this.clearTimer(item.id);
        return;
      }
      percent = Math.min(100, percent + 25);
      if (percent >= 100) {
        this.clearTimer(item.id);
        const updated = this.patch(item.id, { status: "success", percent: 100 }, true);
        if (updated) {
          this.dispatchEvent(
            new CustomEvent("success", {
              detail: { file: updated, response: { simulated: true } },
              bubbles: true,
              composed: true,
            }),
          );
        }
        return;
      }
      this.patch(item.id, { status: "uploading", percent }, true);
    }, 40);
    this.timers.set(item.id, timer);
  }

  private clearTimer(id: string) {
    const timer = this.timers.get(id);
    if (timer != null) window.clearInterval(timer);
    this.timers.delete(id);
  }

  private revoke(item: UploadFile) {
    const url = item.thumbnailUrl || item.url;
    if (url?.startsWith("blob:") && typeof URL !== "undefined" && URL.revokeObjectURL) {
      URL.revokeObjectURL(url);
    }
  }

  private openPicker = () => {
    if (this.disabled || this.atMax) return;
    this.renderRoot.querySelector<HTMLInputElement>("input[type='file']")?.click();
  };

  private onInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const files = [...(input.files ?? [])];
    input.value = "";
    void this.ingest(files);
  };

  private onTriggerKey = (event: KeyboardEvent) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    this.openPicker();
  };

  private onDragOver = (event: DragEvent) => {
    event.preventDefault();
    if (this.disabled || this.atMax) return;
    this.dragOver = true;
  };

  private onDragLeave = () => {
    this.dragOver = false;
  };

  private onDrop = (event: DragEvent) => {
    event.preventDefault();
    this.dragOver = false;
    if (this.disabled || this.atMax) return;
    void this.ingest([...(event.dataTransfer?.files ?? [])]);
  };

  private removeFile(item: UploadFile) {
    if (this.disabled) return;
    this.clearTimer(item.id);
    this.revoke(item);
    const next = this.value.filter((entry) => entry.id !== item.id);
    this.value = next;
    this.fileList = next;
    this.emitList();
    this.dispatchEvent(
      new CustomEvent("remove", { detail: { file: item }, bubbles: true, composed: true }),
    );
  }

  private retryFile(item: UploadFile) {
    if (this.disabled) return;
    this.dispatchEvent(
      new CustomEvent("retry", { detail: { file: item }, bubbles: true, composed: true }),
    );
    this.patch(item.id, { status: "uploading", percent: 0 });
    const current = this.value.find((entry) => entry.id === item.id);
    if (current) this.begin(current);
  }

  private previewFile(item: UploadFile) {
    this.dispatchEvent(
      new CustomEvent("preview", { detail: { file: item }, bubbles: true, composed: true }),
    );
  }

  private onTriggerSlot = (event: Event) => {
    const slot = event.target as HTMLSlotElement;
    this.hasTriggerSlot = assigned(slot);
  };

  private onFileSlot = (event: Event) => {
    this.hasFileSlot = assigned(event.target as HTMLSlotElement);
  };

  private onEmptySlot = (event: Event) => {
    this.hasEmptySlot = assigned(event.target as HTMLSlotElement);
  };

  private statusText(status: UploadStatus, zh: boolean) {
    const labels = zh
      ? { pending: "等待上傳", uploading: "上傳中", success: "成功", error: "失敗" }
      : { pending: "Waiting", uploading: "Uploading", success: "Success", error: "Failed" };
    return labels[status];
  }

  private statusIcon(status: UploadStatus) {
    if (status === "success") {
      return svg`<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6.2 11.2 2.9 7.9 1.7 9.1l4.5 4.5 8-8-1.2-1.2z"></path></svg>`;
    }
    if (status === "error") {
      return svg`<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4.2 4.2 8 8l3.8-3.8 1.2 1.2L9.2 9.2l3.8 3.8-1.2 1.2L8 10.4l-3.8 3.8-1.2-1.2 3.8-3.8-3.8-3.8z"></path></svg>`;
    }
    if (status === "uploading") {
      return svg`<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="3"></circle></svg>`;
    }
    return svg`<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="1.4"></circle></svg>`;
  }

  private fileIcon() {
    return svg`<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 1.5A1.5 1.5 0 0 0 2.5 3v10A1.5 1.5 0 0 0 4 14.5h8a1.5 1.5 0 0 0 1.5-1.5V5.6L9.9 1.5H4z"></path></svg>`;
  }

  private plusIcon() {
    return svg`<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.5a.75.75 0 0 1 .75.75v5h5a.75.75 0 0 1 0 1.5h-5v5a.75.75 0 0 1-1.5 0v-5h-5a.75.75 0 0 1 0-1.5h5v-5A.75.75 0 0 1 8 1.5z"></path></svg>`;
  }

  private closeIcon() {
    return svg`<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4.22 4.22a.75.75 0 0 1 1.06 0L8 6.94l2.72-2.72a.75.75 0 1 1 1.06 1.06L9.06 8l2.72 2.72a.75.75 0 1 1-1.06 1.06L8 9.06l-2.72 2.72a.75.75 0 0 1-1.06-1.06L6.94 8 4.22 5.28a.75.75 0 0 1 0-1.06z"></path></svg>`;
  }

  private uploadIcon() {
    return svg`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V6.8l-2.6 2.6-1.4-1.4L12 3.9l4 4.1-1.4 1.4L13 6.8V16h-1zm-6 2h12v2H6v-2z"></path></svg>`;
  }

  private renderThumb(item: UploadFile) {
    const src = item.thumbnailUrl || (item.url && item.url.startsWith("blob:") ? item.url : "");
    if (src) return html`<img part="thumbnail" alt="" src=${src} />`;
    return html`<span part="thumbnail">${this.fileIcon()}</span>`;
  }

  private renderProgress(item: UploadFile, zh: boolean) {
    if (item.status !== "uploading" && item.status !== "error") return nothing;
    const pct = Math.max(0, Math.min(100, Math.round(item.percent ?? 0)));
    const label = `${zh ? "上傳進度" : "Upload progress"} ${item.name}`;
    return html`
      <div
        part="progress"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow=${pct}
        aria-label=${label}
      >
        <div part="track"><div part="fill" data-status=${item.status} style=${`width:${pct}%`}></div></div>
        <span part="percent">${pct}%</span>
      </div>
    `;
  }

  private renderListItem(item: UploadFile, zh: boolean) {
    return html`
      <li part="item" role="listitem" data-status=${item.status}>
        ${this.renderThumb(item)}
        <div>
          <div part="name">${item.name}</div>
          <div part="meta">
            ${item.size != null ? html`<span part="size">${formatBytes(item.size)}</span>` : nothing}
            <span part="status" data-status=${item.status}>
              <span part="status-icon">${this.statusIcon(item.status)}</span>
              ${this.statusText(item.status, zh)}
            </span>
          </div>
          ${this.renderProgress(item, zh)}
        </div>
        <div part="actions">
          ${item.status === "error" && this.showRetryButton
            ? html`<button
                type="button"
                part="retry"
                aria-label=${`${zh ? "重試上傳" : "Retry upload"} ${item.name}`}
                @click=${() => this.retryFile(item)}
              >
                ${zh ? "重試" : "Retry"}
              </button>`
            : nothing}
          ${this.showRemoveButton
            ? html`<button
                type="button"
                part="remove"
                aria-label=${`${zh ? "移除" : "Remove"} ${item.name}`}
                @click=${() => this.removeFile(item)}
              >
                ${this.closeIcon()}
              </button>`
            : nothing}
        </div>
      </li>
    `;
  }

  private renderCard(item: UploadFile, zh: boolean) {
    const pct = Math.max(0, Math.min(100, Math.round(item.percent ?? 0)));
    return html`
      <li part="item" role="listitem" data-status=${item.status}>
        ${this.renderThumb(item)}
        <span part="badge" data-status=${item.status}>
          ${item.status === "uploading" ? `${pct}%` : this.statusText(item.status, zh)}
        </span>
        ${item.status === "uploading" || item.status === "error" ? this.renderProgress(item, zh) : nothing}
        <div part="overlay">
          <button
            type="button"
            part="preview"
            aria-label=${`${zh ? "預覽" : "Preview"} ${item.name}`}
            @click=${() => this.previewFile(item)}
          >
            ${this.fileIcon()}
          </button>
          ${item.status === "error" && this.showRetryButton
            ? html`<button
                type="button"
                part="retry"
                aria-label=${`${zh ? "重試上傳" : "Retry upload"} ${item.name}`}
                @click=${(event: Event) => {
                  event.stopPropagation();
                  this.retryFile(item);
                }}
              >
                ${zh ? "重試" : "Retry"}
              </button>`
            : nothing}
          ${this.showRemoveButton
            ? html`<button
                type="button"
                part="remove"
                aria-label=${`${zh ? "移除" : "Remove"} ${item.name}`}
                @click=${(event: Event) => {
                  event.stopPropagation();
                  this.removeFile(item);
                }}
              >
                ${this.closeIcon()}
              </button>`
            : nothing}
        </div>
      </li>
    `;
  }

  private renderAdd(zh: boolean) {
    const blocked = this.disabled || this.atMax;
    return html`
      <button
        type="button"
        part="add trigger"
        aria-disabled=${blocked ? "true" : "false"}
        aria-label=${this.chooseLabel(zh)}
        @click=${this.openPicker}
      >
        <span part="add-icon" aria-hidden="true">+</span>
        <span>${zh ? "上傳" : "Upload"}</span>
      </button>
    `;
  }

  private renderChrome(zh: boolean) {
    const blocked = this.disabled || this.atMax;
    if (this.hasTriggerSlot) {
      return html`<div
        part="trigger"
        tabindex=${blocked ? -1 : 0}
        @click=${this.openPicker}
        @keydown=${this.onTriggerKey}
      >
        <slot name="trigger" @slotchange=${this.onTriggerSlot}></slot>
      </div>`;
    }
    if (this.dragger) {
      return html`<div style="display:contents">${this.renderDragger(zh)}</div>
        <slot name="trigger" hidden @slotchange=${this.onTriggerSlot}></slot>`;
    }
    if (this.listType === "picture-card") {
      return html`<slot name="trigger" hidden @slotchange=${this.onTriggerSlot}></slot>`;
    }
    return html`<div style="display:contents">${this.renderButton(zh)}</div>
      <slot name="trigger" hidden @slotchange=${this.onTriggerSlot}></slot>`;
  }

  private renderButton(zh: boolean) {
    const blocked = this.disabled || this.atMax;
    const labelledBy = this.getAttribute("aria-labelledby");
    return html`
      <button
        type="button"
        part="trigger"
        aria-disabled=${blocked ? "true" : "false"}
        aria-label=${labelledBy ? nothing : this.chooseLabel(zh)}
        aria-labelledby=${labelledBy || nothing}
        @click=${this.openPicker}
      >
        ${this.plusIcon()}
        <span>${this.chooseLabel(zh)}</span>
      </button>
    `;
  }

  private renderDragger(zh: boolean) {
    const blocked = this.disabled || this.atMax;
    return html`
      <div
        part="trigger dragger"
        role="button"
        tabindex=${blocked ? -1 : 0}
        aria-disabled=${blocked ? "true" : "false"}
        aria-label=${this.chooseLabel(zh)}
        data-dragover=${this.dragOver ? "" : nothing}
        @click=${this.openPicker}
        @keydown=${this.onTriggerKey}
        @dragover=${this.onDragOver}
        @dragleave=${this.onDragLeave}
        @drop=${this.onDrop}
      >
        <span part="dragger-icon">${this.uploadIcon()}</span>
        <strong part="dragger-title">
          ${zh ? "將檔案拖曳到此處，或點擊選擇" : "Drag files here, or click to choose"}
        </strong>
        ${this.accept
          ? html`<span>${this.accept}</span>`
          : html`<span>${zh ? "或點擊選擇" : "PNG, JPG, PDF"}</span>`}
      </div>
    `;
  }

  override render() {
    const zh = prefersZh(this);
    const labelledBy = this.getAttribute("aria-labelledby");
    const cards = this.listType === "picture-card";
    const listLabel = zh ? "已選檔案" : "Selected files";
    return html`
      <div part="root" aria-disabled=${this.disabled ? "true" : "false"}>
        ${this.renderChrome(zh)}
        <slot
          name="file"
          ?hidden=${!this.showFileList || !this.hasFileSlot}
          @slotchange=${this.onFileSlot}
        ></slot>
        ${this.showFileList && !this.hasFileSlot
          ? html`<ul part="list" role="list" aria-label=${listLabel}>
              ${this.value.map((item) => (cards ? this.renderCard(item, zh) : this.renderListItem(item, zh)))}
              ${cards ? html`<li part="add-item" role="presentation">${this.renderAdd(zh)}</li>` : nothing}
            </ul>`
          : nothing}
        <div part="empty" ?hidden=${!this.showFileList || this.hasFileSlot || !!this.value.length || !this.hasEmptySlot}>
          <slot name="empty" @slotchange=${this.onEmptySlot}></slot>
        </div>
        ${this.atMax ? html`<p part="hint">${zh ? "已達上限" : "Limit reached"}</p>` : nothing}
        <input
          part="input"
          type="file"
          name=${this.name}
          accept=${this.accept || nothing}
          ?multiple=${this.multiple}
          ?disabled=${this.disabled || this.atMax}
          aria-label=${labelledBy ? nothing : this.chooseLabel(zh)}
          aria-labelledby=${labelledBy || nothing}
          @change=${this.onInput}
        />
      </div>
    `;
  }
}

function assigned(slot: HTMLSlotElement) {
  return slot.assignedNodes({ flatten: true }).some((node) => {
    if (node.nodeType === Node.TEXT_NODE) return Boolean(node.textContent?.trim());
    return node.nodeType === Node.ELEMENT_NODE;
  });
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  const mb = bytes / (1024 * 1024);
  return mb >= 10 ? `${Math.round(mb)} MB` : `${mb.toFixed(1)} MB`;
}

declare global {
  interface HTMLElementTagNameMap {
    "gk-upload": GkUpload;
  }
}
