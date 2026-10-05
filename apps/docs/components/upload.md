<script setup lang="ts">
import { ref } from "vue";

const files = ref([
  { id: "a", name: "攤位簡介_排版版.pdf", size: 1.2 * 1024 * 1024, status: "uploading", percent: 64 },
  { id: "b", name: "主視覺_橫幅.png", size: 860 * 1024, status: "success", percent: 100 },
  { id: "c", name: "議程草稿.docx", size: 420 * 1024, status: "error", percent: 38 },
]);
const thumb =
  "data:image/svg+xml," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><rect width='64' height='64' fill='#F2CE5E'/></svg>",
  );
const cards = ref([
  { id: "p1", name: "cover.png", status: "success", percent: 100, thumbnailUrl: thumb },
  { id: "p2", name: "fail.png", status: "error", percent: 20, thumbnailUrl: thumb },
]);
</script>

# Upload

File field with a button trigger and a text list. Picture cards and a drag zone are opt-in. Progress uses brand gold. Success and failure use an icon plus text.

The built-in transport simulates progress so a demo can finish without an endpoint. Pass `customRequest` for a real upload. Cropping and a preview lightbox are follow-ups.

## Demos

<DemoCard title="List" code="<gk-upload lang=&quot;zh-Hant&quot;>">
  <template #description>
    Default <code>list-type</code> is <code>list</code>. Default <code>dragger</code> is false. Sizes are 28 / 34 / 40.
  </template>
  <div style="max-width:28rem">
    <gk-upload lang="zh-Hant" :value="files"></gk-upload>
  </div>
</DemoCard>

<DemoCard title="Drag zone" code="<gk-upload dragger>">
  <gk-upload dragger lang="zh-Hant"></gk-upload>
</DemoCard>

<DemoCard title="Picture card" code="<gk-upload list-type=&quot;picture-card&quot;>">
  <gk-upload list-type="picture-card" lang="zh-Hant" :value="cards"></gk-upload>
</DemoCard>

<DemoCard title="Sizes, max, disabled" code="<gk-upload size=&quot;sm&quot; max=&quot;1&quot;>">
  <div style="display:grid;gap:0.75rem">
    <gk-upload size="sm" lang="zh-Hant"></gk-upload>
    <gk-upload size="lg" lang="zh-Hant"></gk-upload>
    <gk-upload max="1" lang="zh-Hant" :value="[{ id: 'm', name: 'only.pdf', status: 'success', percent: 100 }]"></gk-upload>
    <gk-upload disabled lang="zh-Hant"></gk-upload>
  </div>
</DemoCard>

<DemoCard title="Inside a form item" code="<gk-form-item label=&quot;附件&quot; path=&quot;files&quot;>">
  <gk-form style="max-width:28rem">
    <gk-form-item label="附件" path="files">
      <gk-upload lang="zh-Hant"></gk-upload>
    </gk-form-item>
  </gk-form>
</DemoCard>

## API

### Properties

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` / `file-list` | `UploadFile[]` | `[]` | `{ id, name, size?, status, percent?, url?, thumbnailUrl?, file? }` |
| `accept` | `string` | `''` | Forwarded to the hidden file input |
| `multiple` | `boolean` | `false` | When false, a new pick replaces the list |
| `max` | `number` | — | Disables the trigger and shows「已達上限」 |
| `size` | `sm` \| `md` \| `lg` | `md` | Button height 28 / 34 / 40. Cards are 96 / 104 / 112 |
| `list-type` | `list` \| `picture-card` | `list` | |
| `show-file-list` | `boolean` | `true` | |
| `show-remove-button` / `show-retry-button` | `boolean` | `true` | |
| `dragger` | `boolean` | `false` | Dashed drop zone instead of the button |
| `directory` | `boolean` | `false` | Sets `webkitdirectory` |
| `name` | `string` | `'file'` | FormData field name |
| `default-upload` | `boolean` | `true` | `false` leaves files `pending` until `upload()` |
| `customRequest` | function | — | `{ file, fileItem, onProgress, onSuccess, onError }` |
| `beforeUpload` | function | — | Return `false` or throw to cancel. `before-upload` is also cancelable |

`status` is `pending` \| `uploading` \| `success` \| `error`.

### Events

| Name | Detail |
| --- | --- |
| `change`, `update:file-list`, `update:value` | `{ fileList, value }` |
| `before-upload` | `{ file }` — `preventDefault()` cancels |
| `progress` | `{ file, percent }` |
| `success` | `{ file, response? }` |
| `error` | `{ file, error? }` |
| `remove` | `{ file }` |
| `retry` | `{ file }` |
| `preview` | `{ file }` — picture-card only. No lightbox in v1 |

### Parts

`root`, `trigger`, `input`, `dragger`, `list`, `item`, `thumbnail`, `name`, `size`, `progress`, `status-icon`, `remove`, `retry`, `add`.

### Slots

`trigger` replaces the button or drag zone. `file` replaces the list. `empty` is an optional hint when the list is empty.

Set `show-file-list="false"`, `default-upload="false"`, or `show-search` style flags with the string `false`. A bare attribute means true.
