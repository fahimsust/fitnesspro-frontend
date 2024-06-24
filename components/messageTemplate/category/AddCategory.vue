<script lang="ts" setup>
import { toRefs } from "vue";
import Lucide from "~/components/enigma/base-components/Lucide";
import { Dialog } from "~/components/enigma/base-components/Headless";
import { InputField, SubmitButton, CancelButton, SelectField } from "~/components/form";

const props = defineProps({
  setModal: {
    required: true,
    type: Function,
  },
  modalShow: {
    required: true,
    type: Boolean,
  },
  refresh: {
    required: true,
    type: Function,
  },
});
const { createMessageTemplateCategory, list, errors, loading } = useMessageTemplateCategories();
const { setModal, modalShow, refresh } = toRefs(props);

let templates:any = ref([]);
let form = reactive({
  name: "",
  parent_id: ""
});

const addTemplateCategory = async () => {
  await createMessageTemplateCategory(form);
  await refresh.value();
  validationFocus(form, errors);
  if (Object.keys(errors).length == 0) {
    setModal.value(false)
  }
};
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  templates = await list();
  dataLoaded.value = true
});
</script>
<template>
  <Dialog backdrop="static" :open="modalShow" @close="() => {
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
        <h2 class="mr-auto text-base font-medium">Add Message Template</h2>
      </Dialog.Title>

      <Dialog.Description>
        <div>
          <InputField name="name" :submit-function="addTemplateCategory" type="text" v-model="form" :error="errors.name"
            title="Name" />
        </div>
        <div class="mt-3" v-if="dataLoaded">
          <SelectField :options="templates" name="parent_id" :submit-function="addTemplateCategory" v-model="form"
            :error="errors.name" title="Parent" default-option="Root Category" />
        </div>
      </Dialog.Description>
      <Dialog.Footer>
        <SubmitButton :createFunction="addTemplateCategory" :loading="loading" />
      </Dialog.Footer>
    </Dialog.Panel>
  </Dialog>
</template>
