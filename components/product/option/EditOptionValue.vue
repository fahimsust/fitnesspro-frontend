<script lang="ts" setup>
import { toRefs } from "vue";
import Lucide from "~/components/enigma/base-components/Lucide";
import UpdateTranslatedOptionValue from "~~/components/product/option/UpdateTranslatedOptionValue.vue";
import { Slideover, Disclosure } from "~/components/enigma/base-components/Headless";
import {
  InputField,
  SelectField,
  SubmitButton,
  CancelButton,
} from "~/components/form";
import {
  FormSwitch,
} from "~/components/enigma/base-components/Form";

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
  modelValue: {
    required: true,
    type: Object,
  },
  openParent:{
    required: true,
    type: Function,
  }
});
const { updateProductOptionValue, optionCustomValue, errors, loading } = useProductOption();

const { setSlideover, slideover, refreshOptionValue, modelValue: optionValue,openParent } = toRefs(props);


const is_custom = ref(optionValue.value.is_custom)
const customType: any = [
  { 'id': 0, 'name': 'Text' },
  { 'id': 1, 'name': 'Textarea' },
  { 'id': 2, 'name': 'Colorpicker' }
]
let form = reactive({
  name: optionValue.value.name,
  display: optionValue.value.display,
  rank: optionValue.value.rank,
  price: optionValue.value.price
});
let customValueFrom: any = reactive({});
let languages: any = ref([])
const { list } = useLanguages();

const optionValueValidationAndEdit = async () => {
  await updateProductOptionValue(form, customValueFrom, is_custom.value, optionValue.value.is_custom, optionValue.value.id);
  validationFocus(form, errors);
  if (Object.keys(errors).length == 0) {
    openParent.value(true)
    await refreshOptionValue.value();
    setSlideover.value(false);
  }
};
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  const customValue = await optionCustomValue(optionValue.value.id)
  customValueFrom = reactive({
    custom_type: customValue ? customValue.value.custom_type : null,
    custom_charlimit: customValue ? customValue.value.custom_charlimit : null,
    custom_instruction: customValue ? customValue.value.custom_instruction : null,
    custom_label: customValue ? customValue.value.custom_label : null,
  });
  languages = await list();
  if (languages.value[0].id == 1) languages.value.shift();
  dataLoaded.value = true
})
</script>
<template>
  <Slideover backdrop="static" :open="slideover" size="lg" @close="() => {
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
        <h2 class="mr-auto text-base font-medium">Edit: {{ optionValue.name }}</h2>
      </Slideover.Title>

      <Slideover.Description>
        <div v-if="!dataLoaded">
          <div class="rounded-lg box intro-y mt-3">
            <TableLoading />
          </div>
        </div>
        <Disclosure.Group variant="boxed" v-if="dataLoaded">
          <Disclosure key="1">
            <Disclosure.Button> English </Disclosure.Button>
            <Disclosure.Panel class="leading-relaxed text-slate-600 dark:text-slate-500">
              <div>
                <InputField name="name" :submit-function="optionValueValidationAndEdit" type="text" v-model="form"
                  :error="errors.name" title="Name" />
              </div>
              <div class="mt-3">
                <InputField name="display" :submit-function="optionValueValidationAndEdit" type="text" v-model="form"
                  :error="errors.display" title="Display Name" />
              </div>
              <div class="mt-3">
                <InputField name="rank" :submit-function="optionValueValidationAndEdit" type="number" v-model="form"
                  :error="errors.rank" title="Rank" />
              </div>
              <div class="mt-3">
                <InputField name="price" :submit-function="optionValueValidationAndEdit" type="text" v-model="form"
                  :error="errors.price" title="Price" />
              </div>
              <div class="mt-3">
                <FormSwitch>
                  <FormSwitch.Input type="checkbox" id="is_custom" v-model="is_custom" />
                  <FormSwitch.Label htmlFor="is_custom"> Is Custom </FormSwitch.Label>
                </FormSwitch>
              </div>
              <template v-if="is_custom">
                <div class="mt-3">
                  <SelectField :options="customType" :submit-function="optionValueValidationAndEdit" name="custom_type"
                    v-model="customValueFrom" :error="errors.custom_type" title="Custom Type" />
                </div>
                <div class="mt-3">
                  <InputField name="custom_charlimit" :submit-function="optionValueValidationAndEdit" type="number"
                    v-model="customValueFrom" :error="errors.custom_charlimit" title="Custom Charlimit" />
                </div>
                <div class="mt-3">
                  <InputField name="custom_label" :submit-function="optionValueValidationAndEdit" type="text"
                    v-model="customValueFrom" :error="errors.custom_label" title="Custom Label" />
                </div>
                <div class="mt-3">
                  <InputField name="custom_instruction" :submit-function="optionValueValidationAndEdit" type="text"
                    v-model="customValueFrom" :error="errors.custom_instruction" title="Custom Instruction" />
                </div>
              </template>
            </Disclosure.Panel>
          </Disclosure>
          <Disclosure v-for="language in languages" :key="language.id">
            <Disclosure.Button>
              {{ language.name }}
            </Disclosure.Button>
            <Disclosure.Panel class="leading-relaxed text-slate-600 dark:text-slate-500">
              <UpdateTranslatedOptionValue :option="optionValue" :language_id="language.id" />
            </Disclosure.Panel>
          </Disclosure>
        </Disclosure.Group>
      </Slideover.Description>
      <Slideover.Footer>
        <CancelButton :cancelFunction="setSlideover" />
        <SubmitButton :createFunction="optionValueValidationAndEdit" :loading="loading" />
      </Slideover.Footer>
    </Slideover.Panel>
  </Slideover>
</template>
