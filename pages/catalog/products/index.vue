<script setup lang="ts">
import _ from "lodash";
import Button from "~/components/enigma/base-components/Button";
import { FormSelect, FormLabel } from "~/components/enigma/base-components/Form";
import Lucide from "~/components/enigma/base-components/Lucide";
import Alert from "~/components/enigma/base-components/Alert";
import { Popover } from "~/components/enigma/base-components/Headless";
import Table from "~/components/enigma/base-components/Table";
import EditVariantVue from "~/components/product/EditVariant.vue";
import { useQueryParamStore } from "~/store/enigma/query-param";

definePageMeta({
  middleware: ["auth"],
  layout: "simple-menu-new",
});

useHead({
  title: "Products: " + useRuntimeConfig().public.company,
});
const router = useRouter();
const queryParam = useQueryParamStore().queryParam
if(queryParam && queryParam.products)
{ 
  await router.push({ path: `/catalog/products`, query: queryParam.products });
}
useQueryParamStore().setQueryParam({})
const route = useRoute();
const editLink = (id: number, parent: any) => {
  if (parent == null) {
    const currentQuery = {products:{ ...route.query }};
    if(route.query)
    {
      useQueryParamStore().setQueryParam(currentQuery)
    }
    router.push("/catalog/products/" + id);
  } else {
    product_id.value = id;
    setModel(true);
  }
};

const {
  list,
  archive,
  restore,
  deleteConfirmationModal,
  setArchiveId,
  types,
  brands,
  resetPage,
} = useProducts();

const dataLoaded = ref(false)
let products:any = ref([]);
let lastPage:any = ref(1);
let currentPage:any = ref(1);
let keywordString:any = ref('');
let trashed:any = ref(0);
let hideChildren:any = ref(0);
let typeId:any = ref(0)
let brandId:any = ref(0)
let brandList: any = ref([])
let typeList: any = ref([])
let orderBy: any = ref('');
let orderType: any = ref('');


const fetchData = async ()=>{
  const result = await list();
  products = result.products;
  lastPage = result.lastPage;
  currentPage = result.currentPage;
  keywordString = result.keywordString;
  trashed = result.trashed;
  hideChildren = result.hideChildren;
  typeId = result.typeId;
  brandId = result.brandId;
  orderBy = result.orderBy;
  orderType = result.orderType;
  typeList = await types();
  brandList = await brands();
  dataLoaded.value = true
}

const fetchList = async () => {
  resetPage();
  await list();
};
const createLink = () => {
  router.push("/catalog/products/create");
};
const searchByKeyword = async (event: any) => {
  createNewPathAndPush("keyword", event.target.value, true);
  await fetchList();
};
const setTrashed = async (event: any) => {
  createNewPathAndPush("trashed", event.target.value, true);
  await fetchList();
};
const setHideChildren = async () => {
  if (hideChildren.value == 1) {
    hideChildren.value = 0;
    createNewPathAndPush("hide_children", "", true);
  } else {
    hideChildren.value = 1;
    createNewPathAndPush("hide_children", "1", true);
  }
  await fetchList();
};
let buttonClass = computed(() => (hideChildren.value == 1 ? "success" : "primary"));
const setTypeId = async (event: any) => {
  createNewPathAndPush("type_id", event.target.value, true);
  await fetchList();
};
const setBrandId = async (event: any) => {
  createNewPathAndPush("brand_id", event.target.value, true);
  await fetchList();
};
const setConfirmationModal = (value: boolean) => {
  deleteConfirmationModal.value = value;
};
const product_id = ref(0);
const modalShow = ref(false);
const setModel = (value: boolean) => {
  modalShow.value = value;
};
const settingTemplate = () => {
  router.push("/catalog/products/settings-template");
};
onMounted(async () => {
  await nextTick();
  await fetchData();
});
const headerColumns = ref([
  { label: 'ID', field: 'id', sortable: true },
  { label: 'NAME', field: 'title', sortable: true },
  { label: 'SKU', field: 'product_no', sortable: true },
  { label: 'Actions', field: '', sortable: false, extraClass: "text-center" },
]);
const changeOrder = async (order_by: string) => {
  await changeOrderBy(order_by, orderBy, orderType, fetchList);
}
</script>

