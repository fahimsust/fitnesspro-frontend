<script setup lang="ts">
import _ from "lodash";
import Table from "~/components/enigma/base-components/Table";
import Button from "~/components/enigma/base-components/Button";
import AddNote from "./AddNote.vue";

const props = defineProps({
  modelValue: {
    required: true,
    type: Object,
  },
});
let { modelValue: order } = toRefs(props);
const orderId: any = order.value.id;
const {
  getOrderNotes,
} = useOrderNotes();

const refresh = async () => {
  await getOrderNotes(orderId);
}
const modalShow = ref(false);
const setModel = (value: boolean) => {
  modalShow.value = value;
};
const keyword = ref("")
const searchByKeyword = async (keyword: any) => {
  currentPage.value = 1
  await getOrderNotes(orderId, keyword);
};

const dataLoaded = ref(false)
let notes: any = ref([]);
let lastPage: any = ref(1);
let currentPage: any = ref(1);


const fetchData = async () => {
  const result = await getOrderNotes(orderId);
  notes = result.notes;
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
    <Button variant="primary" class="mr-2 mt-2 mb-2 shadow-md" @click="setModel(true)">
      Create Note</Button>
    <div class="flex flex-wrap items-center col-span-12 mt-2 mb-2 intro-y sm:flex-nowrap">
      <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
        <div class="relative w-56 text-slate-500">
          <EnterSearch v-model="keyword" :searchByKeyword="searchByKeyword" />
        </div>
      </div>
    </div>
    <div class="overflow-y-auto col-span-12 mt-2">
      <Table class="border-spacing-y-[10px] border-separate -mt-2">
        <Table.Thead variant="dark">
          <Table.Tr>
            <Table.Th class="whitespace-nowrap">MESSAGE</Table.Th>
            <Table.Th class="whitespace-nowrap">CREATED BY</Table.Th>
            <Table.Th class="whitespace-nowrap">DATE</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr v-if="!dataLoaded" class="intro-x">
            <Table.Td colspan="3" class="py-0 px-0">
              <TableLoading />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-if="notes.length == 0 && dataLoaded" class="intro-x">
            <Table.Td colspan="3" class="py-0 px-0">
              <AlertGray />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-for="note in notes">
            <Table.Td>
              {{ note.note }}
            </Table.Td>
            <Table.Td>
              {{ note.user.name }}
            </Table.Td>
            <Table.Td>
              {{ formatDateTime(note.created) }}
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </div>
    <PaginationModal v-model="currentPage" v-if="dataLoaded" :getList="refresh" :numberOfPages="lastPage" />
  </div>
  <AddNote :modal-show="modalShow" :set-modal="setModel" :refresh="refresh" :orderId="orderId" />
</template>
