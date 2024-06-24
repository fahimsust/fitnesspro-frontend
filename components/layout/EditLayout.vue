<script lang="ts" setup>
import { toRefs } from "vue";
import { Dialog } from "~/components/enigma/base-components/Headless";
import { InputField, SubmitButton, CancelButton } from "~/components/form";

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
  modelValue: {
    required: true,
    type: Object,
  },
});
const { updateLayout, errors, loading } = useLayouts();
const { setModal, modelValue: layout, modalShow, refresh } = toRefs(props);

let form = reactive({
  name: layout.value.name,
  file: layout.value.file,
});

const validationAndUpdate = async () => {
  await updateLayout(form, layout.value.id);
  await refresh.value();
  validationFocus(form, errors);
  if (Object.keys(errors).length == 0) {
    setModal.value(false)
  }
};
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
      </a>
      <Dialog.Title>
        <h2 class="mr-auto text-base font-medium">Edit Layout</h2>
      </Dialog.Title>

      <Dialog.Description>
        <div>
          <InputField :auto-focus="true" name="name" :submit-function="validationAndUpdate" type="text" v-model="form"
            :error="errors.name" title="Name" />
        </div>
        <div class="mt-3">
          <InputField :auto-focus="true" name="file" :submit-function="validationAndUpdate" type="text" v-model="form"
            :error="errors.file" title="File Name" />
        </div>
      </Dialog.Description>
      <Dialog.Footer>
        <SubmitButton :createFunction="validationAndUpdate" :loading="loading" />
      </Dialog.Footer>
    </Dialog.Panel>
  </Dialog>
</template>
