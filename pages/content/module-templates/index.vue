<script setup lang="ts">
import _ from "lodash";
import Button from "~/components/enigma/base-components/Button";
import { FormSelect } from "~/components/enigma/base-components/Form";
import Lucide from "~/components/enigma/base-components/Lucide";
import Table from "~/components/enigma/base-components/Table";
import Confirmation from "~~/components/Confirmation.vue";
import AddModuleTemplate from "~/components/moduleTemplates/AddModuleTemplate.vue"
import { useQueryParamStore } from "~/store/enigma/query-param";


definePageMeta({
  middleware: ["auth"],
  layout: "simple-menu-new",
});

useHead({
  title: "Module Templates: " + useRuntimeConfig().public.company,
});
const router = useRouter();
const queryParam = useQueryParamStore().queryParam
if(queryParam && queryParam.module_templates)
{ 
  await router.push({ path: `/content/module-templates`, query: queryParam.module_templates });
}
useQueryParamStore().setQueryParam({})
const route = useRoute();
const editLink = (id: Number) => {
  const currentQuery = {module_templates:{ ...route.query }};
  if(route.query)
  {
    useQueryParamStore().setQueryParam(currentQuery)
  }
  router.push("/content/module-templates/" + id);
};

const {
  list,
  deleteModuleTemplate,
  deleteConfirmationModal,
  setDeleteId
} = useModuleTemplates();

const {
  getModuleTemplate
} = useProductSiteSetting();

let templates: any = ref([]);

const modalShow = ref(false);
const setModel = (value: boolean) => {
  modalShow.value = value;
};

const searchByKeyword = async (value: any) => {
  currentPage.value = 1;
  createNewPathAndPush("keyword", value, true);
  await list();
};

const setTemplateId = async (event: any) => {
  currentPage.value = 1;
  createNewPathAndPush("parent_template_id", event.target.value, true);
  await list();
};
const setConfirmationModal = (value: boolean) => {
  deleteConfirmationModal.value = value;
};

const dataLoaded = ref(false)
let moduleTemplates:any = ref([]);
let lastPage:any = ref(1);
let currentPage:any = ref(1);
let keywordString:any = ref('');
let templateId:any = ref(1);
let orderBy: any = ref('');
let orderType: any = ref('');

const fetchData = async ()=>{
  const result = await list();
  moduleTemplates = result.moduleTemplates;
  lastPage = result.lastPage;
  currentPage = result.currentPage;
  keywordString = result.keywordString;
  templateId = result.templateId;
  orderBy = result.orderBy;
  orderType = result.orderType;
  templates = await getModuleTemplate();
  dataLoaded.value = true
}
onMounted(async () => {
  await nextTick();
  await fetchData();
});
const fetchList = async () => {
  currentPage.value = 1;
  await list();
};
const headerColumns = ref([
  { label: 'ID', field: 'id', sortable: true },
  { label: 'NAME', field: 'name', sortable: true },
  { label: 'PARENT', field: '', sortable: false },
  { label: '', field: '', sortable: false, extraClass: "text-center" },
]);
const changeOrder = async (order_by: string) => {
  await changeOrderBy(order_by, orderBy, orderType, fetchList);
}
</script>

<template>
  <h2 class="mt-10 text-lg font-medium intro-y">Module Templates</h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
      <Button variant="primary" class="mr-2 shadow-md" @click="setModel(true)">
        Add A Module Template</Button>

      <div class="hidden mx-auto md:block text-slate-500">
        <!-- Showing 1 to 10 of 150 entries -->
      </div>
      <div class="flex mr-3 mt-3 sm:w-auto sm:mt-0" v-if="dataLoaded">
        <FormSelect v-model="templateId" @change="setTemplateId($event)">
          <option value="0" key="0">All Parent Template</option>
          <option :value="template.id" v-for="template in templates" :key="template.id">
            {{ template.name }}
          </option>
        </FormSelect>
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
            <Table.Td colspan="6" class="py-0 px-0">
              <TableLoading />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-if="moduleTemplates.length == 0 && dataLoaded" class="intro-x">
            <Table.Td colspan="6" class="py-0 px-0">
              <AlertGray />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-for="moduleTemplate in moduleTemplates" @click="() => {
            editLink(moduleTemplate.id)
          }" class="cursor-pointer intro-x" :key="moduleTemplate.id">
            <Table.Td>
              {{ moduleTemplate.id }}
            </Table.Td>
            <Table.Td>
              {{ moduleTemplate.name }}
            </Table.Td>
            <Table.Td>
              {{ moduleTemplate.parent_template ? moduleTemplate.parent_template.name : "Root Template" }}
            </Table.Td>

            <Table.Td>
              <div class="flex items-center justify-center">
                <NuxtLink class="flex text-danger cursor-pointer" @click="(event) => {
                  event.preventDefault();
                  setDeleteId(moduleTemplate.id);
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
    sub-header="Do you really want to delete this module template?" :functionToRun="deleteModuleTemplate" />
  <AddModuleTemplate :modal-show="modalShow" :templates="templates" :set-modal="setModel" :refresh="list" />
</template>
