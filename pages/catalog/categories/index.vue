<script setup lang="ts">
import _ from "lodash";
import Button from "~/components/enigma/base-components/Button";
import Lucide from "~/components/enigma/base-components/Lucide";
import Table from "~/components/enigma/base-components/Table";
import IntSwitch from "~/components/form/IntSwitch.vue";
import { useQueryParamStore } from "~/store/enigma/query-param";

definePageMeta({
  middleware: ["auth"],
  layout: "simple-menu-new",
});

useHead({
  title: "Categories: " + useRuntimeConfig().public.company,
});
const router = useRouter();
const queryParam = useQueryParamStore().queryParam
if (queryParam && queryParam.category) {
  await router.push({ path: `/catalog/categories`, query: queryParam.category });
}
useQueryParamStore().setQueryParam({})
const route = useRoute();
const editLink = (id: Number) => {
  const currentQuery = { category: { ...route.query } };
  if (route.query) {
    useQueryParamStore().setQueryParam(currentQuery)
  }
  router.push("/catalog/categories/" + id);
};

const {
  list,
  deleteCategory,
  deleteConfirmationModal,
  setCategoryId,
  resetPage,
  statusChange,
} = useCategories();

const dataLoaded = ref(false)
let categories: any = ref([]);
let lastPage: any = ref(1);
let currentPage: any = ref(1);
let keywordString: any = ref('');
let orderBy: any = ref('');
let orderType: any = ref('');

const fetchData = async () => {
  const result = await list();
  categories = result.categories;
  lastPage = result.lastPage;
  currentPage = result.currentPage;
  keywordString = result.keywordString;
  orderBy = result.orderBy;
  orderType = result.orderType;
  dataLoaded.value = true
}

const fetchList = async () => {
  resetPage();
  await list();
};
const createLink = () => {
  router.push("/catalog/categories/create");
};
const settingTemplate = () => {
  router.push("/catalog/categories/settings-template");
};

const searchByKeyword = async (event: any) => {
  createNewPathAndPush("keyword", event.target.value, true);
  await fetchList();
};
const setConfirmationModal = (value: boolean) => {
  deleteConfirmationModal.value = value;
};
const changeStatus = async (value: boolean, id: number) => {
  let form = { status: value };
  statusChange(form, id);
  await list();
};
onMounted(async () => {
  await nextTick();
  await fetchData();
});
const headerColumns = ref([
  { label: 'ID', field: 'id', sortable: true },
  { label: 'TITLE', field: 'title', sortable: true },
  { label: 'URL SLUG', field: 'url_name', sortable: true },
  { label: 'ACTIVE', field: 'status', sortable: true },
  { label: '', field: '', sortable: false, extraClass: "text-center" },
]);
const listFetch = async()=>{
  currentPage.value = 1
  await fetchData();
}
const changeOrder = async (order_by: string) => {
  await changeOrderBy(order_by, orderBy, orderType, listFetch);
}
</script>

<template>
  <h2 class="mt-10 text-lg font-medium intro-y">Categories</h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
      <Button @click="createLink" variant="primary" class="mr-2 shadow-md">
        Create New Category
      </Button>
      <Button @click="settingTemplate" variant="primary" class="mr-2 shadow-md">
        Setting Template
      </Button>

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
            <Table.Td colspan="5" class="py-0 px-0">
              <TableLoading />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-if="categories.length == 0 && dataLoaded" class="intro-x">
            <Table.Td colspan="5" class="py-0 px-0">
              <AlertGray />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-for="category in categories" @click="editLink(category.id)" :class="'cursor-pointer'"
            :key="category.id" class="intro-x">
            <Table.Td>
              {{ category.id }}
            </Table.Td>
            <Table.Td>
              {{ category.title }}
            </Table.Td>

            <Table.Td>
              {{ category.url_name }}
            </Table.Td>
            <Table.Td>
              <IntSwitch :change-status="changeStatus" :cat_id="category.id" :key="category.status"
                v-model="category.status" />
            </Table.Td>

            <Table.Td>
              <div class="flex items-center justify-center">
                <NuxtLink class="flex text-danger cursor-pointer" @click="(event) => {
                    event.preventDefault();
                    setCategoryId(category.id);
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

    <Pagination v-model="currentPage" v-if="dataLoaded" :key="currentPage" :getList="list" :numberOfPages="lastPage" />
  </div>
  <!-- BEGIN: Delete Confirmation Modal -->
  <Confirmation v-model="deleteConfirmationModal" :setConfirmationModal="setConfirmationModal" :set-id="setCategoryId"
    :functionToRun="deleteCategory" />
</template>
