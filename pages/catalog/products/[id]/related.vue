<script lang="ts" setup>
import Table from "~/components/enigma/base-components/Table";
import Lucide from "~/components/enigma/base-components/Lucide";
import Button from "~/components/enigma/base-components/Button";
import SearchRelatedProduct from "~/components/product/SearchRelatedProduct.vue";
import { ref } from "vue";

definePageMeta({
  middleware: ["auth"],
  layout: "edit-product",
});

useHead({
  title: "Manage Related Product: " + useRuntimeConfig().public.company,
});

const {
  getRelatedProduct,
  addRelatedProduct,
  deleteRelatedProduct,
  deleteConfirmationModal,
  setArchiveId,
} = useRelatedProduct();
const route = useRoute();
const idParem = parseInt(route.params.id.toString());

const dataLoaded = ref(false)
let products: any = ref([])


const removeRelatedProduct = () => {
  deleteRelatedProduct(idParem);
};
const add = async (id: number) => {
  let data = reactive({ related_id: id });
  await addRelatedProduct(data, idParem);
  products = await getRelatedProduct(idParem);
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
  products = await getRelatedProduct(idParem);
  dataLoaded.value = true
})
</script>
<template>
  <div class="col-span-12 lg:col-span-9">
    <!-- BEGIN: Post Content -->
    <div class="col-span-12 intro-y">
      <div class="p-5 intro-y box xl:mt-5">
        <Button @click="() => setModal(true)" variant="primary" class="mr-2 shadow-md">
          Add Related Product
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
              <Table.Tr v-if="dataLoaded && products.length == 0" class="intro-x">
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
      </div>
    </div>
  </div>
  <search-related-product :add="add" :setModel="setModal" :modalShow="modalShow" />
  <Confirmation v-model="deleteConfirmationModal" buttonStringMain="Remove"
    subHeader="Do you want to remove this related product?" :setConfirmationModal="setConfirmationModal"
    :set-id="setArchiveId" :functionToRun="removeRelatedProduct" />
</template>
