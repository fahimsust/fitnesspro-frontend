<script lang="ts" setup>
import { onMounted, ref, toRefs, provide } from "vue";
import Lucide from "~/components/enigma/base-components/Lucide";
import { Dialog } from "~/components/enigma/base-components/Headless";
import Error from "./form/Error.vue";

import { InputField, SubmitButton, CancelButton } from "~/components/form";
import { type FilePond, setOptions } from "filepond";
import vueFilePond from "vue-filepond";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";

const props = defineProps({
  setModel: {
    required: true,
    type: Function,
  },
  add: {
    required: true,
    type: Function,
  },
  modalShow: {
    required: true,
    type: Boolean,
  },
});
const uploadUrl = useRuntimeConfig().public.backendBaseUrl + "/api/";
setOptions({
  server: {
    url: uploadUrl,
    process: {
      url: "upload-file",
      method: "POST",
      withCredentials: false,
      onload: (formData: any) => {
        const obj = JSON.parse(formData);
        image.value = obj.id;
        return formData;
      },
    },
  },
});

const { saveImage, errors, loading } = useImages();

const { setModel, modalShow, add } = toRefs(props);

const image = ref(null);
let form = reactive({
  name: null,
  default_caption: null,
  image: null,
});

const fileValidationAndAdd = async () => {
  form.image = image.value;
  const image_id = await saveImage(form);
  validationFocus(form, errors);
  if (image_id != 0) {
    add.value(image_id);
    setModel.value(false);
  }
};

const FilePondComponent = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview
);
const pond = ref<FilePond | null>(null);
FilePondComponent.setup;
</script>
<template>
  <Dialog :open="modalShow" @close="() => {
    setModel(false);
  }
    ">
    <Dialog.Panel>
      <a @click="(event) => {
        event.preventDefault();
        setModel(false);
      }
        " class="absolute top-3 right-4" href="#">
        <Lucide icon="X" class="w-8 h-8" />
      </a>
      <Dialog.Title>
        <h2 class="mr-auto text-base font-medium">Add Image</h2>
      </Dialog.Title>

      <Dialog.Description>
        <div>
          <file-pond-component ref="pond" instant-upload="true" label-idle="Drop files here..." :allow-multiple="false"
            :credits="'false'" allow-revert="false" accepted-file-types="image/jpeg, image/png, image/gif" />
        </div>
        <input type="hidden" v-model="image" />
        <Error :error="errors.image" />

        <div class="mt-3">
          <InputField name="name" type="text" :required="true" :submit-function="fileValidationAndAdd" v-model="form"
            :error="errors.name" title="Name" />
        </div>
        <div class="mt-3">
          <InputField name="default_caption" type="text" :required="true" :submit-function="fileValidationAndAdd"
            v-model="form" :error="errors.default_caption" title="Default Caption" />
        </div>
      </Dialog.Description>
      <Dialog.Footer>
        <SubmitButton :createFunction="fileValidationAndAdd" :loading="loading" />
      </Dialog.Footer>
    </Dialog.Panel>
  </Dialog>
</template>
