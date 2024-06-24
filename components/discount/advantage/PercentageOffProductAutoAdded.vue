<script setup lang="ts">
import _ from "lodash";
import { reactive } from "vue";
import { SelectField, InputField } from "~/components/form";
import AdvantageProduct from "./AdvantageProduct.vue";

const { errors, updateAdvantage, getAdvantage } = useDiscountAdvantage();
const props = defineProps({
  advantage: {
    required: true,
    type: Object
  },
});
const percentagesKey = ref(1)
const { advantage } = toRefs(props);
const keyPercentages = ref(percentagesKey.value.toString()+"-"+advantage.value.id.toString())
const advantageValue = ref(advantage.value)
const refresh = async () => {
  const newAdvantageValue = await getAdvantage(advantage.value.id);
  advantageValue.value = newAdvantageValue.value;
}
let formEdit = reactive({
  amount: advantage.value.amount,
});
const updated = ref(false)
const validateAndUpdate = async () => {
  if(updated.value)
  {
    await updateAdvantage(formEdit, advantage.value.id);
    validationFocus(formEdit, errors);
    await refresh();
    updated.value = false
  }
};
watch(() => advantageValue.value, async (newVal) => {
  if (newVal) {
    percentagesKey.value += 1;
    keyPercentages.value = keyPercentages.value.toString()+"-"+advantage.value.id.toString()
  }
});
</script>

<template>
  <div class="col-span-12 intro-y md:col-span-4">
    <InputField :change="()=>updated=true" :blur="validateAndUpdate" :submitFunction="validateAndUpdate" name="amount" v-model="formEdit" :error="errors.amount"
      title="Percentage Off" />
  </div>
  <div class="col-span-12 mt-3">
    <AdvantageProduct :key="keyPercentages" :advantage="advantageValue" :refresh="refresh" />
  </div>
</template>