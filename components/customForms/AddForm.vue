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
});
const router = useRouter();
const { addCustomForm, errors, loading } = useCustomForms();
const { setModal, modalShow } = toRefs(props);

let form = reactive({
  name: null,
  status: true
});

const formValidationAndAdd = async () => {
  const customForm = await addCustomForm(form);
  validationFocus(form, errors);
  if (Object.keys(errors).length == 0) {
    setModal.value(false);
    setTimeout(function () {
      router.push("/customforms/" + customForm.id);
    }, 1000);
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
        <h2 class="mr-auto text-base font-medium">Add Custom Form</h2>
      </Dialog.Title>

      <Dialog.Description>
        <div>
          <InputField name="name" type="text" v-model="form" :error="errors.name" title="Name" />
        </div>
      </Dialog.Description>
      <Dialog.Footer>
        <SubmitButton :createFunction="formValidationAndAdd" :loading="loading" />
      </Dialog.Footer>
    </Dialog.Panel>
  </Dialog>
</template>
