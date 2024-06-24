<script lang="ts" setup>
import { toRefs, type PropType } from "vue";
import Lucide from "~/components/enigma/base-components/Lucide";
import { Slideover } from "~/components/enigma/base-components/Headless";
import {
  InputField,
  SubmitButton,
  CancelButton,
} from "~/components/form";

const props = defineProps({
  setSlideover: {
    required: true,
    type: Function,
  },
  slideover: {
    required: true,
    type: Boolean,
  },
  refreshOptionValue: {
    required: true,
    type: Function,
  },
  option: {
    required: true,
    type: Object as PropType<any>
  },
  openParent:{
    required: true,
    type: Function,
  }
});
const { addProductOptionValue, errors, loading } = useProductOption();

const { setSlideover, slideover, refreshOptionValue, option,openParent } = toRefs(props);

let form = reactive({
  display: null,
  rank: 0,
  price: 1,
  option_id: option.value.id,
});


const optionValueValidationAndAdd = async () => {
  await addProductOptionValue(form);
  validationFocus(form, errors);
  if (Object.keys(errors).length == 0) {
    openParent.value(true)
    await refreshOptionValue.value();
    setSlideover.value(false);
  }
};
</script>
<template>
  <Slideover backdrop="static" :open="slideover" @close="() => {
    setSlideover(false);
    openParent(true)
  }
    ">
    <Slideover.Panel>
      <a @click="(event) => {
        event.preventDefault();
        setSlideover(false);
        openParent(true)
      }
        " class="absolute top-3 right-4" href="#">
        <Lucide icon="X" class="w-8 h-8" />
      </a>
      <Slideover.Title>
        <h2 class="mr-auto text-base font-medium">Add Product Option Value</h2>
      </Slideover.Title>

      <Slideover.Description>
        <div>
          <InputField name="display" :submit-function="optionValueValidationAndAdd" type="text" v-model="form"
            :error="errors.display" title="Display Name/Name" />
        </div>
        <div class="mt-3">
          <InputField name="rank" :submit-function="optionValueValidationAndAdd" type="number" v-model="form"
            :error="errors.rank" title="Rank" />
        </div>
        <div class="mt-3">
          <InputField name="price" :submit-function="optionValueValidationAndAdd" type="text" v-model="form"
            :error="errors.price" title="Price" />
        </div>
      </Slideover.Description>
      <Slideover.Footer>
        <CancelButton :cancelFunction="setSlideover" />
        <SubmitButton :createFunction="optionValueValidationAndAdd" :loading="loading" />
      </Slideover.Footer>
    </Slideover.Panel>
  </Slideover>
</template>
