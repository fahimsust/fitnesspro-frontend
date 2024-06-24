<script lang="ts" setup>
import { toRefs } from "vue";
import { Dialog } from "~/components/enigma/base-components/Headless";
import Button from "~/components/enigma/base-components/Button";
import Lucide from "~/components/enigma/base-components/Lucide";
import { Disclosure } from "~/components/enigma/base-components/Headless";
import Alert from "~/components/enigma/base-components/Alert";
import EditModuleFieldValue from "~/components/moduleTemplate/EditModuleFieldValue.vue"

const props = defineProps({
  setModel: {
    required: true,
    type: Function,
  },
  site_id: {
    required: false,
    type: Number,
    default: 0,
  },
  product_id: {
    required: false,
    type: Number,
    default: 0,
  },
  category_id: {
    required: false,
    type: Number,
    default: 0,
  },
  product_template: {
    required: false,
    type: Boolean,
    default: false,
  },
  settings_template: {
    required: false,
    type: Number,
    default: 0,
  },
  section: {
    required: false,
    type: String,
    default: ""
  },
  module_template_id: {
    required: true,
    type: Number,
  },
  modalShow: {
    required: true,
    type: Boolean,
  },
  getModulesSection: {
    required: true,
    type: Function,
  }
});
const section_id = ref(0);
const module_id = ref(0);
const settings_template_id = ref(0)
const section_name = ref("");
const module_name = ref("");
const { setModel, modalShow, module_template_id, site_id, product_id, getModulesSection, category_id, settings_template, product_template } = toRefs(props);


let productSettingModuleSections: any = ref({});
const slideOver = ref(false);
const openModal = (
  module_id_local: number,
  section_id_local: number,
  settings_template_id_local: number,
  section_name_local: string,
  module_name_local: string
) => {
  section_id.value = section_id_local;
  module_id.value = module_id_local;
  section_name.value = section_name_local;
  module_name.value = module_name_local;
  settings_template_id.value = settings_template_id_local;
  setModel.value(false);
  setSlideover(true);
};
const setSlideover = (value: boolean) => {
  slideOver.value = value;
};
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  productSettingModuleSections = await getModulesSection.value(
    module_template_id.value
  );
  dataLoaded.value = true
})
</script>
<template>
  <Dialog size="xl" :open="modalShow" @close="() => {
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
        <h2 class="mr-auto text-base font-medium">Module Sections</h2>
      </Dialog.Title>
      <Dialog.Description class="grid max-h-[70vh] overflow-auto grid-cols-12 gap-4 gap-y-3 p-0 py-5">
        <div v-if="!dataLoaded">
          <div class="rounded-lg box intro-y mt-3">
            <TableLoading />
          </div>
        </div>
        <div class="col-span-12" v-if="dataLoaded">
          <Alert variant="danger" v-if="productSettingModuleSections.length == 0"
            class="w-full col-span-12 h-14 text-left">
            No Data Found
          </Alert>
          <Disclosure.Group class="col-span-12 overflow-y-auto" id="overflow-div-id"
            v-if="productSettingModuleSections.length > 0" variant="boxed">
            <Disclosure v-for="productSettingModuleSection in productSettingModuleSections">
              <Disclosure.Button>
                {{ productSettingModuleSection.sections.display }}
              </Disclosure.Button>
              <Disclosure.Panel :id="'id_' + productSettingModuleSection.sections.id">
                <div class="grid grid-cols-2" v-if="productSettingModuleSection.modules.length > 0">
                  <Button v-for="templateModule in productSettingModuleSection.modules" variant="pending"
                    class="inline-block mb-2 mr-1" @click="
                      openModal(
                        templateModule.module.id,
                        productSettingModuleSection.sections.id,
                        settings_template,
                        productSettingModuleSection.sections.display,
                        templateModule.module.name
                      )
                      ">
                    {{ templateModule.module.name }}
                  </Button>
                </div>
              </Disclosure.Panel>
            </Disclosure>
          </Disclosure.Group>
        </div>
      </Dialog.Description>
    </Dialog.Panel>
  </Dialog>
  <EditModuleFieldValue :key="module_id" v-if="slideOver" :slideover="slideOver" :set-slideover="setSlideover"
    :site_id="site_id" :product_id="product_id" :category_id="category_id" :section="section"
    :product_template="product_template" :module_id="module_id" :setModel="setModel"
    :settings_template_id="settings_template_id" :section_id="section_id" :section_name="section_name"
    :module_name="module_name" />
</template>
