<script setup lang="ts">
import { ref } from "vue";

const fruit = ref("pear");
const clearable = ref("apple");
const multipleValues = ref(["apple", "pear"]);
const remoteLoading = ref(false);
const remoteOptions = ref([
  { value: "apple", label: "蘋果" },
  { value: "pear", label: "梨" },
  { value: "plum", label: "李" },
]);
function onFruit(e: CustomEvent<{ value: string }>) {
  fruit.value = e.detail.value;
}
function onClearable(e: CustomEvent<{ value: string }>) {
  clearable.value = e.detail.value;
}
function onMultiple(e: CustomEvent<{ value: string[] }>) {
  multipleValues.value = e.detail.value;
}
let latestRemoteRequest = 0;
function onRemoteSearch(e: CustomEvent<{ query: string; requestId: number }>) {
  latestRemoteRequest = e.detail.requestId;
  remoteLoading.value = true;
  const query = e.detail.query.toLowerCase();
  window.setTimeout(() => {
    if (e.detail.requestId !== latestRemoteRequest) return;
    remoteOptions.value = [
      { value: "apple", label: "蘋果" },
      { value: "pear", label: "梨" },
      { value: "plum", label: "李" },
    ].filter((option) => option.label.toLowerCase().includes(query));
    remoteLoading.value = false;
  }, 300);
}

const codes = {
  basic: `<gk-select :value="fruit" placeholder="選擇水果" @change="onFruit">
  <gk-option value="apple">蘋果</gk-option>
  <gk-option value="pear">梨</gk-option>
  <gk-option value="plum">李</gk-option>
</gk-select>`,
  size: `<gk-select size="sm" value="a" placeholder="小">
  <gk-option value="a">小</gk-option>
</gk-select>
<gk-select size="md" value="a" placeholder="中">
  <gk-option value="a">中</gk-option>
</gk-select>
<gk-select size="lg" value="a" placeholder="大">
  <gk-option value="a">大</gk-option>
</gk-select>`,
  clearable: `<gk-select clearable :value="clearable" placeholder="可清除" @change="onClearable">
  <gk-option value="apple">蘋果</gk-option>
  <gk-option value="pear">梨</gk-option>
</gk-select>`,
  status: `<gk-select status="success" value="ok" placeholder="成功">
  <gk-option value="ok">看起來沒問題</gk-option>
</gk-select>
<gk-select status="warning" value="warn" placeholder="警告">
  <gk-option value="warn">請檢查</gk-option>
</gk-select>
<gk-select status="error" value="bad" placeholder="錯誤">
  <gk-option value="bad">無效</gk-option>
</gk-select>`,
  disabled: `<gk-select disabled value="apple" placeholder="停用">
  <gk-option value="apple">蘋果</gk-option>
</gk-select>`,
  filterable: `<gk-select filterable placeholder="搜尋水果">
  <gk-option value="apple">蘋果</gk-option>
  <gk-option value="pear">梨</gk-option>
  <gk-option value="plum">李</gk-option>
</gk-select>`,
  groups: `<gk-select placeholder="選擇水果">
  <gk-option-group label="新鮮水果">
    <gk-option value="apple">蘋果</gk-option>
    <gk-option value="pear">梨</gk-option>
  </gk-option-group>
  <gk-option-group label="無法使用" disabled>
    <gk-option value="plum">李</gk-option>
  </gk-option-group>
</gk-select>`,
  empty: `<gk-select open placeholder="沒有選項"></gk-select>`,
  multiple: `<gk-select multiple :value="multipleValues" placeholder="選擇水果" @change="onMultiple">
  <gk-option value="apple">蘋果</gk-option>
  <gk-option value="pear">梨</gk-option>
  <gk-option value="plum">李</gk-option>
</gk-select>`,
  max: `<gk-select multiple max="2" placeholder="最多選兩種水果">
  <gk-option value="apple">蘋果</gk-option>
  <gk-option value="pear">梨</gk-option>
  <gk-option value="plum">李</gk-option>
</gk-select>`,
  remote: `<gk-select remote remote-debounce="300" :loading="remoteLoading" placeholder="遠端搜尋" @search="onRemoteSearch">
  <gk-option v-for="option in remoteOptions" :key="option.value" :value="option.value">{{ option.label }}</gk-option>
</gk-select>`,
  customState: `<gk-select loading open>
  <span slot="loading">正在取得水果…</span>
  <span slot="empty">找不到符合的水果</span>
</gk-select>`,
  virtual: `<gk-select virtual item-height="34" placeholder="大量選項">
  <!-- 在此提供大量 gk-option 元素 -->
</gk-select>`,
};
</script>

# Select 選擇器

單選下拉選單。觸發器對齊 Input 外觀；選項懸停與選中使用淺品牌色，不是實心黃塊。

## 示範

