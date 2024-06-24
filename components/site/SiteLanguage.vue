<script lang="ts" setup>
import _ from "lodash";
import { ref } from "vue";
import Table from "~/components/enigma/base-components/Table";
import Button from "~/components/enigma/base-components/Button";
import Lucide from "~/components/enigma/base-components/Lucide";
import SearchLanguage from "~~/components/site/SearchLanguage.vue";

const {
  getSiteLanguages,
  deleteSiteLanguage,
  addSiteLanguage,
  updateSiteLanguage,
  deleteConfirmationModal,
  setArchiveId,
} = useSiteLanguage();
const route = useRoute();
const idParem = parseInt(route.params.id.toString());
const keyLanguage = ref(1)

const removeLanguage = async() => {
  await deleteSiteLanguage(idParem);
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
    language_id: id,
  });
  await addSiteLanguage(data, idParem);
  await refresh();
};

const refresh = async () => {
  await getSiteLanguages(idParem);
};
const modifyLanguage = async(obj: any) => {
  if (is_change.value == true) {
    let form = reactive({
      rank: obj.pivot.rank,
    });
    await updateSiteLanguage(form,idParem,obj.id);
    is_change.value = false;
  }
};
const openModal = ()=>{
  keyLanguage.value = keyLanguage.value+1
  setModal(true)
}
const is_change = ref(false);
let siteLanguages: any = ref([])
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  siteLanguages = await getSiteLanguages(idParem);
  dataLoaded.value = true
})
</script>

<template>
  <div class="p-1">
    <Button @click="() => openModal()" variant="primary" class="mr-2 shadow-md">
      Add Language
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
          <Table.Tr v-if="siteLanguages.length == 0 && dataLoaded" class="intro-x">
            <Table.Td colspan="5" class="py-0 px-0">
              <AlertGray />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-for="siteLanguage in siteLanguages" :key="siteLanguage.id"
            class="intro-x">
            <Table.Td>
              {{ siteLanguage.id }}
            </Table.Td>
            <Table.Td>
              {{ siteLanguage.name }}
            </Table.Td>
            <Table.Td>
              {{siteLanguage.code }}
            </Table.Td>
            <Table.Td>
                <input
                  class="input_class"
                  type="number"
                  v-model="siteLanguage.pivot.rank"
                  @blur="modifyLanguage(siteLanguage)"
                  @change="is_change = true"
                />
            </Table.Td>

            <Table.Td>
              <div class="flex items-center justify-center">
                <NuxtLink class="flex text-danger text-center cursor-pointer" @click="(event) => {
                    event.preventDefault();
                    setArchiveId(siteLanguage.id);
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
  <SearchLanguage :key="keyLanguage" :set-model="setModal" :add="add" :modal-show="modalShow" />
  <Confirmation v-model="deleteConfirmationModal" buttonStringMain="Remove"
    subHeader="Do you want to remove this language from this site?" :setConfirmationModal="setConfirmationModal"
    :set-id="setArchiveId" :functionToRun="removeLanguage" />
</template>
