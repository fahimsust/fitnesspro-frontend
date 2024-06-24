<script lang="ts" setup>
import { toRefs, type PropType } from "vue"
import UpdateTranslatedOption from "~~/components/product/option/UpdateTranslatedOption.vue";
import { Disclosure } from "~/components/enigma/base-components/Headless";
import { Dialog } from "~/components/enigma/base-components/Headless";
import Lucide from "~/components/enigma/base-components/Lucide";

const props = defineProps({
  setModel: {
    required: true,
    type: Function,
  },
  option: {
    required: true,
    type: Object as PropType<any>
  },
  modalShow: {
    required: true,
    type: Boolean,
  }
})
const {
  setModel,
  modalShow,
  option
} = toRefs(props)
const { list } = useLanguages();
let languages: any = ref([])
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  languages = await list();
  if (languages.value[0].id == 1) languages.value.shift();
  dataLoaded.value = true
})
</script>
<template>
  <Dialog size="xl" backdrop="static" :open="modalShow" @close="() => {
    setModel(false);
  }
    ">
    <Dialog.Panel class="p-3">
      <a @click="(event) => {
        event.preventDefault();
        setModel(false);
      }
        " class="absolute top-3 right-4" href="#">
        <Lucide icon="X" class="w-8 h-8" />
      </a>
      <Dialog.Title>
        <h2 class="mr-auto text-base font-medium">{{ option.name }}: Translations</h2>
      </Dialog.Title>

      <Dialog.Description class="max-h-[75vh] overflow-auto">
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
              <UpdateTranslatedOption :option="option" :language_id="language.id" />
            </Disclosure.Panel>
          </Disclosure>
        </Disclosure.Group>
      </Dialog.Description>
    </Dialog.Panel>
  </Dialog>
</template>
