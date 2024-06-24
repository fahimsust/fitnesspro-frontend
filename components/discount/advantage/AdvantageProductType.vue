<script lang="ts" setup>
import { ref, toRefs } from "vue";
import Table from "~/components/enigma/base-components/Table";
import Button from "~/components/enigma/base-components/Button";
import Lucide from "~~/components/enigma/base-components/Lucide";
import SearchAdvantageProductType from "./SearchAdvantageProductType.vue";
import { FormInput } from "~/components/enigma/base-components/Form";
const props = defineProps({
  refresh: {
    required: true,
    type: Function,
  },
  advantage: {
    required: true,
    type: Object,
  },
  applyto_qty_type: {
    required: false,
    type: Number,
    default: 0,
  },
});

const { refresh, advantage, applyto_qty_type } = toRefs(props);
const {
  addAdvantageProductType,
  deleteAdvantageProductType,
  updateAdvantageProductType,
  errors,
  loading,
} = useAdvantageProductType();
const removeProductAdvantage = async (productAdvantageTypeId: number) => {
  await deleteAdvantageProductType(productAdvantageTypeId);
  await refresh.value();
};
const addProductType = async (id: number) => {
  let data = reactive({ producttype_id: id, advantage_id: advantage.value.id });
  await addAdvantageProductType(data);
  await refresh.value();
};
const updated = ref(false);
const updateProductType = async (applyto_qty: string, id: number) => {
  if (updated.value) {
    let data = reactive({ applyto_qty: applyto_qty });
    await updateAdvantageProductType(data, id);
    await refresh.value();
    updated.value = false;
  }
};
const modalShow = ref(false);
const setModal = (value: boolean) => {
  modalShow.value = value;
};
</script>
<template>
  <div class="p-1">
    <Button @click="() => setModal(true)" variant="primary" class="mr-2 shadow-md">Search Products Types To
      Assign</Button>

    <div class="overflow-x-auto">
      <Table class="border-spacing-y-[10px] border-separate mt-2 hover">
        <Table.Thead variant="dark">
          <Table.Tr>
            <Table.Th class="whitespace-nowrap">PRODUCT TYPE</Table.Th>
            <Table.Th v-if="applyto_qty_type == 1" class="whitespace-nowrap">APPLY QTY</Table.Th>
            <Table.Th class="whitespace-nowrap text-center"></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr v-if="advantage.target_product_types != null &&
      advantage.target_product_types.length == 0
      " class="intro-x">
            <Table.Td colspan="6" class="py-0 px-0">
              <AlertGray />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-for="advantageProductType in advantage.target_product_types" :key="advantageProductType.id"
            class="intro-x">
            <Table.Td>
              {{ advantageProductType.name }}
            </Table.Td>
            <Table.Td v-if="applyto_qty_type == 1">
              <FormInput type="number" class="w-24" v-model="advantageProductType.pivot.applyto_qty"
                @change="() => (updated = true)"
                @blur="updateProductType(($event.target as HTMLInputElement).value, advantageProductType.pivot.id)" />
            </Table.Td>

            <Table.Td>
              <div class="flex items-center justify-center">
                <NuxtLink class="flex text-danger text-center cursor-pointer" @click="() => {
        removeProductAdvantage(advantageProductType.pivot.id);
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

  <SearchAdvantageProductType :key="advantage.id" :advantage_id="advantage.id" :add="addProductType"
    :setModel="setModal" :modalShow="modalShow" />
</template>
