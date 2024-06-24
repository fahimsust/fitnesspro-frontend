<script lang="ts" setup>
import { ref, toRefs } from "vue";
import Table from "~/components/enigma/base-components/Table";
import Button from "~/components/enigma/base-components/Button";
import Lucide from "~~/components/enigma/base-components/Lucide";
import SearchConditionMembership from "../search/SearchConditionMembership.vue";
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
const { addConditionMembership, deleteConditionMembership, errors, loading } = useConditionMembership();
const removeMembership = async (membershipConditionId: number) => {
  await deleteConditionMembership(membershipConditionId);
  await refresh.value();
};
const addMembership = async (id: number) => {
  let data = reactive({ membershiplevel_id: id, condition_id: condition.value.id });
  await addConditionMembership(data);
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
      Search Membership Level To Assign
    </Button>

    <div class="overflow-x-auto">
      <Table class="border-spacing-y-[10px] border-separate mt-2 hover">
        <Table.Thead variant="dark">
          <Table.Tr>
            <Table.Th class="whitespace-nowrap">Membership</Table.Th>
            <Table.Th class="whitespace-nowrap text-center"></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr v-if="condition.membership_levels != null && condition.membership_levels.length == 0" class="intro-x">
            <Table.Td colspan="6" class="py-0 px-0">
              <AlertGray />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-for="membershipLevel in condition.membership_levels" :key="membershipLevel.id" class="intro-x">
            <Table.Td>
              {{ membershipLevel.name }}
            </Table.Td>

            <Table.Td>
              <div class="flex items-center justify-center">
                <NuxtLink class="flex text-danger text-center cursor-pointer" @click="() => {
                  removeMembership(membershipLevel.pivot.id);
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

  <SearchConditionMembership :key="condition.id" :condition_id="condition.id" :add="addMembership" :setModel="setModal"
    :modalShow="modalShow" />
</template>
