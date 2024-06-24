<script setup lang="ts">
import _ from "lodash";
import Button from "~/components/enigma/base-components/Button";
import {
  FormSelect,
  FormLabel,
} from "~/components/enigma/base-components/Form";
import '@vuepic/vue-datepicker/dist/main.css'
import Datepicker from '@vuepic/vue-datepicker';
import Lucide from "~/components/enigma/base-components/Lucide";
import { Popover } from "~/components/enigma/base-components/Headless";
import Table from "~/components/enigma/base-components/Table";
import { useCustomers } from "~~/composables/account/useCustomers";
import {
  FormInput,
} from "~/components/enigma/base-components/Form";
import { type Ref } from "vue";
import SortableTableHeader from "~/components/SortableTableHeader.vue";
import { useQueryParamStore } from "~/store/enigma/query-param";

definePageMeta({
  middleware: ["auth"],
  layout: "simple-menu-new",
});

useHead({
  title: "Orders: " + useRuntimeConfig().public.company,
});
const router = useRouter();
const queryParam = useQueryParamStore().queryParam
if (queryParam && queryParam.order_actives) {
  await router.push({ path: `/order/actives`, query: queryParam.order_actives });
}
useQueryParamStore().setQueryParam({})
const route = useRoute();
const editLink = (id: Number) => {
  const currentQuery = { order_actives: { ...route.query } };
  if (route.query) {
    useQueryParamStore().setQueryParam(currentQuery)
  }
  router.push("/order/actives/" + id);
};

const {
  list,
  orderStatuses,
  shipmentStatuses,
  resetPage
} = useCompletedOrders();

const {
  types
} = useProducts();

const {
  countryList,
  stateList
} = useAddresses();

const {
  getPaymentMethods
} = usePaymentMethod();

const {
  shippingMethods
} = useShippingMethod();

const {
  distributors
} = useProducts();

const dataLoaded = ref(false)
let orders: any = ref([]);
let lastPage: any = ref(1);
let currentPage: any = ref(1);
let keyword: any = ref('');
let order_no: any = ref('');
let start_date: any = ref('');
let end_date: any = ref('');
let start_date_travel: any = ref('');
let end_date_travel: any = ref('');
let status_id: any = ref(0);
let country_id: any = ref(0);
let distributor_id: any = ref(0);
let state_id: any = ref(0);
let payment_method_id: any = ref(0);
let shipping_method_id: any = ref(0);
let product_type_id: any = ref(0);
let orderBy: any = ref('');
let orderType: any = ref('');

const refsMap: { [key: string]: Ref<string | number> } = {
  order_no,
  start_date,
  end_date,
  start_date_travel,
  end_date_travel,
  status_id,
  country_id,
  distributor_id,
  state_id,
  payment_method_id,
  shipping_method_id,
  product_type_id,
};

let statusList: any = ref([]);
let countries: any = ref([]);
let paymentMethods: any = ref([]);
let shippingMethodList: any = ref([]);
let distributorList: any = ref([]);
let productTypes: any = ref([]);
let states: any = ref([]);

const fetchData = async () => {
  const result = await list();
  orders = result.orders;
  lastPage = result.lastPage;
  currentPage = result.currentPage;
  keyword = result.keyword;
  order_no = result.order_no;
  start_date = result.start_date;
  end_date = result.end_date;
  start_date_travel = result.start_date_travel;
  end_date_travel = result.end_date_travel;
  status_id = result.status_id;
  country_id = result.country_id;
  distributor_id = result.distributor_id;
  state_id = result.state_id;
  payment_method_id = result.payment_method_id;
  shipping_method_id = result.shipping_method_id;
  product_type_id = result.product_type_id;
  orderBy = result.orderBy;
  orderType = result.orderType;
  dataLoaded.value = true
}

const fetchList = async () => {
  resetPage();
  await fetchData()
};

const getStates = async (id: string) => {
  const countryStatus = await stateList(parseInt(id));
  states.value = countryStatus.value;
  state_id.value = 0;
};

const searchByKeyword = async (value: any) => {
  createNewPathAndPush('keyword', value, true);
  await fetchList();
};

const updateField = async (event: Event, fieldName: string) => {
  const target = event.target as HTMLInputElement;
  if (refsMap[fieldName]) {
    refsMap[fieldName].value = target.value;
    if (fieldName === 'country_id') {
      await getStates(target.value);
    }
  }
};

