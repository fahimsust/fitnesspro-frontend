<script lang="ts" setup>
import { toRefs, type PropType } from "vue";
import { FormCheck, FormLabel, FormSwitch } from "~/components/enigma/base-components/Form";
import Error from "~/components/form/Error.vue";
interface Option {
  id: any;
  title: string;
  price: number; // Added price fields
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
  <div>
    <label class="block text-gray-700 text-sm font-bold mb-2">
      {{ title }}<b v-if="required" class="text-red-500 ml-1">*</b>
    </label>
    <div class="grid grid-cols-4 gap-4 mb-4">
      <div v-for="option in options" :key="option.id" class="p-4 border border-gray-300 rounded-lg flex items-center">
        <FormCheck class="mr-2">
          <FormCheck.Input :id="`${name}-${option.id}`" type="radio" :name="name" :value="option.id"
            @change="$emit('update:modelValue[{{name}}]', ($event.target as HTMLInputElement).value)"
            v-model="modelValue[name]" />
          <FormCheck.Label htmlFor="radio-switch-4">
            {{ option.title }} - ${{ option.price }}/year
          </FormCheck.Label>
        </FormCheck>

      </div>
    </div>
    <Error :error="error" />
  </div>
</template>
