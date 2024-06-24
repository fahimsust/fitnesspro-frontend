<script lang="ts" setup>
import Table from "~/components/enigma/base-components/Table";
import EditPrice from "~/components/product/price/EditPrice.vue";
import MainPrice from "~/components/product/price/MainPrice.vue";
import { Tab } from "~/components/enigma/base-components/Headless";
import Tabs from "~/components/tabs/Tabs.vue";
import { FormSelect } from "~/components/enigma/base-components/Form";
import { ref } from "vue";
import PriceRow from "~/components/product/price/PriceRow.vue";
const props = defineProps({
  modelValue: {
    required: true,
    type: Object,
  },
  popup: {
    required: false,
    type: Boolean,
    default: false,
  },
});
const product = ref(props.modelValue);
const popup = ref(props.popup);
const { getPrices, updatePrice, getChildPrices } = useProductPricing();
const { siteList } = useSite();
const price = ref({ id: 0 });

let priceList:any = ref([])
let sites:any = ref([])
let pricing:any = ref([])
let lastPage:any = ref(1)
let currentPage:any = ref(1)
const dataLoaded = ref(false)
const fetchData = async()=>{
  const result = await getChildPrices(product.value.id);
  pricing = result.pricing
  lastPage = result.lastPage
  currentPage = result.currentPage
  priceList = await getPrices(product.value.id);
  sites = await siteList();
  dataLoaded.value = true
}

const site_id = ref("");
const keyword = ref("");
const slideOver = ref(false);
const setPrice = (priceValue: any, value: boolean) => {
  price.value = priceValue;
  setSlideover(value);
};
const setSlideover = (value: boolean) => {
  slideOver.value = value;
};
const refreshPrices = async () => {
  await getPrices(product.value.id);
  await fetchList();
};
const fetchList = async () => {
  await getChildPrices(product.value.id, keyword.value, site_id.value);
};
const search = async () => {
  currentPage.value = 1;
  await getChildPrices(product.value.id, keyword.value, site_id.value);
};


const setValue = async (fieldName: string, value: any, priceObj: any) => {
  let form: any = reactive({
    site_id: priceObj.site_id,
    price_reg: priceObj.price_reg,
    price_sale: priceObj.price_sale,
    onsale: priceObj.onsale,
    min_qty: priceObj.min_qty,
    max_qty: priceObj.max_qty,
    pricing_rule_id: priceObj.pricing_rule_id,
    ordering_rule_id: priceObj.ordering_rule_id,
    feature: priceObj.feature,
  });
  if (fieldName == "onsale" || fieldName == "status") {
    form[fieldName] = !form[fieldName];
  }
  await updatePrice(form, priceObj.product_id);
  await refreshPrices();
};
const tabList = [
  { title: "Product", description: "Update Main Product Price", icon: "DollarSign" },
  { title: "Variants", description: "Update Variants Price", icon: "Settings" },
];
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
  <div class="col-span-12 intro-y" v-if="dataLoaded && pricing != undefined" :class="{ box: !popup, 'xl:mt-5': !popup }">
    <MainPrice class="p-4" v-if="product.parent_product != null ||
      (pricing.length == 0 && keyword == '' && site_id == '')
      " :priceList="priceList" :set-value="setValue" :set-price="setPrice" :refresh-prices="refreshPrices" />
    <Tab.Group class="intro-y box" v-if="product.parent_product == null &&
      (pricing.length > 0 || site_id != '' || keyword != '')
      ">
      <Tabs :tablist="tabList" />
      <Tab.Panels>
        <Tab.Panel class="p-5">
          <MainPrice  :set-price="setPrice" :refresh-prices="refreshPrices" :priceList="priceList" :set-value="setValue" />
        </Tab.Panel>
        <Tab.Panel class="p-5">
          <div class="flex flex-wrap items-center justify-between col-span-12 mt-5 intro-y sm:flex-nowrap">
            <div class="w-full px-5 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
              <div class="relative w-56 text-slate-500" >
                <FormSelect @change="search" v-model="site_id" class="mt-2">
                  <option key="0" value="">All Site</option>
                  <option :value="option.id" v-for="option in sites" :key="option.id">
                    {{ option.name }}
                  </option>
                </FormSelect>
              </div>
            </div>
            <div class="w-full px-5 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
              <div class="relative w-56 text-slate-500">
                <EnterSearch v-model="keyword" :searchByKeyword="search" />
              </div>
            </div>
          </div>

          <div class="px-5 mt-2 intro-y box xl:mt-4 overflow-x-auto">
            <Table class="-mt-2 hover">
              <Table.Thead variant="dark" class="text-xs">
                <Table.Tr>
                  <Table.Th class="whitespace-nowrap pt-5">Site</Table.Th>
                  <Table.Th class="whitespace-nowrap pt-5">REGULAR PRICE</Table.Th>
                  <Table.Th class="whitespace-nowrap pt-5">SALE PRICE</Table.Th>
                  <Table.Th class="whitespace-nowrap pt-5">ON SALE</Table.Th>
                  <Table.Th class="whitespace-nowrap pt-5">PUBLISH</Table.Th>
                  <Table.Th class="whitespace-nowrap pt-5"></Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody class="py-0">
                <Table.Tr v-if="!dataLoaded" class="intro-x">
                  <Table.Td colspan="6" class="py-0 px-0">
                    <TableLoading />
                  </Table.Td>
                </Table.Tr>
                <Table.Tr v-if="pricing.length == 0 && dataLoaded" class="intro-x">
                  <Table.Td colspan="6" class="py-0 px-0">
                    <AlertGray />
                  </Table.Td>
                </Table.Tr>
                <PriceRow v-for="price in pricing" :key="price.id" :price="price" :set-value="setValue"
                  :set-price="setPrice" />
              </Table.Tbody>
            </Table>
          </div>
          <PaginationModal class="mb-5 mt-5" v-if="dataLoaded" v-model="currentPage" :getList="fetchList" :numberOfPages="lastPage" />
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  </div>
  <edit-price :key="price.id" :refreshPrices="refreshPrices" :slideover="slideOver" :setSlideover="setSlideover"
    v-model="price" />
</template>
<style lang="postcss" scoped>
.input_class {
  @apply disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:bg-darkmode-800/50 dark:disabled:border-transparent [&[readonly]]:bg-slate-100 [&[readonly]]:cursor-not-allowed [&[readonly]]:dark:bg-darkmode-800/50 [&[readonly]]:dark:border-transparent transition duration-200 ease-in-out w-full text-sm border-slate-200 shadow-sm rounded-md placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary focus:border-opacity-40 dark:bg-darkmode-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:placeholder:text-slate-500/80 flex-1;
}
</style>
