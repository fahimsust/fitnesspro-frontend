<script lang="ts" setup>
import { toRefs } from "vue";
import { Dialog, Disclosure } from "~/components/enigma/base-components/Headless";
import { CancelButton } from "~/components/form";
import UpdateTranslatedSection from "./UpdateTranslatedSection.vue";
import Lucide from "~/components/enigma/base-components/Lucide";
const props = defineProps({
  setModal: {
    required: true,
    type: Function,
  },
  modalShow: {
    required: true,
    type: Boolean,
  },
  modelValue: {
    required: true,
    type: Object,
  },
});

const { setModal, modelValue: section, modalShow } = toRefs(props);
const { list } = useLanguages();
let languages:any = ref([]);

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
          Edit: {{ section.title }}
        </h2>
      </Dialog.Title>
      <Dialog.Description>
        <div v-if="!dataLoaded">
          <div class="rounded-lg box intro-y mt-3">
            <TableLoading />
          </div>
        </div>
        <Disclosure.Group variant="boxed" v-if="dataLoaded">
          <Disclosure v-for="language in languages" :key="language.id">
            <Disclosure.Button>
              {{ language.name }}
            </Disclosure.Button>
            <Disclosure.Panel class="leading-relaxed text-slate-600 dark:text-slate-500">
              <UpdateTranslatedSection :section_id="section.id" :language_id="language.id" :title="section.title" />
            </Disclosure.Panel>
          </Disclosure>
        </Disclosure.Group>
      </Dialog.Description>
      <Dialog.Footer>
        <CancelButton button-text="Done" :cancelFunction="setModal" />
      </Dialog.Footer>
    </Dialog.Panel>
  </Dialog>
</template>
