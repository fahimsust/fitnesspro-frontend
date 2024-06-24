<script setup lang="ts">
import _ from "lodash";
import { toRefs } from "vue";
import Lucide from "~/components/enigma/base-components/Lucide";
import Table from "~/components/enigma/base-components/Table";
import { FormSwitch } from "~~/components/enigma/base-components/Form";
import AddCertificate from "./AddCertificate.vue";
import EditCertificate from "./EditCertificate.vue";
import Button from "~/components/enigma/base-components/Button";

const props = defineProps({
  modelValue: {
    required: true,
    type: Object,
  },
});
let { modelValue: customer } = toRefs(props);
const customerId = customer.value.id;
const {
  accountCertificateList,
  deleteConfirmationModal,
  deleteCertificate,
  updateCertificate,
  setDeleteId
} = useCustomerCertificate();
const fetchList = async () => {
  await accountCertificateList(customerId)
}
const modelShowKey = ref(0)
const modalShow = ref(false);
const setModel = (value: boolean) => {
  modelShowKey.value = modelShowKey.value + 1
  modalShow.value = value;
};

const certificate: any = ref({
  id: 0
})
const modalShowEdit = ref(false);
const setDataAndEdit = (value: object) => {
  modelShowKey.value = modelShowKey.value + 1
  certificate.value = value
  setModelEdit(true)
}
const setModelEdit = (value: boolean) => {
  modalShowEdit.value = value;
};

const setConfirmationModal = (value: boolean) => {
  deleteConfirmationModal.value = value;
};
const deleteFileAndReload = async () => {
  await deleteCertificate();
  await accountCertificateList(customerId)
}
const getFileName = (fullPath: string) => {
  const parts = fullPath.split('/');
  return parts[parts.length - 1];
};
const updateData = async (certificate: any, fieldName: string, value: any) => {
  let form: any = {
    cert_exp: certificate.cert_exp,
    cert_type: certificate.cert_type,
    cert_org: certificate.cert_org,
    cert_num: certificate.cert_num,
  };
  form[fieldName] = !value
  await updateCertificate(form, null, certificate.id)
  await accountCertificateList(customerId)
}
const formatDate = (dateStr: any) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString(); // This will format the date in a standard readable format
}
let certificates:any = ref([]);
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  certificates = await accountCertificateList(customerId)
  dataLoaded.value = true
});
</script>

<template>
  <div class="p-1">
    <Button variant="primary" class="mr-2 mb-3 shadow-md" @click="setModel(true)">
      Add A New Certificate
    </Button>
    <div class="text-success font-semibold mb-2">
      Upload current certifications/pertinent education documents for your teaching specialties. 2 easy steps:
    </div>
    <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <ol class="list-decimal list-inside space-y-2">
        <li>
          <span class="font-medium text-gray-700 dark:text-gray-300">Step 1 - “Add Certification”</span>
          on the right side of the page ("Type" is asking whether it's yoga, group x, pt, tennis, etc..).
        </li>
        <li>
          <span class="font-medium text-gray-700 dark:text-gray-300">Step 2 - Upload</span>
          a copy of certification by clicking “Add Files” directly under the Edit button.
        </li>
      </ol>
    </div>
    <div class="mt-3">
      <p class="text-sm font-semibold text-gray-600 dark:text-gray-300">
        **If files showing without details (title, expiration, number) these are from old fitness pro travel platform.
        Please click to edit and add details.
      </p>
      <p class="text-sm font-semibold text-gray-600 dark:text-gray-300 mt-2">
        *Uploads should be .PDF, .JPG, or .PNG formats and less than 2MB as a total file size (100kb ideal).
      </p>
    </div>
    <div class="overflow-y-auto col-span-12">
      <Table class="border-spacing-y-[10px] border-separate mt-2 hover">
        <Table.Thead variant="dark">
          <Table.Tr>
            <Table.Th class="whitespace-nowrap">CERT</Table.Th>
            <Table.Th class="whitespace-nowrap">EXPIRATION</Table.Th>
            <Table.Th class="whitespace-nowrap">TYPE</Table.Th>
            <Table.Th class="whitespace-nowrap">ORGANIZATION</Table.Th>
            <Table.Th class="whitespace-nowrap">CREATED</Table.Th>
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
          <Table.Tr v-if="certificates.length == 0 && dataLoaded" class="intro-x">
            <Table.Td colspan="7" class="py-0 px-0">
              <AlertGray />
            </Table.Td>
          </Table.Tr>
          <Table.Tr class="cursor-pointer intro-x" @click="setDataAndEdit(certificate)"
            v-for="certificate in certificates" :key="certificate.id">
            <Table.Td>
              {{ certificate.cert_num }}
              <br />
              <a @click="(e) => e.stopPropagation()"
                :href="`${useRuntimeConfig().public.s3ImageUrl}${certificate.file_name}`" target="_blank"
                class="text-blue-600 hover:text-blue-800 underline transition duration-300 ease-in-out">
                {{ getFileName(certificate.file_name) }}
              </a>
            </Table.Td>
            <Table.Td>
              {{ formatDate(certificate.cert_exp) }}
            </Table.Td>
            <Table.Td>
              {{ certificate.cert_type }}
            </Table.Td>
            <Table.Td>
              {{ certificate.cert_org }}
            </Table.Td>
            <Table.Td>
              {{ formatDateTime(certificate.created) }}
            </Table.Td>
            <Table.Td>
              <FormSwitch.Input type="checkbox" :key="certificate.approval_status" v-model="certificate.approval_status"
                @click="(event: any) => {
                  event.preventDefault();
                  updateData(certificate, 'approval_status', certificate.approval_status)
                  event.stopPropagation();
                }
                  " />
            </Table.Td>
            <Table.Td>
              <div class="flex items-center justify-center">
                <NuxtLink class="flex text-danger cursor-pointer" @click="(event) => {
                  event.preventDefault();
                  setDeleteId(certificate.id);
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
    button-string-main="Delete" sub-header="Do you really want to delete this certificate?"
    :functionToRun="deleteFileAndReload" />
  <AddCertificate :modal-show="modalShow" :key="modelShowKey" v-model="customer" :set-modal="setModel"
    :fetchList="fetchList" />
  <EditCertificate v-if="certificate.id > 0" :key="modelShowKey" :modal-show="modalShowEdit" v-model="certificate"
    :set-modal="setModelEdit" :fetchList="fetchList" />
</template>
