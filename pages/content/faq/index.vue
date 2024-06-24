<script setup lang="ts">
import SortableTableHeader from "~/components/SortableTableHeader.vue";
import Button from "~/components/enigma/base-components/Button";
import Lucide from "~/components/enigma/base-components/Lucide";
import Table from "~/components/enigma/base-components/Table";
import { FormSwitch } from "~~/components/enigma/base-components/Form";
import { useQueryParamStore } from "~/store/enigma/query-param";

definePageMeta({
  middleware: ["auth"],
  layout: "simple-menu-new",
});
useHead({
  title: "Faqs: " + useRuntimeConfig().public.company,
});
const router = useRouter();
const queryParam = useQueryParamStore().queryParam
if(queryParam && queryParam.faqs)
{ 
  await router.push({ path: `/content/faq`, query: queryParam.faqs });
}
useQueryParamStore().setQueryParam({})

const {
  setArchiveId,
  list,
  deleteFaq,
  statusChange,
  deleteConfirmationModal,
} = useFaqs();

const dataLoaded = ref(false)
let faqs:any = ref([]);
let lastPage:any = ref(1);
let currentPage:any = ref(1);
let keywordString:any = ref('');
let orderBy:any = ref('');
let orderType:any = ref('');


const fetchData = async ()=>{
  const result = await list();
  faqs = result.faqs;
  lastPage = result.lastPage;
  currentPage = result.currentPage;
  keywordString = result.keywordString;
  orderBy = result.orderBy;
  orderType = result.orderType;
  dataLoaded.value = true
}
const fetchList = async () => {
  currentPage.value = 1;
  await list();
};
const createLink = () => {
  router.push("/content/faq/create");
};
const changeOrder = async (order_by: string) => {
  await changeOrderBy(order_by, orderBy, orderType, fetchList);
}
const route = useRoute();
const editLink = (id: Number) => {
  const currentQuery = {faqs:{ ...route.query }};
  if(route.query)
  {
    useQueryParamStore().setQueryParam(currentQuery)
  }
  router.push("/content/faq/" + id);
};

const changeStatus = async (value: boolean, id: number) => {
  let form = { status: value };
  await statusChange(form, id);
};
const searchByKeyword = async (event: any) => {
  createNewPathAndPush("keyword", event.target.value, true);
  await fetchList();
};

const setConfirmationModal = (value: boolean) => {
  deleteConfirmationModal.value = value;
};
const headerColumns = ref([
  { label: 'ID', field: 'id', sortable: true },
  { label: 'QUESTION', field: 'question', sortable: true },
  { label: 'RANK', field: 'rank', sortable: true },
  { label: 'ACTIVE', field: 'active', sortable: false }, // Add ACTIVE column
  { label: '', field: '', sortable: false }, // Add empty column
]);
onMounted(async () => {
  await nextTick();
  await fetchData();
});
</script>

<template>
  <h2 class="mt-10 text-lg font-medium intro-y">FAQ</h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
      <Button variant="primary" @click="createLink" class="mr-2 shadow-md">
        Create FAQ
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
      <Table class="border-spacing-y-[10px] border-separate -mt-2 hover">
        <SortableTableHeader :columns="headerColumns" :orderBy="orderBy" :orderType="orderType"
          :handleSort="changeOrder" :v-if="dataLoaded" />
        
        <Table.Tbody>
          <Table.Tr v-if="!dataLoaded" class="intro-x">
            <Table.Td colspan="5" class="py-0 px-0">
              <TableLoading />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-if="faqs.length == 0 && dataLoaded" class="intro-x">
            <Table.Td colspan="5" class="py-0 px-0">
              <AlertGray />
            </Table.Td>
          </Table.Tr>
          <Table.Tr
            v-for="faq in faqs"
            @click="editLink(faq.id)"
            :class="'cursor-pointer'"
            :key="faq.id"
            class="intro-x"
          >
            <Table.Td>
              {{ faq.id }}
            </Table.Td>
            <Table.Td>
              {{ faq.question }}
            </Table.Td>
            <Table.Td>
              {{ faq.rank }}
            </Table.Td>
            <Table.Td>
              <FormSwitch.Input
                type="checkbox"
                :key="faq.status"
                v-model="faq.status"
                @click="
                    (event:any) => {
                      event.preventDefault();
                      changeStatus(!faq.status, faq.id);
                      event.stopPropagation();
                    }
                  "
              />
            </Table.Td>

            <Table.Td>
              <div class="flex items-center justify-center">
                <NuxtLink
                  class="flex text-danger cursor-pointer"
                  @click="
                    (event) => {
                      event.preventDefault();
                      setArchiveId(faq.id);
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
    :set-id="setArchiveId"
    sub-header="Do you really want to delete this faq?"
    :functionToRun="deleteFaq"
  />
</template>
