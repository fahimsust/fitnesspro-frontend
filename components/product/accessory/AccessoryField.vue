<script lang="ts" setup>
import _ from "lodash";
import { reactive, ref } from "vue";
import Table from "~/components/enigma/base-components/Table";
import Button from "~/components/enigma/base-components/Button";
import Lucide from "~/components/enigma/base-components/Lucide";
import SearchAccessoryField from "~/components/product/accessory/SearchAccessoryField.vue";

const {
  geProductAccessoryField,
  addUpdateProductAccessoryField,
  deleteProductAccessoryField,
  deleteConfirmationModal,
  setArchiveId,
} = useProductAccessoryField();
const route = useRoute();
const idParem = parseInt(route.params.id.toString());
let productAccessoryFields:any = ref([]);
const removeProductAccessoryField = () => {
  deleteProductAccessoryField(idParem);
};
const add = async (id: number) => {
  let data = reactive({
    accessories_fields_id: id,
    rank: 1,
  });
  await addUpdateProductAccessoryField(data, idParem, false);
  await refreshAccessoryField();
};
const setConfirmationModal = (value: boolean) => {
  deleteConfirmationModal.value = value;
};
const modalShow = ref(false);
const setModal = (value: boolean) => {
  modalShow.value = value;
};

const refreshAccessoryField = async () => {
  productAccessoryFields = await geProductAccessoryField(idParem);
};
const setValue = async (accesoryObj: any) => {
  let form: any = reactive({
    rank: accesoryObj.rank,
    accessories_fields_id: accesoryObj.accessories_fields_id,
  });
  await addUpdateProductAccessoryField(form, idParem, true);
  is_change.value = false;
};
const setVlueIfChange = async (accesoryObj: any) => {
  if (is_change.value == true) {
    await setValue(accesoryObj);
    await geProductAccessoryField(idParem);
  }
};
const is_change = ref(false);
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  productAccessoryFields = await geProductAccessoryField(idParem);
  dataLoaded.value = true
});
</script>

<template>
  <div class="p-1">
    <Button @click="() => setModal(true)" variant="primary" class="mr-2 shadow-md">
      Add Product Accessory Field
    </Button>

    <div class="overflow-x-auto">
      <Table class="border-spacing-y-[10px] border-separate mt-2 hover">
        <Table.Thead variant="dark">
          <Table.Tr>
            <Table.Th class="whitespace-nowrap">NAME</Table.Th>
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
            <Table.Tr v-if="productAccessoryFields.length == 0 && dataLoaded" class="intro-x">
              <Table.Td colspan="3" class="py-0 px-0">
                <AlertGray />
              </Table.Td>
            </Table.Tr>
          <Table.Tr
            v-for="productAccessoryField in productAccessoryFields"
            :key="productAccessoryField.id"
            class="intro-x"
          >
            <Table.Td>
              {{
                productAccessoryField.accessory_field
                  ? productAccessoryField.accessory_field.name
                  : ""
              }}
            </Table.Td>
            <Table.Td class="max-w-[100px] text-right">
              <input
                class="input_class max-w-[75px] text-right"
                type="number"
                v-model="productAccessoryField.rank"
                @change="is_change = true"
                @blur="setVlueIfChange(productAccessoryField)"
              />
            </Table.Td>

            <Table.Td>
              <div class="flex items-center justify-center">
                <NuxtLink
                  class="flex text-danger text-center cursor-pointer"
                  @click="
                    (event) => {
                      event.preventDefault();
                      setArchiveId(productAccessoryField.accessory_field.id);
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
  <SearchAccessoryField :add="add" :setModel="setModal" :modalShow="modalShow" />
  <Confirmation
    v-model="deleteConfirmationModal"
    buttonStringMain="Remove"
    subHeader="Do you want to remove this accessory field?"
    :setConfirmationModal="setConfirmationModal"
    :set-id="setArchiveId"
    :functionToRun="removeProductAccessoryField"
  />
</template>
<style lang="postcss" scoped>
.input_class {
  @apply disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:bg-darkmode-800/50 dark:disabled:border-transparent [&[readonly]]:bg-slate-100 [&[readonly]]:cursor-not-allowed [&[readonly]]:dark:bg-darkmode-800/50 [&[readonly]]:dark:border-transparent transition duration-200 ease-in-out text-sm border-slate-200 shadow-sm rounded-md placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary focus:border-opacity-40 dark:bg-darkmode-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:placeholder:text-slate-500/80 flex-1;
}
</style>
