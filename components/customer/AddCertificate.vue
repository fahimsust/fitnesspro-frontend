<script setup lang="ts">
import { ref, toRefs, type PropType } from "vue";
import Error from "~/components/form/Error.vue";
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
interface Option {
  id: string;
  name: string;
}

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
  modelValue: customer,
  modalShow,
} = toRefs(props);

const {
  uploadCertificate,
  errors,
  loading
} = useCustomerCertificate();

let formData = reactive({
  account_id: customer.value.id,
  cert_num: null,
  cert_exp: null,
  cert_type: null,
  cert_org: null,
  approval_status: false,
});
let file_name: any = ref()

const certificationValidationAndAdd = async () => {
  await uploadCertificate(formData, file_name.value);
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
        <h2 class="mr-auto text-base font-medium">Add Certificate</h2>
      </Dialog.Title>

      <Dialog.Description class="max-h-[75vh] overflow-auto">
        <div class="grid grid-cols-12 gap-4 gap-y-3">
          <div class="col-span-6 xs:col-span-12">
            <InputField :submit-function="certificationValidationAndAdd" name="cert_num" v-model="formData"
              :error="errors.cert_num" :required="true" title="Certification Number" />
          </div>
          <div class="col-span-6 xs:col-span-12">
            <DatePickerField :submit-function="certificationValidationAndAdd" name="cert_exp" v-model="formData"
              :error="errors.cert_exp" :required="false" title="Expiration" />
          </div>
          <div class="col-span-6 xs:col-span-12">
            <InputField :submit-function="certificationValidationAndAdd" name="cert_org" v-model="formData"
              :error="errors.cert_org" :required="true" title="Organization" />
          </div>
          <div class="col-span-6 xs:col-span-12">
            <InputField :submit-function="certificationValidationAndAdd" name="cert_type" v-model="formData"
              :error="errors.cert_type" :required="true" title="Type" />
          </div>
          <div class="col-span-6 xs:col-span-12">
            <div v-if="file_name" class="text-sm text-gray-500 pt-2 mb-2">
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
            <Error :error="errors.file_name" />
            <label
              class="flex items-center justify-center mb-5 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded cursor-pointer transition-colors w-48">
              <Lucide icon="UploadCloud" class="mr-2" />Upload Certification
              <input type="file" name="file_name" class="hidden" @change="changeFile" accept=".pdf,.jpg,.png" />
            </label>
          </div>
          <div class="mt-3 col-span-6 xs:col-span-12">
            <CheckBoxField name="approval_status" v-model="formData" :error="errors.approval_status" title="Approved?" />
          </div>
        </div>
      </Dialog.Description>
      <Dialog.Footer>
        <SubmitButton :createFunction="certificationValidationAndAdd" :loading="loading" />
      </Dialog.Footer>
    </Dialog.Panel>
  </Dialog>
</template>
