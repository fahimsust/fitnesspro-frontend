<script setup lang="ts">
import Button from "~/components/enigma/base-components/Button";
import Lucide from "~/components/enigma/base-components/Lucide";
import Table from "~/components/enigma/base-components/Table";
import AddForm from "~~/components/customForms/AddForm.vue";
import { FormSwitch } from "~~/components/enigma/base-components/Form";
import { useQueryParamStore } from "~/store/enigma/query-param";

definePageMeta({
  middleware: ["auth"],
  layout: "simple-menu-new",
});
useHead({
  title: "Custom Forms: " + useRuntimeConfig().public.company,
});
const router = useRouter();
const queryParam = useQueryParamStore().queryParam
if(queryParam && queryParam.customforms)
{ 
  await router.push({ path: `/customforms`, query: queryParam.customforms });
}
useQueryParamStore().setQueryParam({})

const {
  setArchiveId,
  list, 
  deleteCustomForm,
  updateCustomForm,
  deleteConfirmationModal,
  errors
} = useCustomForms();
const route = useRoute();
const editLink = (id: Number) => {
  const currentQuery = {customforms:{ ...route.query }};
  if(route.query)
  {
    useQueryParamStore().setQueryParam(currentQuery)
  }
  router.push("/customforms/" + id);
};
const fetchList = async () => {
  currentPage.value = 1;
  await list();
};

const searchByKeyword = async (value: any) => {
  createNewPathAndPush("keyword", value, true);
  await fetchList();
};

const setConfirmationModal = (value: boolean) => {
  deleteConfirmationModal.value = value;
};
const modalShow = ref(false);
const setModal = (value: boolean) => {
  modalShow.value = value;
};

const formValidationAndEdit = async (status: any, customForm: any,) => {
  let form = reactive({
    name: customForm.name,
    status: status == "on" ? false : true,
  });
  await updateCustomForm(form, customForm.id);
  validationFocus(form, errors);
};
const dataLoaded = ref(false)
let customForms:any = ref([]);
let lastPage:any = ref(1);
let currentPage:any = ref(1);
let keywordString:any = ref('');
let orderBy: any = ref('');
let orderType: any = ref('');

const fetchData = async ()=>{
  const result = await list();
  customForms = result.customForms;
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
const headerColumns = ref([
  { label: 'ID', field: 'id', sortable: true },
  { label: 'NAME', field: 'name', sortable: true },
  { label: 'ACTIVE', field: 'status', sortable: true },
  { label: '', field: '', sortable: false }
]);
const changeOrder = async (order_by: string) => {
  await changeOrderBy(order_by, orderBy, orderType, fetchList);
}
</script>

<template>
  <h2 class="mt-10 text-lg font-medium intro-y">Custom Forms</h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
      <Button variant="primary" @click="setModal(true)" class="mr-2 shadow-md">
        Create Custom Form
      </Button>

      <div class="hidden mx-auto md:block text-slate-500">
        <!-- Showing 1 to 10 of 150 entries -->
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
          <Table.Tr v-if="customForms.length == 0 && dataLoaded" class="intro-x">
            <Table.Td colspan="4" class="py-0 px-0">
              <AlertGray />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-for="customForm in customForms" @click="editLink(customForm.id)" :class="'cursor-pointer'"
            :key="customForm.id" class="intro-x">
            <Table.Td>
              {{ customForm.id }}
            </Table.Td>
            <Table.Td>
              {{ customForm.name }}
            </Table.Td>
            <Table.Td>
              <div class="flex items-center">
                <FormSwitch.Input type="checkbox" v-model="customForm.status" @click="(e) => e.stopPropagation()"
                  @change="formValidationAndEdit(($event.target as HTMLInputElement).value, customForm)" />
              </div>
            </Table.Td>

            <Table.Td>
              <div class="flex items-center justify-center">
                <NuxtLink class="flex text-danger cursor-pointer" @click="(event) => {
                  event.preventDefault();
                  setArchiveId(customForm.id);
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

    <Pagination v-model="currentPage" :key="currentPage" v-if="dataLoaded" :getList="list" :numberOfPages="lastPage" />
  </div>
  <!-- BEGIN: Delete Confirmation Modal -->
  <Confirmation v-model="deleteConfirmationModal" :setConfirmationModal="setConfirmationModal" :set-id="setArchiveId"
    sub-header="Do you really want to delete this Custom form?" :functionToRun="deleteCustomForm" />
  <AddForm :modal-show="modalShow" :set-modal="setModal" />
</template>
