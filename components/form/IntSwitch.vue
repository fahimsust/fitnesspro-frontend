<script lang="ts" setup>
import { toRefs, ref } from "vue";
import { FormSwitch } from "~/components/enigma/base-components/Form";
const props = defineProps({
  changeStatus: {
    required: true,
    type: Function,
  },
  modelValue: {
    type: Number,
    default: 1,
  },
  cat_id: {
    type: Number,
    default: 1,
  },
});

const { changeStatus, modelValue } = toRefs(props);
const localValue = ref(modelValue.value == 1 ? true : false);
</script>
<template>
  <FormSwitch.Input type="checkbox" v-model="localValue" @click="(event: any) => {
    event.preventDefault();
    changeStatus(!localValue, cat_id);
    event.stopPropagation();
  }
    " />
</template>
