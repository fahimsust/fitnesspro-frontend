<script lang="ts" setup>
import { toRefs } from "vue";
import Lucide from "~/components/enigma/base-components/Lucide";
import { Slideover, Dialog } from "~/components/enigma/base-components/Headless";
import { InputField, SubmitButton, CancelButton } from "~/components/form";
const props = defineProps({
  setSlideover: {
    required: true,
    type: Function,
  },
  slideover: {
    required: true,
    type: Boolean,
  },
  refreshBrand: {
    required: true,
    type: Function,
  },
  modelValue: {
    required: true,
    type: Object,
  },
});
const { updateBrand, errors, loading } = useBrands();
const { setSlideover, modelValue: brand, slideover, refreshBrand } = toRefs(props);
let form = reactive({
  name: brand.value.name,
});
const brandValidationAndUpdate = async () => {
  await updateBrand(form, brand.value.id);
  await refreshBrand.value();
  validationFocus(form, errors);
  if (Object.keys(errors).length == 0) {
    setSlideover.value(false);
  }
};
</script>
<template>
  <Dialog backdrop="static" :open="slideover" @close="() => {
    setSlideover(false);
  }
    ">
    <Dialog.Panel>
      <a @click="(event) => {
        event.preventDefault();
        setSlideover(false);
      }
        " class="absolute top-3 right-4" href="#">
        <Lucide icon="X" class="w-8 h-8" />
      </a>
      <Dialog.Title>
        <h2 class="mr-auto text-base font-medium">Edit Brand</h2>
      </Dialog.Title>

      <Dialog.Description>
        <div>
          <InputField :auto-focus="true" name="name" type="text" v-model="form" :error="errors.name"
            :submit-function="brandValidationAndUpdate" title="Name" />
        </div>
      </Dialog.Description>
      <Dialog.Footer>
        <SubmitButton :createFunction="brandValidationAndUpdate" :loading="loading" />
      </Dialog.Footer>
    </Dialog.Panel>
  </Dialog>
</template>
