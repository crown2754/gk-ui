<script setup lang="ts">
import { ref } from "vue";

const line = ref("overview");
const segment = ref("list");

function onLine(event: CustomEvent<{ value: string }>) {
  line.value = event.detail.value;
}

function onSegment(event: CustomEvent<{ value: string }>) {
  segment.value = event.detail.value;
}

const codes = {
  line: `<gk-tabs aria-label="Course" :value="line" @update:value="onLine">
  <gk-tab-pane name="overview" tab="Overview">Overview copy.</gk-tab-pane>
  <gk-tab-pane name="syllabus" tab="Syllabus">Week plan.</gk-tab-pane>
  <gk-tab-pane name="reviews" tab="Reviews">Reviews land here.</gk-tab-pane>
  <gk-tab-pane name="files" tab="Files (disabled)" disabled>Unavailable.</gk-tab-pane>
</gk-tabs>`,
  segment: `<gk-tabs type="segment" aria-label="View" :value="segment" @change="onSegment">
  <gk-tab-pane name="list" tab="List">List view.</gk-tab-pane>
  <gk-tab-pane name="board" tab="Board">Board view.</gk-tab-pane>
  <gk-tab-pane name="timeline" tab="Timeline">Timeline view.</gk-tab-pane>
</gk-tabs>`,
  sizes: `<gk-tabs size="sm" aria-label="Small">
  <gk-tab-pane name="a" tab="sm 28">Small tabs are 28px.</gk-tab-pane>
  <gk-tab-pane name="b" tab="Item B">Item B.</gk-tab-pane>
</gk-tabs>
<gk-tabs size="lg" aria-label="Large">
  <gk-tab-pane name="a" tab="lg 40">Large tabs are 40px.</gk-tab-pane>
  <gk-tab-pane name="b" tab="Item B">Item B.</gk-tab-pane>
</gk-tabs>`,
  disabled: `<gk-tab-pane name="files" tab="Files" disabled>Hidden until enabled.</gk-tab-pane>`,
  many: `<gk-tabs aria-label="Categories">
  <gk-tab-pane name="all" tab="All">Scroll the tab list horizontally.</gk-tab-pane>
  <gk-tab-pane name="design" tab="Design system">Design.</gk-tab-pane>
  <!-- more panes; the tab list does not wrap -->
</gk-tabs>`,
  still: `<gk-tabs animated="false" aria-label="Still">
  <gk-tab-pane name="a" tab="Instant">No panel fade.</gk-tab-pane>
  <gk-tab-pane name="b" tab="Other">Other panel.</gk-tab-pane>
</gk-tabs>`,
  icon: `<gk-tab-pane name="overview">
  <span slot="tab">★ Overview</span>
  Icon labels use the tab slot.
</gk-tab-pane>`,
};
</script>

# Tabs

Tabs switch panels. The default is an underline (`line`). `segment` is the compact alternative. Card tabs are not part of v1.

## Demos

<DemoCard title="Line" :code="codes.line">
  <template #description>
    Active text uses brand-pressed. A 2px brand indicator sits on the divider. Arrow keys move between enabled tabs.
  </template>
  <gk-tabs aria-label="Course" :value="line" @update:value="onLine" style="width:100%">
    <gk-tab-pane name="overview" tab="Overview">
      This course introduces the GK design system and how the components ship.
    </gk-tab-pane>
    <gk-tab-pane name="syllabus" tab="Syllabus">
      Week 1 Tokens · Week 2 Form · Week 3 Overlays · Week 4 Display
    </gk-tab-pane>
    <gk-tab-pane name="reviews" tab="Reviews">
      Reviews will show up here.
    </gk-tab-pane>
    <gk-tab-pane name="files" tab="Files (disabled)" disabled>
      Attachments are unavailable.
    </gk-tab-pane>
  </gk-tabs>
</DemoCard>

<DemoCard title="Segment" :code="codes.segment">
  <template #description>
    The track is the quiet button fill. The active segment is a 22% brand wash with pressed text. There is no underline and no card chrome.
  </template>
  <gk-tabs type="segment" aria-label="View" :value="segment" @change="onSegment">
    <gk-tab-pane name="list" tab="List">Segment track with a brand-wash active tab.</gk-tab-pane>
    <gk-tab-pane name="board" tab="Board">Board view.</gk-tab-pane>
    <gk-tab-pane name="timeline" tab="Timeline">Timeline view.</gk-tab-pane>
  </gk-tabs>
</DemoCard>

<DemoCard title="Sizes" :code="codes.sizes">
  <template #description>
    Line hit areas match Button: <code>sm</code> 28, <code>md</code> 34, <code>lg</code> 40. Segment tabs sit inside the track at 26 / 30 / 36.
  </template>
  <div style="display:grid;gap:12px;width:100%">
    <gk-tabs size="sm" aria-label="Small">
      <gk-tab-pane name="a" tab="sm 28">Small line tabs.</gk-tab-pane>
      <gk-tab-pane name="b" tab="Item B">Item B.</gk-tab-pane>
    </gk-tabs>
    <gk-tabs size="lg" aria-label="Large">
      <gk-tab-pane name="a" tab="lg 40">Large line tabs.</gk-tab-pane>
      <gk-tab-pane name="b" tab="Item B">Item B.</gk-tab-pane>
    </gk-tabs>
  </div>
