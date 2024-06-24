<script setup lang="ts">
import _ from "lodash";
import Button from "~/components/enigma/base-components/Button";
import {
  FormSelect,
  FormLabel,
} from "~/components/enigma/base-components/Form";
import Lucide from "~/components/enigma/base-components/Lucide";
import { Popover } from "~/components/enigma/base-components/Headless";
import Table from "~/components/enigma/base-components/Table";
import { useCustomers } from "~~/composables/account/useCustomers";
import {
  FormInput,
} from "~/components/enigma/base-components/Form";
import { type Ref } from "vue";
import { useQueryParamStore } from "~/store/enigma/query-param";

definePageMeta({
  middleware: ["auth"],
  layout: "simple-menu-new",
});

useHead({
  title: "Accounts: " + useRuntimeConfig().public.company,
});
const router = useRouter();
const queryParam = useQueryParamStore().queryParam
if(queryParam && queryParam.customers)
{ 
  await router.push({ path: `/customers`, query: queryParam.customers });
}
useQueryParamStore().setQueryParam({})
const route = useRoute();
const editLink = (id: Number) => {
  const currentQuery = {customers:{ ...route.query }};
  if(route.query)
  {
    useQueryParamStore().setQueryParam(currentQuery)
  }
  router.push("/customers/" + id);
};

const { list, accountStatuses, resetPage } = useCustomers();

const { all } = useAccountType();
const { countryList, stateList } = useAddresses();

let refsMap: { [key: string]: Ref<string | number> } = {};

let typeList: any = ref([])
let statusList: any = ref([])
let countries: any = ref([])

const dataLoaded = ref(false)
let accounts:any = ref([]);
let lastPage:any = ref(1);
let currentPage:any = ref(1);
let keyword:any = ref('');
let first_name:any = ref('');
let last_name:any = ref('');
let city:any = ref('');
let status_id:any = ref(0);
let country_id:any = ref(0);
let type_id:any = ref(0);
let state_id:any = ref(0);
let orderBy: any = ref('');
let orderType: any = ref('');

const fetchData = async ()=>{
  const result = await list();
  accounts = result.accounts;
  lastPage = result.lastPage;
  currentPage = result.currentPage;
  keyword = result.keyword;
  first_name = result.first_name;
  last_name = result.last_name;
  city = result.city;
  status_id = result.status_id;
  country_id = result.country_id;
  type_id = result.type_id;
  state_id = result.state_id;
  orderBy = result.orderBy;
  orderType = result.orderType;
  typeList = await all();
  statusList = await accountStatuses();
  countries = await countryList();
  refsMap = {
    first_name: first_name,
    last_name: last_name,
    city: city,
    status_id: status_id,
    country_id: country_id,
    type_id: type_id,
    state_id: state_id,
  };
  dataLoaded.value = true
}

let states: any = ref([]);

const fetchList = async () => {
  resetPage();
  await list();
};

const getStates = async (id: string) => {
  const countryStatus = await stateList(parseInt(id));
  states.value = countryStatus.value;
  state_id.value = 0
};

const searchByKeyword = async (value: any) => {
  createNewPathAndPush("keyword", value, true);
  await fetchList();
};

const updateField = async (event: Event, fieldName: string) => {
  const target = event.target as HTMLInputElement;
  if (refsMap[fieldName]) {
    refsMap[fieldName].value = target.value;
    if (fieldName == "country_id") {
      await getStates(target.value)
    }
  }
}

const handleSearch = async () => {
  const searchOption = []
  if (first_name.value) searchOption.push({ name: "first_name", value: first_name.value });
  if (last_name.value) searchOption.push({ name: "last_name", value: last_name.value });
  if (status_id.value) searchOption.push({ name: "status_id", value: status_id.value });
  if (type_id.value) searchOption.push({ name: "type_id", value: type_id.value });
  if (country_id.value) searchOption.push({ name: "country_id", value: country_id.value });
  if (state_id.value) searchOption.push({ name: "state_id", value: state_id.value });
  if (city.value) searchOption.push({ name: "city", value: city.value });
  createNewPathForSearchAndPush(searchOption, true)
  await fetchList();
}
onMounted(async () => {
  await nextTick();
  await fetchData();
});
const headerColumns = ref([
  { label: 'ID', field: 'id', sortable: true },
  { label: 'NAME', field: 'first_name', sortable: true },
  { label: 'EMAIL', field: 'email', sortable: true },
  { label: 'CREATED', field: 'created_at', sortable: true },
  { label: 'TYPE', field: 'type_id', sortable: true },
  { label: 'STATUS', field: 'status_id', sortable: true },
]);
const changeOrder = async (order_by: string) => {
  await changeOrderBy(order_by, orderBy, orderType, fetchList);
}
</script>

