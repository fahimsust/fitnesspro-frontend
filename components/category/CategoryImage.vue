<script setup lang="ts">
import _ from "lodash";
import { ref, toRefs, reactive } from "vue";
import Button from "~/components/enigma/base-components/Button";
import UploadFile from "~~/components/UploadFile.vue";
import Lucide from "~/components/enigma/base-components/Lucide";
import SearchImage from "~~/components/SearchImage.vue";
import Alert from "~/components/enigma/base-components/Alert";
const route = useRoute();
const emit = defineEmits(["update:modelValue"]);

const { updateImage, errors, loading } = useCategories();
const props = defineProps({
  modelValue: {
    required: true,
    type: Object,
  },
});
let { modelValue: category } = toRefs(props);
const idParem = parseInt(route.params.id.toString());

const addImage = async (image_id: number) => {
  let form: any = reactive({
    image_id: image_id,
  });
  const updatedCategory = await updateImage(form, idParem);
  validationFocus(form, errors);
  if (updatedCategory != null) emit("update:modelValue", updatedCategory);
};
const modalShow = ref(false);
const setModal = (value: boolean) => {
  modalShow.value = value;
};
const modalShowSearch = ref(false);
const setModalSearch = (value: boolean) => {
  modalShowSearch.value = value;
};
</script>

<template>
  <div class="p-1">
    <div v-if="category.image_id" class="py-4">
      <img
        :alt="category.image.name"
        :src="`${useRuntimeConfig().public.s3ImageUrl}/tr:w-150/${
          category.image.filename
        }`"
      />
    </div>
    <div v-if="!category.image_id" class="py-4">
      <Alert variant="soft-danger" class="flex items-center">
        <Lucide icon="AlertCircle" class="w-6 h-6 mr-2" />
        No Image Uploaded
      </Alert>
    </div>
    <div class="flex flex-wrap items-left col-span-5 intro-y sm:flex-nowrap">
      <Button @click="() => setModal(true)" variant="primary" class="mr-2">
        Upload Image
      </Button>
      <Button @click="() => setModalSearch(true)" variant="primary" class="mr-2">
        Search Image
      </Button>
    </div>
  </div>
  <UploadFile
    v-if="modalShow"
    :setModel="setModal"
    :modalShow="modalShow"
    :add="addImage"
  />
  <SearchImage
    v-if="modalShowSearch"
    :setModel="setModalSearch"
    :modalShow="modalShowSearch"
    :add="addImage"
  />
</template>
