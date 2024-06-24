<script lang="ts" setup>
import { toRefs } from "vue";
import Lucide from "~/components/enigma/base-components/Lucide";
import { Slideover } from "~/components/enigma/base-components/Headless";
import {
  InputField,
  SubmitButton,
  CancelButton,
  CheckBoxField,
  SelectField,
} from "~/components/form";

const props = defineProps({
  setSlider: {
    required: true,
    type: Function,
  },
  slideOver: {
    required: true,
    type: Boolean,
  },
  attribueId: {
    required: true,
    type: Number,
  },
  refresh: {
    required: true,
    type: Function,
  },
});
const { createAttributeOption, errors, loading } = useAttributeOption();
const { setSlider, slideOver, refresh, attribueId } = toRefs(props);

let form = reactive({
  attribute_id: attribueId.value,
  display: "",
  status: true,
});

const optionValidationAndAdd = async () => {
  await createAttributeOption(form);
  await refresh.value();
  validationFocus(form, errors);
};
</script>
<template>
  <Slideover backdrop="static" :open="slideOver" @close="() => {
    setSlider(false);
  }
    ">
    <Slideover.Panel>
      <a @click="(event: any) => {
        event.preventDefault();
        setSlider(false);
      }
        " class="absolute top-3 right-4" href="#">
        <Lucide icon="X" class="w-8 h-8" />
      </a>
      <Slideover.Title>
        <h2 class="mr-auto text-base font-medium">Add Option</h2>
      </Slideover.Title>

      <Slideover.Description>
        <div>
          <InputField name="display" :submit-function="optionValidationAndAdd" v-model="form" :error="errors.display"
            title="Display" />
        </div>
        <div class="mt-3">
          <InputField name="rank" type="number" :submit-function="optionValidationAndAdd" v-model="form"
            :error="errors.rank" title="Rank" />
        </div>
        <div class="mt-3">
          <check-box-field name="status" v-model="form" :error="errors.status" title="Status" />
        </div>
      </Slideover.Description>
      <Slideover.Footer>
        <CancelButton :cancelFunction="setSlider" />
        <SubmitButton :createFunction="optionValidationAndAdd" :loading="loading" />
      </Slideover.Footer>
    </Slideover.Panel>
  </Slideover>
</template>