<template>
  <h2 class="mt-10 text-lg font-medium intro-y">Customers</h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap" v-if="dataLoaded">

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
                    <FormLabel htmlFor="for_first_name">First Name</FormLabel>
                    <FormInput v-model="first_name" type="text" class="w-56" @keyup="updateField($event, 'first_name')">
                    </FormInput>
                  </div>
                  <div class="flex-1">
                    <FormLabel htmlFor="for_last_name">Last Name</FormLabel>
                    <FormInput v-model="last_name" type="text" class="w-56" @keyup="updateField($event, 'last_name')">
                    </FormInput>
                  </div>
                </div>

                <!-- Row 2 -->
                <div class="flex space-x-5">
                  <div class="flex-1">
                    <FormLabel htmlFor="for_status">Status</FormLabel>
                    <FormSelect v-model="status_id" class="w-56" @change="updateField($event, 'status_id')">
                      <option value="0" key="0">All</option>
                      <option :value="option.id" v-for="option in statusList" :key="option.id">
                        {{ option.name }}
                      </option>
                    </FormSelect>
                  </div>
                  <div class="flex-1">
                    <FormLabel htmlFor="type">Type</FormLabel>
                    <FormSelect class="w-56" v-model="type_id" @change="updateField($event, 'type_id')">
                      <option value="0" key="0">All</option>
                      <option :value="option.id" v-for="option in typeList" :key="option.id">
                        {{ option.name }}
                      </option>
                    </FormSelect>
                  </div>
                </div>

                <!-- Row 3 -->
                <div class="flex space-x-5">
                  <div class="flex-1">
                    <FormLabel htmlFor="country">Country</FormLabel>
                    <FormSelect class="w-56" v-model="country_id" @change="updateField($event, 'country_id')">
                      <option value="0" key="0">All</option>
                      <option :value="option.id" v-for="option in countries" :key="option.id">
                        {{ option.name }}
                      </option>
                    </FormSelect>
                  </div>
                  <div class="flex-1">
                    <FormLabel htmlFor="country">State</FormLabel>
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
                      <FormLabel htmlFor="for_city">City</FormLabel>
                      <FormInput class="w-56" :key="city" v-model="city" type="text" @keyup="updateField($event, 'city')">
                      </FormInput>
                    </div>
                    <div class="flex-1"></div>
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
      <div class="hidden mx-auto md:block text-slate-500">

      </div>

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
          <Table.Tr v-if="accounts.length == 0 && dataLoaded" class="intro-x">
            <Table.Td colspan="6" class="py-0 px-0">
              <AlertGray />
            </Table.Td>
          </Table.Tr>
          <Table.Tr @click="editLink(account.id)" :class="'cursor-pointer'" v-for="account in accounts" :key="account.id"
            class="intro-x">
            <Table.Td>
              {{ account.id }}
            </Table.Td>
            <Table.Td>
              {{ account.fullname }}
            </Table.Td>
            <Table.Td>
              {{ account.email }}
            </Table.Td>
            <Table.Td>
              {{ account.created_at }}
            </Table.Td>
            <Table.Td>
              <span :class="{
                'bg-blue-500 text-white': account.type?.id === 1,
                'bg-gray-500 text-white': account.type?.id === 2 || account.type?.id === 7,
                'bg-green-400 text-white': account.type?.id === 3,
                'bg-purple-400 text-white': account.type?.id === 4,
                'bg-teal-400 text-white': account.type?.id === 5,
                'bg-red-500 text-white': account.type?.id === 6,
                'bg-teal-500 text-white': account.type?.id === 8,
                'bg-purple-500 text-white': account.type?.id === 9,
                'bg-green-500 text-white': account.type?.id === 10,
              }" class="py-1 px-2 rounded-full">
                {{ account.type?.name }}
              </span>
            </Table.Td>
            <Table.Td>
              <span :class="{
                'bg-green-500 text-white': account.status?.id === 1,
                'bg-red-500 text-white': account.status?.id === 2,
                'bg-yellow-500 text-white': account.status?.id === 3 || account.status?.id === 6,
                'bg-blue-500 text-white': account.status?.id === 4,
                'bg-gray-500 text-white': account.status?.id === 5,
              }" class="py-1 px-2 rounded-full">
                {{ account.status?.name }}
              </span>
            </Table.Td>

          </Table.Tr>
        </Table.Tbody>
      </Table>
    </div>
    <!-- END: Data List -->

    <Pagination v-model="currentPage" :key="currentPage" v-if="dataLoaded" :getList="list" :numberOfPages="lastPage" />
  </div>
</template>