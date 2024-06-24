<script setup lang="ts">
import { ref } from "vue";
import Lucide from "~/components/enigma/base-components/Lucide";
const props = defineProps({
  modelValue: {
    required: true,
    type: Number,
  },
});
const emit = defineEmits(["update:modelValue"]);
const hoverReview = ref(0);
const hoverOut = () => {
  hoverReview.value = 0;
};
const localValue = ref(props.modelValue);
watch(localValue, () => {
  emit("update:modelValue", localValue.value);
});
const setStar = (value: number) => {
  localValue.value = value;
};
const setHover = (value: number) => {
  hoverReview.value = value;
};
const getClassBooloean = (value: number): boolean => {
  if (hoverReview.value > 0) {
    if (hoverReview.value >= value) {
      return true;
    } else {
      return false;
    }
  } else {
    if (localValue.value >= value) {
      return true;
    } else {
      return false;
    }
  }
};
const getFill = (value: number): string => {
  if (hoverReview.value > 0) {
    if (hoverReview.value >= value) {
      return "orange";
    } else {
      return "transparent";
    }
  } else {
    if (localValue.value >= value) {
      return "orange";
    } else {
      return "transparent";
    }
  }
};
</script>
<template>
  <div class="flex cursor-pointer" @mouseleave="hoverOut">
    <Lucide
      icon="Star"
      class="w-5 h-5 mr-2 font-bold"
      :fill="getFill(1)"
      @click="setStar(1)"
      @mouseover="setHover(1)"
      :class="{ 'text-orange-400': getClassBooloean(1) }"
    />
    <Lucide
      icon="Star"
      class="w-5 h-5 mr-2 font-bold"
      @click="setStar(2)"
      :fill="getFill(2)"
      @mouseover="setHover(2)"
      :class="{ 'text-orange-400': getClassBooloean(2) }"
    />
    <Lucide
      icon="Star"
      class="w-5 h-5 mr-2 font-bold"
      @click="setStar(3)"
      :fill="getFill(3)"
      @mouseover="setHover(3)"
      :class="{ 'text-orange-400': getClassBooloean(3) }"
    />
    <Lucide
      icon="Star"
      class="w-5 h-5 mr-2 font-bold"
      @click="setStar(4)"
      :fill="getFill(4)"
      @mouseover="setHover(4)"
      :class="{ 'text-orange-400': getClassBooloean(4) }"
    />
    <Lucide
      icon="Star"
      class="w-5 h-5 mr-2 font-bold"
      @click="setStar(5)"
      :fill="getFill(5)"
      @mouseover="setHover(5)"
      :class="{ 'text-orange-400': getClassBooloean(5) }"
    />
  </div>
</template>
