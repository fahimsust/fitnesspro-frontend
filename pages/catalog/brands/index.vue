<script setup lang="ts">
import _ from "lodash";
import Button from "~/components/enigma/base-components/Button";
import Lucide from "~/components/enigma/base-components/Lucide";
import Table from "~/components/enigma/base-components/Table";
import Confirmation from "~~/components/Confirmation.vue";
import EditBrand from "~~/components/brand/EditBrand.vue";
import AddBrand from "~~/components/brand/AddBrand.vue";
import { useQueryParamStore } from "~/store/enigma/query-param";

definePageMeta({
  middleware: ["auth"],
  layout: "simple-menu-new",
});

useHead({
  title: "Brands: " + useRuntimeConfig().public.company,
});

useQueryParamStore().setQueryParam({})
const { list, deleteBrand, deleteConfirmationModal, setDeleteId } = useBrands();

const dataLoaded = ref(false)
let brands:any = ref([]);
let lastPage:any = ref(1);
let currentPage:any = ref(1);
let keywordString:any = ref('');
let orderBy:any = ref('');
let orderType:any = ref('');

const fetchData = async ()=>{
  const result = await list();
  brands = result.brands;
  lastPage = result.lastPage;
  currentPage = result.currentPage;
  keywordString = result.keywordString;
  orderBy = result.orderBy;
  orderType = result.orderType;
  dataLoaded.value = true
}

const brand = ref({ id: 0 });

const searchByKeyword = async (event: any) => {
  currentPage.value = 1;
  createNewPathAndPush("keyword", event.target.value, true);
  await list();
};
const setConfirmationModal = (value: boolean) => {
  deleteConfirmationModal.value = value;
};
const modalShow = ref(false);
const setModel = (value: boolean) => {
  modalShow.value = value;
};
const slideover = ref(false);
const setBrandAndOpenSlideOver = (obj: any) => {
  brand.value = obj;
  setSlideover(true);
};
const setSlideover = (value: boolean) => {
  slideover.value = value;
};
onMounted(async () => {
  await nextTick();
  await fetchData();
});
const fetchList = async () => {
  currentPage.value = 1;
  await fetchData();
};
const headerColumns = ref([
  { label: 'ID', field: 'id', sortable: true },
  { label: 'NAME', field: 'name', sortable: true },
  { label: '', field: '', sortable: false,extraClass:"text-center" },
]);
const changeOrder = async (order_by: string) => {
  await changeOrderBy(order_by, orderBy, orderType, fetchList);
}
</script>

<template>
  <h2 class="mt-10 text-lg font-medium intro-y">Brands</h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
      <Button variant="primary" class="mr-2 shadow-md" @click="setModel(true)">
        Create New Brand</Button>
      <div class="hidden mx-auto md:block text-slate-500">
        <!-- Showing 1 to 10 of 150 entries -->
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
        <SortableTableHeader
          :columns="headerColumns"
          :orderBy="orderBy"
          :orderType="orderType"
          :handleSort="changeOrder"
          :v-if="dataLoaded"
        />
        <Table.Tbody>
          <Table.Tr v-if="!dataLoaded" class="intro-x">
            <Table.Td colspan="3" class="py-0 px-0">
              <TableLoading />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-if="brands.length == 0 && dataLoaded" class="intro-x">
            <Table.Td colspan="3" class="py-0 px-0">
              <AlertGray />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-for="brand in brands" class="cursor-pointer intro-x" :key="brand.id"
            @click="setBrandAndOpenSlideOver(brand)">
            <Table.Td>
              {{ brand.id }}
            </Table.Td>
            <Table.Td>
              {{ brand.name }}
            </Table.Td>

            <Table.Td>
              <div class="flex items-center justify-center">
                <NuxtLink class="flex text-danger cursor-pointer" @click="(event) => {
                  event.preventDefault();
                  setDeleteId(brand.id);
                  setConfirmationModal(true);
                  event.stopPropagation();
                }
                  ">
                  <Lucide icon="Trash2" class="w-4 h-4 mr-1" />
                  <span class="hidden">Remove</span>
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
  <Confirmation v-model="deleteConfirmationModal" :setConfirmationModal="setConfirmationModal" :set-id="setDeleteId"
    sub-header="Do you really want to delete this brand?" :functionToRun="deleteBrand" button-string-main="Delete" />
  <AddBrand :modal-show="modalShow" :setBrandAndOpenSlideOver="setBrandAndOpenSlideOver" :set-modal="setModel"
    :refresh-brand="list" />
  <EditBrand :key="brand.id" v-model="brand" :slideover="slideover" :setSlideover="setSlideover" :refresh-brand="list" />
</template>
