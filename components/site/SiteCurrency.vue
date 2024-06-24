<script lang="ts" setup>
import _ from "lodash";
import { ref } from "vue";
import Table from "~/components/enigma/base-components/Table";
import Button from "~/components/enigma/base-components/Button";
import Lucide from "~/components/enigma/base-components/Lucide";
import SearchCurrency from "~~/components/site/SearchCurrency.vue";

const {
  getSiteCurrencies,
  deleteSiteCurrency,
  addSiteCurrency,
  updateSiteCurrency,
  deleteConfirmationModal,
  setArchiveId,
} = useSiteCurrency();
const route = useRoute();
const idParem = parseInt(route.params.id.toString());
const keyCurrency = ref(1)

const removeCurrency = async() => {
  await deleteSiteCurrency(idParem);
};
const setConfirmationModal = (value: boolean) => {
  deleteConfirmationModal.value = value;
};
const modalShow = ref(false);
const setModal = (value: boolean) => {
  modalShow.value = value;
};
const add = async (id: number) => {
  let data = reactive({
    currency_id: id,
  });
  await addSiteCurrency(data, idParem);
  await refresh();
};

const refresh = async () => {
  await getSiteCurrencies(idParem);
};
const modifyLanguage = async(obj: any) => {
  if (is_change.value == true) {
    let form = reactive({
      rank: obj.pivot.rank,
    });
    await updateSiteCurrency(form,idParem,obj.id);
    is_change.value = false;
  }
};
const openModal = ()=>{
  keyCurrency.value = keyCurrency.value+1
  setModal(true)
}
const is_change = ref(false);
let siteCurrenies: any = ref([])
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  siteCurrenies = await getSiteCurrencies(idParem);
  dataLoaded.value = true
})
</script>

<template>
  <div class="p-1">
    <Button @click="() => openModal()" variant="primary" class="mr-2 shadow-md">
      Add Currency
    </Button>

    <div class="overflow-x-auto">
      <Table class="border-spacing-y-[10px] border-separate mt-2 hover">
        <Table.Thead variant="dark">
          <Table.Tr>
            <Table.Th class="whitespace-nowrap">ID</Table.Th>
            <Table.Th class="whitespace-nowrap">NAME</Table.Th>
            <Table.Th class="whitespace-nowrap">CODE</Table.Th>
            <Table.Th class="whitespace-nowrap">RANK</Table.Th>
            <Table.Th class="whitespace-nowrap text-center"></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr v-if="!dataLoaded" class="intro-x">
            <Table.Td colspan="5" class="py-0 px-0">
              <TableLoading />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-if="siteCurrenies.length == 0 && dataLoaded" class="intro-x">
            <Table.Td colspan="5" class="py-0 px-0">
              <AlertGray />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-for="siteCurrency in siteCurrenies" :key="siteCurrency.id"
            class="intro-x">
            <Table.Td>
              {{ siteCurrency.id }}
            </Table.Td>
            <Table.Td>
              {{ siteCurrency.name }}
            </Table.Td>
            <Table.Td>
              {{ siteCurrency.code }}
            </Table.Td>
            <Table.Td>
                <input
                  class="input_class"
                  type="number"
                  v-model="siteCurrency.pivot.rank"
                  @blur="modifyLanguage(siteCurrency)"
                  @change="is_change = true"
                />
            </Table.Td>

            <Table.Td>
              <div class="flex items-center justify-center">
                <NuxtLink class="flex text-danger text-center cursor-pointer" @click="(event) => {
                    event.preventDefault();
                    setArchiveId(siteCurrency.id);
                    setConfirmationModal(true);
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
  <SearchCurrency :key="keyCurrency" :set-model="setModal" :add="add" :modal-show="modalShow" />
  <Confirmation v-model="deleteConfirmationModal" buttonStringMain="Remove"
    subHeader="Do you want to remove this currency from this site?" :setConfirmationModal="setConfirmationModal"
    :set-id="setArchiveId" :functionToRun="removeCurrency" />
</template>
