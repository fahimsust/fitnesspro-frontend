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
  setBrandAndOpenSlideOver: {
    required: true,
    type: Function,
  },
  refreshBrand: {
    required: true,
    type: Function,
  },
});
const input = ref<HTMLInputElement>();
const { createBrand, errors, loading } = useBrands();
const { setModal, modalShow, setBrandAndOpenSlideOver, refreshBrand } = toRefs(props);

let form = reactive({
  name: "",
});
const autoFocus = ref(false);
const keyInput = ref(0);

const brandValidationAndAdd = async () => {
  await createBrand(form);
  await refreshBrand.value();
  validationFocus(form, errors);
  if (Object.keys(errors).length == 0) {
    keyInput.value = keyInput.value + 1;
    form.name = "";
    setTimeout(function () {
      document.getElementById("name")?.focus();
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
        <h2 class="mr-auto text-base font-medium">Add Brand</h2>
      </Dialog.Title>

      <Dialog.Description>
        <div>
          <InputField :auto-focus="true" :key="keyInput" name="name" :submit-function="brandValidationAndAdd" type="text"
            v-model="form" :error="errors.name" title="Name" />
        </div>
      </Dialog.Description>
      <Dialog.Footer>
        <SubmitButton :createFunction="brandValidationAndAdd" :loading="loading" />
      </Dialog.Footer>
    </Dialog.Panel>
  </Dialog>
</template>
