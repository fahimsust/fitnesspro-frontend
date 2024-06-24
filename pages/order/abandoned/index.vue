<script setup lang="ts">
import Table from "~/components/enigma/base-components/Table";
import { useQueryParamStore } from "~/store/enigma/query-param";

definePageMeta({
  middleware: ["auth"],
  layout: "simple-menu-new",
});
useHead({
  title: "Abandoned Orders: " + useRuntimeConfig().public.company,
});

useQueryParamStore().setQueryParam({})

const {
  list,
} = useAbandonedOrder();

const router = useRouter();

const dataLoaded = ref(false)
let abandonedOrders:any = ref([]);
let lastPage:any = ref(1);
let currentPage:any = ref(1);
let keyword:any = ref('');
let orderBy: any = ref('');
let orderType: any = ref('');
//const { abandonedOrders, lastPage, currentPage, keyword } = await list();
const fetchList = async () => {
  await list();
};
const searchByKeyword = async (value: any) => {
  createNewPathAndPush("keyword", value, true);
  await fetchList();
};
const viewLink = (id: Number) => {
  router.push("/order/abandoned/" + id);
};
onMounted(async () => {
  await nextTick();
  const result = await list();
  abandonedOrders = result.abandonedOrders;
  lastPage = result.lastPage;
  currentPage = result.currentPage;
  keyword = result.keyword;
  orderBy = result.orderBy;
  orderType = result.orderType;
  dataLoaded.value = true
});
const listFetch = async () => {
  currentPage.value = 1
  await list();
};
const headerColumns = ref([
  { label: 'SITE', field: 'name', sortable: true },
  { label: 'ORDER NO.', field: 'order_no', sortable: true },
  { label: 'ACCOUNT', field: 'email', sortable: true },
  { label: 'CUSTOMER', field: 'first_name', sortable: true },
  { label: 'CREATED', field: 'created_at', sortable: true }
]);
const changeOrder = async (order_by: string) => {
  await changeOrderBy(order_by, orderBy, orderType, listFetch);
}
</script>

<template>
  <div class="grid grid-cols-12 gap-6 mt-2">
    <div class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
      <h2 class="mt-5 text-lg font-medium intro-y">Abandoned Orders</h2>
      <div class="hidden mx-auto md:block text-slate-500">

      </div>
      <div class="w-full mt-2 sm:w-auto sm:ml-auto md:ml-0">
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
            <Table.Td colspan="5" class="py-0 px-0">
              <TableLoading />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-if="abandonedOrders.length == 0 && dataLoaded" class="intro-x">
            <Table.Td colspan="5" class="py-0 px-0">
              <AlertGray />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-for="abandonedOrder in abandonedOrders" class="cursor-pointer intro-x" :key="abandonedOrder.id"
            @click="viewLink(abandonedOrder.id)">

            <Table.Td>
              {{ abandonedOrder.site.name }}
            </Table.Td>
            <Table.Td>
              {{ abandonedOrder.order ? abandonedOrder.order.order_no : '' }}
            </Table.Td>
            <Table.Td>
              {{ abandonedOrder.account.email }}
            </Table.Td>
            <Table.Td>
              {{ abandonedOrder.account.fullname }}
            </Table.Td>
            <Table.Td>
              {{ formatDate(abandonedOrder.created_at) }}
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </div>
    <Pagination v-model="currentPage" :key="currentPage" v-if="dataLoaded"  :getList="list" :numberOfPages="lastPage" />
  </div>
</template>
