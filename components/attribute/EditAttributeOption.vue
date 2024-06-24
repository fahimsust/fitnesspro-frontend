<script lang="ts" setup>
import { toRefs } from "vue";
import Lucide from "~/components/enigma/base-components/Lucide";
import { Slideover, Disclosure } from "~/components/enigma/base-components/Headless";
import UpdateTranslatedAttributeOption from "./UpdateTranslatedAttributeOption.vue";
import { InputField, SubmitButton, CancelButton, CheckBoxField } from "~/components/form";

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
const { updateAttributeOption, errors, loading } = useAttributeOption();
const { setSlider, slideOver, refresh, modelValue: attributeOption } = toRefs(props);
const { list } = useLanguages();
let languages:any = ref([]);

let form = reactive({
  display: attributeOption.value.display,
  status: attributeOption.value.status,
});

const attributeOptionValidationAndEdit = async () => {
  await updateAttributeOption(form, attributeOption.value.id);
  await refresh.value();
  validationFocus(form, errors);
};
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  languages = await list();
  if (languages.value[0].id == 1) languages.value.shift();
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
        <h2 class="mr-auto text-base font-medium">Edit Attribute Option</h2>
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
                <InputField name="display" :submit-function="attributeOptionValidationAndEdit" v-model="form"
                  :error="errors.display" title="Display" />
              </div>
              <div class="mt-3">
                <InputField name="rank" type="number" :submit-function="attributeOptionValidationAndEdit" v-model="form"
                  :error="errors.rank" title="Rank" />
              </div>
              <div class="mt-3">
                <check-box-field name="status" v-model="form" :error="errors.status" title="Status" />
              </div>
              <div class="mt-5 text-right">
                <SubmitButton :createFunction="attributeOptionValidationAndEdit" :loading="loading" />
              </div>
            </Disclosure.Panel>
          </Disclosure>
          <Disclosure v-for="language in languages" :key="language.id">
            <Disclosure.Button>
              {{ language.name }}
            </Disclosure.Button>
            <Disclosure.Panel class="leading-relaxed text-slate-600 dark:text-slate-500">
              <UpdateTranslatedAttributeOption :option_id="attributeOption.id" :language_id="language.id"
                :display="attributeOption.display" />
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