<template>
  <h2 class="mt-10 text-lg font-medium intro-y">Products</h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
      <Button @click="createLink" variant="primary" class="mr-2 shadow-md">
        Create New Product
      </Button>
      <Button @click="settingTemplate" variant="primary" class="mr-2 shadow-md">
        Setting Template
      </Button>

      <div class="hidden mx-auto md:block text-slate-500">
        <!-- Showing 1 to 10 of 150 entries -->
      </div>

      <Button
        :variant="buttonClass"
        class="mr-2"
        :key="hideChildren"
        @click="setHideChildren"
      >
        {{ hideChildren == 1 ? "Show Children" : "Hide Children" }}
      </Button>
      <Popover
        class="inline-block mr-2 mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0"
        v-slot="{ close }"
      >
        <Popover.Button :as="Button" variant="primary">
          <Lucide icon="Filter" class="w-4 h-4 mr-1" />
          Filter
          <Lucide icon="ChevronDown" class="w-4 h-4 ml-2" />
        </Popover.Button>
        <Popover.Panel placement="bottom-start">
          <div class="p-2">
            <div>
              <FormLabel htmlFor="for_trashed">Status</FormLabel>
              <FormSelect
                class="flex-1 mt-2"
                v-model="trashed"
                @change="setTrashed($event)"
              >
                <option value="0" key="0">Active</option>
                <option value="1" key="1">Archived</option>
              </FormSelect>
            </div>
            <div class="mt-3">
              <FormLabel htmlFor="brand">Brand</FormLabel>
              <FormSelect v-model="brandId" @change="setBrandId($event)">
                <option value="0" key="0">All</option>
                <option :value="option.id" v-for="option in brandList" :key="option.id">
                  {{ option.name }}
                </option>
              </FormSelect>
            </div>
            <div class="mt-3">
              <FormLabel htmlFor="type">Type</FormLabel>
              <FormSelect v-model="typeId" @change="setTypeId($event)">
                <option value="0" key="0">All</option>
                <option :value="option.id" v-for="option in typeList" :key="option.id">
                  {{ option.name }}
                </option>
              </FormSelect>
            </div>
            <div class="flex items-center mt-3">
              <Button
                variant="primary"
                @click="
                  () => {
                    close();
                  }
                "
                class="w-64 ml-auto"
              >
                Done
              </Button>
            </div>
          </div>
        </Popover.Panel>
      </Popover>
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
          <Table.Tr v-if="products.length == 0 && dataLoaded" class="intro-x">
            <Table.Td colspan="4" class="py-0 px-0">
              <AlertGray />
            </Table.Td>
          </Table.Tr>
          <Table.Tr
            v-for="product in products"
            @click="
              trashed == 0 ? editLink(product.id, product.parent_product) : () => {}
            "
            :class="trashed == 0 ? 'cursor-pointer' : ''"
            :key="product.id"
            class="intro-x"
          >
            <Table.Td>
              {{ product.id }}
            </Table.Td>
            <Table.Td>
              {{ product.title }}
            </Table.Td>
            <Table.Td>
              {{ product.product_no }}
            </Table.Td>

            <Table.Td>
              <div class="flex items-center justify-center">
                <NuxtLink
                  v-if="trashed == 0 && product.parent_product != null"
                  @click="
                    (event) => {
                      editLink(product.parent_product, null);
                      event.stopPropagation();
                    }
                  "
                  class="flex items-center mr-3 text-green-600 hover:text-green-300"
                >
                  Edit Parent
                </NuxtLink>
                <NuxtLink
                  v-if="trashed == 0"
                  class="flex text-danger cursor-pointer"
                  @click="
                    (event) => {
                      event.preventDefault();
                      setArchiveId(product.id);
                      setConfirmationModal(true);
                      event.stopPropagation();
                    }
                  "
                >
                  <Lucide icon="Trash2" class="w-4 h-4 mr-1" />
                  <span class="hidden">Archive</span>
                </NuxtLink>
                <NuxtLink
                  v-if="trashed == 1"
                  class="flex text-success cursor-pointer"
                  @click="
                    (event) => {
                      event.preventDefault();
                      restore(product.id);
                      event.stopPropagation();
                    }
                  "
                >
                  <Lucide icon="ArchiveRestore" class="w-4 h-4 mr-1" />
                  <span class="hidden">Restore</span>
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
    :functionToRun="archive"
  />
  <EditVariantVue
    v-if="product_id"
    :key="product_id"
    :product_id="product_id"
    :modal-show="modalShow"
    :set-model="setModel"
  />
</template>
