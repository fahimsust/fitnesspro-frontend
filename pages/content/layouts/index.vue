<script setup lang="ts">
import _ from "lodash";
import Button from "~/components/enigma/base-components/Button";
import Lucide from "~/components/enigma/base-components/Lucide";
import Table from "~/components/enigma/base-components/Table";
import Confirmation from "~~/components/Confirmation.vue";
import EditLayout from "~/components/layout/EditLayout.vue";
import AddLayout from "~/components/layout/AddLayout.vue";
import { useQueryParamStore } from "~/store/enigma/query-param";

definePageMeta({
  middleware: ["auth"],
  layout: "simple-menu-new",
});

useHead({
  title: "Layouts: " + useRuntimeConfig().public.company,
});

useQueryParamStore().setQueryParam({})

const { list, deleteLayout, deleteConfirmationModal, setArchiveId } = useLayouts();

const layout = ref({ id: 0 });

const setConfirmationModal = (value: boolean) => {
  deleteConfirmationModal.value = value;
};
const modalShow = ref(false);
const setModel = (value: boolean) => {
  modalShow.value = value;
};
const editModalShow = ref(false);
const setLayoutAndOpenModal = (obj: any) => {
  layout.value = obj;
  setEditModalShow(true);
};
const setEditModalShow = (value: boolean) => {
  editModalShow.value = value;
};
let layouts: any = ref({});
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  layouts = await list();
  dataLoaded.value = true
})
</script>

<template>
  <h2 class="mt-10 text-lg font-medium intro-y">Layouts</h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
      <Button variant="primary" class="mr-2 shadow-md" @click="setModel(true)">
        Create New Layout</Button>
      <div class="hidden mx-auto md:block text-slate-500">
        <!-- Showing 1 to 10 of 150 entries -->
      </div>
    </div>
    <!-- BEGIN: Data List -->
    <div class="col-span-12 overflow-x-auto intro-y">
      <Table class="border-spacing-y-[10px] border-separate -mt-2 hover">
        <Table.Thead variant="dark">
          <Table.Tr>
            <Table.Th class="whitespace-nowrap">ID</Table.Th>
            <Table.Th class="whitespace-nowrap">NAME</Table.Th>
            <Table.Th class="whitespace-nowrap">FILE</Table.Th>
            <Table.Th class="whitespace-nowrap text-center"></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr v-if="!dataLoaded" class="intro-x">
            <Table.Td colspan="4" class="py-0 px-0">
              <TableLoading />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-if="layouts.length == 0 && dataLoaded" class="intro-x">
            <Table.Td colspan="4" class="py-0 px-0">
              <AlertGray />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-for="layout in layouts" class="cursor-pointer intro-x" :key="layout.id"
            @click="setLayoutAndOpenModal(layout)">
            <Table.Td>
              {{ layout.id }}
            </Table.Td>
            <Table.Td>
              {{ layout.name }}
            </Table.Td>
            <Table.Td>
              {{ layout.file }}
            </Table.Td>
            <Table.Td>
              <div class="flex items-center justify-center">
                <NuxtLink class="flex text-danger cursor-pointer" @click="(event) => {
                  event.preventDefault();
                  setArchiveId(layout.id);
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
  <Confirmation v-model="deleteConfirmationModal" :setConfirmationModal="setConfirmationModal" :set-id="setArchiveId"
    sub-header="Do you really want to delete this layout?" :functionToRun="deleteLayout" button-string-main="Delete" />
  <AddLayout :modal-show="modalShow" :set-modal="setModel" :refresh="list" />
  <EditLayout :key="layout.id" v-model="layout" :modal-show="editModalShow" :set-modal="setEditModalShow" :refresh="list" />
</template>
