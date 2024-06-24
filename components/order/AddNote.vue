<script lang="ts" setup>
import { toRefs } from "vue";
import Lucide from "~/components/enigma/base-components/Lucide";
import { Dialog } from "~/components/enigma/base-components/Headless";
import { TextAreaField, SubmitButton, CancelButton } from "~/components/form";

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
  orderId: {
    required: true,
    type: Number,
  },
});
const { createNote, errors, loading } = useOrderNotes();
const { setModal, modalShow, refresh, orderId } = toRefs(props);

let form = reactive({
  note: "",
});

const validationAndAdd = async () => {
  await createNote(form, orderId.value);
  validationFocus(form, errors);
  if (Object.keys(errors).length == 0) {
    await refresh.value();
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
        <Lucide icon="X" class="w-8 h-8" />
      </a>
      <Dialog.Title>
        <h2 class="mr-auto text-base font-medium">Add Note</h2>
      </Dialog.Title>

      <Dialog.Description>
        <div>
          <TextAreaField :auto-focus="true" name="note" type="text" v-model="form" :error="errors.note" title="Note" />
        </div>
      </Dialog.Description>
      <Dialog.Footer>
        <SubmitButton :createFunction="validationAndAdd" :loading="loading" />
      </Dialog.Footer>
    </Dialog.Panel>
  </Dialog>
</template>
