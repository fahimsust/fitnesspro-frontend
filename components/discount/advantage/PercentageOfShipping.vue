<script setup lang="ts">
import _ from "lodash";
import { reactive } from "vue";
import { SelectField, InputField } from "~/components/form";

const { errors, updateAdvantage, getAdvantage } = useDiscountAdvantage();
const props = defineProps({
  advantage: {
    required: true,
    type: Object,
  },
});
const { advantage } = toRefs(props);
const { countryList } = useAddresses();
const { shippingMethods } = useShippingMethod();
const { distributors } = useProducts();
let distributorList: any = ref([])
let countries: any = ref([])
let shippingMethodList: any = ref([])
let formEdit = reactive({
  apply_shipping_id: advantage.value.apply_shipping_id,
  apply_shipping_country: advantage.value.apply_shipping_country,
  apply_shipping_distributor: advantage.value.apply_shipping_distributor,
  amount: advantage.value.amount,
});
const updated = ref(false);
const validateAndUpdate = async () => {
  if (updated.value) {
    await updateAdvantage(formEdit, advantage.value.id);
    validationFocus(formEdit, errors);
    await getAdvantage(advantage.value.id);
    updated.value = false;
  }
};
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  distributorList = await distributors()
  countries = await countryList();
  shippingMethodList = await shippingMethods();
  dataLoaded.value = true
});
</script>

<template>
  <div v-if="!dataLoaded">
    <div class="rounded-lg box intro-y mt-3">
      <TableLoading />
    </div>
  </div>
  <div class="col-span-12 intro-y md:col-span-3" v-if="dataLoaded">
    <SelectField defaultOption="All" :options="shippingMethodList" name="apply_shipping_id" v-model="formEdit"
      :error="errors.apply_shipping_id" title="Shipping Methods" :runFunction="() => {
        updated = true;
        validateAndUpdate();
      }
        " />
  </div>
  <div class="col-span-12 intro-y md:col-span-3" v-if="dataLoaded">
    <SelectField defaultOption="Any" :options="countries" name="apply_shipping_country" v-model="formEdit"
      :error="errors.apply_shipping_country" title="Ship to Country" :runFunction="() => {
        updated = true;
        validateAndUpdate();
      }
        " />
  </div>
  <div class="col-span-12 intro-y md:col-span-3" v-if="dataLoaded">
    <SelectField defaultOption="Any" :options="distributorList" name="apply_shipping_distributor" v-model="formEdit"
      :error="errors.apply_shipping_distributor" title="Fulfillment Distributor" :runFunction="() => {
        updated = true;
        validateAndUpdate();
      }
        " />
  </div>
  <div class="col-span-12 intro-y md:col-span-3" v-if="dataLoaded">
    <InputField :change="() => (updated = true)" :blur="validateAndUpdate" :submitFunction="validateAndUpdate"
      name="amount" v-model="formEdit" :error="errors.amount" title="Percentage Off" />
  </div>
</template>
