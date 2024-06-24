<script lang="ts" setup>
import { toRefs, type PropType } from "vue";
import { FormCheck, FormLabel, FormSwitch } from "~/components/enigma/base-components/Form";
import Error from "~/components/form/Error.vue";
interface Option {
  value: any;
  title: string;
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

  required: {
    required: false,
    type: Boolean,
    default: false,
  },
});

const { name, error, modelValue } = toRefs(props);
</script>
<template>
  <label>{{ title }}<b v-if="required" class="text-danger ml-1">*</b></label>
  <div class="flex flex-col mt-2 sm:flex-row">
    <div  :class="option.value > 1?'mr-4 mt-2 sm:mt-0':'mr-4'" v-for="option in options" :key="option.value">
      <input 
        :value="option.value" 
        :name="name" 
        type="radio" 
        class="mr-2"
        v-model="modelValue[name]"
        @change="$emit('update:modelValue[{{name}}]', ($event.target as HTMLInputElement).value)"
      />
      <label class="mt-1">{{ option.title }}</label>
    </div>
  </div>
  <Error :error="error" />
</template>
