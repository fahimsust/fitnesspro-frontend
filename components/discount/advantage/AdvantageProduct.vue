<script lang="ts" setup>
import { ref, toRefs } from "vue";
import Table from "~/components/enigma/base-components/Table";
import Button from "~/components/enigma/base-components/Button";
import SearchAdvantageProduct from "./SearchAdvantageProduct.vue";
import Lucide from "~~/components/enigma/base-components/Lucide";
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
    default: 0
  }
});

const { refresh, advantage } = toRefs(props);
const { addAdvantageProduct, updateAdvantageProduct, deleteAdvantageProduct, errors, loading } = useAdvantageProduct();
const removeProductAdvantage = async (productAdvantageId: number) => {
  await deleteAdvantageProduct(productAdvantageId);
  await refresh.value();
};
const addProduct = async (id: number) => {
  let data = reactive({ product_id: id, advantage_id: advantage.value.id });
  await addAdvantageProduct(data);
  await refresh.value();
};
const updated = ref(false)
const updateProductAdvantage = async (applyto_qty: string, id: number) => {
  if (updated.value) {
    let data = reactive({ applyto_qty: applyto_qty });
    await updateAdvantageProduct(data, id);
    await refresh.value();
    updated.value = false
  }
};

const modalShow = ref(false);
const setModal = (value: boolean) => {
  modalShow.value = value;
};
</script>
<template>
  <div class="p-1">
    <Button @click="() => setModal(true)" variant="primary" class="mr-2 shadow-md">
      Search Products To Assign
    </Button>

    <div class="overflow-x-auto">
      <Table class="border-spacing-y-[10px] border-separate mt-2 hover">
        <Table.Thead variant="dark">
          <Table.Tr>
            <Table.Th class="whitespace-nowrap">PRODUCT</Table.Th>
            <Table.Th v-if="applyto_qty_type == 1" class="whitespace-nowrap">APPLY QTY</Table.Th>
            <Table.Th class="whitespace-nowrap text-center"></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr v-if="advantage.target_products != null && advantage.target_products.length == 0" class="intro-x">
            <Table.Td colspan="6" class="py-0 px-0">
              <AlertGray />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-for="advantageProduct in advantage.target_products" :key="advantageProduct.id" class="intro-x">
            <Table.Td>
              {{ advantageProduct.title }}
            </Table.Td>
            <Table.Td v-if="applyto_qty_type == 1">
              <FormInput @change="() => updated = true" class="w-24" type="number"
                v-model="advantageProduct.pivot.applyto_qty"
                @blur="updateProductAdvantage(($event.target as HTMLInputElement).value, advantageProduct.pivot.id)" />
            </Table.Td>

            <Table.Td>
              <div class="flex items-center justify-center">
                <NuxtLink class="flex text-danger text-center cursor-pointer" @click="() => {
                  removeProductAdvantage(advantageProduct.pivot.id);
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

  <SearchAdvantageProduct :key="advantage.id" :advantage_id="advantage.id" :add="addProduct" :setModel="setModal"
    :modalShow="modalShow" />
</template>
