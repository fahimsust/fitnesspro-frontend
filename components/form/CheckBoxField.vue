<script lang="ts" setup>
import { toRefs } from "vue";
import { FormLabel, FormSwitch } from "~/components/enigma/base-components/Form";
import Error from "~/components/form/Error.vue";
interface Option {
  id: string;
  name: string;
}
const props = defineProps({
  error: {
    required: false,
    type: String,
  },
  name: {
    required: true,
    type: String,
  },
  submitFunction: {
    required: false,
    type: Function,
    default: () => { },
  },
  modelValue: {
    type: Object,
    default: {},
  },
  title: {
    required: true,
    type: String,
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
});

const { name, error, modelValue, submitFunction } = toRefs(props);
const submit = (_: any) => {
  submitFunction.value();
};
</script>
<template>
  <FormLabel :class="{ inline_label: formInline }">{{ title }}<b v-if="required" class="text-danger ml-1">*</b>
  </FormLabel>
  <FormSwitch>
    <FormSwitch.Input type="checkbox" :id="name" v-model="modelValue[name]" @change="submit"
      @click="$emit('update:modelValue[{{name}}]', ($event.target as HTMLInputElement).value)" />
  </FormSwitch>
  <Error :error="error" />
</template>
<style lang="postcss" scoped>
.inline_input {
  @apply flex items-center flex-1;
}

.inline_label {
  @apply inline-block text-left sm:mr-3;
}
</style>
