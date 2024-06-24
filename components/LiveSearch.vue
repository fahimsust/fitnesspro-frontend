<script setup lang="ts">
import { ref, toRefs } from "vue";
import Lucide from "~/components/enigma/base-components/Lucide";
import { FormInput } from "~/components/enigma/base-components/Form";
const props = defineProps({
  searchByKeyword: {
    required: true,
    type: Function,
  },
  modelValue: {
    required: true,
    type: String,
  },
  placeholder: {
    required: false,
    type: String,
    default: "Search...",
  },
});
const showCross = ref(false);
const localSearch = async ($event: any) => {
  if (localValue.value) {
    showCross.value = true;
  }
  emit("update:modelValue", localValue.value);
  await searchByKeyword.value($event);
  localValue.value = "";
};
const crossClick = async () => {
  const event = { target: { value: "" } };
  showCross.value = false;
  localValue.value = "";
  emit("update:modelValue", localValue.value);
  await searchByKeyword.value(event);
};
const processSearch = debounce(localSearch);

const searchByKeyword = ref(props.searchByKeyword);
const localValue = ref(props.modelValue);
const emit = defineEmits(["update:modelValue"]);
if (localValue.value != "") {
  showCross.value = true;
}
</script>
<template>
  <FormInput
    type="text"
    v-model="localValue"
    @keyup="processSearch($event)"
    class="w-56 pr-10 pl-8"
    :placeholder="placeholder"
  />
  <Lucide
    v-if="showCross"
    @click="crossClick"
    icon="X"
    class="absolute cursor-pointer font-bold inset-y-0 right-0 w-4 h-4 my-auto mr-3"
  />
  <Lucide icon="Search" class="absolute inset-y-0 left-2 w-4 h-4 my-auto mr-3" />
</template>
