<script lang="ts" setup>
import { toRefs } from "vue";
import Lucide from "~/components/enigma/base-components/Lucide";
import { Slideover, Disclosure } from "~/components/enigma/base-components/Headless";
import UpdateTranslatedAttribute from "./UpdateTranslatedAttribute.vue";
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
  refresh: {
    required: true,
    type: Function,
  },
  modelValue: {
    required: true,
    type: Object,
  },
});
const { updateAttribute, errors, loading, attributeTypes } = useAttribute();
const { setSlider, slideOver, refresh, modelValue: attribute } = toRefs(props);
const { list } = useLanguages();
let languages:any = ref([]);
let types:any = ref([]);

let form = reactive({
  name: attribute.value.name,
  type_id: attribute.value.type_id,
  show_in_details: attribute.value.show_in_details,
  show_in_search: attribute.value.show_in_search,
});

const attributeValidationAndEdit = async () => {
  await updateAttribute(form, attribute.value.id);
  await refresh.value();
  validationFocus(form, errors);
};
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  languages = await list();
  if (languages.value[0].id == 1) languages.value.shift();
  types = await attributeTypes();
  dataLoaded.value = true
});
</script>
<template>
  <Slideover size="lg" backdrop="static" :open="slideOver" @close="() => {
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
        <h2 class="mr-auto text-base font-medium">Edit Attribute</h2>
      </Slideover.Title>

      <Slideover.Description>
        <div v-if="!dataLoaded">
          <div class="rounded-lg box intro-y mt-3">
            <TableLoading />
          </div>
        </div>
        <Disclosure.Group variant="boxed" v-if="dataLoaded">
          <Disclosure>
            <Disclosure.Button> English </Disclosure.Button>
            <Disclosure.Panel class="leading-relaxed text-slate-600 dark:text-slate-500">
              <div>
                <InputField name="name" :submit-function="attributeValidationAndEdit" v-model="form" :error="errors.name"
                  title="Attribute Name" />
              </div>
              <div class="mt-3">
                <SelectField :options="types" :submit-function="attributeValidationAndEdit"
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
              <div class="mt-5 text-right">
                <SubmitButton :createFunction="attributeValidationAndEdit" :loading="loading" />
              </div>
            </Disclosure.Panel>
          </Disclosure>
          <Disclosure v-for="language in languages" :key="language.id">
            <Disclosure.Button>
              {{ language.name }}
            </Disclosure.Button>
            <Disclosure.Panel class="leading-relaxed text-slate-600 dark:text-slate-500">
              <UpdateTranslatedAttribute :attribute_id="attribute.id" :language_id="language.id" :name="attribute.name" />
            </Disclosure.Panel>
          </Disclosure>
        </Disclosure.Group>
      </Slideover.Description>
      <Slideover.Footer>
        <CancelButton button-text="done" :cancelFunction="setSlider" />
      </Slideover.Footer>
    </Slideover.Panel>
  </Slideover>
</template>