const formatDateForMySQL = (date: string | null): string | null => {
  if (!date) return null;
  const formattedDate = new Date(date).toISOString().split('T')[0];
  return formattedDate;
};

const handleSearch = async () => {
  const searchOption = [];
  if (order_no.value) searchOption.push({ name: 'order_no', value: order_no.value });
  if (start_date.value) searchOption.push({ name: 'start_date', value: formatDateForMySQL(start_date.value) });
  if (end_date.value) searchOption.push({ name: 'end_date', value: formatDateForMySQL(end_date.value) });
  if (start_date_travel.value) searchOption.push({ name: 'start_date_travel', value: formatDateForMySQL(start_date_travel.value) });
  if (end_date_travel.value) searchOption.push({ name: 'end_date_travel', value: formatDateForMySQL(end_date_travel.value) });
  if (status_id.value) searchOption.push({ name: 'status_id', value: status_id.value });
  if (country_id.value) searchOption.push({ name: 'country_id', value: country_id.value });
  if (state_id.value) searchOption.push({ name: 'state_id', value: state_id.value });
  if (distributor_id.value) searchOption.push({ name: 'distributor_id', value: distributor_id.value });
  if (payment_method_id.value) searchOption.push({ name: 'payment_method_id', value: payment_method_id.value });
  if (shipping_method_id.value) searchOption.push({ name: 'shipping_method_id', value: shipping_method_id.value });
  if (product_type_id.value) searchOption.push({ name: 'product_type_id', value: product_type_id.value });
  createNewPathForSearchAndPush(searchOption, true);
  await fetchList();
};

const changeOrder = async (order_by: string) => {
  await changeOrderBy(order_by, orderBy, orderType, fetchList);
};

const headerColumns = ref([
  { label: 'ID', field: 'id', sortable: true },
  { label: 'ORDER NO', field: 'order_no', sortable: true },
  { label: 'CUSTOMER', field: 'first_name', sortable: true },
  { label: 'SHIPMENTS/PRODUCTS', field: 'products', sortable: false },
  { label: 'CREATED', field: 'created', sortable: false },
]);

onMounted(async () => {
  await nextTick();
  statusList = await shipmentStatuses();
  countries = await countryList();
  paymentMethods = await getPaymentMethods();
  shippingMethodList = await shippingMethods();
  distributorList = await distributors();
  productTypes = await types();
  await fetchData();
});
</script>

