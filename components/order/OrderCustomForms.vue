<script setup lang="ts">
import _ from "lodash";
import Table from "~/components/enigma/base-components/Table";
import CustomDataEdit from "./CustomDataEdit.vue";

const props = defineProps({
  modelValue: {
    required: true,
    type: Object,
  },
});
let { modelValue: order } = toRefs(props);
const orderId = order.value.id;
const {
  getOrderCustomForms,
} = useOrderCustomForms();

const refresh = async () => {
  await getOrderCustomForms(orderId);
}
const getCustomFormValue = (customForm: any, section: any, field: any) => {
  if (customForm.product && customForm.product_type) {
    if (
      customForm.form_values &&
      customForm.form_values[customForm.form_id.toString() + "-" + customForm.product_id.toString() + "-" + customForm.product_type_id.toString()]
      && customForm.form_values[customForm.form_id.toString() + "-" + customForm.product_id.toString() + "-" + customForm.product_type_id.toString()][section.id.toString()]
      && customForm.form_values[customForm.form_id.toString() + "-" + customForm.product_id.toString() + "-" + customForm.product_type_id.toString()][section.id.toString()][field.id.toString()]
    ) {
      return field.display + " : " + customForm.form_values[customForm.form_id.toString() + "-" + customForm.product_id.toString() + "-" + customForm.product_type_id.toString()][section.id.toString()][field.id.toString()];
    }
  }
  else {

    if (
      customForm.form_values &&
      customForm.form_values[customForm.form_id.toString()] &&
      customForm.form_values[customForm.form_id.toString()][section.id.toString()] &&
      customForm.form_values[customForm.form_id.toString()][section.id.toString()][field.id.toString()]
    ) {
      return field.display + " : " + customForm.form_values[customForm.form_id.toString()][section.id.toString()][field.id.toString()]
    }
  }
  return "";
}

const customForm = ref({ id: 0 })
const modalShow = ref(false);
const setDataOpenModal = (localForm: any) => {
  customForm.value = localForm
  setModel(true)
}
const setModel = (value: boolean) => {
  modalShow.value = value;
};

const dataLoaded = ref(false)
let customForms: any = ref([]);
let lastPage: any = ref(1);
let currentPage: any = ref(1);


const fetchData = async () => {
  const result = await getOrderCustomForms(orderId);
  customForms = result.customForms;
  lastPage = result.lastPage;
  currentPage = result.currentPage;
  dataLoaded.value = true
}
onMounted(async () => {
  await nextTick();
  await fetchData();
});

</script>

<template>
  <div class="p-2">
    <h3 class="mt-2 text-xl text-success font-semibold">Custom Forms</h3>
    <div class="overflow-y-auto col-span-12 mt-2">
      <Table class="border-spacing-y-[10px] border-separate -mt-2">
        <Table.Thead variant="dark">
          <Table.Tr>
            <Table.Th class="whitespace-nowrap">CUSTOM FORM</Table.Th>
            <Table.Th class="whitespace-nowrap">PRODUCT</Table.Th>
            <Table.Th class="whitespace-nowrap">PRODUCT TYPE</Table.Th>
            <Table.Th class="whitespace-nowrap">VALUE</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr v-if="!dataLoaded" class="intro-x">
            <Table.Td colspan="4" class="py-0 px-0">
              <TableLoading />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-if="customForms.length == 0 && dataLoaded" class="intro-x">
            <Table.Td colspan="4" class="py-0 px-0">
              <AlertGray />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-for="customForm in customForms" class="cursor-pointer" @click="() => {
            setDataOpenModal(customForm)
          }">
            <Table.Td>
              {{ customForm.form.name }}
            </Table.Td>
            <Table.Td>
              {{ customForm.product ? customForm.product.title : '' }}
            </Table.Td>
            <Table.Td>
              {{ customForm.product_type ? customForm.product_type.name : '' }}
            </Table.Td>
            <Table.Td>
              <div v-for="section in customForm.form.sections">
                <div v-for="field in section.fields">
                  {{ getCustomFormValue(customForm, section, field) }}
                </div>
              </div>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </div>
    <PaginationModal v-model="currentPage" v-if="dataLoaded" :getList="refresh" :numberOfPages="lastPage" />
  </div>
  <CustomDataEdit v-if="customForm.id > 0" :modal-show="modalShow" :set-modal="setModel" :refresh="refresh"
    :customForm="customForm" />
</template>
