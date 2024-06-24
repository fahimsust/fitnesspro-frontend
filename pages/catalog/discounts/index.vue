<script setup lang="ts">
import Button from "~/components/enigma/base-components/Button";
import Lucide from "~/components/enigma/base-components/Lucide";
import Table from "~/components/enigma/base-components/Table";
import { FormSwitch, FormSelect } from "~~/components/enigma/base-components/Form";
import AddDiscount from "~~/components/discount/AddDiscount.vue";
import AddPage from "~~/components/page/AddPage.vue";
import { useQueryParamStore } from "~/store/enigma/query-param";

definePageMeta({
  middleware: ["auth"],
  layout: "simple-menu-new",
});
useHead({
  title: "Discount: " + useRuntimeConfig().public.company,
});
const router = useRouter();
const queryParam = useQueryParamStore().queryParam
if (queryParam && queryParam.discounts) {
  await router.push({ path: `/catalog/discounts`, query: queryParam.discounts });
}
useQueryParamStore().setQueryParam({})
const {
  setArchiveId,
  discountList,
  archive,
  statusChange,
  deleteConfirmationModal,
} = useDiscount();

const route = useRoute();
const editLink = (id: Number) => {
  const currentQuery = { discounts: { ...route.query } };
  if (route.query) {
    useQueryParamStore().setQueryParam(currentQuery)
  }
  router.push("/catalog/discounts/" + id);
};

const dataLoaded = ref(false)
let discounts: any = ref([]);
let lastPage: any = ref(1);
let currentPage: any = ref(1);
let keywordString: any = ref('');
let discountStatus: any = ref('')
let orderBy: any = ref('');
let orderType: any = ref('');
const fetchData = async () => {
  const result = await discountList();
  discounts = result.discounts;
  lastPage = result.lastPage;
  currentPage = result.currentPage;
  keywordString = result.keywordString;
  discountStatus = result.discountStatus;
  orderBy = result.orderBy;
  orderType = result.orderType;
  dataLoaded.value = true
}
const fetchList = async () => {
  currentPage.value = 1;
  await fetchData();
};

const changeStatus = async (value: boolean, id: number) => {
  let form = { status: value };
  await statusChange(form, id);
};
const searchByKeyword = async (event: any) => {
  createNewPathAndPush("keyword", event.target.value, true);
  await fetchList();
};
const setStatus = async (event: any) => {
  createNewPathAndPush("status", event.target.value, true);
  await fetchList();
};

const setConfirmationModal = (value: boolean) => {
  deleteConfirmationModal.value = value;
};
const modalShow = ref(false);
const setModal = (value: boolean) => {
  modalShow.value = value;
};
onMounted(async () => {
  await nextTick();
  await fetchData();
});
const headerColumns = ref([
  { label: 'ID', field: 'id', sortable: true },
  { label: 'NAME', field: 'name', sortable: true },
  { label: 'DISPLAY', field: 'display', sortable: true },
  { label: 'DATE', field: 'start_date', sortable: true },
  { label: 'PUBLISHED', field: 'status', sortable: true },
  { label: '', field: '', sortable: false, extraClass: "text-center" },
]);
const changeOrder = async (order_by: string) => {
  await changeOrderBy(order_by, orderBy, orderType, fetchList);
}
</script>

<template>
  <h2 class="mt-10 text-lg font-medium intro-y">Discounts</h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
      <Button variant="primary" @click="setModal(true)" class="mr-2 shadow-md">
        Create Discount
      </Button>

      <div class="hidden mx-auto md:block text-slate-500">
        <!-- Showing 1 to 10 of 150 entries -->
      </div>
      <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0" v-if="dataLoaded">
        <FormSelect class="w-48 ml-0 mr-3 xl:w-auto !box" v-model="discountStatus" @change="setStatus($event)">
          <option value="" key="0">Select Status</option>
          <option value="1" key="2">Published</option>
          <option value="0" key="1">Not Published</option>
        </FormSelect>
      </div>
      <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
        <div class="relative w-56 text-slate-500">
          <LiveSearch :key="keywordString" v-model="keywordString" :searchByKeyword="searchByKeyword" />
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
          <Table.Tr v-if="discounts.length == 0 && dataLoaded" class="intro-x">
            <Table.Td colspan="6" class="py-0 px-0">
              <AlertGray />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-for="discount in discounts" @click="editLink(discount.id)" :class="'cursor-pointer'"
            :key="discount.id" class="intro-x">
            <Table.Td>
              {{ discount.id }}
            </Table.Td>
            <Table.Td>
              {{ discount.name }}
            </Table.Td>
            <Table.Td>
              {{ discount.display }}
            </Table.Td>
            <Table.Td>
              <div v-if="discount.start_date && discount.exp_date">
                {{ formatDate(discount.start_date) }} to {{ formatDate(discount.exp_date) }}
              </div>

            </Table.Td>
            <Table.Td>
              <FormSwitch.Input type="checkbox" :key="discount.status" v-model="discount.status" @click="(event: any) => {
                event.preventDefault();
                changeStatus(!discount.status, discount.id);
                event.stopPropagation();
              }
                " />
            </Table.Td>

            <Table.Td>
              <div class="flex items-center justify-center">
                <NuxtLink class="flex text-danger cursor-pointer" @click="(event) => {
                  event.preventDefault();
                  setArchiveId(discount.id);
                  setConfirmationModal(true);
                  event.stopPropagation();
                }
                  ">
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

    <Pagination v-model="currentPage" :key="currentPage" v-if="dataLoaded" :getList="fetchData" :numberOfPages="lastPage" />
  </div>
  <!-- BEGIN: Delete Confirmation Modal -->
  <Confirmation v-model="deleteConfirmationModal" :setConfirmationModal="setConfirmationModal" :set-id="setArchiveId"
    sub-header="Do you really want to delete this discount?" :functionToRun="archive" />
  <AddDiscount :modal-show="modalShow" :set-modal="setModal" />
</template>
