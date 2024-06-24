<script setup lang="ts">
import _ from "lodash";
import Button from "~/components/enigma/base-components/Button";
import Lucide from "~/components/enigma/base-components/Lucide";
import Table from "~/components/enigma/base-components/Table";
import Confirmation from "~~/components/Confirmation.vue";
import EditCategory from "~~/components/messageTemplate/category/EditCategory.vue";
import AddCategory from "~~/components/messageTemplate/category/AddCategory.vue";
import { useQueryParamStore } from "~/store/enigma/query-param";

definePageMeta({
  middleware: ["auth"],
  layout: "simple-menu-new",
});
useHead({
  title: "Message Template Category: " + useRuntimeConfig().public.company,
});

useQueryParamStore().setQueryParam({})

const { list, deleteMessageTemplateCategory, deleteConfirmationModal, setDeleteId } = useMessageTemplateCategories();
let messageTemplateCategories:any = ref([])
const messageTemplateCategory = ref({ id: 0 });

const setConfirmationModal = (value: boolean) => {
  deleteConfirmationModal.value = value;
};
const modalShow = ref(false);
const setModal = (value: boolean) => {
  modalShow.value = value;
};
const editShow = ref(false);
const setMessageTemplateAndShowModal = (obj: any) => {
  messageTemplateCategory.value = obj;
  setEditShow(true);
};
const setEditShow = (value: boolean) => {
  editShow.value = value;
};
const dataLoaded = ref(false)
const fetchData = async ()=>{
  messageTemplateCategories = await list();
  dataLoaded.value = true
}
onMounted(async () => {
  await nextTick();
  await fetchData();
});
</script>

<template>
  <h2 class="mt-10 text-lg font-medium intro-y">Message Template Category</h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
      <Button variant="primary" class="mr-2 shadow-md" @click="setModal(true)">
        Create Message Category</Button>
      <div class="hidden mx-auto md:block text-slate-500">
      </div>
    </div>
    <!-- BEGIN: Data List -->
    <div class="col-span-12 overflow-x-auto intro-y">
      <Table class="border-spacing-y-[10px] border-separate -mt-2 hover">
        <Table.Thead variant="dark">
          <Table.Tr>
            <Table.Th class="whitespace-nowrap">ID</Table.Th>
            <Table.Th class="whitespace-nowrap">NAME</Table.Th>
            <Table.Th class="whitespace-nowrap">PARENT CATEGORY</Table.Th>
            <Table.Th class="whitespace-nowrap text-center"></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr v-if="!dataLoaded" class="intro-x">
            <Table.Td colspan="3" class="py-0 px-0">
              <TableLoading />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-if="messageTemplateCategories.length == 0 && dataLoaded" class="intro-x">
            <Table.Td colspan="3" class="py-0 px-0">
              <AlertGray />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-for="messageTemplateCategory in messageTemplateCategories" class="cursor-pointer intro-x"
            :key="messageTemplateCategory.id" @click="setMessageTemplateAndShowModal(messageTemplateCategory)">
            <Table.Td>
              {{ messageTemplateCategory.id }}
            </Table.Td>
            <Table.Td>
              {{ messageTemplateCategory.name }}
            </Table.Td>
            <Table.Td>
              {{ messageTemplateCategory.parent ? messageTemplateCategory.parent.name : "" }}
            </Table.Td>

            <Table.Td>
              <div class="flex items-center justify-center">
                <NuxtLink class="flex text-danger cursor-pointer" @click="(event) => {
                  event.preventDefault();
                  setDeleteId(messageTemplateCategory.id);
                  setConfirmationModal(true);
                  event.stopPropagation();
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
  <Confirmation v-model="deleteConfirmationModal" :setConfirmationModal="setConfirmationModal" :set-id="setDeleteId"
    sub-header="Do you really want to delete this message category?" :functionToRun="deleteMessageTemplateCategory"
    button-string-main="Delete" />
  <AddCategory :modal-show="modalShow" :set-modal="setModal" :refresh="list" />
  <EditCategory v-if="editShow" v-model="messageTemplateCategory" :modal-show="editShow" :set-modal="setEditShow"
    :refresh="list" />
</template>
