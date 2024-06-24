<script lang="ts" setup>
import _ from "lodash";
import { ref } from "vue";
import Table from "~/components/enigma/base-components/Table";
import Button from "~/components/enigma/base-components/Button";
import Lucide from "~/components/enigma/base-components/Lucide";
import SearchCategory from "~~/components/site/SearchCategory.vue";

const {
  getSiteCategories,
  deleteSiteCategory,
  addSiteCategory,
  deleteConfirmationModal,
  setArchiveId,
} = useSiteCategory();
const route = useRoute();
const idParem = parseInt(route.params.id.toString());

const removeCategory = async () => {
  await deleteSiteCategory(idParem);
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
    category_id: id,
  });
  await addSiteCategory(data, idParem);
  await refresh();
};

const refresh = async () => {
  await getSiteCategories(idParem);
};
let siteCategories: any = ref([])
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  siteCategories = await getSiteCategories(idParem);
  dataLoaded.value = true
})
</script>

<template>
  <div class="p-1">
    <Button @click="() => setModal(true)" variant="primary" class="mr-2 shadow-md">
      Add Category
    </Button>

    <div class="overflow-x-auto">
      <Table class="border-spacing-y-[10px] border-separate mt-2 hover">
        <Table.Thead variant="dark">
          <Table.Tr>
            <Table.Th class="whitespace-nowrap">ID</Table.Th>
            <Table.Th class="whitespace-nowrap">TITLE</Table.Th>
            <Table.Th class="whitespace-nowrap">SUBTITLE</Table.Th>
            <Table.Th class="whitespace-nowrap text-center"></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr v-if="!dataLoaded" class="intro-x">
            <Table.Td colspan="4" class="py-0 px-0">
              <TableLoading />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-if="siteCategories.length == 0 && dataLoaded" class="intro-x">
            <Table.Td colspan="4" class="py-0 px-0">
              <AlertGray />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-for="siteCategory in siteCategories" :key="siteCategory.id" class="intro-x">
            <Table.Td>
              {{ siteCategory.id }}
            </Table.Td>
            <Table.Td>
              {{ siteCategory.title }}
            </Table.Td>
            <Table.Td>
              {{ siteCategory.subtitle }}
            </Table.Td>

            <Table.Td>
              <div class="flex items-center justify-center">
                <NuxtLink class="flex text-danger text-center cursor-pointer" @click="(event) => {
                  event.preventDefault();
                  setArchiveId(siteCategory.id);
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
  <SearchCategory :set-model="setModal" :add="add" :modal-show="modalShow" />
  <Confirmation v-model="deleteConfirmationModal" buttonStringMain="Remove"
    subHeader="Do you want to remove this category?" :setConfirmationModal="setConfirmationModal" :set-id="setArchiveId"
    :functionToRun="removeCategory" />
</template>