</DemoCard>

<DemoCard title="Disabled tab" :code="codes.disabled">
  <template #description>
    Disabled panes stay in the list at 50% opacity and are skipped by click and keyboard.
  </template>
  <gk-tabs aria-label="Disabled example" style="width:100%">
    <gk-tab-pane name="open" tab="Open">Enabled panel.</gk-tab-pane>
    <gk-tab-pane name="locked" tab="Locked" disabled>You cannot select this tab.</gk-tab-pane>
    <gk-tab-pane name="done" tab="Done">The next enabled tab.</gk-tab-pane>
  </gk-tabs>
</DemoCard>

<DemoCard title="Many tabs" :code="codes.many">
  <template #description>
    The tab list scrolls horizontally and does not wrap. On a narrow viewport, swipe the tab list.
  </template>
  <gk-tabs aria-label="Categories" style="width:100%">
    <gk-tab-pane name="all" tab="All">Scroll the tab list instead of wrapping.</gk-tab-pane>
    <gk-tab-pane name="design" tab="Design system">Design system.</gk-tab-pane>
    <gk-tab-pane name="frontend" tab="Frontend">Frontend.</gk-tab-pane>
    <gk-tab-pane name="product" tab="Product">Product strategy.</gk-tab-pane>
    <gk-tab-pane name="content" tab="Content">Content marketing.</gk-tab-pane>
    <gk-tab-pane name="brand" tab="Brand">Brand visual.</gk-tab-pane>
    <gk-tab-pane name="a11y" tab="Accessibility">Accessibility.</gk-tab-pane>
    <gk-tab-pane name="perf" tab="Performance">Performance.</gk-tab-pane>
  </gk-tabs>
</DemoCard>

<DemoCard title="Animation off" :code="codes.still">
  <template #description>
    <code>animated</code> defaults to true (180ms panel fade and indicator slide). <code>:animated="false"</code> or <code>animated="false"</code> turns it off.
  </template>
  <gk-tabs animated="false" aria-label="Still" style="width:100%">
    <gk-tab-pane name="a" tab="Instant">Panels swap without a fade.</gk-tab-pane>
    <gk-tab-pane name="b" tab="Other">The other panel.</gk-tab-pane>
  </gk-tabs>
</DemoCard>

<DemoCard title="Icon label" :code="codes.icon">
  <template #description>
    Put rich label content in the pane’s <code>tab</code> slot. It replaces the <code>tab</code> string.
  </template>
  <gk-tabs aria-label="With icons" style="width:100%">
    <gk-tab-pane name="overview">
      <span slot="tab">★ Overview</span>
      The tab slot can hold an icon and a label.
    </gk-tab-pane>
    <gk-tab-pane name="notes" tab="Notes">Plain string labels still work beside slotted ones.</gk-tab-pane>
  </gk-tabs>
</DemoCard>

## API

### Tabs Props

| Prop | Type | Default |
|------|------|---------|
| `value` | `string` | first enabled pane |
| `default-value` | `string` | — |
| `type` | `'line' \| 'segment'` | `'line'` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `animated` | `boolean` | `true` |
| `placement` | `'top'` | `'top'` |

`value` is controlled when you set it. With an empty value, `default-value` or the first enabled pane is selected. v1 placement is top only; a vertical tab list is deferred. There is no `card` type.

`animated="false"` is respected (the string `"false"` is not treated as true).

### Tab Pane Props

| Prop | Type | Default |
|------|------|---------|
| `name` | `string` | — |
| `tab` | `string` | — |
| `label` | `string` | — |
| `disabled` | `boolean` | `false` |

`label` aliases `tab`. The `tab` string wins when both are set. `name` is the value key and should be unique.

### Tabs Slots

| Name | Description |
|------|-------------|
| default | `gk-tab-pane` children |
| pane `tab` | Rich tab label. Replaces the `tab` text |
| pane default | Panel body |

### Tabs Events

| Name | Description |
|------|-------------|
| `update:value` | Selection changed. `detail: { value: string }`. Bubbles; `composed: true`. |
| `change` | Same payload as `update:value`. |

### CSS Parts

| Part | Description |
|------|-------------|
| `tablist` | Scrollable tab row |
| `tab` | One tab button |
| `indicator` | 2px brand underline. Hidden for `segment` |
| `panels` | Panel stack |
| `panel` | The visible or hidden panel shell |

### Accessibility

- The list is `role="tablist"` with `aria-orientation="horizontal"`. Pass `aria-label` on `gk-tabs` to name it.
- Each tab is `role="tab"` with `aria-selected`, `aria-controls`, and `aria-disabled` when needed.
- Each panel is `role="tabpanel"` with `aria-labelledby`. Inactive panels are `hidden`.
- Left / Right move among enabled tabs and wrap. Home and End jump to the ends. Tab leaves the tab list and enters the active panel.
- Only the selected enabled tab is in the tab order.
- Focus-visible uses the soft brand ring.

Vertical placement and card tabs are intentionally out of this version.
