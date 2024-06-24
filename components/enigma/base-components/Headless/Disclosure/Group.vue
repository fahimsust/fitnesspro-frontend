<script lang="ts">
type Variant = "default" | "boxed";
</script>

<script setup lang="ts">
import { ref, provide, useSlots, type ComputedRef, computed } from "vue";

export type ProvideGroup = ComputedRef<{
  selectedIndex?: number;
  setSelectedIndex: (value: number) => void;
  variant?: Variant;
}>;

interface GroupProps {
  as?: string | object;
  selectedIndex?: number;
  variant?: Variant;
}

const slots = useSlots();

const { as, selectedIndex, variant } = withDefaults(defineProps<GroupProps>(), {
  as: "div",
  selectedIndex: 0,
  variant: "default",
});

const active = ref(selectedIndex);
const setActive = (value: number) => {
  active.value = value;
};

provide<ProvideGroup>(
  "group",
  computed(() => {
    return {
      selectedIndex: active.value,
      setSelectedIndex: setActive,
      variant: variant,
    };
  })
);

let slotsArray: any = [];
if (slots.default) {
  slots.default().forEach((slot) => {
    if (Array.isArray(slot.children)) {
      slot.children.forEach((slotchildren) => {
        slotsArray.push(slotchildren);
      });
    } else {
      slotsArray.push(slot);
    }
  });
}
</script>

<template>
  <component :is="as">
    <component v-for="(item, key) in slotsArray" :is="item" :index="key" />
  </component>
</template>
