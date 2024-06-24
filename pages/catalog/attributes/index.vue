<script setup lang="ts">
import _ from "lodash";
import Button from "~/components/enigma/base-components/Button";
import Lucide from "~/components/enigma/base-components/Lucide";
import Table from "~/components/enigma/base-components/Table";
import Confirmation from "~/components/Confirmation.vue";
import { useAttributeSet } from "~/composables/attribute/useAttributeSet";
import CreateAttributeSet from "~~/components/attribute/CreateAttributeSet.vue";
import EditAttributeSet from "~~/components/attribute/EditAttributeSet.vue";
import Attributes from "~~/components/attribute//Attributes.vue";
import { useQueryParamStore } from "~/store/enigma/query-param";

definePageMeta({
  middleware: ["auth"],
  layout: "simple-menu-new",
});

useHead({
  title: "Attribute Set: " + useRuntimeConfig().public.company,
});
useQueryParamStore().setQueryParam({})
const {
  list,
  deleteAttributeSet,
  deleteConfirmationModal,
  setDeleteId,
} = useAttributeSet();
const dataLoaded = ref(false)
let attributeSets:any = ref([]);
let lastPage:any = ref(1);
let currentPage:any = ref(1);
let orderBy:any = ref('');
let orderType:any = ref('');
const fetchData = async ()=>{
  const result = await list();
  attributeSets = result.attributeSets;
  lastPage = result.lastPage;
  currentPage = result.currentPage;
  orderBy = result.orderBy;
  orderType = result.orderType;
  dataLoaded.value = true
}

const attributeSet = ref({ id: 0 });

const setConfirmationModal = (value: boolean) => {
  deleteConfirmationModal.value = value;
};
const modalShow = ref(false);
const setModal = (value: boolean) => {
  modalShow.value = value;
};
const modalShowAttribute = ref(false);
const setModalAttribute = (value: boolean) => {
  modalShowAttribute.value = value;
};
const setAttributeSetAndOpenModalAttribute = (obj: any) => {
  attributeSet.value = obj;
  setModalAttribute(true);
};
const modalShowEdit = ref(false);
const setAttributeSetAndOpenModal = (obj: any) => {
  attributeSet.value = obj;
  setModalEdit(true);
};
const setModalEdit = (value: boolean) => {
  modalShowEdit.value = value;
};
onMounted(async () => {
  await nextTick();
  await fetchData();
});
const fetchList = async () => {
  currentPage.value = 1;
  await fetchData();
};
const headerColumns = ref([
  { label: '', field: '', sortable: false },
  { label: 'ATTRIBUTE SET NAME', field: 'name', sortable: true },
  { label: 'NO. OF ATTRIBUTES', field: 'attributes_count', sortable: true },
  { label: '', field: '', sortable: false,extraClass:"text-center" },
]);
const changeOrder = async (order_by: string) => {
  await changeOrderBy(order_by, orderBy, orderType, fetchList);
}
</script>

<template>
  <h2 class="mt-10 text-lg font-medium intro-y">Attribute Set</h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
      <Button variant="primary" class="mr-2 shadow-md" @click="setModal(true)">
        Create Attribute Set</Button
      >
    </div>
    <!-- BEGIN: Data List -->
    <div class="col-span-12 overflow-x-auto intro-y">
      <Table class="border-spacing-y-[10px] border-separate -mt-2 hover">
        <SortableTableHeader
          :columns="headerColumns"
          :orderBy="orderBy"
          :orderType="orderType"
          :handleSort="changeOrder"
          :v-if="dataLoaded"
        />
        <Table.Tbody>
          <Table.Tr v-if="!dataLoaded" class="intro-x">
            <Table.Td colspan="4" class="py-0 px-0">
              <TableLoading />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-if="attributeSets.length == 0 && dataLoaded" class="intro-x">
            <Table.Td colspan="4" class="py-0 px-0">
              <AlertGray />
            </Table.Td>
          </Table.Tr>
          <Table.Tr
            v-for="attributeSet in attributeSets"
            class="cursor-pointer intro-x"
            :key="attributeSet.id"
            @click="setAttributeSetAndOpenModal(attributeSet)"
          >
            <Table.Td>
              <Button
                variant="pending"
                class="w-auto mb-1 mr-2 text-xs"
                @click="
                  (event) => {
                    event.preventDefault();
                    setAttributeSetAndOpenModalAttribute(attributeSet);
                    event.stopPropagation();
                  }
                "
              >
                <Lucide icon="List" class="w-4 h-4 mr-2" />Attributes
              </Button>
            </Table.Td>
            <Table.Td>
              {{ attributeSet.name }}
            </Table.Td>
            <Table.Td>
              {{ attributeSet.attributes_count }}
            </Table.Td>

            <Table.Td>
              <div class="flex items-center justify-center">
                <NuxtLink
                  class="flex text-danger cursor-pointer"
                  @click="
                    (event) => {
                      event.preventDefault();
                      setDeleteId(attributeSet.id);
                      setConfirmationModal(true);
                      event.stopPropagation();
                    }
                  "
                >
                  <Lucide icon="Trash2" class="w-4 h-4 mr-1" />
                  <span class="hidden">Remove</span>
                </NuxtLink>
              </div>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </div>
    <!-- END: Data List -->

    <Pagination v-model="currentPage" v-if="dataLoaded" :key="currentPage" :getList="list" :numberOfPages="lastPage" />
  </div>
  <Confirmation
    v-model="deleteConfirmationModal"
    :setConfirmationModal="setConfirmationModal"
    :set-id="setDeleteId"
    sub-header="Do you really want to delete this Attribute Set?"
    :functionToRun="deleteAttributeSet"
    button-string-main="Delete"
  />
  <CreateAttributeSet :set-modal="setModal" :modal-show="modalShow" :refresh="list" />
  <EditAttributeSet
    v-if="attributeSet.id > 0"
    :key="attributeSet.id"
    :set-modal="setModalEdit"
    :modal-show="modalShowEdit"
    v-model="attributeSet"
    :refresh="list"
  />
  <Attributes
    v-if="attributeSet.id > 0"
    :key="attributeSet.id"
    :set="attributeSet"
    :set-model="setModalAttribute"
    :modal-show="modalShowAttribute"
  />
</template>
