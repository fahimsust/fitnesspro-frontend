<script setup lang="ts">
import { toRefs } from "vue";
import Lucide from "~/components/enigma/base-components/Lucide";
import { Slideover } from "~/components/enigma/base-components/Headless";
import {
  InputField,
  SubmitButton,
  CancelButton,
  TomSelectField,
} from "~/components/form";
const props = defineProps({
  setSlideover: {
    required: true,
    type: Function,
  },
  slideover: {
    required: true,
    type: Boolean,
  },
  modelValue: {
    required: true,
    type: Object,
  },
  refreshPrices: {
    required: true,
    type: Function,
  },
});
const emit = defineEmits(["update:modelValue"]);
const {
  getOrderingRules,
  getPricingRules,
  updatePrice,
  getPrice,
  errors,
  loading,
} = useProductPricing();

const { setSlideover, slideover, modelValue: priceModel, refreshPrices } = toRefs(props);
let price = priceModel;

let orderingRules = ref([]);
let pricingRules = ref([]);

let form = reactive({
  site_id: price.value.site_id,
  price_reg: price.value.price_reg,
  price_sale: price.value.price_sale,
  onsale: price.value.onsale,
  min_qty: price.value.min_qty,
  max_qty: price.value.max_qty,
  pricing_rule_id:
    price.value.pricing_rule_id == null ? "" : String(price.value.pricing_rule_id),
  ordering_rule_id:
    price.value.ordering_rule_id == null ? "" : String(price.value.ordering_rule_id),
  feature: price.value.feature,
});

const priceValidationAndEdit = async () => {
  const newPrice = await updatePrice(form, price.value.product_id);
  await refreshPrices.value();
  validationFocus(form, errors);
  if (Object.keys(errors).length == 0) {
    emit("update:modelValue", newPrice);
    setSlideover.value(false);
  }
};
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  if (price.value.id > 0)
    price = await getPrice(priceModel.value.id, priceModel.value.product_id);

  orderingRules = await getOrderingRules();
  pricingRules = await getPricingRules();
  form = reactive({
    site_id: price.value.site_id,
    price_reg: price.value.price_reg,
    price_sale: price.value.price_sale,
    onsale: price.value.onsale,
    min_qty: price.value.min_qty,
    max_qty: price.value.max_qty,
    pricing_rule_id:
      price.value.pricing_rule_id == null ? "" : String(price.value.pricing_rule_id),
    ordering_rule_id:
      price.value.ordering_rule_id == null ? "" : String(price.value.ordering_rule_id),
    feature: price.value.feature,
  });
  dataLoaded.value = true
})
</script>
<template>
  <Slideover backdrop="static" :open="slideover" @close="() => {
    setSlideover(false);
  }
    ">
    <Slideover.Panel>
      <a @click="(event) => {
        event.preventDefault();
        setSlideover(false);
      }
        " v-if="price.id > 0" class="absolute top-3 right-4" href="#">
        <Lucide icon="X" class="w-8 h-8" />
      </a>
      <Slideover.Title>
        <h2 class="mr-auto text-base font-medium">Edit Price Setting</h2>
      </Slideover.Title>

      <Slideover.Description>
        <div class="mt-3">
          <InputField name="min_qty" :submit-function="priceValidationAndEdit" type="number" v-model="form"
            :error="errors.min_qty" title="Min Quantity" />
        </div>
        <div class="mt-3">
          <InputField name="max_qty" :submit-function="priceValidationAndEdit" type="number" v-model="form"
            :error="errors.max_qty" title="Max Quantity" />
        </div>

        <div class="mt-3" v-id="dataLoaded">
          <TomSelectField :options="pricingRules" name="pricing_rule_id" v-model="form" :error="errors.pricing_rule_id"
            title="Volume Pricing Rule" />
        </div>
        <div class="mt-3" v-id="dataLoaded">
          <TomSelectField :options="orderingRules" name="ordering_rule_id" v-model="form"
            :error="errors.ordering_rule_id" title="Ordering Rule" />
        </div>
      </Slideover.Description>
      <Slideover.Footer>
        <CancelButton :cancelFunction="setSlideover" />
        <SubmitButton :createFunction="priceValidationAndEdit" :loading="loading" />
      </Slideover.Footer>
    </Slideover.Panel>
  </Slideover>
</template>
