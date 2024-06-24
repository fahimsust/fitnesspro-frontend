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
});
const wait = ref(false);
const route = useRoute();
const idParem = parseInt(route.params.id.toString());
const { list } = useLanguages();

const addAndSearch = async (id: number) => {
  wait.value = true;
  await add.value(id);
  await list(idParem);
  wait.value = false;
};
const { setModel, modalShow, add } = toRefs(props);

let languages: any = ref([])
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  languages = await list(
    idParem
  );
  dataLoaded.value = true
})
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
        <h2 class="mr-auto text-base font-medium">Languages</h2>
      </Dialog.Title>
      <Dialog.Description class="grid grid-cols-12 gap-4 gap-y-3 max-h-[75vh] overflow-auto">
        <div class="overflow-y-auto col-span-12">
          <Table class="border-spacing-y-[10px] border-separate -mt-2">
            <Table.Thead variant="dark">
              <Table.Tr>
                <Table.Th class="whitespace-nowrap">ID</Table.Th>
                <Table.Th class="whitespace-nowrap">NAME</Table.Th>
                <Table.Th class="whitespace-nowrap">CODE</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr v-if="!dataLoaded" class="intro-x">
                <Table.Td colspan="3" class="py-0 px-0">
                  <TableLoading />
                </Table.Td>
              </Table.Tr>
              <Table.Tr v-if="languages.length == 0 && dataLoaded" class="intro-x">
                <Table.Td colspan="3" class="py-0 px-0">
                  <AlertGray />
                </Table.Td>
              </Table.Tr>
              <Table.Tr v-for="language in languages" @click="() => {
                if (!wait) addAndSearch(language.id);
              }
                " :key="language.id" class="intro-x hover:bg-primary hover:text-white"
                :class="{ 'cursor-pointer': !wait, 'cursor-wait': wait }">
                <Table.Td>
                  {{ language.id }}
                </Table.Td>
                <Table.Td>
                  {{ language.name }}
                </Table.Td>
                <Table.Td>
                  {{ language.code }}
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </div>
      </Dialog.Description>
    </Dialog.Panel>
  </Dialog>
</template>
