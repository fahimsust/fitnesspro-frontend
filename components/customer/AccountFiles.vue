<script setup lang="ts">
import _ from "lodash";
import { toRefs } from "vue";
import Lucide from "~/components/enigma/base-components/Lucide";
import Table from "~/components/enigma/base-components/Table";

const props = defineProps({
  modelValue: {
    required: true,
    type: Object,
  },
});
let { modelValue: customer } = toRefs(props);
const customerId = customer.value.id;
const {
  accountFileList,
  deleteConfirmationModal,
  deleteFile,
  uploadFile,
  setDeleteId } = useCustomerFiles();
const loading = ref(false);

const changeFile = async (event: any) => {
  const file = event.target.files[0];

  if (file && file.size > 2097152) { // 2MB in bytes
    alert('File size should not exceed 2MB.');
    return;
  }

  loading.value = true;
  try {
    await uploadFile(file, customerId);
    await accountFileList(customerId);
  } catch (error) {
    // Handle any errors
  } finally {
    loading.value = false;
    event.target.value = ''; // Reset the file input
  }
};

const setConfirmationModal = (value: boolean) => {
  deleteConfirmationModal.value = value;
};
const deleteFileAndReload = async () => {
  await deleteFile();
  await accountFileList(customerId)
}
const getFileName = (fullPath: string) => {
  const parts = fullPath.split('/');
  return parts[parts.length - 1];
};
let files:any = ref([]);
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  files = await accountFileList(customerId)
  dataLoaded.value = true
});
</script>

<template>
  <div class="p-1">
    <div class="text-success font-semibold mb-2">
      Certifications do NOT go here! See left side, next tab down titled "Certifications". This page will function in the
      future, thank you.
    </div>
    <div class="mt-3 mb-3">
      <p class="text-sm font-semibold text-gray-600 dark:text-gray-300">
        Uploads should be .PDF, .JPG, or .PNG formats and less than 2MB as a total file size (100kb ideal).
      </p>
    </div>
    <label
      class="flex items-center justify-center mb-5 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded cursor-pointer transition-colors w-36">
      <Lucide icon="UploadCloud" class="mr-2" />Upload File
      <input type="file" name="filename" class="hidden" @change="changeFile" accept=".pdf,.jpg,.png" />
    </label>
    <div v-if="loading" class="loader">Uploading...</div>
    <div class="overflow-y-auto col-span-12">
      <Table class="border-spacing-y-[10px] border-separate -mt-2 hover">
        <Table.Thead variant="dark">
          <Table.Tr>
            <Table.Th class="whitespace-nowrap">ID</Table.Th>
            <Table.Th class="whitespace-nowrap">File</Table.Th>
            <Table.Th class="whitespace-nowrap">UPLOADED</Table.Th>
            <Table.Th class="whitespace-nowrap"></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr v-if="!dataLoaded" class="intro-x">
            <Table.Td colspan="4" class="py-0 px-0">
              <TableLoading />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-if="files.length == 0 && dataLoaded" class="intro-x">
            <Table.Td colspan="4" class="py-0 px-0">
              <AlertGray />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-for="file in files" :key="file.id" class="intro-x">
            <Table.Td>
              {{ file.id }}
            </Table.Td>
            <Table.Td>
              <a :href="`${useRuntimeConfig().public.s3ImageUrl}${file.filename}`" target="_blank">
                {{ getFileName(file.filename) }}
              </a>

            </Table.Td>
            <Table.Td>
              {{ formatDateTime(file.uploaded) }}
            </Table.Td>
            <Table.Td>
              <div class="flex items-center justify-center">
                <NuxtLink class="flex text-danger cursor-pointer" @click="(event) => {
                  event.preventDefault();
                  setDeleteId(file.id);
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
    button-string-main="Delete" sub-header="Do you really want to delete this file?"
    :functionToRun="deleteFileAndReload" />
</template>
