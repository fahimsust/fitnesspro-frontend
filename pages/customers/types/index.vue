<script setup lang="ts">
import _ from "lodash";
import Button from "~/components/enigma/base-components/Button";
import Table from "~/components/enigma/base-components/Table";
import AddAccountType from "~/components/accountTypes/AddAccountType.vue"
import EditAccountType from "~/components/accountTypes/EditAccountType.vue"
import { useQueryParamStore } from "~/store/enigma/query-param";

definePageMeta({
  middleware: ["auth"],
  layout: "simple-menu-new",
});

useHead({
  title: "Account Types: " + useRuntimeConfig().public.company,
});
useQueryParamStore().setQueryParam({})
const { listAccountTypes } = useAccountType();

const accountType = ref({ id: 0 });

const searchByKeyword = async (value: any) => {
  currentPageType.value = 1;
  createNewPathAndPush("keyword", value, true);
  await listAccountTypes();
};

const modalShow = ref(false);
const setModel = (value: boolean) => {
  modalShow.value = value;
};
const editModal = ref(false);
const setAccountTypeAndOpenModal = (obj: any) => {
  accountType.value = obj;
  setEditModal(true);
};
const setEditModal = (value: boolean) => {
  editModal.value = value;
};
const dataLoaded = ref(false)
let accountTypes:any = ref([]);
let lastPage:any = ref(1);
let currentPageType:any = ref(1);
let keywordString:any = ref('');
let orderBy: any = ref('');
let orderType: any = ref('');

const fetchData = async ()=>{
  const result = await listAccountTypes();
  accountTypes = result.accountTypes;
  lastPage = result.lastPage;
  currentPageType = result.currentPageType;
  keywordString = result.keywordString;
  orderBy = result.orderBy;
  orderType = result.orderType;
  dataLoaded.value = true
}
onMounted(async () => {
  await nextTick();
  await fetchData();
});
const fetchList = async () => {
  currentPageType.value = 1;
  await listAccountTypes();
};
const headerColumns = ref([
  { label: 'NAME', field: 'name', sortable: true },
  { label: 'DEFAULT STATUS', field: '', sortable: false },
  { label: 'DISCOUNT LEVEL', field: '', sortable: false }
]);
const changeOrder = async (order_by: string) => {
  await changeOrderBy(order_by, orderBy, orderType, fetchList);
}
</script>

<template>
  <h2 class="mt-10 text-lg font-medium intro-y">Account Types</h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
      <Button variant="primary" class="mr-2 shadow-md" @click="setModel(true)">
        Create Account Type</Button>
      <div class="hidden mx-auto md:block text-slate-500">
        <!-- Showing 1 to 10 of 150 entries -->
      </div>
      <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
        <div class="relative w-56 text-slate-500">
          <EnterSearch :key="keywordString" v-model="keywordString" :searchByKeyword="searchByKeyword" />
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
            <Table.Td colspan="3" class="py-0 px-0">
              <TableLoading />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-if="accountTypes.length == 0 && dataLoaded" class="intro-x">
            <Table.Td colspan="3" class="py-0 px-0">
              <AlertGray />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-for="accountType in accountTypes" class="cursor-pointer intro-x" :key="accountType.id"
            @click="setAccountTypeAndOpenModal(accountType)">
            <Table.Td>
              {{ accountType.name }}
            </Table.Td>
            <Table.Td>
              {{ accountType.default_status?.name }}
            </Table.Td>
            <Table.Td>
              {{ accountType.discount_level?.name }}
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </div>
    <!-- END: Data List -->

    <Pagination v-model="currentPageType" :key="currentPageType" v-if="dataLoaded" :getList="listAccountTypes" :numberOfPages="lastPage" />
  </div>
  <AddAccountType :modal-show="modalShow" :set-modal="setModel" :refresh="listAccountTypes" />
  <EditAccountType :modal-show="editModal" v-if="dataLoaded" :key="accountType.id" :set-modal="setEditModal" :refresh="listAccountTypes"
    v-model="accountType" />
</template>
