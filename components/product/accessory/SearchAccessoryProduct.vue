<script lang="ts" setup>
import { ref, toRefs } from "vue";
import { Dialog } from "~/components/enigma/base-components/Headless";
import Lucide from "~/components/enigma/base-components/Lucide";
import Table from "~/components/enigma/base-components/Table";
import Button from "~/components/enigma/base-components/Button";
import Alert from "~/components/enigma/base-components/Alert";
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

const keyword = ref("");
const wait = ref(false);
const route = useRoute();
const idParem = parseInt(route.params.id.toString());
const { setModel, modalShow, add } = toRefs(props);
const { searchProductAccessory } = useProductAccessory();
const searchByKeyword = async (value: string) => {
  keyword.value = value;
  currentPage.value = 1;
  await searchProductAccessory(idParem, keyword.value);
};
const list = async () => {
  await searchProductAccessory(idParem, keyword.value);
};
const addAndSearch = async (id: number) => {
  wait.value = true;
  await add.value(id);
  await searchProductAccessory(idParem, keyword.value);
  wait.value = false;
};

let products: any = ref([])
let lastPage: any = ref(1)
let currentPage: any = ref(1)
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  const result = await searchProductAccessory(
    idParem,
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
        <h2 class="mr-auto text-base font-medium">Search Accessory Product</h2>
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
                <Table.Td colspan="4" class="py-0 px-0">
                  <TableLoading />
                </Table.Td>
              </Table.Tr>
              <Table.Tr v-if="products.length == 0 && dataLoaded" class="intro-x">
                <Table.Td colspan="4" class="py-0 px-0">
                  <AlertGray />
                </Table.Td>
              </Table.Tr>
              <Table.Tr v-for="product in products" @click="() => {
                if (!wait) addAndSearch(product.id);
              }
                " :key="product.id" class="intro-x hover:bg-primary hover:text-white"
                :class="{ 'cursor-pointer': !wait, 'cursor-wait': wait }">
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
