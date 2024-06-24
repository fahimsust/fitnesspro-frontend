<script setup>
import _ from "lodash";
import { reactive } from "vue";

import { FormInline } from "~/components/enigma/base-components/Form";
import { InputField, SubmitButton, SelectField, CheckBoxField } from "~/components/form";
const emit = defineEmits(["update:modelValue"]);

const {
  updateInventory,
  errors,
  loading,
  distributors,
  availabilities,
  fulfillmentrules,
} = useProducts();
const props = defineProps({
  modelValue: {
    required: true,
    type: Object,
  },
});
const product = ref(props.modelValue);

let distributorList = ref([]);
let availabilityList = ref([]);
let fulfillmentruleList = ref([]);
const dataLoaded = ref(false)
const fetchData = async()=>{
  distributorList = await distributors();
  availabilityList = await availabilities();
  fulfillmentruleList = await fulfillmentrules();
  dataLoaded.value = true
}
let form = reactive({
  default_outofstockstatus_id: product.value.default_outofstockstatus_id,
  default_distributor_id: product.value.default_distributor_id,
  default_cost: product.value.default_cost,
  fulfillment_rule_id: product.value.fulfillment_rule_id,
  inventoried: product.value.inventoried,
});
const validateAndCreate = async () => {
  const updatedProduct = await updateInventory(form, product.value.id);
  validationFocus(form, errors);
  if (updatedProduct != null) emit("update:modelValue", updatedProduct);
};
onMounted(async()=>{
  await nextTick();
  await fetchData();
})
</script>

<template>
  <div v-if="!dataLoaded">
    <div class="rounded-lg box intro-y mt-3">
      <TableLoading />
    </div>
  </div>
  <div class="mt-3" v-if="dataLoaded">
    <FormInline class="mt-5 first:mt-0 flex-wrap">
      <SelectField
        :options="availabilityList"
        :submit-function="validateAndCreate"
        name="default_outofstockstatus_id"
        v-model="form"
        :error="errors.default_outofstockstatus_id"
        title="Out of Stock Status"
        :formInline="true"
        :defaultOption="product.parent_product != null ? 'Use Parent' : 'Select'"
      />
    </FormInline>
    <FormInline class="mt-5 first:mt-0 flex-wrap">
      <SelectField
        :options="distributorList"
        :submit-function="validateAndCreate"
        name="default_distributor_id"
        v-model="form"
        :error="errors.default_distributor_id"
        title="Default Distributor"
        :formInline="true"
        :defaultOption="product.parent_product != null ? 'Use Parent' : 'Select'"
      />
    </FormInline>
    <FormInline class="mt-5 first:mt-0 flex-wrap">
      <SelectField
        :options="fulfillmentruleList"
        :submit-function="validateAndCreate"
        name="fulfillment_rule_id"
        v-model="form"
        :error="errors.fulfillment_rule_id"
        title="Fulfillment Rule"
        :formInline="true"
        :defaultOption="product.parent_product != null ? 'Use Parent' : 'Select'"
      />
    </FormInline>
    <FormInline class="mt-5 first:mt-0 flex-wrap">
      <InputField
        name="default_cost"
        :submit-function="validateAndCreate"
        type="number"
        v-model="form"
        :error="errors.default_cost"
        title="Default Cost"
        :formInline="true"
      />
    </FormInline>
    <FormInline class="mt-5 first:mt-0 flex-wrap">
      <check-box-field
        name="inventoried"
        v-model="form"
        :error="errors.inventoried"
        title="Inventoried"
        :formInline="true"
      />
    </FormInline>

    <div class="mt-5 text-right">
      <SubmitButton :createFunction="validateAndCreate" :loading="loading" />
    </div>
  </div>
</template>
