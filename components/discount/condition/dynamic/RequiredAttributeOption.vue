<script setup lang="ts">
import _ from "lodash";
import ConditionAttribute from "../list/ConditionAttribute.vue";
import CommonWidget from "../common/CommonWidget.vue";

const props = defineProps({
  condition: {
    required: true,
    type: Object
  }
});
const { condition } = toRefs(props);
const dynamicComponent = shallowRef(ConditionAttribute)
</script>

<template>
      <CommonWidget :condition="condition" :dynamicComponent="dynamicComponent" />
</template>