<script lang="ts" setup>
import { ref, toRefs } from "vue";
import Table from "~/components/enigma/base-components/Table";
import Button from "~/components/enigma/base-components/Button";
import Lucide from "~~/components/enigma/base-components/Lucide";
import SearchConditionAccountType from "../search/SearchConditionAccountType.vue";
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
const { addConditionAccountType, deleteConditionAccountType, errors, loading } = useConditionAccountType();
const removeAccountTypeDiscount = async (accountTypeDiscountId: number) => {
  await deleteConditionAccountType(accountTypeDiscountId);
  await refresh.value();
};

const addAccountType = async (id: number) => {
  let data = reactive({ accounttype_id: id, condition_id: condition.value.id });
  await addConditionAccountType(data);
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
      Search Account Type To Assign
    </Button>

    <div class="overflow-x-auto">
      <Table class="border-spacing-y-[10px] border-separate mt-2 hover">
        <Table.Thead variant="dark">
          <Table.Tr>
            <Table.Th class="whitespace-nowrap">PRODUCT TYPE</Table.Th>
            <Table.Th class="whitespace-nowrap text-center"></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr v-if="condition.account_types != null && condition.account_types.length == 0" class="intro-x">
            <Table.Td colspan="6" class="py-0 px-0">
              <AlertGray />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-for="conditionAccountType in condition.account_types" :key="conditionAccountType.id"
            class="intro-x">
            <Table.Td>
              {{ conditionAccountType.name }}
            </Table.Td>

            <Table.Td>
              <div class="flex items-center justify-center">
                <NuxtLink class="flex text-danger text-center cursor-pointer" @click="() => {
                  removeAccountTypeDiscount(conditionAccountType.pivot.id);
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

  <SearchConditionAccountType :key="condition.id" :condition_id="condition.id" :add="addAccountType" :setModel="setModal"
    :modalShow="modalShow" />
</template>
