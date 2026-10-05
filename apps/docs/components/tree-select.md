<script setup lang="ts">
import { ref } from "vue";

const dept = ref<string | null>("design");
const options = ref([
  {
    label: "總公司",
    value: "hq",
    children: [
      {
        label: "產品部",
        value: "product",
        children: [
          { label: "設計組", value: "design" },
          { label: "研發組", value: "rd" },
          { label: "實驗組（停用）", value: "lab", disabled: true },
        ],
      },
      { label: "行銷部", value: "mkt", children: [{ label: "品牌組", value: "brand" }] },
      { label: "營運部", value: "ops", children: [{ label: "客服組", value: "cs" }] },
    ],
  },
  { label: "分公司", value: "branch", children: [{ label: "台中", value: "txg" }] },
]);

function onDept(event: CustomEvent<{ value: string | null }>) {
  dept.value = event.detail.value;
}
</script>

# TreeSelect

Single-select tree in a Select-shaped trigger. The panel is one scrollable tree, portaled to `document.body` at z-index 4000 (plus 10 inside each nested overlay). Multiple selection, `check-strategy`, and filtering are follow-ups.

## Demos

<DemoCard title="Department" :code="`<gk-tree-select clearable placeholder=&quot;請選擇部門&quot;>`">
  <template #description>
    The trigger joins ancestor labels with <code> / </code>. The switcher expands a branch. Choosing a node commits and closes.
  </template>
  <div style="max-width:22rem">
    <gk-tree-select
      :options="options"
      :value="dept"
      clearable
      placeholder="請選擇部門"
      @change="onDept"
    ></gk-tree-select>
    <p style="margin:0.75rem 0 0;font-size:0.875rem;opacity:0.8">{{ dept || "(empty)" }}</p>
  </div>
</DemoCard>

<DemoCard title="Leaf label only" code="<gk-tree-select show-path=&quot;false&quot;>">
  <gk-tree-select show-path="false" value="design" :options="options" clearable></gk-tree-select>
</DemoCard>

<DemoCard title="Sizes and status" code="<gk-tree-select size=&quot;sm&quot; status=&quot;error&quot;>">
  <div style="display:grid;gap:0.75rem;max-width:22rem">
    <gk-tree-select size="sm" :options="options" value="design" clearable></gk-tree-select>
    <gk-tree-select size="lg" placeholder="請選擇部門"></gk-tree-select>
    <gk-tree-select status="success" :options="options" value="ops"></gk-tree-select>
    <gk-tree-select status="warning" placeholder="請再確認部門"></gk-tree-select>
    <gk-tree-select status="error" placeholder="必填"></gk-tree-select>
    <gk-tree-select disabled :options="options" value="mkt"></gk-tree-select>
  </div>
</DemoCard>

<DemoCard title="Empty" code="<gk-tree-select open lang=&quot;zh-Hant&quot;>">
  <gk-tree-select open lang="zh-Hant" placeholder="沒有資料"></gk-tree-select>
</DemoCard>

<DemoCard title="Inside a form item" code="<gk-form-item label=&quot;部門&quot; path=&quot;dept&quot;>">
  <gk-form style="max-width:22rem">
    <gk-form-item label="部門" path="dept">
      <gk-tree-select :options="options" placeholder="請選擇部門" clearable></gk-tree-select>
    </gk-form-item>
  </gk-form>
</DemoCard>

## API

### Properties

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` | `string \| number \| null` | `null` | Selected node key |
| `options` / `data` | `TreeNode[]` | `[]` | `{ label, value` or `key, children?, disabled?, isLeaf? }` |
| `placeholder` | `string` | `''` | |
| `separator` | `string` | `' / '` | |
| `size` | `sm` \| `md` \| `lg` | `md` | Trigger 28 / 34 / 40 |
| `clearable` | `boolean` | `false` | |
| `status` | `success` \| `warning` \| `error` | — | |
| `default-expanded-keys` | key[] | `[]` | |
| `expanded-keys` | key[] \| null | `null` | `null` is uncontrolled |
| `expand-on-click-node` | `boolean` | `true` | A collapsed branch expands, then a selectable node commits |
| `selectable` | `(node) => boolean` | any non-disabled node | |
| `show-path` | `boolean` | `true` | `false` shows the selected label only |
| `placement` | `bottom-start` \| `top-start` | `bottom-start` | Flips when space is tight |
| `dropdown-width` | `number \| 'trigger'` | `'trigger'` | Capped at 320px |
| `filterable` / `multiple` | `boolean` | `false` | Present, not implemented in v1 |
| `check-strategy` | `child` \| `parent` \| `all` | `child` | Ignored until multiple ships |

### Events

| Name | Detail |
| --- | --- |
| `change`, `update:value` | `{ value, option, path }` |
| `expand`, `update:expanded-keys` | `{ keys, node, expanded }` |
| `clear` | |

### Parts

`trigger`, `value`, `placeholder`, `clear`, `chevron`, `panel`, `tree`, `node`, `switcher`, `indent`, `label`, `empty`.

Keyboard: ArrowDown, Enter, or Space opens. Up and Down move. Left and Right collapse and expand. Enter commits. Esc closes and returns focus to the trigger.
