<script lang="ts" setup>
import _ from "lodash";
import { reactive } from "vue";
import Table from "~/components/enigma/base-components/Table";
import Button from "~/components/enigma/base-components/Button";
import Lucide from "~/components/enigma/base-components/Lucide";
import { FormSwitch } from "~/components/enigma/base-components/Form";
import SearchAccessoryProduct from "~/components/product/accessory/SearchAccessoryProduct.vue";

const {
  geProductAccessory,
  addUpdateProductAccessory,
  deleteProductAccessory,
  deleteConfirmationModal,
  setArchiveId,
} = useProductAccessory();
const route = useRoute();
const idParem = parseInt(route.params.id.toString());
let productAccessories:any = ref([]);
const removeProductAccessory = () => {
  deleteProductAccessory(idParem);
};
const add = async (id: number) => {
  let data = reactive({ accessory_id: id, required: false, show_as_option: false });
  await addUpdateProductAccessory(data, idParem, false);
  await refreshAccessory();
};
const setConfirmationModal = (value: boolean) => {
  deleteConfirmationModal.value = value;
};
const modalShow = ref(false);
const setModal = (value: boolean) => {
  modalShow.value = value;
};

const refreshAccessory = async () => {
  productAccessories = await geProductAccessory(idParem);
};
const setValue = async (fieldName: string, value: any, accesoryObj: any) => {
  let form: any = reactive({
    required: accesoryObj.required,
    accessory_id: accesoryObj.accessory_id,
    show_as_option: accesoryObj.show_as_option,
    discount_percentage: accesoryObj.discount_percentage,
    link_actions: accesoryObj.link_actions,
    description: accesoryObj.description,
  });
  if (fieldName != "description" && fieldName != "discount_percentage") {
    form[fieldName] = !form[fieldName];
  }
  await addUpdateProductAccessory(form, idParem, true);
};
const setVlueIfChange = async (fieldName: string, value: any, accesoryObj: any) => {
  if (is_change.value == true) {
    await setValue(fieldName, value, accesoryObj);
    is_change.value = false;
  }
};
const is_change = ref(false);
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  productAccessories = await geProductAccessory(idParem);
  dataLoaded.value = true
});
</script>

<template>
  <div class="p-1">
    <Button @click="() => setModal(true)" variant="primary" class="mr-2 shadow-md">
      Add Product Accessory
    </Button>

    <div class="overflow-x-auto">
      <Table class="border-spacing-y-[10px] border-separate mt-2 hover">
        <Table.Thead variant="dark">
          <Table.Tr>
            <Table.Th class="whitespace-nowrap">PRODUCT</Table.Th>
            <Table.Th class="whitespace-nowrap">REQUIRED</Table.Th>
            <Table.Th class="whitespace-nowrap">SHOW AS OPTION</Table.Th>
            <Table.Th class="whitespace-nowrap">LINK ACTION</Table.Th>
            <Table.Th class="whitespace-nowrap text-right">DISCOUNT PERCENTAGE</Table.Th>
            <Table.Th class="whitespace-nowrap text-center"></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr v-if="!dataLoaded" class="intro-x">
            <Table.Td colspan="6" class="py-0 px-0">
              <TableLoading />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-if="productAccessories != null && productAccessories.length == 0 && dataLoaded" class="intro-x">
            <Table.Td colspan="6" class="py-0 px-0">
              <AlertGray />
            </Table.Td>
          </Table.Tr>
          <Table.Tr
            v-for="productAccessory in productAccessories"
            :key="productAccessories.id"
            class="intro-x"
          >
            <Table.Td>
              {{ productAccessory.accessory ? productAccessory.accessory.title : "" }}
            </Table.Td>
            <Table.Td>
              <FormSwitch>
                <FormSwitch.Input
                  type="checkbox"
                  id="required"
                  v-model="productAccessory.required"
                  @click="setValue('required', ($event.target as HTMLInputElement).value, productAccessory)"
                />
              </FormSwitch>
            </Table.Td>
            <Table.Td>
              <FormSwitch>
                <FormSwitch.Input
                  type="checkbox"
                  id="show_as_option"
                  v-model="productAccessory.show_as_option"
                  @click="
                    setValue('show_as_option', ($event.target as HTMLInputElement).value, productAccessory)
                  "
                />
              </FormSwitch>
            </Table.Td>
            <Table.Td>
              <FormSwitch>
                <FormSwitch.Input
                  type="checkbox"
                  id="link_actions"
                  v-model="productAccessory.link_actions"
                  @click="setValue('link_actions', ($event.target as HTMLInputElement).value, productAccessory)"
                />
              </FormSwitch>
            </Table.Td>
            <Table.Td class="max-w-[100px] text-right align-top">
              <input
                class="input_class max-w-[75px] text-right"
                type="number"
                max="100"
                min="0"
                v-model="productAccessory.discount_percentage"
                @change="() => (is_change = true)"
                @blur="setVlueIfChange('discount_percentage', ($event.target as HTMLInputElement).value, productAccessory)"
              />
            </Table.Td>
            <Table.Td>
              <div class="flex items-center justify-center">
                <NuxtLink
                  class="flex text-danger text-center cursor-pointer"
                  @click="
                    (event) => {
                      event.preventDefault();
                      setArchiveId(productAccessory.accessory_id);
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
  </div>
  <SearchAccessoryProduct :add="add" :setModel="setModal" :modalShow="modalShow" />
  <Confirmation
    v-model="deleteConfirmationModal"
    buttonStringMain="Remove"
    subHeader="Do you want to remove this product accessory?"
    :setConfirmationModal="setConfirmationModal"
    :set-id="setArchiveId"
    :functionToRun="removeProductAccessory"
  />
</template>
<style lang="postcss" scoped>
.input_class {
  @apply disabled:bg-slate-100 disabled:cursor-not-allowed text-center dark:disabled:bg-darkmode-800/50 dark:disabled:border-transparent [&[readonly]]:bg-slate-100 [&[readonly]]:cursor-not-allowed [&[readonly]]:dark:bg-darkmode-800/50 [&[readonly]]:dark:border-transparent transition duration-200 ease-in-out w-full text-sm border-slate-200 shadow-sm rounded-md placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary focus:border-opacity-40 dark:bg-darkmode-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:placeholder:text-slate-500/80 flex-1;
}
</style>
