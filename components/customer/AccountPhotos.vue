<script setup lang="ts">
import _ from "lodash";
import { toRefs } from "vue";
import Lucide from "~/components/enigma/base-components/Lucide";
import Table from "~/components/enigma/base-components/Table";
import { FormSwitch } from "~~/components/enigma/base-components/Form";

const props = defineProps({
  modelValue: {
    required: true,
    type: Object,
  },
});
let { modelValue: customer } = toRefs(props);
const customerId = customer.value.id;
const { accountPhotoList, deletePhoto, setDeleteId, statusChange, deleteConfirmationModal } = useCustomerPhotos();

const changeStatus = async (value: boolean, id: number) => {
  await statusChange(value, id);
  await accountPhotoList(customerId)
};
const setConfirmationModal = (value: boolean) => {
  deleteConfirmationModal.value = value;
};
const deletePhotoAndReload = async () => {
  await deletePhoto();
  await accountPhotoList(customerId)
}
let photos:any = ref([]);
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  photos = await accountPhotoList(customerId)
  dataLoaded.value = true
});
</script>

<template>
  <div class="p-1">
    <div class="overflow-y-auto col-span-12">
      <Table class="border-spacing-y-[10px] border-separate -mt-2 hover">
        <Table.Thead variant="dark">
          <Table.Tr>
            <Table.Th class="whitespace-nowrap">ID</Table.Th>
            <Table.Th class="whitespace-nowrap">PROFILE PHOTO</Table.Th>
            <Table.Th class="whitespace-nowrap">IMAGE</Table.Th>
            <Table.Th class="whitespace-nowrap">TITLE</Table.Th>
            <Table.Th class="whitespace-nowrap">ADDED</Table.Th>
            <Table.Th class="whitespace-nowrap">APPROVED</Table.Th>
            <Table.Th class="whitespace-nowrap"></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr v-if="!dataLoaded" class="intro-x">
            <Table.Td colspan="7" class="py-0 px-0">
              <TableLoading />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-if="photos.length == 0 && dataLoaded" class="intro-x">
            <Table.Td colspan="7" class="py-0 px-0">
              <AlertGray />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-for="photo in photos" :key="photo.id" class="intro-x">
            <Table.Td>
              {{ photo.id }}
            </Table.Td>
            <Table.Td>
              {{ photo.account_profile_image ? "Yes" : "No" }}
            </Table.Td>
            <Table.Td>
              <img :alt="photo.img" :src="`${useRuntimeConfig().public.s3ImageUrl}/tr:w-80,h-80/${photo.img}`" />
            </Table.Td>
            <Table.Td>
              {{ photo.title }}
            </Table.Td>
            <Table.Td>
              {{ formatDateTime(photo.added) }}
            </Table.Td>
            <Table.Td>
              <FormSwitch.Input type="checkbox" :key="photo.approved" v-model="photo.approved" @click="(event: any) => {
                event.preventDefault();
                changeStatus(!photo.approved, photo.id);
                event.stopPropagation();
              }
                " />
            </Table.Td>
            <Table.Td>
              <div class="flex items-center justify-center">
                <NuxtLink class="flex text-danger cursor-pointer" @click="(event) => {
                  event.preventDefault();
                  setDeleteId(photo.id);
                  setConfirmationModal(true);
                  event.stopPropagation();
                }
                  ">
                  <Lucide icon="Trash2" class="w-4 h-4 mr-1" />
                  <span class="hidden">Delete</span>
                </NuxtLink>
              </div>
            </Table.Td>

          </Table.Tr>
        </Table.Tbody>
      </Table>
    </div>
  </div>
  <Confirmation v-model="deleteConfirmationModal" :setConfirmationModal="setConfirmationModal" :set-id="setDeleteId"
    button-string-main="Delete" sub-header="Do you really want to delete this photo?"
    :functionToRun="deletePhotoAndReload" />
</template>
