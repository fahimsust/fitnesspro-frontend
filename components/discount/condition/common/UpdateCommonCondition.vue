<script setup lang="ts">
import _ from "lodash";
import { reactive } from "vue";
import { InputField, SelectField } from "~/components/form";


const { errors, updateDiscountCondition, getDiscountCondition } = useDiscountCondition();
const props = defineProps({
  condition: {
    required: true,
    type: Object
  },
  refreshSingle: {
    required: true,
    type: Function
  }
});
const { condition, refreshSingle } = toRefs(props);

const applyQtyType = [{ id: false, name: 'Combined Qty of Assigned' }, { id: true, name: 'Individual Qty of Each Assigned' }];
const conditionEquals = [{ id: 0, name: 'Equals' }, { id: 1, name: 'Does Not Equals' }];
let formEdit = reactive({
  required_qty_combined: condition.value.required_qty_combined,
  required_qty_type: condition.value.required_qty_type,
  equals_notequals: condition.value.equals_notequals ? condition.value.equals_notequals : 0,
});
const updated = ref(false)
const validateAndUpdate = async () => {
  if (updated.value) {
    await updateDiscountCondition(formEdit, condition.value.id);
    validationFocus(formEdit, errors);
    await refreshSingle.value();
    updated.value = false
  }
};

</script>

<template>
  <div class="col-span-12 intro-y md:col-span-4">
    <SelectField :hasDefault="false" :options="applyQtyType" name="required_qty_type" v-model="formEdit"
      :error="errors.required_qty_type" title="Required Qty Type"
      :runFunction="() => { updated = true; validateAndUpdate() }" />
  </div>
  <div class="col-span-12 intro-y md:col-span-4" v-if="formEdit.required_qty_type == 0">
    <InputField :change="() => updated = true" type="number" :blur="validateAndUpdate" :submitFunction="validateAndUpdate"
      name="required_qty_combined" v-model="formEdit" :error="errors.condition_required_qty_combined"
      title="Required Qty" />
  </div>
  <div class="col-span-12 intro-y md:col-span-4">
    <SelectField :hasDefault="false" :options="conditionEquals" name="equals_notequals" v-model="formEdit"
      :error="errors.equals_notequals" title="Condition" :runFunction="() => { updated = true; validateAndUpdate() }" />
  </div>
</template>