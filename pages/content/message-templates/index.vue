<script setup lang="ts">
import _ from "lodash";
import Button from "~/components/enigma/base-components/Button";
import { FormSelect } from "~/components/enigma/base-components/Form";
import Lucide from "~/components/enigma/base-components/Lucide";
import Table from "~/components/enigma/base-components/Table";
import Confirmation from "~~/components/Confirmation.vue";
import { useQueryParamStore } from "~/store/enigma/query-param";

definePageMeta({
  middleware: ["auth"],
  layout: "simple-menu-new",
});

useHead({
  title: "Message Templates: " + useRuntimeConfig().public.company,
});
const router = useRouter();
const queryParam = useQueryParamStore().queryParam
if(queryParam && queryParam.message_templates)
{ 
  await router.push({ path: `/content/message-templates`, query: queryParam.message_templates });
}
useQueryParamStore().setQueryParam({})
const route = useRoute();
const editLink = (id: Number) => {
  const currentQuery = {message_templates:{ ...route.query }};
  if(route.query)
  {
    useQueryParamStore().setQueryParam(currentQuery)
  }
  router.push("/content/message-templates/" + id);
};

const {
  list,
  deleteMessageTemplate,
  deleteConfirmationModal,
  setDeleteId
} = useMessageTemplates();

const {
  categories
} = useProducts();

let categoryList:any = ref([]);

const createLink = () => {
  router.push("/content/message-templates/create");
};

const searchByKeyword = async (value: any) => {
  currentPage.value = 1;
  createNewPathAndPush("keyword", value, true);
  await list();
};

const setCategoryId = async (event: any) => {
  currentPage.value = 1;
  createNewPathAndPush("category_id", event.target.value, true);
  await list();
};
const setConfirmationModal = (value: boolean) => {
  deleteConfirmationModal.value = value;
};
const dataLoaded = ref(false)
let messageTemplates:any = ref([]);
let lastPage:any = ref(1);
let currentPage:any = ref(1);
let keywordString:any = ref('');
let categoryId:any = ref(1);
let orderBy: any = ref('');
let orderType: any = ref('');

const fetchData = async ()=>{
  const result = await list();
  messageTemplates = result.messageTemplates;
  lastPage = result.lastPage;
  currentPage = result.currentPage;
  keywordString = result.keywordString;
  categoryId = result.categoryId;
  orderBy = result.orderBy;
  orderType = result.orderType;
  categoryList = await categories();
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
  { label: 'SUBJECT', field: 'subject', sortable: true },
  { label: 'NOTES', field: 'notes', sortable: true },
  { label: 'CATEGORY', field: 'category_id', sortable: true },
  { label: '', field: '', sortable: false, extraClass: "text-center" },
]);
const changeOrder = async (order_by: string) => {
  await changeOrderBy(order_by, orderBy, orderType, fetchList);
}
</script>

<template>
  <h2 class="mt-10 text-lg font-medium intro-y">Message Template</h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
      <Button variant="primary" class="mr-2 shadow-md" @click="createLink">
        Create New Message Template</Button>

      <div class="hidden mx-auto md:block text-slate-500">
        <!-- Showing 1 to 10 of 150 entries -->
      </div>
      <div class="flex mr-3 mt-3 sm:w-auto sm:mt-0" v-if="dataLoaded">
        <FormSelect v-model="categoryId" @change="setCategoryId($event)">
          <option value="0" key="0">All Categories</option>
          <option :value="option.id" v-for="option in categoryList" :key="option.id">
            {{ option.title }}
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
          <Table.Tr v-if="messageTemplates.length == 0 && dataLoaded" class="intro-x">
            <Table.Td colspan="6" class="py-0 px-0">
              <AlertGray />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-for="messageTemplate in messageTemplates" @click="() => {
            editLink(messageTemplate.id)
          }" class="cursor-pointer intro-x" :key="messageTemplate.id">
            <Table.Td>
              {{ messageTemplate.id }}
            </Table.Td>
            <Table.Td>
              {{ messageTemplate.name }}
            </Table.Td>
            <Table.Td>
              {{ messageTemplate.subject }}
            </Table.Td>
            <Table.Td>
              {{ messageTemplate.notes }}
            </Table.Td>
            <Table.Td>
              {{ messageTemplate.category ? messageTemplate.category.name : "No Category" }}
            </Table.Td>

            <Table.Td>
              <div class="flex items-center justify-center">
                <NuxtLink class="flex text-danger cursor-pointer" @click="(event) => {
                  event.preventDefault();
                  setDeleteId(messageTemplate.id);
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
    sub-header="Do you really want to delete this message template?" :functionToRun="deleteMessageTemplate" />
</template>
