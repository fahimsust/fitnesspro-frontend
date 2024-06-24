<script lang="ts" setup>
import Table from "~/components/enigma/base-components/Table";
import Lucide from "~/components/enigma/base-components/Lucide";
import Button from "~/components/enigma/base-components/Button";
import { ref } from "vue";
import SearchHideProduct from "~~/components/category/SearchHideProduct.vue";
const {
  getHideProduct,
  addHideProduct,
  deleteHideProduct,
  deleteConfirmationModal,
  setArchiveId,
} = useHideProduct();
const route = useRoute();
const idParem = parseInt(route.params.id.toString());
let products: any = ref([]);
const removeHideProduct = () => {
  deleteHideProduct(idParem);
};
const add = async (id: number) => {
  let data = reactive({ product_id: id });
  await addHideProduct(data, idParem);
  products = await getHideProduct(idParem);
};
const setConfirmationModal = (value: boolean) => {
  deleteConfirmationModal.value = value;
};
const modalShow = ref(false);
const setModal = (value: boolean) => {
  modalShow.value = value;
};
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  products = await getHideProduct(idParem);
  dataLoaded.value = true;
});
</script>
<template>
  <Button @click="() => setModal(true)" variant="primary" class="mr-2 shadow-md">
    Select Products to Hide
  </Button>
  <div class="overflow-x-auto">
    <Table class="border-spacing-y-[10px] border-separate mt-2 hover">
      <Table.Thead variant="dark">
        <Table.Tr>
          <Table.Th class="whitespace-nowrap">ID</Table.Th>
          <Table.Th class="whitespace-nowrap">NAME</Table.Th>
          <Table.Th class="whitespace-nowrap">SKU</Table.Th>
          <Table.Th class="whitespace-nowrap text-center"></Table.Th>
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
        <Table.Tr v-for="product in products" :key="product.id" class="intro-x">
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
              <NuxtLink class="flex text-danger cursor-pointer" @click="(event) => {
                  event.preventDefault();
                  setArchiveId(product.id);
                  setConfirmationModal(true);
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
  <SearchHideProduct :add="add" v-if="modalShow" :key="modalShow ? 'true' : 'false'" :setModel="setModal"
    :modalShow="modalShow" />

  <Confirmation v-model="deleteConfirmationModal" buttonStringMain="Remove"
    subHeader="Do you want to unhide this product?" :setConfirmationModal="setConfirmationModal" :set-id="setArchiveId"
    :functionToRun="removeHideProduct" />
</template>
