<script setup lang="ts">
import _ from "lodash";
import Button from "~/components/enigma/base-components/Button";
import Lucide from "~/components/enigma/base-components/Lucide";
import Table from "~/components/enigma/base-components/Table";
import Confirmation from "~~/components/Confirmation.vue";
import AddDisplayTemplate from "~~/components/displayTemplate/AddDisplayTemplate.vue";
import EditDisplayTemplate from "~~/components/displayTemplate/EditDisplayTemplate.vue";
import { useQueryParamStore } from "~/store/enigma/query-param";

definePageMeta({
  middleware: ["auth"],
  layout: "simple-menu-new",
});

useHead({
  title: "Display Templates: " + useRuntimeConfig().public.company,
});

useQueryParamStore().setQueryParam({})
const { list, deleteDisplayTemplate, deleteConfirmationModal, setDeleteId } = useDisplayTemplates();

const dataLoaded = ref(false)
let displayTemplates:any = ref([]);
let lastPage:any = ref(1);
let currentPage:any = ref(1);
let keywordString:any = ref('');
let orderBy: any = ref('');
let orderType: any = ref('');


const fetchData = async ()=>{
  const result = await list();
  displayTemplates = result.displayTemplates;
  lastPage = result.lastPage;
  currentPage = result.currentPage;
  keywordString = result.keywordString;
  orderBy = result.orderBy;
  orderType = result.orderType;
  dataLoaded.value = true
}

const displayTemplate = ref({ id: 0 });
const addKey = ref(1)

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
const modalShowEdit = ref(false);
const setDisplayTemplateAndOpenModal = (obj: any) => {
  addKey.value = addKey.value + 1
  displayTemplate.value = obj;
  setModelEdit(true);
};
const setModelEdit = (value: boolean) => {
  modalShowEdit.value = value;
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
  { label: 'NAME', field: 'name', sortable: true },
  { label: 'INCLUDE', field: 'include', sortable: true },
  { label: 'TYPE', field: 'type_id', sortable: true },
  { label: '', field: '', sortable: false, extraClass: "text-center" },
]);
const changeOrder = async (order_by: string) => {
  await changeOrderBy(order_by, orderBy, orderType, fetchList);
}
</script>

<template>
  <h2 class="mt-10 text-lg font-medium intro-y">Display Templates</h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
      <Button variant="primary" class="mr-2 shadow-md" @click="setModel(true)">
        Create Display Template</Button>
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
        <SortableTableHeader :columns="headerColumns" :orderBy="orderBy" :orderType="orderType"
          :handleSort="changeOrder" :v-if="dataLoaded" />
        <Table.Tbody>
          <Table.Tr v-if="!dataLoaded" class="intro-x">
            <Table.Td colspan="7" class="py-0 px-0">
              <TableLoading />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-if="displayTemplates.length == 0 && dataLoaded" class="intro-x">
            <Table.Td colspan="7" class="py-0 px-0">
              <AlertGray />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-for="displayTemplate in displayTemplates" class="cursor-pointer intro-x" :key="displayTemplate.id"
            @click="setDisplayTemplateAndOpenModal(displayTemplate)">
            <Table.Td>
              {{ displayTemplate.name }}
            </Table.Td>
            <Table.Td>
              {{ displayTemplate.include }}
            </Table.Td>
            <Table.Td>
              {{ displayTemplate.type.name }}
            </Table.Td>

            <Table.Td>
              <div class="flex items-center justify-center">
                <NuxtLink class="flex text-danger cursor-pointer" @click="(event) => {
                  event.preventDefault();
                  setDeleteId(displayTemplate.id);
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

    <Pagination v-model="currentPage" :key="currentPage" v-if="dataLoaded" :getList="list" :numberOfPages="lastPage" />
  </div>
  <Confirmation v-model="deleteConfirmationModal" :setConfirmationModal="setConfirmationModal" :set-id="setDeleteId"
    sub-header="Do you really want to delete this Display Template?" :functionToRun="deleteDisplayTemplate"
    button-string-main="Delete" />
  <AddDisplayTemplate :key="addKey" :modal-show="modalShow" :set-modal="setModel" :refresh="list" />
  <EditDisplayTemplate :key="displayTemplate.id" v-model="displayTemplate" :modal-show="modalShowEdit"
    :set-modal="setModelEdit" :refresh="list" />
</template>