<DemoCard title="基礎" :code="codes.basic">
  <template #description>
    綁定 <code>value</code>，並以 <code>e.detail.value</code> 監聽 <code>change</code>。選項以 <code>gk-option</code> 插槽提供。
  </template>
  <div style="min-width:16rem">
    <gk-select :value="fruit" placeholder="選擇水果" @change="onFruit">
      <gk-option value="apple">蘋果</gk-option>
      <gk-option value="pear">梨</gk-option>
      <gk-option value="plum">李</gk-option>
    </gk-select>
  </div>
  <p style="margin:0;font-size:0.875rem;opacity:0.8">值：{{ fruit || "（空）" }}</p>
</DemoCard>

<DemoCard title="自訂載入與空狀態內容" :code="codes.customState">
  <template #description>
    使用 <code>slot="loading"</code> 或 <code>slot="empty"</code> 的元素，
    自訂清單的載入與空狀態內容。
  </template>
  <div style="min-width:16rem">
    <gk-select loading open>
      <span slot="loading">正在取得水果…</span>
      <span slot="empty">找不到符合的水果</span>
    </gk-select>
  </div>
</DemoCard>

<DemoCard title="載入與遠端搜尋" :code="codes.remote">
  <template #description>
    <code>loading</code> 顯示載入狀態並阻擋選取；<code>remote</code> 會在 debounce
    後以     <code>e.detail.query</code> 與遞增的 <code>e.detail.requestId</code> 派發
    <code>search</code>。請保留最新 request id 以忽略過期的非同步回應；
    可用 <code>remote-debounce</code> 設定毫秒數。
  </template>
  <div style="min-width:16rem">
    <gk-select remote remote-debounce="300" :loading="remoteLoading" placeholder="遠端搜尋" @search="onRemoteSearch">
      <gk-option v-for="option in remoteOptions" :key="option.value" :value="option.value">
        {{ option.label }}
      </gk-option>
    </gk-select>
  </div>
</DemoCard>

<DemoCard title="篩選" :code="codes.filterable">
  <template #description>
    <code>filterable</code> 會加入搜尋欄位，並依選項文字或 value 篩選。
  </template>
  <div style="min-width:16rem">
    <gk-select filterable placeholder="搜尋水果">
      <gk-option value="apple">蘋果</gk-option>
      <gk-option value="pear">梨</gk-option>
      <gk-option value="plum">李</gk-option>
    </gk-select>
  </div>
</DemoCard>

<DemoCard title="多選" :code="codes.multiple">
  <template #description>
    <code>multiple</code> 會保持清單開啟，並將已選值顯示為標籤。<code>value</code> 請使用字串陣列；
    選項也會顯示 checkbox 選取指示。
  </template>
  <div style="min-width:16rem">
    <gk-select multiple :value="multipleValues" placeholder="選擇水果" @change="onMultiple">
      <gk-option value="apple">蘋果</gk-option>
      <gk-option value="pear">梨</gk-option>
      <gk-option value="plum">李</gk-option>
    </gk-select>
  </div>
  <p style="margin:0;font-size:0.875rem;opacity:0.8">
    已選：{{ multipleValues.length ? multipleValues.join("、") : "（空）" }}
  </p>
</DemoCard>

<DemoCard title="多選數量上限" :code="codes.max">
  <template #description>
    在多選模式設定 <code>max</code> 限制新增數量；已選項目仍可正常取消。
  </template>
  <div style="min-width:16rem">
    <gk-select multiple max="2" placeholder="最多選兩種水果">
      <gk-option value="apple">蘋果</gk-option>
      <gk-option value="pear">梨</gk-option>
      <gk-option value="plum">李</gk-option>
    </gk-select>
  </div>
</DemoCard>

## 選項群組與空狀態

可使用 `<gk-option-group label="…">` 將選項分組。鍵盤以
Arrow/Home/End 導覽時會跳過停用選項；沒有選項時，清單會顯示
`No options` 狀態。

設定 <code>filterable</code> 後，清單開啟時會顯示搜尋欄位。篩選會不分大小寫比對選項文字或 value；Arrow 鍵與 Enter 仍可從篩選結果中導覽與選取。

<DemoCard title="選項群組" :code="codes.groups">
  <template #description>
    使用 <code>gk-option-group</code> 將選項分組；停用群組會停用其中所有選項。
  </template>
  <div style="min-width:16rem">
    <gk-select placeholder="選擇水果">
      <gk-option-group label="新鮮水果">
        <gk-option value="apple">蘋果</gk-option>
        <gk-option value="pear">梨</gk-option>
      </gk-option-group>
      <gk-option-group label="無法使用" disabled>
        <gk-option value="plum">李</gk-option>
      </gk-option-group>
    </gk-select>
  </div>
</DemoCard>

