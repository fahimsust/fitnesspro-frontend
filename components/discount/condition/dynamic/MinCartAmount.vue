<script setup lang="ts">
import _ from "lodash";
import { reactive } from "vue";
import { InputField } from "~/components/form";


const {errors, updateDiscountCondition, getDiscountCondition } = useDiscountCondition();
  const props = defineProps({
    condition: {
      required: true,
      type: Object
    }
  });
const { condition } = toRefs(props);
const conditionValue = ref(condition.value)
const refreshSingle = async()=>{
  const newRuleValue = await getDiscountCondition(condition.value.id);
  conditionValue.value = newRuleValue.value;
}
let formEdit = reactive({
  required_cart_value: condition.value.required_cart_value,
});
const updated = ref(false)
const validateAndUpdate = async () => {
  if(updated.value)
  {
    await updateDiscountCondition(formEdit,condition.value.id);
    validationFocus(formEdit, errors);
    await refreshSingle();
    updated.value = false
  }
};
</script>

<template>
      <div  class="col-span-12 intro-y md:col-span-3">
        <InputField :change="()=>updated=true" :blur="validateAndUpdate" :submitFunction="validateAndUpdate" name="required_cart_value" v-model="formEdit" :error="errors.required_cart_value"
          title="Minimum Amount"  />
      </div>
</template>