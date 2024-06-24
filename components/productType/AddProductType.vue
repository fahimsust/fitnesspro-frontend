<script lang="ts" setup>
import { toRefs } from "vue";
import Lucide from "~/components/enigma/base-components/Lucide";
import { Dialog, Menu } from "~/components/enigma/base-components/Headless";
import { InputField, SelectField, SubmitButton, CancelButton } from "~/components/form";

const props = defineProps({
  setModal: {
    required: true,
    type: Function,
  },
  modalShow: {
    required: true,
    type: Boolean,
  },
  setTypeAndOpenSlideOver: {
    required: true,
    type: Function,
  },
  refreshType: {
    required: true,
    type: Function,
  },
});
const { addProductTypes, errors, loading } = useProductType();
const { setModal, modalShow, setTypeAndOpenSlideOver, refreshType } = toRefs(props);

let form = reactive({
  name: null,
});

const typeValidationAndAdd = async () => {
  const productType = await addProductTypes(form);
  await refreshType.value();
  validationFocus(form, errors);
  if (Object.keys(errors).length == 0) {
    setModal.value(false);
    //both modal and slider add/remove overflow hidden in html tag when they open/closed.So I need to use this hack.
    setTimeout(function () {
      setTypeAndOpenSlideOver.value(productType);
    }, 100);
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
        <h2 class="mr-auto text-base font-medium">Add Product Type</h2>
      </Dialog.Title>

      <Dialog.Description>
        <div>
          <InputField name="name" type="text" :submit-function="typeValidationAndAdd" v-model="form" :error="errors.name"
            title="Name" />
        </div>
      </Dialog.Description>
      <Dialog.Footer>
        <SubmitButton :createFunction="typeValidationAndAdd" :loading="loading" />
      </Dialog.Footer>
    </Dialog.Panel>
  </Dialog>
</template>
