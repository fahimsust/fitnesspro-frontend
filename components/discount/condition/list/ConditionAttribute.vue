<script lang="ts" setup>
import { ref, toRefs } from "vue";
import Table from "~/components/enigma/base-components/Table";
import Button from "~/components/enigma/base-components/Button";
import Lucide from "~~/components/enigma/base-components/Lucide";
import SearchConditionAttribute from "../search/SearchConditionAttribute.vue";
import { FormInput } from "~/components/enigma/base-components/Form";
const props = defineProps({
  refresh: {
    required: true,
    type: Function,
  },
  condition: {
    required: true,
    type: Object,
  },
});

const { refresh, condition } = toRefs(props);
const { addConditionAttribute, deleteConditionAttribute, updateConditionAttribute, errors, loading } = useConditionAttribute();
const removeAttributeDiscount = async (productAttributeId: number) => {
  await deleteConditionAttribute(productAttributeId);
  await refresh.value();
};
const updated = ref(false)
const updateRequiredQuantity = async (required_qty: string, id: number) => {
  if (updated.value) {
    let data = reactive({ required_qty: required_qty });
    await updateConditionAttribute(data, id);
    await refresh.value();
    updated.value = false
  }
};
const addProductAttribute = async (id: number) => {
  let data = reactive({ attributevalue_id: id, condition_id: condition.value.id });
  await addConditionAttribute(data);
  await refresh.value();
};
const modalShow = ref(false);
const setModal = (value: boolean) => {
  modalShow.value = value;
};
</script>
<template>
  <div class="p-1">
    <Button @click="() => setModal(true)" variant="primary" class="mr-2 shadow-md">
      Search Attribute To Assign
    </Button>

    <div class="overflow-x-auto">
      <Table class="border-spacing-y-[10px] border-separate mt-2 hover">
        <Table.Thead variant="dark">
          <Table.Tr>
            <Table.Th class="whitespace-nowrap">ATTRIBUTE</Table.Th>
            <Table.Th v-if="condition.required_qty_type == 1" class="whitespace-nowrap">REQUIRED QTY</Table.Th>
            <Table.Th class="whitespace-nowrap text-center"></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr v-if="condition.attribute_options != null && condition.attribute_options.length == 0" class="intro-x">
            <Table.Td colspan="6" class="py-0 px-0">
              <AlertGray />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-for="attributeOption in condition.attribute_options" :key="attributeOption.id" class="intro-x">
            <Table.Td>
              {{ attributeOption.attribute.name }} : {{ attributeOption.display }}
            </Table.Td>
            <Table.Td v-if="condition.required_qty_type == 1">
              <FormInput @change="() => updated = true" class="w-24" type="number"
                v-model="attributeOption.pivot.required_qty"
                @blur="updateRequiredQuantity(($event.target as HTMLInputElement).value, attributeOption.pivot.id)" />
            </Table.Td>

            <Table.Td>
              <div class="flex items-center justify-center">
                <NuxtLink class="flex text-danger text-center cursor-pointer" @click="() => {
                  removeAttributeDiscount(attributeOption.pivot.id);
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

  <SearchConditionAttribute :key="condition.id" :condition_id="condition.id" :add="addProductAttribute"
    :setModel="setModal" :modalShow="modalShow" />
</template>