<DemoCard title="空狀態" :code="codes.empty">
  <template #description>
    開啟但沒有選項的 Select 會顯示空清單狀態。
  </template>
  <div style="min-width:16rem">
    <gk-select open placeholder="沒有選項"></gk-select>
  </div>
</DemoCard>

<DemoCard title="尺寸" :code="codes.size">
  <template #description>
    高度對齊 Input：<code>sm</code> / <code>md</code> / <code>lg</code> 為 28 / 34 / 40。
  </template>
  <div style="display:grid;gap:0.75rem;min-width:16rem">
    <gk-select size="sm" value="a" placeholder="小">
      <gk-option value="a">小</gk-option>
    </gk-select>
    <gk-select size="md" value="a" placeholder="中">
      <gk-option value="a">中</gk-option>
    </gk-select>
    <gk-select size="lg" value="a" placeholder="大">
      <gk-option value="a">大</gk-option>
    </gk-select>
  </div>
</DemoCard>

<DemoCard title="虛擬滾動" :code="codes.virtual">
  <template #description>
    大量選項可啟用 <code>virtual</code>。<code>item-height</code> 請設定為實際選項高度（像素）。
  </template>
  <div style="min-width:16rem">
    <gk-select virtual item-height="34" placeholder="大量選項">
      <gk-option v-for="index in 100" :key="index" :value="`option-${index}`">
        選項 {{ index }}
      </gk-option>
    </gk-select>
  </div>
</DemoCard>

<DemoCard title="可清除" :code="codes.clearable">
  <template #description>
    <code>clearable</code> 在有值時顯示清除按鈕。
  </template>
  <div style="min-width:16rem">
    <gk-select clearable :value="clearable" placeholder="可清除" @change="onClearable">
      <gk-option value="apple">蘋果</gk-option>
      <gk-option value="pear">梨</gk-option>
    </gk-select>
  </div>
</DemoCard>

<DemoCard title="狀態" :code="codes.status">
  <template #description>
    以 <code>status</code> 顯示驗證外觀：<code>success</code>、<code>warning</code> 或 <code>error</code>。
  </template>
  <div style="display:grid;gap:0.75rem;min-width:16rem">
    <gk-select status="success" value="ok" placeholder="成功">
      <gk-option value="ok">看起來沒問題</gk-option>
    </gk-select>
    <gk-select status="warning" value="warn" placeholder="警告">
      <gk-option value="warn">請檢查</gk-option>
    </gk-select>
    <gk-select status="error" value="bad" placeholder="錯誤">
      <gk-option value="bad">無效</gk-option>
    </gk-select>
  </div>
</DemoCard>

<DemoCard title="停用" :code="codes.disabled">
  <template #description>
    <code>disabled</code> 會阻擋開啟。
  </template>
  <div style="min-width:16rem">
    <gk-select disabled value="apple" placeholder="停用">
      <gk-option value="apple">蘋果</gk-option>
    </gk-select>
  </div>
</DemoCard>

## API

### Select Props

| Prop | 型別 | 預設值 |
|------|------|---------|
| `value` | `string \| string[]` | `''`／`multiple` 時為 `[]` |
| `placeholder` | `string` | `''` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `disabled` | `boolean` | `false` |
| `clearable` | `boolean` | `false` |
| `filterable` | `boolean` | `false` |
| `loading` | `boolean` | `false` |
| `remote` | `boolean` | `false` |
| `remote-debounce` | `number` | `300` |
| `virtual` | `boolean` | `false` |
| `item-height` | `number` | `34` |
| `name` | `string` | `''` |
| `required` | `boolean` | `false` |

可使用 `loading` 與 `empty` 命名 slot 自訂狀態內容。
設定 `name` 可讓 Select 參與原生表單提交；`required` 會啟用約束驗證。
呼叫 `form.reset()` 會清除 Select 值。
| `multiple` | `boolean` | `false` |
| `max` | `number` | `0`（不限） |
| `status` | `'success' \| 'warning' \| 'error' \| ''` | `''` |
| `open` | `boolean` | `false` |

### Select Slots

| 名稱 | 說明 |
|------|------|
| default | `<gk-option value="…">` 子元素 |
| loading | `loading` 為 `true` 時顯示的內容 |
| empty | 沒有可見選項時顯示的內容 |

### Select Events

| 名稱 | 說明 |
|------|------|
| `change` | `detail: { value: string \| string[] }` |
| `search` | `detail: { query: string, requestId: number }`（remote debounce 後） |

### Option Props

| Prop | 型別 | 預設值 |
|------|------|---------|
| `value` | `string` | `''` |
| `disabled` | `boolean` | `false` |

### Option Group Props

| Prop | 型別 | 預設值 |
|------|------|---------|
| `label` | `string` | `''` |
| `disabled` | `boolean` | `false` |
