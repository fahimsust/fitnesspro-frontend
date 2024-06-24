<script setup lang="ts">
import _ from "lodash";
import Button from "~/components/enigma/base-components/Button";
import { FormSelect } from "~/components/enigma/base-components/Form";
import Lucide from "~/components/enigma/base-components/Lucide";
import Alert from "~/components/enigma/base-components/Alert";
import Table from "~/components/enigma/base-components/Table";
import Confirmation from "~~/components/Confirmation.vue";
import EditProductType from "~~/components/productType/EditProductType.vue";
import AddProductType from "~~/components/productType/AddProductType.vue";
import { useQueryParamStore } from "~/store/enigma/query-param";

definePageMeta({
  middleware: ["auth"],
  layout: "simple-menu-new",
});

useHead({
  title: "Product Type: " + useRuntimeConfig().public.company,
});

useQueryParamStore().setQueryParam({})
const {
  list,
  deleteProductType,
  deleteConfirmationModal,
  setArchiveId,
  attributeSets,
} = useProductType();

const dataLoaded = ref(false)
let productTypes:any = ref([]);
let lastPage:any = ref(1);
let currentPage:any = ref(1);
let keywordString:any = ref('');
let attributeId:any = ref(0);
let attributeList: any = ref([])
let orderBy: any = ref('');
let orderType: any = ref('');
const fetchData = async ()=>{
  const result = await list();
  productTypes = result.productTypes;
  lastPage = result.lastPage;
  currentPage = result.currentPage;
  keywordString = result.keywordString;
  attributeId = result.attributeId;
  orderBy = result.orderBy;
  orderType = result.orderType;
  attributeList = await attributeSets();
  dataLoaded.value = true
}
const productType = ref({ id: 0 });

const searchByKeyword = async (event: any) => {
  currentPage.value = 1;
  createNewPathAndPush("keyword", event.target.value, true);
  await list();
};

const setAttributeId = async (event: any) => {
  currentPage.value = 1;
  createNewPathAndPush("attribute_set_id", event.target.value, true);
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
const setTypeAndOpenSlideOver = (obj: any) => {
  productType.value = obj;
  setSlideover(true);
};
const setSlideover = (value: boolean) => {
  slideover.value = value;
};
const pluck = (arr: any, key: string) => arr.map((i: { [x: string]: any }) => i[key]);
const AttriobuteSetsString = (arr: any, key: string) => {
  let attributeSets = "";
  if (arr.length > 0) {
    attributeSets = pluck(arr, key).join(", ");
  }
  return attributeSets;
};
onMounted(async () => {
  await nextTick();
  await fetchData();
});
const fetchList = async()=>{
  currentPage.value = 1
  await list();
}
const headerColumns = ref([
  { label: 'ID', field: 'id', sortable: true },
  { label: 'TYPE', field: 'name', sortable: true },
  { label: 'SETS ASSIGNED', field: '', sortable: false },
  { label: '', field: '', sortable: false, extraClass: "text-center" },
]);
const changeOrder = async (order_by: string) => {
  await changeOrderBy(order_by, orderBy, orderType, fetchList);
}
</script>

<template>
  <h2 class="mt-10 text-lg font-medium intro-y">Product Types</h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
      <Button variant="primary" class="mr-2 shadow-md" @click="setModel(true)">
        Create New Product Type</Button
      >

      <div class="hidden mx-auto md:block text-slate-500">
        <!-- Showing 1 to 10 of 150 entries -->
      </div>
      <div class="flex mr-3 mt-3 sm:w-auto sm:mt-0">
        <FormSelect v-model="attributeId" @change="setAttributeId($event)">
          <option value="0" key="0">All Attribute Sets</option>
          <option :value="option.id" v-for="option in attributeList" :key="option.id">
            {{ option.name }}
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
          <Table.Tr v-if="productTypes.length == 0 && dataLoaded" class="intro-x">
            <Table.Td colspan="4" class="py-0 px-0">
              <AlertGray />
            </Table.Td>
          </Table.Tr>
          <Table.Tr
            v-for="productType in productTypes"
            class="cursor-pointer intro-x"
            :key="productType.id"
            @click="setTypeAndOpenSlideOver(productType)"
          >
            <Table.Td>
              {{ productType.id }}
            </Table.Td>
            <Table.Td>
              {{ productType.name }}
            </Table.Td>
            <Table.Td>
              {{ AttriobuteSetsString(productType.attribute_sets, "name") }}
            </Table.Td>

            <Table.Td>
              <div class="flex items-center justify-center">
                <NuxtLink
                  class="flex text-danger cursor-pointer"
                  @click="
                    (event) => {
                      event.preventDefault();
                      setArchiveId(productType.id);
                      setConfirmationModal(true);
                      event.stopPropagation();
                    }
                  "
                >
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
  <Confirmation
    v-model="deleteConfirmationModal"
    :setConfirmationModal="setConfirmationModal"
    :set-id="setArchiveId"
    sub-header="Do you really want to delete this record?"
    :functionToRun="deleteProductType"
  />
  <AddProductType
    :modal-show="modalShow"
    :setTypeAndOpenSlideOver="setTypeAndOpenSlideOver"
    :set-modal="setModel"
    :refresh-type="list"
  />
  <EditProductType
    :key="productType.id"
    v-model="productType"
    :slideover="slideover"
    :setSlideover="setSlideover"
    :refresh-type="list"
  />
</template>
