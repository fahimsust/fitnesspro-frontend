<script setup lang="ts">
import { toRefs } from "vue";
import { FormLabel, FormInput } from "~/components/enigma/base-components/Form";
import Error from "~/components/form/Error.vue";
const props = defineProps({
  error: {
    required: false,
    type: String,
  },
  name: {
    required: true,
    type: String,
  },
  modelValue: {
    type: Object,
    default: {},
  },

  placeholder: {
    required: false,
    type: String,
    default: "",
  },
  title: {
    required: true,
    type: String,
  },
  type: {
    required: false,
    type: String,
    default: "text",
  },
  formInline: {
    required: false,
    type: Boolean,
    default: false,
  },
  required: {
    required: false,
    type: Boolean,
    default: false,
  },
  autoFocus: {
    required: false,
    type: Boolean,
    default: false,
  },
  submitFunction: {
    required: false,
    type: Function,
    default: () => { },
  },
  blur: {
    required: false,
    type: Function,
    default: () => { },
  },
  change: {
    required: false,
    type: Function,
    default: () => { },
  },
  withLabel: {
    required: false,
    type: Boolean,
    default: true,
  },
  autoComplete: {
    required: false,
    type: String,
    default: "",
  },
  classProp: {
    required: false,
    type: String,
    default: "",
  },
});

const {
  name,
  placeholder,
  error,
  modelValue,
  submitFunction,
  autoFocus,
  withLabel,
  blur
} = toRefs(props);
const submit = (_: any) => {
  submitFunction.value();
};
</script>
<template>
  <FormLabel v-if="withLabel" :class="{ inline_label: formInline }" :htmlFor="name">{{ title }}<b v-if="required"
      class="text-danger ml-1">*</b></FormLabel>
  <FormInput :class="[classProp, { inline_input: formInline }]" :type="type" :autofocus="autoFocus"
    :autocomplete="autoComplete" @keyup.enter="submit($event)" @change="() => change()" :id="name" @blur="() => blur()"
    v-model="modelValue[name]" @input="$emit('update:modelValue[{{name}}]', ($event.target as HTMLInputElement).value)"
    :placeholder="placeholder" />
  <Error :error="error" :formInline="formInline" />
</template>
<style lang="postcss" scoped>
.inline_input {
  @apply flex items-center flex-1;
}

.inline_label {
  @apply inline-block text-left sm:mr-2;
}
</style>
