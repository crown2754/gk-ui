<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";

const model = reactive({
  name: "陳小安",
  email: "chen@",
  city: "taipei",
  qty: 2,
  score: 4,
  region: ["tw", "tpe", "daan"] as string[] | null,
  note: "",
});

const rules = {
  name: { required: true },
  email: { required: true, pattern: /^[^@]+@[^@]+\.[^@]+$/, message: "請輸入有效的電子郵件" },
  qty: { required: true, min: 1, max: 99 },
  region: { required: true, message: "請選擇地區" },
};

const regionOptions = [
  {
    label: "台灣",
    value: "tw",
    children: [
      {
        label: "台北市",
        value: "tpe",
        children: [{ label: "大安區", value: "daan" }],
      },
    ],
  },
];

const orderForm = ref<{ validate: () => Promise<unknown> } | null>(null);
onMounted(() => orderForm.value?.validate());

function onField(key: keyof typeof model, e: CustomEvent<{ value: unknown }>) {
  (model as Record<string, unknown>)[key] = e.detail.value;
}

const codes = {
  basic: `<gk-form :model="model" :rules="rules" label-width="7.5rem" @submit="onSubmit">
  <gk-form-item label="姓名" path="name" required help="與證件相同">
    <gk-input :value="model.name" @input="onName"></gk-input>
  </gk-form-item>
</gk-form>`,
  top: `<gk-form label-placement="top" label-width="auto">
  <gk-form-item label="顯示名稱" path="title">
    <gk-input></gk-input>
  </gk-form-item>
</gk-form>`,
};
</script>

# Form

`gk-form` and `gk-form-item` lay out labels, required marks, and validation messages around Input, Select, InputNumber, Rate, Cascader, Upload, TreeSelect, and Transfer. They do not replace those controls.

Labels default to the left, 7.5rem wide in the demo, aligned right. The component does not switch layout at a breakpoint. Bind `label-placement="top"` below about 640px.

## Demos

<DemoCard title="Order" :code="codes.basic">
  <template #description>
    The email starts invalid so the error is visible. Submit runs <code>validate()</code> and emits <code>submit</code> with <code>{ model }</code> only when every item passes. Validators are synchronous.
  </template>
  <gk-form
    ref="orderForm"
    :model="model"
    :rules="rules"
    label-width="7.5rem"
    style="max-width:36rem"
  >
    <gk-form-item label="姓名" path="name" required help="與證件相同">
      <gk-input :value="model.name" @input="onField('name', $event)"></gk-input>
    </gk-form-item>
    <gk-form-item label="電子郵件" path="email" required>
      <gk-input :value="model.email" @input="onField('email', $event)"></gk-input>
    </gk-form-item>
    <gk-form-item label="城市" path="city">
      <gk-select :value="model.city" @change="onField('city', $event)">
        <gk-option value="taipei">台北市</gk-option>
        <gk-option value="new-taipei">新北市</gk-option>
      </gk-select>
    </gk-form-item>
    <gk-form-item label="數量" path="qty" required>
      <gk-input-number :value="model.qty" min="1" max="99" @change="onField('qty', $event)">
        <span slot="suffix">件</span>
      </gk-input-number>
    </gk-form-item>
    <gk-form-item label="滿意度" path="score">
      <gk-rate :value="model.score" @change="onField('score', $event)"></gk-rate>
    </gk-form-item>
    <gk-form-item label="地區" path="region" required>
      <gk-cascader
        :options="regionOptions"
        :value="model.region"
        @change="onField('region', $event)"
      ></gk-cascader>
    </gk-form-item>
    <gk-form-item label="備註" path="note">
      <gk-input
        type="textarea"
        :value="model.note"
        placeholder="請放在管理室"
        @input="onField('note', $event)"
      ></gk-input>
      <span slot="extra">最多 200 字</span>
    </gk-form-item>
    <gk-form-item>
      <gk-button type="submit">送出</gk-button>
      <gk-button type="reset" variant="secondary" style="margin-inline-start:0.5rem">重設</gk-button>
    </gk-form-item>
  </gk-form>
</DemoCard>

<DemoCard title="Labels on top" :code="codes.top">
  <gk-form label-placement="top" style="max-width:20rem">
    <gk-form-item label="顯示名稱" path="shop">
      <gk-input value="小安的店"></gk-input>
    </gk-form-item>
  </gk-form>
</DemoCard>

<DemoCard title="Feedback off, warning, disabled" :code="`<gk-form-item .showFeedback=&quot;false&quot;>`">
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;max-width:40rem">
    <gk-form label-placement="top">
      <gk-form-item label="顯示名稱" path="shop" required help="會出現在收據上">
        <gk-input value="小安的店"></gk-input>
      </gk-form-item>
      <gk-form-item label="庫存警示" path="stock" validation-status="warning" feedback="低於 5 件會提醒補貨">
        <gk-input-number value="3"></gk-input-number>
      </gk-form-item>
    </gk-form>
    <gk-form label-placement="top">
      <gk-form-item label="折扣碼" path="code" required .showFeedback="false">
        <gk-input status="error" value="SUMMER"></gk-input>
      </gk-form-item>
      <gk-form disabled>
        <gk-form-item label="會員編號" path="member">
          <gk-input value="GK-20418" disabled></gk-input>
        </gk-form-item>
      </gk-form>
    </gk-form>
  </div>
</DemoCard>

## Narrow screens

```html
<gk-form :label-placement="narrow ? 'top' : 'left'" label-width="7.5rem">
```

Keep that binding in the app. Inline forms are for wide screens only.

## API

### gk-form

| Name | Type | Default |
| --- | --- | --- |
| `model` | `object` | `{}` |
| `rules` | `Record<path, Rule \| Rule[]>` | `{}` |
| `size` | `sm` \| `md` \| `lg` | `md` |
| `label-placement` | `left` \| `top` | `left` |
| `label-width` | `string` | `auto` |
| `label-align` | `left` \| `right` | right when placement is left |
| `inline` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |
| `show-label` / `show-require-mark` / `show-feedback` | `boolean` | `true` |

`validate()` returns `Promise<{ valid, errors: { path, message }[] }>`. `restoreValidation()` clears item errors. `submit` fires with `{ model }` only when valid. Reset keeps the same model object.

A rule is `{ required?, message?, pattern?, min?, max?, validator? }`. `validator` must be synchronous. A Promise becomes the message「尚不支援非同步驗證」.

### gk-form-item

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `label` / `path` | `string` | — | |
| `required` | `boolean` | `false` | Shows the mark even without a required rule |
| `rule` | `Rule \| Rule[]` | — | Overrides the form rule for that path |
| `feedback` | `string` | — | Wins over the failed rule text |
| `validation-status` | `success` \| `warning` \| `error` | — | Drives child `status` when the child has one |
| `help` | `string` | — | Shown when there is no error |
| `show-label` / `show-feedback` / `show-require-mark` | `boolean` | inherit | Use a property binding for `false` |

Parts: `row`, `label`, `mark`, `control`, `help`, `feedback`, `extra`.

The required asterisk is real text with `aria-hidden="true"`. The control gets `aria-required`. Errors set `aria-invalid` and `aria-describedby`. When `show-label` is false, give the control its own accessible name.

`gk-rate` has no status border; the feedback text is the error cue. Known status children are Input, Select, InputNumber, Cascader, Date Picker, and TreeSelect. Upload and Transfer use the feedback text the same way Rate does.
