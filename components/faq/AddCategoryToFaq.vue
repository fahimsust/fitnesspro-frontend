<script lang="ts" setup>
import Table from "~/components/enigma/base-components/Table";
import Alert from "~/components/enigma/base-components/Alert";
import Lucide from "~/components/enigma/base-components/Lucide";
import Button from "~/components/enigma/base-components/Button";
import { ref } from "vue";
import SearchFaqCategory from "./SearchFaqCategory.vue";

const {
  getFaqCategories,
  addFaqCategory,
  deleteCategory,
  deleteConfirmationModal,
  setArchiveId,
} = useFaqsCategories();
const route = useRoute();
const idParem = parseInt(route.params.id.toString());
let categories: any = ref([]);
const removeCategory = () => {
  deleteCategory(idParem);
};
const add = async (id: number) => {
  let data = reactive({ categories_id: id });
  await addFaqCategory(data, idParem);
  categories = await getFaqCategories(idParem);
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
  categories = await getFaqCategories(idParem);
  dataLoaded.value = true
});
</script>
<template>
  <Button @click="() => setModal(true)" variant="primary" class="mr-2 shadow-md">
    Add Category
  </Button>
  <div class="overflow-x-auto">
    <Table class="border-spacing-y-[10px] border-separate mt-2 hover">
      <Table.Thead variant="dark">
        <Table.Tr>
          <Table.Th class="whitespace-nowrap">ID</Table.Th>
          <Table.Th class="whitespace-nowrap">TITLE</Table.Th>
          <Table.Th class="whitespace-nowrap text-center"></Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        <Table.Tr v-if="!dataLoaded" class="intro-x">
          <Table.Td colspan="3" class="py-0 px-0">
            <TableLoading />
          </Table.Td>
        </Table.Tr>
        <Table.Tr v-if="categories.length == 0 && dataLoaded" class="intro-x">
          <Table.Td colspan="3" class="py-0 px-0">
            <AlertGray />
          </Table.Td>
        </Table.Tr>
        <Table.Tr v-for="category in categories" :key="category.id" class="intro-x">
          <Table.Td>
            {{ category.id }}
          </Table.Td>
          <Table.Td>
            {{ category.title }}
          </Table.Td>
          <Table.Td>
            <div class="flex items-center justify-center">
              <NuxtLink class="flex text-danger cursor-pointer" @click="(event) => {
                  event.preventDefault();
                  setArchiveId(category.id);
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
  <SearchFaqCategory :add="add" v-if="modalShow" :key="modalShow ? 'true' : 'false'" :setModel="setModal"
    :modalShow="modalShow" />
  <Confirmation v-model="deleteConfirmationModal" buttonStringMain="Remove"
    subHeader="Do you want to remove this category from faq?" :setConfirmationModal="setConfirmationModal"
    :set-id="setArchiveId" :functionToRun="removeCategory" />
</template>
