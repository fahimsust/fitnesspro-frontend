<script lang="ts" setup>
import { ref, toRefs, type PropType } from "vue"
import { Dialog } from "~/components/enigma/base-components/Headless"
import Lucide from "~/components/enigma/base-components/Lucide"
import Table from "~/components/enigma/base-components/Table"
import Button from "~/components/enigma/base-components/Button"
import AttributeOptions from "./AttributeOptions.vue"

import EditAttribute from "./EditAttribute.vue"
import CreateAttribute from "./CreateAttribute.vue"

const props = defineProps({
  setModel: {
    required: true,
    type: Function,
  },
  set: {
    required: true,
    type: Object as PropType<any>
  },
  modalShow: {
    required: true,
    type: Boolean,
  }
})
const {
  setModel,
  modalShow,
  set
} = toRefs(props)
const {
  list,
  deleteAttribute,
  setDeleteId,
  deleteConfirmationModal
} = useAttribute()
const fetchlist = async () => {
  await list(set.value.id);
}
const removeAttribute = async (id: number) => {
  await deleteAttribute(set.value.id)
}
const setConfirmationModal = (value: boolean) => {
  deleteConfirmationModal.value = value
}
const slideOver = ref(false)

const setSlideover = (value: boolean) => {
  slideOver.value = value
}
const slideOverAdd = ref(false)

const setSlideoverAdd = (value: boolean) => {
  slideOverAdd.value = value
}

const setAttributeAndOpenOption = (value: any) => {
  attribute.value = value
  setModalOption(true)
}
const modalOption = ref(false)

const setModalOption = (value: boolean) => {
  modalOption.value = value
}

const attribute = ref({ id: 0 })
const setAttribute = (value: any) => {
  attribute.value = value
  setSlideover(true)
}


const dataLoaded = ref(false)
let attributes: any = ref([]);
let lastPage: any = ref(1);
let currentPage: any = ref(1);

const fetchData = async () => {
  const result = await list(set.value.id)
  attributes = result.attributes;
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
        <h2 class="mr-auto text-base font-medium">{{ set.name }}: Attributes</h2>
      </Dialog.Title>
      <Dialog.Description class="grid grid-cols-12 gap-4 gap-y-3 max-h-[75vh] overflow-auto">
        <div class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
          <Button @click="setSlideoverAdd(true)" variant="primary" class="ml-0 mb-2 sm:mb-0 shadow-none">
            Create Attribute
          </Button>
        </div>

        <div class="overflow-y-auto col-span-12">
          <Table class="border-spacing-y-[10px] border-separate -mt-2 hover">
            <Table.Thead variant="dark" class="text-xs">
              <Table.Tr>
                <Table.Th class="whitespace-nowrap"></Table.Th>
                <Table.Th class="whitespace-nowrap">ATTRIBUTES</Table.Th>
                <Table.Th class="whitespace-nowrap">NO. OF OPTIONS</Table.Th>
                <Table.Th class="whitespace-nowrap text-center"></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr v-if="!dataLoaded" class="intro-x">
                <Table.Td colspan="4" class="py-0 px-0">
                  <TableLoading />
                </Table.Td>
              </Table.Tr>
              <Table.Tr v-if="attributes.length == 0 && dataLoaded" class="intro-x">
                <Table.Td colspan="4" class="py-0 px-0">
                  <AlertGray />
                </Table.Td>
              </Table.Tr>
              <template v-for="attribute in attributes" :key="attribute.id">
                <Table.Tr class="cursor-pointer" @click="(event: any) => { setAttribute(attribute); }">
                  <Table.Td>
                    <Button variant="pending" class="w-auto mb-1 mr-2 text-xs" @click="(event: any) => {
                      event.preventDefault();
                      setAttributeAndOpenOption(attribute);
                      event.stopPropagation();
                    }
                      ">
                      <Lucide icon="List" class="w-4 h-4 mr-2" />Options
                    </Button>
                  </Table.Td>
                  <Table.Td>
                    {{ attribute.name }}
                  </Table.Td>
                  <Table.Td>
                    {{ attribute.options_count }}
                  </Table.Td>
                  <Table.Td>
                    <div class="flex items-center justify-center">
                      <NuxtLink class="flex text-danger text-center cursor-pointer" @click="(event: any) => {
                        event.preventDefault();
                        setDeleteId(attribute.id);
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
              </template>
            </Table.Tbody>
          </Table>
        </div>
        <PaginationModal v-model="currentPage" v-if="dataLoaded" :getList="fetchlist" :numberOfPages="lastPage" />
        <Confirmation v-model="deleteConfirmationModal" buttonStringMain="Remove"
          subHeader="Do you want to remove this attribute?" :setConfirmationModal="setConfirmationModal"
          :set-id="setDeleteId" :functionToRun="removeAttribute" />
      </Dialog.Description>

    </Dialog.Panel>
  </Dialog>
  <EditAttribute :key="attribute.id" v-if="attribute.id > 0" :set-slider="setSlideover" :refresh="fetchlist"
    :slide-over="slideOver" v-model="attribute" />
  <CreateAttribute :set-slider="setSlideoverAdd" :set-id="set.id" :refresh="fetchlist" :slide-over="slideOverAdd" />
  <AttributeOptions :set-model="setModalOption" :modal-show="modalOption" :attribute="attribute" :key="attribute.id"
    v-if="attribute.id > 0" />
</template>
