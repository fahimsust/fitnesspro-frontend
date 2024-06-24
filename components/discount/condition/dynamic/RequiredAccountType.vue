<script setup lang="ts">
import _ from "lodash";
import ConditionAccountType from "../list/ConditionAccountType.vue";


const { getDiscountCondition } = useDiscountCondition();
  const props = defineProps({
    condition: {
      required: true,
      type: Object
    }
  });
const { condition } = toRefs(props);
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
      <div class="col-span-12 mt-3">
        <ConditionAccountType :key="conditionKeyMain" :condition="conditionValue" :refresh="refreshSingle" />
      </div>
</template>