<script setup lang="ts">
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
});
const awaiting = ref(false);
const keyword = ref("");
const route = useRoute();
const { searchChildRules } = useOrderingRuleChild();
const idParem = parseInt(route.params.id.toString());
const searchByKeyword = async (value: string) => {
  keyword.value = value;
  await searchChildRules(idParem, keyword.value);
};
const { setModel, modalShow, add } = toRefs(props);

const addAndSearch = async (id: number) => {
  awaiting.value = true;
  await add.value(id);
  await searchChildRules(idParem, keyword.value);
  awaiting.value = false;
};
let childRules: any = ref([]);
const dataLoaded = ref(false)
const fetchData = async () => {
  childRules = await searchChildRules(idParem, keyword.value);
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
    <Dialog.Panel class="p-3 text-center">
      <a @click="(event) => {
        event.preventDefault();
        setModel(false);
      }
        " class="absolute top-3 right-4" href="#">
        <Lucide icon="X" class="w-8 h-8" />
      </a>
      <Dialog.Title>
        <h2 class="mr-auto text-base font-medium">Search Child Rules</h2>
      </Dialog.Title>
      <Dialog.Description class="grid grid-cols-12 gap-4 gap-y-3">
        <div class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
          <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
            <div class="relative w-56 text-slate-500">
              <EnterSearch v-model="keyword" :searchByKeyword="searchByKeyword" />
            </div>
          </div>
        </div>

        <div class="overflow-y-auto col-span-12 max-h-72">
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
              <Table.Tr v-if="childRules.length == 0 && dataLoaded" class="intro-x">
                <Table.Td colspan="2" class="py-0 px-0">
                  <AlertGray />
                </Table.Td>
              </Table.Tr>
              <Table.Tr v-for="childRule in childRules" @click="() => {
                if (!awaiting) addAndSearch(childRule.id);
              }
                " :key="childRule.id" class="intro-x hover:bg-primary hover:text-white"
                :class="{ 'cursor-pointer': !awaiting, 'cursor-wait': awaiting }">
                <Table.Td>
                  {{ childRule.id }}
                </Table.Td>
                <Table.Td>
                  {{ childRule.name }}
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </div>
      </Dialog.Description>
    </Dialog.Panel>
  </Dialog>
</template>
