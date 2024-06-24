<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import _ from "lodash";
import { twMerge } from "tailwind-merge";
import { computed, useAttrs } from "vue";

const attrs = useAttrs();
const computedClass = computed(() =>
  twMerge([
    "text-xs text-slate-500 mt-2",
    typeof attrs.class === "string" && attrs.class,
  ])
);
</script>

<template>
  <div :class="computedClass" v-bind="{ ...attrs, class: undefined }">
    <slot></slot>
  </div>
</template>
