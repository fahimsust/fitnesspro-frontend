<script setup lang="ts">
import Table from "~/components/enigma/base-components/Table";
import { FormSelect } from "~/components/enigma/base-components/Form";
definePageMeta({
  middleware: ["auth"],
  layout: "edit-affiliate",
});

useHead({
  title: "Affiliate  Referrals: " + useRuntimeConfig().public.company,
});
const route = useRoute();
const idParam = parseInt(route.params.id.toString());
const { list } = useAffiliateReferrals();
const { statusList } = useReferrals();

const dataLoaded = ref(false)
let referrals:any = ref([]);
let lastPage:any = ref(1);
let currentPage:any = ref(1);
let keywordString:any = ref('');
let referralStatus:any = ref(1);
let statuses:any = ref([])
let orderBy:any = ref('');
let orderType:any = ref('');

const fetchData = async ()=>{
  const result = await list(idParam);
  referrals = result.referrals;
  lastPage = result.lastPage;
  currentPage = result.currentPage;
  keywordString = result.keywordString;
  referralStatus = result.referralStatus;
  orderBy = result.orderBy;
  orderType = result.orderType;
  statuses = await statusList();
  dataLoaded.value = true
}
const fetchList = async () => {
  if (currentPage.value != 1) currentPage.value = 1;
  else await list(idParam);
};
const listWithAffiliate = async () => {
  await list(idParam);
};
const validateAndUpdate = async(referral:any)=>{
  let form = reactive({
    status_id:referral.status_id
  });
  await updateReferral(form, referral.id);
}
const {
  updateReferral,
} = useReferrals();

const searchByKeyword = async (event:any) => {
  createNewPathAndPush("keyword", event.target.value, true);
  await fetchList();
};
const setStatus = async (event:any) => {
  createNewPathAndPush("status", event.target.value, true);
  await fetchList();
};
onMounted(async () => {
  await nextTick();
  await fetchData();
});
const headerColumns = ref([
  { label: 'ORDER NO', field: 'order_no', sortable: true },
  { label: 'TYPE', field: 'type_id', sortable: true },
  { label: 'STATUS', field: 'status_id', sortable: true },
  { label: 'AMOUNT', field: 'amount', sortable: true },
]);
const changeOrder = async (order_by: string) => {
  await changeOrderBy(order_by, orderBy, orderType, fetchList);
}
</script>
<template>
  <div class="col-span-12 lg:col-span-9 2xl:col-span-10">
    <div class="rounded-lg box intro-y shadow lg:mt-14">
      <div class="px-5 py-6 sm:px-6 space-y-8 divide-y divide-gray-200 sm:space-y-5">
        <div class="space-y-6 sm:space-y-5">
          <div>
            <h2 class="mr-auto text-base font-medium">Referrals</h2>
            <!-- <p class="mt-1 max-w-2xl text-sm text-gray-500">Use a permanent address where you can
                                receive mail.</p> -->
          </div>
          <div
            class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap"
          >
            <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
              <FormSelect
                class="w-48 ml-0 mr-3 xl:w-auto"
                v-model="referralStatus"
                @change="setStatus($event)"
              >
                <option value="" key="0">Select Status</option>
                <option v-for="status in statuses" :value="status.id" :key="status.id">
                  {{ status.name }}
                </option>
              </FormSelect>
            </div>

            <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
              <div class="relative w-56 text-slate-500">
                <LiveSearch
                  :key="keywordString"
                  v-model="keywordString"
                  :searchByKeyword="searchByKeyword"
                />
              </div>
            </div>
          </div>
          <div class="col-span-12 overflow-auto intro-y lg:overflow-visible">
            <Table class="border-spacing-y-[10px] border-separate -mt-2 hover">
              <SortableTableHeader
                :columns="headerColumns"
                :orderBy="orderBy"
                :orderType="orderType"
                :handleSort="changeOrder"
                :v-if="dataLoaded"
              />
              <Table.Tbody>
                <Table.Tr v-if="!dataLoaded" class="intro-x">
                  <Table.Td colspan="4" class="py-0 px-0">
                    <TableLoading />
                  </Table.Td>
                </Table.Tr>
                <Table.Tr v-if="referrals.length == 0 && dataLoaded" class="intro-x">
                  <Table.Td colspan="4" class="py-0 px-0">
                    <AlertGray />
                  </Table.Td>
                </Table.Tr>

                <Table.Tr
                  v-for="referral in referrals"
                  :key="referral.id"
                  class="intro-x"
                >
                  <Table.Td>
                    {{ referral.order ? referral.order.order_no : "" }}
                  </Table.Td>
                  <Table.Td>
                    {{ referral.type_label }}
                  </Table.Td>
                  <Table.Td>
                    <FormSelect class="w-48 ml-0 mr-3 xl:w-auto" v-model="referral.status_id" @change="validateAndUpdate(referral)">
                        <option value="" key="0">Select Status</option>
                        <option v-for="status in statuses" :value="status.id" :key="status.id">
                          {{ status.name }}
                        </option>
                      </FormSelect>
                  </Table.Td>
                  <Table.Td>
                    {{ referral.amount }}
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </div>
          <Pagination v-model="currentPage" v-if="dataLoaded" :key="currentPage" :getList="listWithAffiliate" :numberOfPages="lastPage" />
        </div>
      </div>
    </div>
  </div>
</template>