<template>
  <h2 class="mt-10 text-lg font-medium intro-y">Orders</h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
      <Popover class="inline-block mr-2 mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0" v-slot="{ close }">
        <Popover.Button :as="Button" variant="primary">
          <Lucide icon="Filter" class="w-4 h-4 mr-1" />
          Filter
          <Lucide icon="ChevronDown" class="w-4 h-4 ml-2" />
        </Popover.Button>
        <Popover.Panel placement="bottom-start">
          <form @submit.prevent="handleSearch">
            <div class="p-2">
              <div class="flex flex-col space-y-3">
                <!-- Row 1 -->
                <div class="flex space-x-5">
                  <div class="flex-1">
                    <FormLabel htmlFor="for_first_name">Order No</FormLabel>
                    <FormInput v-model="order_no" type="text" class="w-56" @keyup="updateField($event, 'order_no')">
                    </FormInput>
                  </div>
                  <div class="flex-1">
                    <FormLabel htmlFor="for_status">Status</FormLabel>
                    <FormSelect class="w-56" v-model="status_id" @change="updateField($event, 'status')">
                      <option value="0" key="0">All</option>
                      <option :value="status.id" v-for="status in statusList" :key="status.id">
                        {{ status.name }}
                      </option>
                    </FormSelect>
                  </div>
                </div>

                <!-- Row 2 -->


                <div class="flex space-x-5">
                  <div class="flex-1">
                    <FormLabel htmlFor="for_date_range">Date Range</FormLabel>
                    <Datepicker :format="'yyyy-MM-dd'" :auto-apply="true" :enable-time-picker="false"
                      v-model="start_date" @change="updateField($event, 'start_date')" />
                  </div>
                  <div class="flex-1">
                    <FormLabel htmlFor="for_thru">thru</FormLabel>
                    <Datepicker :format="'yyyy-MM-dd'" :auto-apply="true" :enable-time-picker="false" v-model="end_date"
                      @change="updateField($event, 'end_date')" />
                  </div>
                </div>

                <div class="flex space-x-5">
                  <div class="flex-1">
                    <FormLabel htmlFor="for_date_range">Trip Date Range</FormLabel>
                    <Datepicker :format="'yyyy-MM-dd'" :auto-apply="true" :enable-time-picker="false"
                      v-model="start_date_travel" @change="updateField($event, 'start_date_travel')" />
                  </div>
                  <div class="flex-1">
                    <FormLabel htmlFor="for_thru">thru</FormLabel>
                    <Datepicker :format="'yyyy-MM-dd'" :auto-apply="true" :enable-time-picker="false"
                      v-model="end_date_travel" @change="updateField($event, 'end_date_travel')" />
                  </div>
                </div>

                <!-- Row 3 -->
                <div class="flex space-x-5">
                  <div class="flex-1">
                    <FormLabel htmlFor="country">Payment Method</FormLabel>
                    <FormSelect class="w-56" v-model="payment_method_id"
                      @change="updateField($event, 'payment_method_id')">
                      <option value="0" key="0">All</option>
                      <option :value="paymentMethod.id" v-for="paymentMethod in paymentMethods" :key="paymentMethod.id">
                        {{ paymentMethod.name }}
                      </option>
                    </FormSelect>
                  </div>
                  <div class="flex-1">
                    <FormLabel htmlFor="country">Shipping Method</FormLabel>
                    <FormSelect class="w-56" v-model="shipping_method_id"
                      @change="updateField($event, 'shipping_method_id')">
                      <option value="0" key="0">All</option>
                      <option :value="shippingMethod.id" v-for="shippingMethod in shippingMethodList"
                        :key="shippingMethod.id">
                        {{ shippingMethod.name }}
                      </option>
                    </FormSelect>
                  </div>
                </div>
                <div class="flex space-x-5">
                  <div class="flex-1">
                    <FormLabel htmlFor="payment">Country</FormLabel>
                    <FormSelect class="w-56" v-model="country_id" @change="updateField($event, 'country_id')">
                      <option value="0" key="0">All</option>
                      <option :value="option.id" v-for="option in countries" :key="option.id">
                        {{ option.name }}
                      </option>
                    </FormSelect>
                  </div>
                  <div class="flex-1">
                    <FormLabel htmlFor="shipping">State</FormLabel>
                    <FormSelect class="w-56" v-model="state_id" @key="country_id"
                      @change="updateField($event, 'state_id')">
                      <option value="0" key="0">All</option>
                      <option :value="option.id" v-for="option in states" :key="option.id">
                        {{ option.name }}
                      </option>
                    </FormSelect>
                  </div>
                </div>

                <div class="flex flex-col space-y-3">
                  <!-- Row 1 -->
                  <div class="flex space-x-5">
                    <div class="flex-1">
                      <FormLabel htmlFor="for_city">Distributor</FormLabel>
                      <FormSelect class="w-56" v-model="distributor_id" @change="updateField($event, 'distributor_id')">
                        <option value="0" key="0">All</option>
                        <option :value="distributor.id" v-for="distributor in distributorList" :key="distributor.id">
                          {{ distributor.name }}
                        </option>
                      </FormSelect>
                    </div>
                    <div class="flex-1">
                      <FormLabel htmlFor="for_city">Product Types</FormLabel>
                      <FormSelect class="w-56" v-model="product_type_id"
                        @change="updateField($event, 'product_type_id')">
                        <option value="0" key="0">All</option>
                        <option :value="productType.id" v-for="productType in productTypes" :key="productType.id">
                          {{ productType.name }}
                        </option>
                      </FormSelect>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex items-center mt-3">
                <Button variant="primary" type="submit" @click="() => {
                  close();
                }
                  " class="w-64 m-auto">
                  Search
                </Button>
              </div>
            </div>
          </form>
        </Popover.Panel>
      </Popover>
      <div class="hidden mx-auto md:block text-slate-500"></div>

      <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
        <div class="relative w-56 text-slate-500">
          <EnterSearch v-model="keyword" :searchByKeyword="searchByKeyword" />
        </div>
      </div>
    </div>
    <!-- BEGIN: Data List -->
    <div class="col-span-12 overflow-x-auto intro-y">
      <Table class="border-spacing-y-[10px] border-separate -mt-2 hover">
        <SortableTableHeader :columns="headerColumns" :orderBy="orderBy" :orderType="orderType"
          :handleSort="changeOrder" :v-if="dataLoaded" />
        <Table.Tbody>
          <Table.Tr v-if="!dataLoaded" class="intro-x">
            <Table.Td colspan="6" class="py-0 px-0">
              <TableLoading />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-if="orders.length == 0 && dataLoaded" class="intro-x">
            <Table.Td colspan="6" class="py-0 px-0">
              <AlertGray />
            </Table.Td>
          </Table.Tr>
          <Table.Tr @click="editLink(order.id)" :class="'cursor-pointer'" v-for="order in orders" :key="order.id"
            class="intro-x">
            <Table.Td>
              {{ order.id }}
            </Table.Td>
            <Table.Td>
              {{ order.order_no }}
            </Table.Td>
            <Table.Td>
              <div class="flex flex-col" v-if="order.account">
                <span class="font-bold">{{ order.account.fullname }}</span>
                <span class="text-gray-500">{{ order.account.username }}</span>
                <span class="text-gray-500">{{ order.account.email }}</span>
                <span class="text-gray-500">{{ order.account.phone }}</span>
              </div>
            </Table.Td>
            <Table.Td>
              <div v-for="shipment in order.shipments" :key="shipment.id" class="mb-4 text-sm">
                <div class="flex items-center space-x-2">
                  <span class="text-gray-500">
                    <Lucide icon="ShoppingCart" class="w-4 h-4 mr-1" />
                  </span>
                  <span :class="{
                    'text-green-500':
                      shipment.distributor &&
                      shipment.distributor.is_dropshipper === true,
                    'text-blue-500': shipment.is_downloads === true,
                    'text-gray-700':
                      shipment.distributor &&
                      shipment.distributor.is_dropshipper !== true &&
                      shipment.is_downloads !== true,
                  }">
                    {{
                      shipment.distributor &&
                        shipment.distributor.is_dropshipper !== true &&
                        shipment.is_downloads !== true
                        ? "SHPT " + shipment.id
                        : shipment.distributor &&
                          shipment.distributor.is_dropshipper === true
                          ? "DROPSHIP"
                          : "NON-SHIP/DWNLDS"
                    }}
                  </span>
                  <div class="ml-auto flex items-center">
                    <span :class="{
                      'bg-yellow-500 text-white':
                        shipment.status && shipment.status.name === 'Processing',
                      'bg-blue-500 text-white':
                        shipment.status &&
                        (shipment.status.name === 'Awaiting Label' ||
                          shipment.status.name === 'Ready to Print'),
                      'bg-green-500 text-white':
                        shipment.status &&
                        (shipment.status.name === 'Ready to Ship' ||
                          shipment.status.name === 'Shipped' ||
                          shipment.status.name === 'Completed'),
                      'bg-red-500 text-white':
                        shipment.status && shipment.status.name === 'Cancelled',
                      'bg-purple-500 text-white':
                        shipment.status &&
                        shipment.status.name === 'Sent to Dropshipper',
                      'bg-orange-500 text-white':
                        shipment.status &&
                        (shipment.status.name === 'Awaiting Payment' ||
                          shipment.status.name === 'Confirmed'),
                      'bg-indigo-500 text-white':
                        shipment.status && shipment.status.name === 'Backordered',
                      'bg-pink-500 text-white':
                        shipment.status &&
                        shipment.status.name === 'Awaiting Resolution',
                      'bg-gray-500 text-white':
                        shipment.status &&
                        (shipment.status.name === 'Cancelled with Credit' ||
                          shipment.status.name === 'Invoiced' ||
                          shipment.status.name === 'Pending'),
                    }" class="py-1 px-2 rounded-full">
                      {{ shipment.status ? shipment.status.name : "N/A" }}
                    </span>
                  </div>
                </div>
                <div v-for="item in shipment.items" :key="item.id" class="ml-4 mt-1">
                  <div>
                    <div class="flex items-center space-x-2">
                      <span class="text-gray-500">
                        <Lucide icon="ShoppingBasket" class="w-4 h-4 mr-1" />
                      </span>
                      <span class="text-gray-700" v-if="item.product">{{ item.product_qty }} x {{ item.product.title
                        }}</span>
                    </div>
                    
                    <div v-if="item.option_values" class="text-xs text-gray-400">
                      <template v-for="option in item.option_values">
                        <div>
                          {{ option.option_value.option.display }}:
                          {{ option.option_value.display }}
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </Table.Td>
            <Table.Td>
              {{ formatDate(order.created_at) }}
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </div>
    <!-- END: Data List -->

    <Pagination v-if="dataLoaded" :key="currentPage" v-model="currentPage" :getList="list" :numberOfPages="lastPage" />
  </div>
</template>
