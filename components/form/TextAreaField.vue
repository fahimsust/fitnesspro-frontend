<script setup lang="ts">
import { toRefs } from "vue";
import { FormLabel, FormTextarea } from "~/components/enigma/base-components/Form";
import Error from "~/components/form/Error.vue";
defineProps({
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
  cols: {
    required: false,
    type: Number,
    default: 5
  },
  rows: {
    required: false,
    type: Number,
    default: 5
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
</script>
<template>
  <FormLabel :htmlFor="name">{{ title }}<b v-if="required" class="text-danger ml-1">*</b></FormLabel>
  <FormTextarea :id="name" :cols="cols" :rows="rows" v-model="modelValue[name]"
    @input="$emit('update:modelValue[{{name}}]', ($event.target as HTMLInputElement).value)" :placeholder="placeholder" />
  <Error :error="error" :formInline="formInline" />
</template>
