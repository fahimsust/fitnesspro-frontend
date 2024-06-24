<script setup lang="ts">
import { integer } from "@vuelidate/validators";
import { toRefs, type PropType } from "vue";
import { FormLabel, FormSelect } from "~/components/enigma/base-components/Form";
import Error from "~/components/form/Error.vue";
interface Option {
  id: any;
  name: string;
}
type ObjectKey = keyof typeof Option;
const props = defineProps({
  error: {
    required: false,
    type: String,
  },
  name: {
    required: true,
    type: String,
  },
  options: {
    required: true,
    type: Array as PropType<Array<Option>>,
  },
  modelValue: {
    type: Object,
    default: {},
  },
  title: {
    required: true,
    type: String,
  },
  runFunction: {
    required: false,
    type: Function,
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
  optionTitle: {
    required: false,
    type: String,
    default: "name",
  },
  defaultOption: {
    required: false,
    type: String,
    default: "Select",
  },
  submitFunction: {
    required: false,
    type: Function,
    default: () => { },
  },
  withLabel: {
    required: false,
    type: Boolean,
    default: true,
  },
  withAfterLabel: {
    required: false,
    type: Boolean,
    default: false,
  },
  afterLabel: {
    required: false,
    type: String,
    default: "",
  },
  hasDefault: {
    required: false,
    type: Boolean,
    default: true,
  },
  currentId: {
    required: false,
    type: Number,
    default: 0,
  },
  selectedId: {
    required: false,
    type: Number,
    default: 0,
  },
});

const { name, error, modelValue, options, runFunction, submitFunction } = toRefs(props);
const submit = (_: any) => {
  submitFunction.value();
};
</script>
<template>
  <FormLabel :class="{ inline_label: formInline }" :htmlFor="name" v-if="withLabel">{{ title }}<b v-if="required"
      class="text-danger ml-1">*</b></FormLabel>
  <FormSelect :class="{ inline_input: formInline }" v-model="modelValue[name]" @keyup.enter="submit($event)" :id="name"
    @change="$emit('update:modelValue[{{name}}]', ($event.target as HTMLInputElement).value); runFunction ? runFunction(($event.target as HTMLInputElement).value) : ''">
    <option v-if="hasDefault" :value="null">{{ defaultOption }}</option>
    <option :value="option.id" v-for="option in options" :key="option.id">
      {{ option[`${optionTitle}` as ObjectKey] }}
    </option>
  </FormSelect>
  <FormLabel  :htmlFor="name"  v-if="withAfterLabel">{{ afterLabel }}</FormLabel>
  <Error :error="error" v-if="currentId == selectedId" :formInline="formInline" />
</template>
<style lang="postcss" scoped>
.inline_input {
  @apply flex items-center flex-1;
}

.inline_label {
  @apply inline-block text-left sm:mr-3;
}
</style>
