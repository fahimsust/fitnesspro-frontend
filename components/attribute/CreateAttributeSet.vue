<script lang="ts" setup>
import { toRefs } from "vue";
import Lucide from "~/components/enigma/base-components/Lucide";
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
});
const { createAttributeSet, errors, loading } = useAttributeSet();
const { setModal, modalShow, refresh } = toRefs(props);

let form = reactive({
  name: "",
});

const attributeSetValidationAndAdd = async () => {
  await createAttributeSet(form);
  await refresh.value();
  validationFocus(form, errors);
  if (Object.keys(errors).length == 0) {
    setModal.value(false);
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
        <Lucide icon="X" class="w-8 h-8" />
      </a>
      <Dialog.Title>
        <h2 class="mr-auto text-base font-medium">Add Attribute Set</h2>
      </Dialog.Title>

      <Dialog.Description>
        <div>
          <InputField name="name" :submit-function="attributeSetValidationAndAdd" v-model="form" :error="errors.name"
            title="Name" />
        </div>
      </Dialog.Description>
      <Dialog.Footer>
        <SubmitButton :createFunction="attributeSetValidationAndAdd" :loading="loading" />
      </Dialog.Footer>
    </Dialog.Panel>
  </Dialog>
</template>
