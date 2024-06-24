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
  setId: {
    required: true,
    type: Number,
  },
  refresh: {
    required: true,
    type: Function,
  },
});
const { createAttribute, errors, loading, attributeTypes } = useAttribute();
const { setSlider, slideOver, refresh, setId } = toRefs(props);
let types:any = ref([]);

let form = reactive({
  set_id: setId.value,
  name: "",
  type_id: null,
  show_in_details: false,
  show_in_search: false,
});

const attributeValidationAndAdd = async () => {
  await createAttribute(form);
  await refresh.value();
  validationFocus(form, errors);
  if (Object.keys(errors).length == 0) {
    setSlider.value(false);
  }
};
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  types = await attributeTypes();
  dataLoaded.value = true
});
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
        <h2 class="mr-auto text-base font-medium">Add Attribute</h2>
      </Slideover.Title>

      <Slideover.Description>
        <div>
          <InputField name="name" :submit-function="attributeValidationAndAdd" v-model="form" :error="errors.name"
            title="Attribute Name" />
        </div>
        <div class="mt-3" v-if="dataLoaded">
          <SelectField :options="types" :submit-function="attributeValidationAndAdd"
            default-option="Select Attribute Type" name="type_id" v-model="form" :error="errors.type_id"
            title="Attribute Type" />
        </div>
        <div class="mt-3">
          <check-box-field name="show_in_details" v-model="form" :error="errors.show_in_details"
            title="Show in Product Details" />
        </div>
        <div class="mt-3">
          <check-box-field name="show_in_search" v-model="form" :error="errors.show_in_search"
            title="Show in Advanced Search" />
        </div>
      </Slideover.Description>
      <Slideover.Footer>
        <CancelButton :cancelFunction="setSlider" />
        <SubmitButton :createFunction="attributeValidationAndAdd" :loading="loading" />
      </Slideover.Footer>
    </Slideover.Panel>
  </Slideover>
</template>
