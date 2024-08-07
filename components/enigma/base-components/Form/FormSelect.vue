<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import _ from "lodash";
import { twMerge } from "tailwind-merge";
import {
  computed,
  type SelectHTMLAttributes,
  useAttrs,
  inject,
  ref,
  watch,
} from "vue";
import { type ProvideFormInline } from "./FormInline.vue";

interface FormSelectProps extends /* @vue-ignore */ SelectHTMLAttributes {
  modelValue?: SelectHTMLAttributes["value"];
  formSelectSize?: "sm" | "lg";
}

interface FormSelectEmit {
  (e: "update:modelValue", value: string): void;
}

const props = defineProps<FormSelectProps>();

const attrs = useAttrs();

const formInline = inject<ProvideFormInline>("formInline", false);

const computedClass = computed(() =>
  twMerge([
    "disabled:bg-slate-100 disabled:cursor-not-allowed disabled:dark:bg-darkmode-800/50",
    "[&[readonly]]:bg-slate-100 [&[readonly]]:cursor-not-allowed [&[readonly]]:dark:bg-darkmode-800/50",
    "transition duration-200 ease-in-out w-full text-sm border-slate-200 shadow-sm rounded-md py-2 px-3 pr-8 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary focus:border-opacity-40 dark:bg-darkmode-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50",
    props.formSelectSize == "sm" && "text-xs py-1.5 pl-2 pr-8",
    props.formSelectSize == "lg" && "text-lg py-1.5 pl-4 pr-8",
    formInline && "flex-1",
    typeof attrs.class === "string" && attrs.class,
  ])
);

const localValue = ref(props.modelValue);
const emit = defineEmits<FormSelectEmit>();

watch(localValue, () => {
  emit("update:modelValue", localValue.value);
});
</script>

<template>
  <select
    :class="computedClass"
    v-bind="{ ...attrs, class: undefined }"
    v-model="localValue"
  >
    <slot></slot>
  </select>
</template>
