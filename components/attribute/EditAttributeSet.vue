<script lang="ts" setup>
import { toRefs } from "vue";
import UpdateTranslatedAttributeSet from "./UpdateTranslatedAttributeSet.vue";
import { Dialog, Disclosure } from "~/components/enigma/base-components/Headless";
import { InputField, SubmitButton, CancelButton } from "~/components/form";
import Lucide from "~/components/enigma/base-components/Lucide"
const props = defineProps({
  setModal: {
    required: true,
    type: Function,
  },
  modalShow: {
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
const { updateAttributeSet, errors, loading } = useAttributeSet();
const { setModal, modelValue: set, modalShow, refresh } = toRefs(props);
const { list } = useLanguages();
let languages:any = ref([]);
let form = reactive({
  name: set.value.name,
});
const attributeSetValidationAndUpdate = async () => {
  await updateAttributeSet(form, set.value.id);
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
  <Dialog size="lg" backdrop="static" :open="modalShow" @close="() => {
    setModal(false);
  }
    ">
    <Dialog.Panel class="p-3">
      <a @click="(event) => {
        event.preventDefault();
        setModal(false);
      }
        " class="absolute top-3 right-4" href="#">
        <Lucide icon="X" class="w-8 h-8" />
      </a>
      <Dialog.Title>
        <h2 class="mr-auto text-base font-medium">
          Edit: {{ set.name }}
        </h2>
      </Dialog.Title>

      <Dialog.Description class="max-h-[75vh] overflow-auto">
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
                <InputField name="name" :with-label="false" v-model="form" :error="errors.name"
                  :submit-function="attributeSetValidationAndUpdate" title="Name" />
                <div class="text-xs text-slate-500 mt-2 text-right">
                  Press Enter For Save
                </div>
              </div>
            </Disclosure.Panel>
          </Disclosure>
          <Disclosure v-for="language in languages" :key="language.id">
            <Disclosure.Button>
              {{ language.name }}
            </Disclosure.Button>
            <Disclosure.Panel class="leading-relaxed text-slate-600 dark:text-slate-500">
              <UpdateTranslatedAttributeSet :set_id="set.id" :language_id="language.id" :name="set.name" />
            </Disclosure.Panel>
          </Disclosure>
        </Disclosure.Group>
      </Dialog.Description>
    </Dialog.Panel>
  </Dialog>
</template>
