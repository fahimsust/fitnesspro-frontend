<script lang="ts" setup>
import { ref, toRefs } from "vue";
import { Dialog } from "~/components/enigma/base-components/Headless";
import Table from "~/components/enigma/base-components/Table";
import Lucide from "~/components/enigma/base-components/Lucide";

const props = defineProps({
  setModel: {
    required: true,
    type: Function,
  },
  modalShow: {
    required: true,
    type: Boolean,
  },
  add: {
    required: true,
    type: Function,
  },
  condition_id: {
    required: true,
    type: Number,
  },
});
const keyword = ref("");
const processing = ref(false);

const { list } = useSpeciality();
const searchByKeyword = async (value: string) => {
  keyword.value = value;
  currentPage.value = 1;
  await list(condition_id.value, keyword.value);
};
const addAndReload = async (item_id: number) => {
  processing.value = true;
  await add.value(item_id);
  await list(condition_id.value, keyword.value);
  processing.value = false;
};
const refresh = async () => {
  await list(condition_id.value, keyword.value);
};
const { setModel, modalShow, add, condition_id } = toRefs(props);

const dataLoaded = ref(false)
let specilities: any = ref([]);
let lastPage: any = ref(1);
let currentPage: any = ref(1);
const fetchData = async () => {
  const result = await list(
    condition_id.value,
    keyword.value
  );
  specilities = result.specilities;
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
  <Dialog size="xl" :open="modalShow" @close="() => {
    setModel(false);
  }
    ">
    <Dialog.Panel class="p-3">
      <a @click="(event) => {
        event.preventDefault();
        setModel(false);
      }
        " class="absolute top-3 right-4" href="#">
        <Lucide icon="X" class="w-8 h-8" />
      </a>
      <Dialog.Title>
        <h2 class="mr-auto text-base font-medium">Search Specialty</h2>
      </Dialog.Title>
      <Dialog.Description class="grid grid-cols-12 gap-4 gap-y-3 max-h-[75vh] overflow-auto">
        <div class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
          <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
            <div class="relative w-56 text-slate-500">
              <EnterSearch v-model="keyword" :searchByKeyword="searchByKeyword" />
            </div>
          </div>
        </div>

        <div class="overflow-y-auto col-span-12">
          <Table class="border-spacing-y-[10px] border-separate -mt-2">
            <Table.Thead variant="dark">
              <Table.Tr>
                <Table.Th class="whitespace-nowrap">ID</Table.Th>
                <Table.Th class="whitespace-nowrap">NAME</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr v-if="!dataLoaded" class="intro-x">
                <Table.Td colspan="2" class="py-0 px-0">
                  <TableLoading />
                </Table.Td>
              </Table.Tr>
              <Table.Tr v-if="specilities.length == 0 && dataLoaded" class="intro-x">
                <Table.Td colspan="2" class="py-0 px-0">
                  <AlertGray />
                </Table.Td>
              </Table.Tr>
              <Table.Tr v-for="specility in specilities" @click="() => {
                if (!processing) addAndReload(specility.id);
              }
                " :key="specility.id" :class="{ 'cursor-pointer': !processing, 'cursor-wait': processing }"
                class="intro-x hover:bg-primary hover:text-white">
                <Table.Td>
                  {{ specility.id }}
                </Table.Td>
                <Table.Td>
                  {{ specility.name }}
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </div>
        <PaginationModal v-model="currentPage" v-if="dataLoaded" :getList="refresh" :numberOfPages="lastPage" />
      </Dialog.Description> 
    </Dialog.Panel>
  </Dialog>
</template>
