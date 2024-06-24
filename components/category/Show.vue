<script lang="ts" setup>
import Table from "~/components/enigma/base-components/Table";
import Alert from "~/components/enigma/base-components/Alert";
import Lucide from "~/components/enigma/base-components/Lucide";
import Button from "~/components/enigma/base-components/Button";
import { ref, onMounted } from "vue";
import SearchShowProduct from "~~/components/category/SearchShowProduct.vue";

const {
  getShowProduct,
  addShowProduct,
  deleteShowProduct,
  deleteConfirmationModal,
  setArchiveId,
  updateShowProduct,
} = useShowProduct();
const route = useRoute();
const idParem = parseInt(route.params.id.toString());
let products:any = ref([]);
const removeShowProduct = () => {
  deleteShowProduct(idParem);
};
const add = async (id: number) => {
  let data = reactive({ product_id: id });
  await addShowProduct(data, idParem);
  products = await getShowProduct(idParem);
};
const setConfirmationModal = (value: boolean) => {
  deleteConfirmationModal.value = value;
};
const modalShow = ref(false);
const setModal = (value: boolean) => {
  modalShow.value = value;
};
const setValue = async (fieldName: string, value: any, featureProduct: any) => {
  let form: any = reactive({
    rank: featureProduct.pivot.rank,
  });
  await updateShowProduct(form, idParem, featureProduct.id);
  await getShowProduct(idParem);
};
const setVlueIfChange = async (fieldName: string, value: any, productOption: any) => {
  if (is_change.value == true) {
    await setValue(fieldName, value, productOption);
  }
};
const is_change = ref(false);
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  products = await getShowProduct(idParem);
  dataLoaded.value = true;
});
</script>
<template>
  <Button @click="() => setModal(true)" variant="primary" class="mr-2 shadow-md">
    Select Products to Show
  </Button>
  <div class="overflow-x-auto">
    <Table class="border-spacing-y-[10px] border-separate mt-2 hover">
      <Table.Thead variant="dark">
        <Table.Tr>
          <Table.Th class="whitespace-nowrap">ID</Table.Th>
          <Table.Th class="whitespace-nowrap">NAME</Table.Th>
          <Table.Th class="whitespace-nowrap">SKU</Table.Th>
          <Table.Th class="whitespace-nowrap">RANK</Table.Th>
          <Table.Th class="whitespace-nowrap text-center"></Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        <Table.Tr v-if="!dataLoaded" class="intro-x">
              <Table.Td colspan="5" class="py-0 px-0">
                <TableLoading />
              </Table.Td>
        </Table.Tr>
        <Table.Tr v-if="products.length == 0 && dataLoaded" class="intro-x">
          <Table.Td colspan="5" class="py-0 px-0">
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
          <Table.Td class="max-w-[100px]">
            <input
              class="input_class max-w-[75px]"
              type="number"
              v-model="product.pivot.rank"
              @change="is_change = true"
              @blur="setVlueIfChange('rank', ($event.target as HTMLInputElement).value, product)"
            />
          </Table.Td>
          <Table.Td>
            <div class="flex items-center justify-center">
              <NuxtLink
                class="flex text-danger cursor-pointer"
                @click="
                  (event) => {
                    event.preventDefault();
                    setArchiveId(product.id);
                    setConfirmationModal(true);
                  }
                "
              >
                <Lucide icon="Trash2" class="w-4 h-4 mr-1" />
                <span class="hidden">Remove</span>
              </NuxtLink>
            </div>
          </Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  </div>
  <SearchShowProduct
    :add="add"
    v-if="modalShow"
    :key="modalShow ? 'true' : 'false'"
    :setModel="setModal"
    :modalShow="modalShow"
  />
  <Confirmation
    v-model="deleteConfirmationModal"
    buttonStringMain="Remove"
    subHeader="Do you want to this product from category show?"
    :setConfirmationModal="setConfirmationModal"
    :set-id="setArchiveId"
    :functionToRun="removeShowProduct"
  />
</template>
<style lang="postcss" scoped>
.input_class {
  @apply disabled:bg-slate-100 max-w-max disabled:cursor-not-allowed text-center dark:disabled:bg-darkmode-800/50 dark:disabled:border-transparent [&[readonly]]:bg-slate-100 [&[readonly]]:cursor-not-allowed [&[readonly]]:dark:bg-darkmode-800/50 [&[readonly]]:dark:border-transparent transition duration-200 ease-in-out w-full text-sm border-slate-200 shadow-sm rounded-md placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary focus:border-opacity-40 dark:bg-darkmode-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:placeholder:text-slate-500/80 flex-1;
}
</style>
