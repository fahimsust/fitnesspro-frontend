<script lang="ts" setup>
import Table from "~/components/enigma/base-components/Table";
import Lucide from "~/components/enigma/base-components/Lucide";
import Button from "~/components/enigma/base-components/Button";
import { ref } from "vue";
import SearchOrderingRules from "./SearchOrderingRules.vue";

const {
  list,
  createChild,
  deleteChild,
  deleteConfirmationModal,
  setDeleteId,
} = useOrderingRuleChild();
const route = useRoute();
const idParem = parseInt(route.params.id.toString());
let childs:any = ref([]);
const removeChild = () => {
  deleteChild(idParem);
};
const add = async (id: number) => {
  let data = reactive({ child_rule_id: id });
  await createChild(data, idParem);
  childs = await list(idParem);
};
const setConfirmationModal = (value: boolean) => {
  deleteConfirmationModal.value = value;
};
const modalShow = ref(false);
const setModal = (value: boolean) => {
  modalShow.value = value;
};
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  childs = await list(idParem);
  dataLoaded.value = true
});
</script>
<template>
  <div class="col-span-12 lg:col-span-9">
    <!-- BEGIN: Post Content -->
    <div class="col-span-12 intro-y">
      <Button @click="() => setModal(true)" variant="primary" class="mr-2 shadow-md">
        Add Child Rule
      </Button>
      <div class="overflow-x-auto">
        <Table class="border-spacing-y-[10px] border-separate mt-2 hover">
          <Table.Thead variant="dark">
            <Table.Tr>
              <Table.Th class="whitespace-nowrap">ID</Table.Th>
              <Table.Th class="whitespace-nowrap">NAME</Table.Th>
              <Table.Th class="whitespace-nowrap text-center"></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr v-if="!dataLoaded" class="intro-x">
              <Table.Td colspan="3" class="py-0 px-0">
                <TableLoading />
              </Table.Td>
            </Table.Tr>
            <Table.Tr v-if="childs.length == 0 && dataLoaded" class="intro-x">
              <Table.Td colspan="3" class="py-0 px-0">
                <AlertGray />
              </Table.Td>
            </Table.Tr>
            <Table.Tr v-for="child in childs" :key="child.id" class="intro-x">
              <Table.Td>
                {{ child.id }}
              </Table.Td>
              <Table.Td>
                {{ child.name }}
              </Table.Td>
              <Table.Td>
                <div class="flex items-center justify-center">
                  <NuxtLink
                    class="flex text-danger cursor-pointer"
                    @click="
                      (event) => {
                        event.preventDefault();
                        setDeleteId(child.id);
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
  </div>
  <SearchOrderingRules
    :add="add"
    v-if="modalShow"
    :key="modalShow ? 'true' : 'false'"
    :setModel="setModal"
    :modalShow="modalShow"
  />
  <Confirmation
    v-model="deleteConfirmationModal"
    buttonStringMain="Remove"
    subHeader="Do you want to remove this child rule from this ordering rules?"
    :setConfirmationModal="setConfirmationModal"
    :set-id="setDeleteId"
    :functionToRun="removeChild"
  />
</template>
