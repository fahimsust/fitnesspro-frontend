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
  orderItem: {
    required: true,
    type: Object,
  },
});
const { createNote, errors, loading } = useOrderItemNote();
const { setModal, modalShow, refresh, orderItem } = toRefs(props);

let form = reactive({
  note: orderItem.value.product_notes,
});

const validationAndAdd = async () => {
  await createNote(form, orderItem.value.id);
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
          <InputField name="note" type="text" v-model="form" :error="errors.note" title="Note" />
        </div>
      </Dialog.Description>
      <Dialog.Footer>
        <SubmitButton :createFunction="validationAndAdd" :loading="loading" />
      </Dialog.Footer>
    </Dialog.Panel>
  </Dialog>
</template>
