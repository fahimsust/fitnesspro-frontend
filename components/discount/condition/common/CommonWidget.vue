<script setup lang="ts">
import _ from "lodash";
import UpdateCommonCondition from "./UpdateCommonCondition.vue";


const {getDiscountCondition } = useDiscountCondition();
  const props = defineProps({
    condition: {
      required: true,
      type: Object
    },
    dynamicComponent: {
        type: Object,
        required: true
    },
  });
const { condition,dynamicComponent } = toRefs(props);
const conditionValue = ref(condition.value)
const conditionKey = ref(1)
const conditionKeyMain = ref(conditionKey.value.toString()+"-"+condition.value.id.toString())
const refreshSingle = async()=>{
  const newRuleValue = await getDiscountCondition(condition.value.id);
  conditionValue.value = newRuleValue.value;
}
watch(() => conditionValue.value, async (newVal) => {
  if (newVal) {
    conditionKey.value += 1;
    conditionKeyMain.value = conditionKey.value.toString()+"-"+condition.value.id.toString()
  }
});

</script>

<template>
      <UpdateCommonCondition :condition="conditionValue" :refreshSingle="refreshSingle" />
      <div class="col-span-12 mt-1">
        <component :is="dynamicComponent" :key="conditionKeyMain" :condition="conditionValue" :refresh="refreshSingle" />
      </div>
</template>