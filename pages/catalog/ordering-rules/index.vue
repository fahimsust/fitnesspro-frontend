<script setup lang="ts">
import Button from "~/components/enigma/base-components/Button";
import Lucide from "~/components/enigma/base-components/Lucide";
import Table from "~/components/enigma/base-components/Table";
import { FormSwitch } from "~~/components/enigma/base-components/Form";
import AddRule from "~~/components/orderingRule/AddRule.vue";
import { useQueryParamStore } from "~/store/enigma/query-param";

definePageMeta({
  middleware: ["auth"],
  layout: "simple-menu-new",
});
useHead({
  title: "Ordering Rule: " + useRuntimeConfig().public.company,
});

const {
  setDeleteId,
  list,
  deleteOrderingRule,
  statusChange,
  deleteConfirmationModal,
} = useOrderingRule();

const router = useRouter();
const queryParam = useQueryParamStore().queryParam
if(queryParam && queryParam.ordering_rules)
{ 
  await router.push({ path: `/catalog/ordering-rules`, query: queryParam.ordering_rules });
}
useQueryParamStore().setQueryParam({})
const route = useRoute();
const editLink = (id: Number) => {
  const currentQuery = {ordering_rules:{ ...route.query }};
  if(route.query)
  {
    useQueryParamStore().setQueryParam(currentQuery)
  }
  router.push("/catalog/ordering-rules/" + id);
};

const dataLoaded = ref(false)
let orderingRules:any = ref([]);
let lastPage:any = ref(1);
let currentPage:any = ref(1);
let keywordString:any = ref('');
let orderBy: any = ref('');
let orderType: any = ref('');

const fetchData = async ()=>{
  const result = await list();
  orderingRules = result.orderingRules;
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
  { label: 'RULE', field: 'name', sortable: true },
  { label: 'NO. OF CONDITION', field: 'conditions_count', sortable: true },
  { label: 'NO. OF CHILD RULES', field: 'child_rules_count', sortable: true },
  { label: 'ACTIVE', field: 'status', sortable: true },
  { label: '', field: '', sortable: false, extraClass: "text-center" },
]);
const changeOrder = async (order_by: string) => {
  await changeOrderBy(order_by, orderBy, orderType, fetchList);
}
</script>

<template>
  <h2 class="mt-10 text-lg font-medium intro-y">Ordering Rules</h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
      <Button variant="primary" @click="setModal(true)" class="mr-2 shadow-md">
        Create Ordering Rule
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
            <Table.Td colspan="6" class="py-0 px-0">
              <TableLoading />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-if="orderingRules.length == 0 && dataLoaded" class="intro-x">
            <Table.Td colspan="6" class="py-0 px-0">
              <AlertGray />
            </Table.Td>
          </Table.Tr>
          <Table.Tr
            v-for="orderingRule in orderingRules"
            @click="editLink(orderingRule.id)"
            :class="'cursor-pointer'"
            :key="orderingRule.id"
            class="intro-x"
          >
            <Table.Td>
              {{ orderingRule.id }}
            </Table.Td>
            <Table.Td>
              {{ orderingRule.name }}
            </Table.Td>
            <Table.Td>
              {{ orderingRule.conditions_count }}
            </Table.Td>
            <Table.Td>
              {{ orderingRule.child_rules_count }}
            </Table.Td>
            <Table.Td>
              <FormSwitch.Input
                type="checkbox"
                :key="orderingRule.status"
                v-model="orderingRule.status"
                @click="
                    (event:any) => {
                      event.preventDefault();
                      changeStatus(!orderingRule.status, orderingRule.id);
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
                      setDeleteId(orderingRule.id);
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
    sub-header="Do you really want to delete this ordering rule?"
    :functionToRun="deleteOrderingRule"
  />
  <AddRule :modal-show="modalShow" :set-modal="setModal" :refresh="list" />
</template>
