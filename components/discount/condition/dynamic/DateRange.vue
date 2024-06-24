<script setup lang="ts">
import _ from "lodash";
import { reactive } from "vue";
import { SubmitButton } from "~/components/form";
import DatePickerField from "~/components/form/DatePickerField.vue";


const { errors, updateDiscountCondition, getDiscountCondition, loading } = useDiscountCondition();
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
  start_date: condition.value.start_date,
  end_date: condition.value.end_date,
});
const validateAndUpdate = async () => {
  await updateDiscountCondition(formEdit, condition.value.id);
  validationFocus(formEdit, errors);
  await refreshSingle();
};
</script>

<template>
  <div class="col-span-12 mt-3 intro-y md:col-span-6">
    <DatePickerField name="start_date" v-model="formEdit" :required="true" :error="errors.start_date"
      title="Start Date" />
  </div>
  <div class="col-span-12  mt-3  intro-y md:col-span-6">
    <DatePickerField name="end_date" v-model="formEdit" :required="true" :error="errors.end_date" title="End Date" />
  </div>
  <div class="col-span-12 intro-y md:col-span-3">
    <SubmitButton :createFunction="validateAndUpdate" :loading="loading" />
  </div>
</template>