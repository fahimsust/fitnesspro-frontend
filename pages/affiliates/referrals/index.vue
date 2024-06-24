<script setup lang="ts">
import _ from "lodash";
import { FormSelect } from "~/components/enigma/base-components/Form";
import Table from "~/components/enigma/base-components/Table";
import { useQueryParamStore } from "~/store/enigma/query-param";

definePageMeta({
  middleware: ["auth"],
  layout: "simple-menu-new",
});

useHead({
  title: "Referrals: " + useRuntimeConfig().public.company,
});

useQueryParamStore().setQueryParam({})
const {
  list,
  statusList,
  updateReferral,
} = useReferrals();

const dataLoaded = ref(false)
let referrals: any = ref([]);
let lastPage: any = ref(1);
let currentPage: any = ref(1);
let keywordString: any = ref('');
let referralStatus: any = ref('');
let nameString: any = ref('');
let statuses: any = ref([])
let orderBy: any = ref('');
let orderType: any = ref('');


const fetchData = async () => {
  const result = await list();
  referrals = result.referrals;
  lastPage = result.lastPage;
  currentPage = result.currentPage;
  keywordString = result.keywordString;
  referralStatus = result.referralStatus;
  nameString = result.nameString;
  orderBy = result.orderBy;
  orderType = result.orderType;
  statuses = await statusList();
  dataLoaded.value = true
}

const searchByKeyword = async (value: any) => {
  createNewPathAndPush("keyword", value, true);
  await list();
};
const setStatus = async (event: any) => {
  createNewPathAndPush("status", event.target.value, true);
  await list();
};
const setName = async (value: any) => {
  createNewPathAndPush("name", value, true);
  await list();
};
const validateAndUpdate = async (referral: any) => {
  let form = reactive({
    status_id: referral.status_id
  });
  await updateReferral(form, referral.id);
}
onMounted(async () => {
  await nextTick();
  await fetchData();
});
const headerColumns = ref([
  { label: 'AFFILIATE', field: 'name', sortable: true },
  { label: 'ORDER NO', field: 'order_no', sortable: true },
  { label: 'TYPE', field: 'type_id', sortable: true },
  { label: 'AMOUNT', field: 'amount', sortable: true },
  { label: 'STATUS', field: 'status_id', sortable: true },
]);
const fetchList = async () => {
  currentPage.value = 1;
  await list();
};
const changeOrder = async (order_by: string) => {
  await changeOrderBy(order_by, orderBy, orderType, fetchList);
}
</script>

<template>
  <h2 class="mt-10 text-lg font-medium intro-y">Referrals</h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
      <div class="flex mr-3 mt-3 sm:w-auto sm:mt-0">
        <FormSelect class="w-48 ml-0 mr-3 xl:w-auto" v-model="referralStatus" @change="setStatus($event)">
          <option value="" key="0">Select Status</option>
          <option v-for="status in statuses" :value="status.id" :key="status.id">
            {{ status.name }}
          </option>
        </FormSelect>
      </div>
      <div class="flex mr-3 mt-3 sm:w-auto sm:mt-0">
        <div class="relative w-56 text-slate-500">
          <EnterSearch placeholder="Search by affiliate name" v-model="nameString" :searchByKeyword="setName" />
        </div>
      </div>
      <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
        <div class="relative w-56 text-slate-500">
          <EnterSearch v-model="keywordString" :searchByKeyword="searchByKeyword" />
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
            <Table.Td colspan="4" class="py-0 px-0">
              <TableLoading />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-if="referrals.length == 0 && dataLoaded" class="intro-x">
            <Table.Td colspan="5" class="py-0 px-0">
              <AlertGray />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-for="referral in referrals" class="cursor-pointer intro-x" :key="referral.id">
            <Table.Td>
              {{ referral.affiliate.name }}
            </Table.Td>
            <Table.Td>
              {{ referral.order.order_no }}
            </Table.Td>
            <Table.Td>
              {{ referral.type_label }}
            </Table.Td>
            <Table.Td>
              {{ referral.amount }}
            </Table.Td>
            <Table.Td>
              <FormSelect class="w-48 ml-0 mr-3 xl:w-auto" v-model="referral.status_id"
                @change="validateAndUpdate(referral)">
                <option value="" key="0">Select Status</option>
                <option v-for="status in statuses" :value="status.id" :key="status.id">
                  {{ status.name }}
                </option>
              </FormSelect>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </div>
    <!-- END: Data List -->

    <Pagination v-model="currentPage" v-if="dataLoaded" :key="currentPage" :getList="list" :numberOfPages="lastPage" />
  </div>
</template>
