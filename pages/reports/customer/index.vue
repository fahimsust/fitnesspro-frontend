<script setup lang="ts">
import Button from "~/components/enigma/base-components/Button";
import Lucide from "~/components/enigma/base-components/Lucide";
import Table from "~/components/enigma/base-components/Table";
import AddCustomerReport from "~/components/report/AddCustomerReport.vue";
import ReportView from "~/components/report/ReportView.vue";
import { FormSwitch } from "~~/components/enigma/base-components/Form";
import LoadingIcon from "~/components/enigma/base-components/LoadingIcon";
import { useQueryParamStore } from "~/store/enigma/query-param";

definePageMeta({
  middleware: ["auth"],
  layout: "simple-menu-new",
});
useHead({
  title: "Customer Reports: " + useRuntimeConfig().public.company,
});
useQueryParamStore().setQueryParam({})

const {
  list,
  deleteReport,
  rebuildReport,
  deleteConfirmationModal,
  reBuildConfirmationModal,
  setRebuildId,
  getReport,
  setDeleteId,
  loading
} = useCustomerReports();

const {downloadCsv,downloadExcel,downloading} = useCustomerReportsDownload();
const fetchList = async () => {
  currentPage.value = 1;
  await list();
};
const showModal = ref(false);
const setShowModal = (value: boolean) => {
  showModal.value = value;
};
const reportData = ref({id:0})
const tempReport = ref({id:0})
const viewReport = async(report:any) => {
  const fullReport = await getReport(report.id);
  reportData.value = fullReport
  tempReport.value = report
  setShowModal(true)
};
const searchByKeyword = async (event: any) => {
  createNewPathAndPush("keyword", event.target.value, true);
  await fetchList();
};
const changeOrder = async (order_by: string) => {
  await changeOrderBy(order_by, orderBy, orderType, fetchList);
}

const setConfirmationModal = (value: boolean) => {
  deleteConfirmationModal.value = value;
};
const setRebuildConfirmationModal = (value: boolean) => {
  reBuildConfirmationModal.value = value;
};
const headerColumns = ref([
  { label: 'ID', field: 'id', sortable: true },
  { label: 'NAME', field: 'name', sortable: true },
  { label: 'CREATED', field: 'created', sortable: true },
  { label: 'STATUS', field: 'ready', sortable: true }, // Add ACTIVE column
  { label: '', field: '', sortable: false }, // Add empty column
]);
const modalShow = ref(false);
const setModal = (value: boolean) => {
  modalShow.value = value;
};

const dataLoaded = ref(false)
let reports:any = ref([]);
let lastPage:any = ref(1);
let currentPage:any = ref(1);
let keywordString:any = ref('');
let orderBy:any = ref('id');
let orderType:any = ref('asc');


const fetchData = async ()=>{
  const result = await list();
  reports = result.reports;
  lastPage = result.lastPage;
  currentPage = result.currentPage;
  keywordString = result.keywordString;
  orderBy = result.orderBy;
  orderType = result.orderType;
  dataLoaded.value = true
}
onMounted(async () => {
  await nextTick();
  await fetchData();
});
</script>

<template>
  <h2 class="mt-10 text-lg font-medium intro-y">Customer Report</h2>
  <div class="grid grid-cols-12 gap-1 mt-5">
    <div class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
      <Button variant="primary" @click="setModal(true)" class="mr-2 shadow-md">
        Create Customer Report
      </Button>

      <div class="hidden mx-auto md:block text-slate-500">
        <!-- Showing 1 to 10 of 150 entries -->
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
    <div class="col-span-12 overflow-x-auto intro-y">
      <div class="w-6 h-6">
        <LoadingIcon v-if="downloading || loading" icon="three-dots" class="w-6 h-6" />
      </div>
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
            <Table.Td colspan="5" class="py-0 px-0">
              <TableLoading />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-if="reports.length == 0 && dataLoaded" class="intro-x">
            <Table.Td colspan="5" class="py-0 px-0">
              <AlertGray />
            </Table.Td>
          </Table.Tr>
          <Table.Tr
            v-for="report in reports"
            @click="viewReport(report)"
            :class="'cursor-pointer'"
            :key="report.id"
            class="intro-x"
          >
            <Table.Td>
              {{ report.id }}
            </Table.Td>
            <Table.Td>
              {{ report.name }}
            </Table.Td>
            <Table.Td>
              {{ formatDate(report.created) }}
            </Table.Td>
            <Table.Td>
              <span :class="{
                'bg-green-500 text-white': report.ready == 2,
                'bg-yellow-500 text-white': report.ready == 0,
                'bg-blue-500 text-white': report.ready == 1
              }" class="py-1 px-2 rounded-full">
                {{report.ready_label }}
              </span>
            </Table.Td>

            <Table.Td>
              <div class="flex items-center justify-center">
                <NuxtLink
                  v-if="!downloading && report.ready == 2"
                  class="flex text-primary cursor-pointer ml-2"
                  @click="
                    (event) => {
                      event.preventDefault();
                      downloadCsv(report.id);
                      event.stopPropagation();
                    }
                  "
                >
                  <Lucide icon="FileDown" class="w-4 h-4 mr-1" />
                  <span class="hidden">CSV</span>

                </NuxtLink>
                <NuxtLink
                  v-if="!downloading && report.ready == 2"
                  class="flex text-primary cursor-pointer ml-2"
                  @click="
                    (event) => {
                      event.preventDefault();
                      downloadExcel(report.id);
                      event.stopPropagation();
                    }
                  "
                >
                  <Lucide icon="FileSpreadsheet" class="w-4 h-4 mr-1" />
                  <span class="hidden">Excel</span>
                </NuxtLink>
                <NuxtLink
                  v-if="!downloading && report.ready == 2"
                  class="flex text-success cursor-pointer ml-2"
                  @click="
                    (event) => {
                      event.preventDefault();
                      setRebuildId(report.id);
                      setRebuildConfirmationModal(true);
                      event.stopPropagation();
                    }
                  "
                >
                  <Lucide icon="Wrench" class="w-4 h-4 mr-1" />
                  <span class="hidden">Re-Build</span>
                </NuxtLink>
                <NuxtLink
                  class="flex text-danger cursor-pointer ml-2"
                  @click="
                    (event) => {
                      event.preventDefault();
                      setDeleteId(report.id);
                      setConfirmationModal(true);
                      event.stopPropagation();
                    }
                  "
                >
                  <Lucide icon="Trash2" class="w-4 h-4 mr-1" />
                  <span class="hidden">Delete</span>
                </NuxtLink>
              </div>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </div>
    <!-- END: Data List -->

    <Pagination v-model="currentPage" :key="currentPage" v-if="dataLoaded" :getList="list" :numberOfPages="lastPage" />
  </div>
  <!-- BEGIN: Delete Confirmation Modal -->
  <Confirmation
    v-model="deleteConfirmationModal"
    :setConfirmationModal="setConfirmationModal"
    :set-id="setDeleteId"
    sub-header="Do you really want to delete this report?"
    :functionToRun="deleteReport"
  />
  <Confirmation
    v-model="reBuildConfirmationModal"
    :setConfirmationModal="setRebuildConfirmationModal"
    :set-id="setRebuildId"
    sub-header="Do you really want to re-build this report?"
    :functionToRun="rebuildReport"
    buttonStringMain="Re-Build"
  />
  <ReportView :key="reportData.id" :report-data="reportData" :report="tempReport" :modal-show="showModal"
    :set-model="setShowModal" />
  <AddCustomerReport :fetch-list="fetchList" :modal-show="modalShow" :set-modal="setModal" />
</template>
