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
const atMax = ref([{ id: "m", name: "only.pdf", status: "success", percent: 100 }]);
</script>

# Upload 上傳

按鈕選檔，清單顯示進度與狀態。圖片卡片與拖曳區要另外打開。進度條是品牌金，成功與失敗都有圖示和文字。

內建傳輸會模擬進度，方便沒有上傳網址時先看介面。正式上傳請傳 `customRequest`。裁切與燈箱預覽不在這一版。

## 範例

<DemoCard title="清單" code="<gk-upload lang=&quot;zh-Hant&quot;>">
  <template #description>
    預設 <code>list-type="list"</code>、<code>dragger</code> 關閉。按鈕高度 28 / 34 / 40。
  </template>
  <div style="max-width:28rem">
    <gk-upload lang="zh-Hant" :value="files"></gk-upload>
  </div>
</DemoCard>

<DemoCard title="拖曳區" code="<gk-upload dragger>">
  <gk-upload dragger lang="zh-Hant"></gk-upload>
</DemoCard>

<DemoCard title="圖片卡片" code="<gk-upload list-type=&quot;picture-card&quot;>">
  <gk-upload list-type="picture-card" lang="zh-Hant" :value="cards"></gk-upload>
</DemoCard>

<DemoCard title="尺寸、上限、停用" code="<gk-upload max=&quot;1&quot; disabled>">
  <div style="display:grid;gap:0.75rem">
    <gk-upload size="sm" lang="zh-Hant"></gk-upload>
    <gk-upload size="lg" lang="zh-Hant"></gk-upload>
    <gk-upload max="1" lang="zh-Hant" :value="atMax"></gk-upload>
    <gk-upload disabled lang="zh-Hant"></gk-upload>
  </div>
</DemoCard>

<DemoCard title="放進表單" code="<gk-form-item label=&quot;附件&quot;>">
  <gk-form style="max-width:28rem">
    <gk-form-item label="附件" path="files">
      <gk-upload lang="zh-Hant"></gk-upload>
    </gk-form-item>
  </gk-form>
</DemoCard>

## API

`value` 與 `file-list` 是同一份 `UploadFile[]`。`status` 為 `pending`、`uploading`、`success`、`error`。

`multiple` 關閉時，新選的檔案會換掉清單。`max` 到達後觸發器停用，並顯示「已達上限」。`default-upload="false"` 時檔案停在等待，呼叫 `upload()` 才開始。

`before-upload` 可以 `preventDefault()`。`customRequest` 收到 `{ file, fileItem, onProgress, onSuccess, onError }`。

事件還有 `progress`、`success`、`error`、`remove`、`retry`、`preview`。`change` 的 detail 是 `{ fileList, value }`。

`trigger` slot 取代按鈕或拖曳區。`file` slot 取代清單。`empty` 是清單為空時的選用提示。

要關掉預設為開的開關，屬性請寫 `false`，例如 `show-file-list="false"`。
