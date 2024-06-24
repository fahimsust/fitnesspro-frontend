<script setup lang="ts">
import _ from "lodash";
import { ref } from "vue";
// import fakerData from "../../utils/enigma/faker";
import Button from "../../components/enigma/base-components/Button";
import { FormSelect } from "../../components/enigma/base-components/Form";
import Lucide from "../../components/enigma/base-components/Lucide";
import Table from "../../components/enigma/base-components/Table";
import Create from "~/components/affiliate/Create.vue";
import { useQueryParamStore } from "~/store/enigma/query-param";

definePageMeta({
  middleware: ["auth"],
  layout: "simple-menu-new",
});

useHead({
  title: "Affiliates: " + useRuntimeConfig().public.company,
});
const router = useRouter();
const queryParam = useQueryParamStore().queryParam
if(queryParam && queryParam.affiliate)
{ 
  await router.push({ path: `/affiliates`, query: queryParam.affiliate });
}
useQueryParamStore().setQueryParam({})
const route = useRoute();
const editAffiliateButton = (id: number) => {
  const currentQuery = {affiliate:{ ...route.query }};
  if(route.query)
  {
    useQueryParamStore().setQueryParam(currentQuery)
  }
  router.push("/affiliates/" + id);
};

const {
  list,
  archive,
  restore,
  deleteConfirmationModal,
  setArchiveId,
} = useAffiliates();

const dataLoaded = ref(false)
let affiliates:any = ref([]);
let lastPage:any = ref(1);
let currentPage:any = ref(1);
let keywordString:any = ref('');
let affiliateStatus:any = ref(1);
let orderBy:any = ref('');
let orderType:any = ref('');

const fetchData = async ()=>{
  const result = await list();
  affiliates = result.affiliates;
  lastPage = result.lastPage;
  currentPage = result.currentPage;
  keywordString = result.keywordString;
  affiliateStatus = result.affiliateStatus;
  orderBy = result.orderBy;
  orderType = result.orderType;
  dataLoaded.value = true
}

const fetchList = async () => {
  if (currentPage.value != 1) currentPage.value = 1;
  await fetchData();
};

const searchByKeyword = async (event: any) => {
  createNewPathAndPush("keyword", event.target.value, true);
  await fetchList();
};
const setStatus = async (event: any) => {
  createNewPathAndPush("status", event.target.value, true);
  await fetchList();
};
const slideOver = ref(false);

const setSlideover = (value: boolean) => {
  slideOver.value = value;
};
const setConfirmationModal = (value: boolean) => {
  deleteConfirmationModal.value = value;
};
onMounted(async () => {
  await nextTick();
  await fetchData();
});
const headerColumns = ref([
  { label: 'ID', field: 'id', sortable: true },
  { label: 'NAME', field: 'name', sortable: true },
  { label: 'EMAIL', field: 'email', sortable: true },
  { label: '', field: '', sortable: false, extrClass:"text-center" }
]);
const changeOrder = async (order_by: string) => {
  await changeOrderBy(order_by, orderBy, orderType, fetchList);
}
</script>

<template>
  <h2 class="mt-10 text-lg font-medium intro-y">Affiliates</h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
      <Button variant="primary" class="mr-2 shadow-md" @click="setSlideover(true)">
        Create New Affiliate
      </Button>

      <div class="hidden mx-auto md:block text-slate-500">
        <!-- Showing 1 to 10 of 150 entries -->
      </div>
      <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
        <FormSelect
          class="w-48 ml-0 mr-3 xl:w-auto !box"
          v-model="affiliateStatus"
          @change="setStatus($event)"
        >
          <option value="1" key="1">Active</option>
          <option value="0" key="0">Archived</option>
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
    <!-- BEGIN: Data List -->
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
          <Table.Tr v-if="affiliates.length == 0 && dataLoaded" class="intro-x">
            <Table.Td colspan="4" class="py-0 px-0">
              <AlertGray />
            </Table.Td>
          </Table.Tr>

          <Table.Tr
            v-for="affiliate in affiliates"
            :key="affiliate.id"
            class="intro-x cursor-pointer"
            @click="editAffiliateButton(affiliate.id)"
          >
            <Table.Td>
              {{ affiliate.id }}
            </Table.Td>
            <Table.Td>
              {{ affiliate.name }}
            </Table.Td>
            <Table.Td>
              {{ affiliate.email }}
            </Table.Td>

            <Table.Td>
              <div class="flex items-center justify-center">
                <NuxtLink
                  v-if="affiliateStatus == 1"
                  class="flex items-center text-danger cursor-pointer"
                  @click="
                    (event) => {
                      event.preventDefault();
                      setArchiveId(affiliate.id);
                      setConfirmationModal(true);
                      event.stopPropagation();
                    }
                  "
                >
                  <Lucide icon="Trash2" class="w-4 h-4 mr-1" />
                  <span class="hidden">Archive</span>
                </NuxtLink>
                <NuxtLink
                  v-if="affiliateStatus == 0"
                  class="flex items-center text-success cursor-pointer"
                  @click="
                    (event) => {
                      event.preventDefault();
                      restore(affiliate.id);
                      event.stopPropagation();
                    }
                  "
                >
                  <Lucide icon="ArchiveRestore" class="w-4 h-4 mr-1" />
                  <span class="hidden">Restore</span>
                </NuxtLink>
              </div>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </div>
    <!-- END: Data List -->

    <Pagination v-model="currentPage" v-if="dataLoaded" :key="currentPage" :getList="list" :numberOfPages="lastPage" />
  </div>
  <!-- BEGIN: Delete Confirmation Modal -->
  <Confirmation
    v-model="deleteConfirmationModal"
    :setConfirmationModal="setConfirmationModal"
    :set-id="setArchiveId"
    :functionToRun="archive"
  />
  <Create :setSlideover="setSlideover" v-model="slideOver" />

  <!-- END: Delete Confirmation Modal -->
</template>
