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
  }
});
const keyProducts = ref(1)
const { advantage } = toRefs(props);
const keyAdvantage = ref(keyProducts.value.toString() + "-" + advantage.value.id.toString())
const advantageValue = ref(advantage.value)
const refresh = async () => {
  const newAdvantageValue = await getAdvantage(advantage.value.id);
  advantageValue.value = newAdvantageValue.value;
}
watch(() => advantageValue.value, async (newVal) => {
  if (newVal) {
    keyProducts.value += 1;
    keyAdvantage.value = keyProducts.value.toString() + "-" + advantage.value.id.toString()
  }
});
</script>

<template>
  <div class="col-span-12 mt-3">
    <AdvantageProduct :key="keyAdvantage" :applyto_qty_type="1" :advantage="advantageValue" :refresh="refresh" />
  </div>
</template>