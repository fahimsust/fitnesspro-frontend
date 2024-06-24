<script lang="ts" setup>
import { toRefs, type PropType } from "vue";
import Lucide from "~/components/enigma/base-components/Lucide";
import { Slideover } from "~/components/enigma/base-components/Headless";
import {
  InputField,
  SubmitButton,
  CancelButton,
} from "~/components/form";
import DatePickerField from "~/components/form/DatePickerField.vue"

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
const { addProductDateOptionValue, errors, loading } = useProductOption();

const { setSlideover, slideover, refreshOptionValue, option,openParent } = toRefs(props);
let form = reactive({
  days_skip_between: null,
  start_date: "",
  end_date: "",
  days_duration: null,
});


const optionValueValidationAndAdd = async () => {
  await addProductDateOptionValue(form, option.value.id);
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
          <DatePickerField name="start_date" v-model="form" :required="true" :error="errors.start_date"
            title="Start Date" />
        </div>
        <div class="mt-3">
          <DatePickerField name="end_date" :required="true" v-model="form" :error="errors.end_date" title="End Date" />
        </div>
        <div class="mt-3">
          <InputField name="days_skip_between" :submit-function="optionValueValidationAndAdd" type="number"
            :required="true" v-model="form" :error="errors.days_skip_between" title="Skip (Days) between Sessions" />
        </div>
        <div class="mt-3">
          <InputField name="days_duration" :submit-function="optionValueValidationAndAdd" type="number" :required="true"
            v-model="form" :error="errors.days_duration" title="Duration of Each (days)" />
        </div>
      </Slideover.Description>
      <Slideover.Footer>
        <CancelButton :cancelFunction="setSlideover" />
        <SubmitButton :createFunction="optionValueValidationAndAdd" :loading="loading" />
      </Slideover.Footer>
    </Slideover.Panel>
  </Slideover>
</template>
