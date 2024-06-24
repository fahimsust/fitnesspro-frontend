<script setup>
import { ref, toRefs } from "vue";
import { Dialog } from "~/components/enigma/base-components/Headless";
import Lucide from "~/components/enigma/base-components/Lucide";
import Table from "~/components/enigma/base-components/Table";
const props = defineProps({
  setModel: {
    required: true,
    type: Function,
  },
  modalShow: {
    required: true,
    type: Boolean,
  },
  add: {
    required: true,
    type: Function,
  },
});
const { setModel, modalShow, add } = toRefs(props);
const processing = ref(false);
const keyword = ref("");
const route = useRoute();
const { searchRelatedProduct } = useRelatedProduct();
const searchByKeyword = async (value) => {
  keyword.value = value;
  currentPage.value = 1;
  await searchRelatedProduct(route.params.id, keyword.value);
};
const list = async () => {
  await searchRelatedProduct(route.params.id, keyword.value);
};
const addAndReload = async (product_id) => {
  processing.value = true;
  await add.value(product_id);
  await list();
  processing.value = false;
};
let products = ref([])
let lastPage = ref(1)
let currentPage = ref(1)
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  const result = await searchRelatedProduct(
    route.params.id,
    keyword.value
  );
  products = result.products
  lastPage = result.lastPage
  currentPage = result.currentPage
  dataLoaded.value = true
})
</script>
<template>
  <Dialog size="xl" :open="modalShow" @close="() => {
    setModel(false);
  }
    ">
    <Dialog.Panel class="p-3">
      <a @click="(event) => {
        event.preventDefault();
        setModel(false);
      }
        " class="absolute top-3 right-4" href="#">
        <Lucide icon="X" class="w-8 h-8" />
      </a>
      <Dialog.Title>
        <h2 class="mr-auto text-base font-medium">Search Related Product</h2>
      </Dialog.Title>
      <Dialog.Description class="grid grid-cols-12 gap-4 gap-y-3 max-h-[75vh] overflow-auto">
        <div class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
          <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
            <div class="relative w-56 text-slate-500">
              <EnterSearch v-model="keyword" :searchByKeyword="searchByKeyword" />
            </div>
          </div>
        </div>

        <div class="overflow-y-auto col-span-12">
          <Table class="border-spacing-y-[10px] border-separate -mt-2">
            <Table.Thead variant="dark">
              <Table.Tr>
                <Table.Th class="whitespace-nowrap">ID</Table.Th>
                <Table.Th class="whitespace-nowrap">NAME</Table.Th>
                <Table.Th class="whitespace-nowrap">SKU</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr v-if="!dataLoaded" class="intro-x">
                <Table.Td colspan="3" class="py-0 px-0">
                  <TableLoading />
                </Table.Td>
              </Table.Tr>
              <Table.Tr v-if="dataLoaded && products.length == 0" class="intro-x">
                <Table.Td colspan="3" class="py-0 px-0">
                  <AlertGray />
                </Table.Td>
              </Table.Tr>
              <Table.Tr v-for="product in products" @click="() => {
                if (!processing) addAndReload(product.id);
              }
                " :key="product.id" :class="{ 'cursor-pointer': !processing, 'cursor-wait': processing }"
                class="intro-x hover:bg-primary hover:text-white">
                <Table.Td>
                  {{ product.id }}
                </Table.Td>
                <Table.Td>
                  {{ product.title }}
                </Table.Td>
                <Table.Td>
                  {{ product.product_no }}
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </div>
        <PaginationModal v-model="currentPage" v-if="dataLoaded" :getList="list" :numberOfPages="lastPage" />
      </Dialog.Description>
    </Dialog.Panel>
  </Dialog>
</template>
