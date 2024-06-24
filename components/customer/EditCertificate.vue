<script setup lang="ts">
import { ref, toRefs, type PropType } from "vue";
import {
  Dialog,
} from "~/components/enigma/base-components/Headless";
import Lucide from "~/components/enigma/base-components/Lucide";
import {
  InputField,
  SubmitButton,
  CancelButton,
  CheckBoxField,
  DatePickerField,
} from "~/components/form";

const props = defineProps({
  fetchList: {
    required: true,
    type: Function,
  },
  setModal: {
    required: true,
    type: Function,
  },
  modalShow: {
    required: true,
    type: Boolean,
  },
  modelValue: {
    required: true,
    type: Object,
  },
});

const {
  fetchList,
  setModal,
  modelValue: certificate,
  modalShow,
} = toRefs(props);

const {
  updateCertificate,
  errors,
  loading
} = useCustomerCertificate();

let formData = reactive({
  cert_num: certificate.value.cert_num,
  cert_exp: certificate.value.cert_exp,
  cert_type: certificate.value.cert_type,
  cert_org: certificate.value.cert_org,
  approval_status: certificate.value.approval_status,
});
let file_name: any = ref()

const certificationValidationAndEdit = async () => {
  await updateCertificate(formData, file_name.value, certificate.value.id);
  validationFocus(formData, errors);
  if (Object.keys(errors).length == 0) {
    setModal.value(false);
    fetchList.value();
  }
};
const changeFile = async (event: any) => {
  const file = event.target.files[0];

  if (file && file.size > 2097152) { // 2MB in bytes
    alert('File size should not exceed 2MB.');
    return;
  }
  event.target.value = '';
  file_name.value = file
};
const getFileName = (fullPath: string) => {
  const parts = fullPath.split('/');
  return parts[parts.length - 1];
};
const getFileIcon = (fileName: any) => {
  const extension = fileName.split('.').pop().toLowerCase();
  switch (extension) {
    case 'pdf':
      return 'File';
    case 'jpg':
    case 'jpeg':
    case 'png':
      return 'FileImage';
    default:
      return 'File';
  }
};
</script>

<template>
  <Dialog backdrop="static" size="xl" :open="modalShow" @close="() => {
    setModal(false);
  }
    ">
    <Dialog.Panel>
      <a @click="(event) => {
        event.preventDefault();
        setModal(false);
      }
        " class="absolute top-3 right-4" href="#">
        <Lucide icon="X" class="w-8 h-8" />
      </a>
      <Dialog.Title>
        <h2 class="mr-auto text-base font-medium">Edit Certificate</h2>
      </Dialog.Title>

      <Dialog.Description class="max-h-[75vh] overflow-auto">
        <div class="grid grid-cols-12 gap-4 gap-y-3">
          <div class="col-span-6 xs:col-span-12">
            <InputField :submit-function="certificationValidationAndEdit" name="cert_num" v-model="formData"
              :error="errors.cert_num" title="Certification Number" />
          </div>
          <div class="col-span-6 xs:col-span-12">
            <DatePickerField :submit-function="certificationValidationAndEdit" name="cert_exp" v-model="formData"
              :error="errors.cert_exp" :required="false" title="Expiration" />
          </div>
          <div class="col-span-6 xs:col-span-12">
            <InputField :submit-function="certificationValidationAndEdit" name="cert_org" v-model="formData"
              :error="errors.cert_org" :required="false" title="Organization" />
          </div>
          <div class="col-span-6 xs:col-span-12">
            <InputField :submit-function="certificationValidationAndEdit" name="cert_type" v-model="formData"
              :error="errors.cert_type" title="Type" />
          </div>
          <div class="col-span-6 xs:col-span-12">
            <div v-if="file_name" class="text-sm text-gray-500 pt-2">
              Selected File :
              <div class="flex items-center">
                <div class="mr-2">
                  <Lucide :icon="getFileIcon(file_name.name)" />
                </div>
                <div class='truncate'>
                  {{ file_name.name }}
                </div>
              </div>
            </div>
            <label
              class="flex items-center justify-center mb-5 mt-5 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded cursor-pointer transition-colors w-48">
              <Lucide icon="UploadCloud" class="mr-2" />Upload Certification
              <input type="file" name="file_name" class="hidden" @change="changeFile" accept=".pdf,.jpg,.png" />
            </label>

            <p>
              <a :href="`${useRuntimeConfig().public.s3ImageUrl}${certificate.file_name}`" target="_blank">
                Current File :
                <div class="flex items-center text-sm text-gray-500">
                  <div class="mr-2">
                    <Lucide :icon="getFileIcon(getFileName(certificate.file_name))" />
                  </div>
                  <div class='truncate'>{{ getFileName(certificate.file_name) }}</div>
                </div>
              </a>
            </p>
          </div>
          <div class="mt-3 col-span-6 xs:col-span-12">
            <CheckBoxField name="approval_status" v-model="formData" :error="errors.approval_status" title="Approved?" />
          </div>
        </div>
      </Dialog.Description>
      <Dialog.Footer>
        <SubmitButton :createFunction="certificationValidationAndEdit" :loading="loading" />
      </Dialog.Footer>
    </Dialog.Panel>
  </Dialog>
</template>
