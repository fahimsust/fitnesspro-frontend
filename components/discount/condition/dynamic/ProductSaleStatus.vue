<script setup lang="ts">
import _ from "lodash";
import { reactive } from "vue";
import { CheckBoxField } from "~/components/form";

const { errors, updateDiscountCondition, getDiscountCondition } = useDiscountCondition();
const props = defineProps({
  condition: {
    required: true,
    type: Object
  }
});
const { condition } = toRefs(props);
const conditionValue = ref(condition.value)
const refreshSingle = async () => {
  const newRuleValue = await getDiscountCondition(condition.value.id);
  conditionValue.value = newRuleValue.value;
}
let formEdit = reactive({
  use_with_rules_products: condition.value.use_with_rules_products,
});
const validateAndUpdate = async () => {
  await updateDiscountCondition(formEdit, condition.value.id);
  validationFocus(formEdit, errors);
  await refreshSingle();
};
</script>

<template>
  <div class="col-span-12 intro-y md:col-span-12">
    <CheckBoxField :submitFunction="validateAndUpdate" name="use_with_rules_products" v-model="formEdit"
      :error="errors.use_with_rules_products" title="Match with Rule's Products/Product Types Only" />
  </div>
</template>