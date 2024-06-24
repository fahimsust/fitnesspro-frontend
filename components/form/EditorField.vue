<script setup lang="ts">
import { toRefs, computed } from "vue";
import { FormLabel } from "~/components/enigma/base-components/Form";
import { ClassicEditor } from "~/components/enigma/base-components/Ckeditor";
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
  minHeight: {
    required: false,
    type: String,
    default: "250px",
  },
  placeholder: {
    required: false,
    type: String,
    default: "",
  },
});

const { name, error, modelValue, minHeight, placeholder } = toRefs(props);
const cssVars = computed(() => {
  return {
    "--min-height": minHeight.value,
  };
});
</script>
<template>
  <FormLabel class="xl:w-40 xl:!mr-10 flex">
    <div class="text-left">
      <div class="flex items-center">
        <div class="font-medium">
          {{ title }}<b v-if="required" class="text-danger ml-1">*</b>
        </div>
      </div>
    </div>
  </FormLabel>
  <client-only placeholder="Loading...">
    <div :style="cssVars" class="flex-1 w-full mt-3 xl:mt-0">
      <ClassicEditor :id="name"
        v-model="modelValue[name]" @input="$emit('update:modelValue[{{name}}]', $event.target.value)" />
    </div>
  </client-only>
  <Error :error="error" />
</template>
<style lang="postcss" scoped>
.inline_input {
  @apply flex items-center flex-1
}

.inline_label {
  @apply inline-block text-left sm:mr-2
}
</style>
<style>
.ck .ck .ck-content {
  min-height: var(--min-height);
}
</style>
