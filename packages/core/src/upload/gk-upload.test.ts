import { describe, expect, it, vi } from "vitest";
import { fixture, html } from "@open-wc/testing";
import "./gk-upload.js";
import type { GkUpload, UploadRequestOptions } from "./gk-upload.js";

function inputOf(el: GkUpload) {
  return el.shadowRoot?.querySelector("input[type='file']") as HTMLInputElement;
}

function pick(el: GkUpload, files: File[]) {
  const input = inputOf(el);
  Object.defineProperty(input, "files", { configurable: true, value: files });
  input.dispatchEvent(new Event("change", { bubbles: true }));
}

async function flush(el: GkUpload) {
  await Promise.resolve();
  await Promise.resolve();
  await el.updateComplete;
  await Promise.resolve();
  await el.updateComplete;
}

describe("gk-upload", () => {
  it("defaults to a list and a button trigger", async () => {
    const el = await fixture<GkUpload>(html`<gk-upload lang="zh-Hant"></gk-upload>`);
    expect(el.listType).toBe("list");
    expect(el.dragger).toBe(false);
    expect(el.shadowRoot?.querySelector("[part~='dragger']")).toBeNull();
    expect(el.shadowRoot?.textContent).toContain("選擇檔案");
    expect(inputOf(el).getAttribute("aria-label")).toBe("選擇檔案");
    expect(inputOf(el).disabled).toBe(false);
  });

  it("reports progress and success through custom-request", async () => {
    const el = await fixture<GkUpload>(html`<gk-upload lang="zh-Hant"></gk-upload>`);
    const requests: UploadRequestOptions[] = [];
    el.customRequest = (options) => {
      requests.push(options);
      options.onProgress(64);
    };
    const onProgress = vi.fn();
    el.addEventListener("progress", onProgress);
    pick(el, [new File(["hello"], "notes.pdf", { type: "application/pdf" })]);
    await flush(el);
    expect(requests).toHaveLength(1);
    expect(el.value[0]?.status).toBe("uploading");
    expect(el.value[0]?.percent).toBe(64);
    expect(el.shadowRoot?.querySelector("[part='progress']")?.getAttribute("aria-valuenow")).toBe("64");
    expect(el.shadowRoot?.textContent).toContain("上傳中");
    expect(onProgress).toHaveBeenCalled();
    requests[0]?.onSuccess({ ok: true });
    await el.updateComplete;
    expect(el.value[0]?.status).toBe("success");
    expect(el.shadowRoot?.textContent).toContain("成功");
    expect(el.fileList).toBe(el.value);
  });

  it("cancels a file when before-upload is prevented and ignores files past max", async () => {
    const el = await fixture<GkUpload>(html`<gk-upload multiple max="1" lang="zh-Hant"></gk-upload>`);
    el.beforeUpload = (file) => file.name !== "skip.txt";
    el.customRequest = () => undefined;
    pick(el, [
      new File(["a"], "skip.txt", { type: "text/plain" }),
      new File(["b"], "keep.txt", { type: "text/plain" }),
      new File(["c"], "extra.txt", { type: "text/plain" }),
    ]);
    await flush(el);
    expect(el.value.map((item) => item.name)).toEqual(["keep.txt"]);
    expect(el.shadowRoot?.textContent).toContain("已達上限");
    expect(inputOf(el).disabled).toBe(true);
    const blocked = vi.fn();
    el.addEventListener("before-upload", (event) => {
      event.preventDefault();
      blocked();
    });
    el.max = 2;
    await el.updateComplete;
    pick(el, [new File(["d"], "nope.txt", { type: "text/plain" })]);
    await flush(el);
    expect(blocked).toHaveBeenCalled();
    expect(el.value.map((item) => item.name)).toEqual(["keep.txt"]);
  });

  it("removes a file and retries an error", async () => {
    const el = await fixture<GkUpload>(html`<gk-upload lang="zh-Hant"></gk-upload>`);
    let fail = true;
    el.customRequest = ({ onError, onSuccess }) => {
      if (fail) onError(new Error("offline"));
      else onSuccess({ ok: true });
    };
    const onRemove = vi.fn();
    const onRetry = vi.fn();
    el.addEventListener("remove", onRemove);
    el.addEventListener("retry", onRetry);
    pick(el, [new File(["a"], "draft.docx", { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" })]);
    await flush(el);
    expect(el.value[0]?.status).toBe("error");
    expect(el.shadowRoot?.textContent).toContain("失敗");
    const retry = el.shadowRoot?.querySelector("[part='retry']") as HTMLButtonElement;
    expect(retry.getAttribute("aria-label")).toContain("重試上傳");
    fail = false;
    retry.click();
    await el.updateComplete;
    expect(onRetry).toHaveBeenCalled();
    expect(el.value[0]?.status).toBe("success");
    (el.shadowRoot?.querySelector("[part='remove']") as HTMLButtonElement).click();
    await el.updateComplete;
    expect(el.value).toEqual([]);
    expect(onRemove).toHaveBeenCalled();
  });

  it("keeps files pending until upload() when default-upload is false", async () => {
    const el = await fixture<GkUpload>(html`<gk-upload default-upload="false"></gk-upload>`);
    const start = vi.fn();
    el.customRequest = ({ onSuccess }) => {
      start();
      onSuccess({});
    };
    pick(el, [new File(["a"], "later.txt", { type: "text/plain" })]);
    await flush(el);
    expect(el.value[0]?.status).toBe("pending");
    expect(start).not.toHaveBeenCalled();
    el.upload();
    await el.updateComplete;
    expect(start).toHaveBeenCalled();
    expect(el.value[0]?.status).toBe("success");
  });

  it("renders a drag zone and picture-card add tile", async () => {
    const drag = await fixture<GkUpload>(html`<gk-upload dragger lang="zh-Hant"></gk-upload>`);
    const zone = drag.shadowRoot?.querySelector("[part~='dragger']") as HTMLElement;
    expect(zone?.getAttribute("role")).toBe("button");
    expect(zone?.textContent).toContain("將檔案拖曳到此處");
    zone.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    const cards = await fixture<GkUpload>(html`<gk-upload list-type="picture-card" lang="zh-Hant"></gk-upload>`);
    cards.value = [
      { id: "1", name: "cover.png", status: "success", percent: 100, thumbnailUrl: "data:image/gif;base64,R0lGODlhAQABAAAAACw=" },
    ];
    await cards.updateComplete;
    expect(cards.shadowRoot?.querySelector("[part~='add']")?.textContent).toContain("上傳");
    const preview = vi.fn();
    cards.addEventListener("preview", preview);
    (cards.shadowRoot?.querySelector("[part='preview']") as HTMLButtonElement).click();
    expect(preview).toHaveBeenCalled();
    expect(cards.shadowRoot?.querySelector("img")?.getAttribute("src")).toContain("data:image");
  });

  it("does not open a disabled control", async () => {
    const el = await fixture<GkUpload>(html`<gk-upload disabled></gk-upload>`);
    expect(el.hasAttribute("disabled")).toBe(true);
    const button = el.shadowRoot?.querySelector("[part='trigger']") as HTMLButtonElement;
    button.click();
    pick(el, [new File(["a"], "no.txt", { type: "text/plain" })]);
    await flush(el);
    expect(el.value).toEqual([]);
  });
});
