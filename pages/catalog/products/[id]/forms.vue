<script lang="ts" setup>
import Table from "~/components/enigma/base-components/Table";
import Lucide from "~/components/enigma/base-components/Lucide";
import Button from "~/components/enigma/base-components/Button";
import SearchCustomForms from "~/components/product/SearchCustomForms.vue";
import { ref } from "vue";
definePageMeta({
  middleware: ["auth"],
  layout: "edit-product",
});
useHead({
  title: "Manage Product Forms: " + useRuntimeConfig().public.company,
});
const {
  setRemoveId,
  geProductForms,
  deleteProductForm,
  addUpdateProductForm,
  deleteConfirmationModal,
} = useProductForm();
const route = useRoute();
const idParem = parseInt(route.params.id.toString());
let productForms: any = ref([]);
const removeProductForm = () => {
  deleteProductForm(idParem);
};
const add = async (id: number) => {
  let data = reactive({ form_id: id, rank: 0 });
  await addUpdateProductForm(data, idParem, false);
  await refreshForm();
};
const setConfirmationModal = (value: boolean) => {
  deleteConfirmationModal.value = value;
};
const modalShow = ref(false);
const setModal = (value: boolean) => {
  modalShow.value = value;
};
const refreshForm = async () => {
  productForms = await geProductForms(idParem);
};
const setValue = async (fieldName: string, value: any, formObj: any) => {
  let form: any = reactive({
    rank: formObj.rank,
    form_id: formObj.form_id,
  });
  form[fieldName] = value;
  await addUpdateProductForm(form, idParem, true);
};
const setVlueIfChange = async (fieldName: string, value: any, productOption: any) => {
  if (is_change.value == true) {
    await setValue(fieldName, value, productOption);
    is_change.value = false;
  }
};
const is_change = ref(false);
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  productForms = await geProductForms(idParem);
  dataLoaded.value = true
})
</script>
<template>
  <div class="col-span-12 lg:col-span-9">
    <!-- BEGIN: Post Content -->
    <div class="col-span-12 intro-y">
      <div class="p-5 intro-y box xl:mt-5">
        <Button @click="() => setModal(true)" variant="primary" class="mr-2 shadow-md">
          Add Product Form
        </Button>
        <div class="overflow-x-auto">
          <Table class="border-spacing-y-[10px] border-separate mt-2 hover">
            <Table.Thead variant="dark">
              <Table.Tr>
                <Table.Th class="whitespace-nowrap">FORM</Table.Th>
                <Table.Th class="whitespace-nowrap text-right">RANK</Table.Th>
                <Table.Th class="whitespace-nowrap text-center"></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr v-if="!dataLoaded" class="intro-x">
                <Table.Td colspan="3" class="py-0 px-0">
                  <TableLoading />
                </Table.Td>
              </Table.Tr>
              <Table.Tr v-if="productForms.length == 0 && dataLoaded" class="intro-x">
                <Table.Td colspan="3" class="py-0 px-0">
                  <AlertGray />
                </Table.Td>
              </Table.Tr>
              <Table.Tr v-for="productForm in productForms.product_forms" :key="productForm.id" class="intro-x">
                <Table.Td>
                  {{ productForm.form.name }}
                </Table.Td>
                <Table.Td class="text-right px-3 max-w-[75px]">
                  <input class="input_class max-w-[75px] text-right" type="number" :value="productForm.rank"
                    @change="is_change = true"
                    @blur="setVlueIfChange('rank', ($event.target as HTMLInputElement).value, productForm)" />
                </Table.Td>
                <Table.Td>
                  <div class="flex items-center justify-center">
                    <NuxtLink class="flex text-danger text-center cursor-pointer" @click="(event) => {
                        event.preventDefault();
                        setRemoveId(productForm.form_id);
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
  <SearchCustomForms :add="add" v-if="modalShow" :setModel="setModal" :modalShow="modalShow" />
  <Confirmation v-model="deleteConfirmationModal" buttonStringMain="Remove"
    subHeader="Do you want to remove this product form?" :setConfirmationModal="setConfirmationModal"
    :set-id="setRemoveId" :functionToRun="removeProductForm" />
</template>
<style lang="postcss" scoped>
.input_class {
  @apply disabled:bg-slate-100 disabled:cursor-not-allowed text-center dark:disabled:bg-darkmode-800/50 dark:disabled:border-transparent [&[readonly]]:bg-slate-100 [&[readonly]]:cursor-not-allowed [&[readonly]]:dark:bg-darkmode-800/50 [&[readonly]]:dark:border-transparent transition duration-200 ease-in-out w-full text-sm border-slate-200 shadow-sm rounded-md placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary focus:border-opacity-40 dark:bg-darkmode-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:placeholder:text-slate-500/80 flex-1;
}
</style>
