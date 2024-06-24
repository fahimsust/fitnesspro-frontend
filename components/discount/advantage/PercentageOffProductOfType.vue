<script setup lang="ts">
import _ from "lodash";
import { reactive } from "vue";
import { SelectField, InputField } from "~/components/form";
import AdvantageProductType from "./AdvantageProductType.vue";

const { errors, updateAdvantage, getAdvantage } = useDiscountAdvantage();
const props = defineProps({
  advantage: {
    required: true,
    type: Object
  },
});
const percentagesKey = ref(1)
const { advantage } = toRefs(props);
const keyPercentages = ref(percentagesKey.value.toString() + "-" + advantage.value.id.toString())
const advantageValue = ref(advantage.value)
const applyQtyType = [{ id: 0, name: 'Combined Qty of Assigned' }, { id: 1, name: 'Individual Qty of Each Assigned' }];
const refresh = async () => {
  const newAdvantageValue = await getAdvantage(advantage.value.id);
  advantageValue.value = newAdvantageValue.value;
}
let formEdit = reactive({
  applyto_qty_type: advantageValue.value.applyto_qty_type,
  applyto_qty_combined: advantageValue.value.applyto_qty_combined,
  amount: advantage.value.amount,
});
const updated = ref(false)
const validateAndUpdate = async () => {
  if (updated.value) {
    await updateAdvantage(formEdit, advantage.value.id);
    validationFocus(formEdit, errors);
    await refresh();
    updated.value = false
  }
};
watch(() => advantageValue.value, async (newVal) => {
  if (newVal) {
    percentagesKey.value += 1;
    keyPercentages.value = keyPercentages.value.toString() + "-" + advantage.value.id.toString()
  }
});
</script>

<template>
  <div class="col-span-12 intro-y md:col-span-4">
    <SelectField :hasDefault="false" :options="applyQtyType" name="applyto_qty_type" v-model="formEdit"
      :error="errors.applyto_qty_type" title="Apply Qty Type"
      :runFunction="() => { updated = true; validateAndUpdate() }" />
  </div>
  <div class="col-span-12 intro-y md:col-span-4" v-if="formEdit.applyto_qty_type == 0">
    <InputField :change="() => updated = true" type="number" :blur="validateAndUpdate" :submitFunction="validateAndUpdate"
      name="applyto_qty_combined" v-model="formEdit" :error="errors.applyto_qty_combined" title="Apply Qty" />
  </div>
  <div class="col-span-12 intro-y md:col-span-4">
    <InputField :change="() => updated = true" :blur="validateAndUpdate" :submitFunction="validateAndUpdate" name="amount"
      v-model="formEdit" :error="errors.amount" title="Percentage Off" />
  </div>
  <div class="col-span-12 mt-3">
    <AdvantageProductType :key="keyPercentages" :applyto_qty_type="formEdit.applyto_qty_type" :advantage="advantageValue"
      :refresh="refresh" />
  </div>
</template>