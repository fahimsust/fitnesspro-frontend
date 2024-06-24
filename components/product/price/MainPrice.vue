<script lang="ts" setup>
import PriceTable from "~/components/product/price/PriceTable.vue";
import Disclosure from "~/components/enigma/base-components/Headless/Disclosure";

const props = defineProps({
  priceList: {
    required: true,
    type: Object,
  },
  setValue: {
    required: true,
    type: Function,
  },
  refreshPrices: {
    required: true,
    type: Function,
  },
  setPrice: {
    required: true,
    type: Function,
  },
});
const { priceList, setValue, setPrice } = toRefs(props);
</script>
<template>
  <Disclosure.Group variant="boxed" v-if="priceList && priceList.default.length == 0">
    <PriceTable
      v-for="site in priceList.site"
      :key="site.id"
      :priceList="site.pricing"
      :setPrice="setPrice"
      :siteName="site.name"
      :setValue="setValue"
    />
  </Disclosure.Group>
  <Disclosure.Group variant="boxed" v-if="priceList && priceList.default.length > 0">
    <PriceTable
      :priceList="priceList.default"
      :setPrice="setPrice"
      siteName="Default Price"
      :setValue="setValue"
    />
    <PriceTable
      v-for="site in priceList.site"
      :priceList="site.pricing"
      :setPrice="setPrice"
      :siteName="site.name"
      :setValue="setValue"
    />
  </Disclosure.Group>
</template>
