<script lang="ts" setup>
import Button from "~/components/enigma/base-components/Button";
import SiteSetting from "~/components/product/setting/SiteSetting.vue";
import ModuleSection from "~/components/moduleTemplate/ModuleSection.vue"
import { Disclosure } from "~/components/enigma/base-components/Headless";
import { ref } from "vue";

definePageMeta({
  middleware: ["auth"],
  layout: "edit-product",
});

useHead({
  title: "Manage Product Site Settings: " + useRuntimeConfig().public.company,
});

const { geCategorySiteSettings } = useCategorySiteSetting();
const { getCategorySiteSettingsModulesSection } = useSettingModuleTemplate();
const route = useRoute();
const idParem = parseInt(route.params.id.toString());
let categorySiteSettings:any = ref([]);

const refreshSetting = async () => {
  categorySiteSettings = await geCategorySiteSettings(idParem);
  refresh.value = refresh.value == 0 ? 1 : 0;
};
const modalShow = ref(false);
const setModal = (value: boolean) => {
  modalShow.value = value;
};
const site_id = ref(0);
const module_template_id = ref(0);
const setValueAndOpenModal = (categorySiteSetting: any) => {
  site_id.value = categorySiteSetting.site_id == null ? 0 : categorySiteSetting.site_id;
  if (
    categorySiteSetting.settings &&
    categorySiteSetting.settings.module_template_id != null
  ) {
    module_template_id.value = categorySiteSetting.settings.module_template_id;
  }
  setModal(true);
};
const getDefaultModuleTemplate = () => {
  let name: string = "Products Page";
  categorySiteSettings.value.forEach(function (element: any) {
    if (element.name == null) {
      if (element.settings && element.settings.module_template_id != null) {
        name = element.settings.module_template.name;
      }
    }
  });
  return name;
};
const getSettingsTemplate = () => {
  let name: string = "None";
  categorySiteSettings.value.forEach(function (element: any) {
    if (element.name == null) {
      if (element.settings && element.settings.settings_template_id != null) {
        name = element.settings.settings_template.name;
      }
    }
  });
  return name;
};
const siteName = (categorySiteSetting: any) => {
  return categorySiteSetting.name != null ? categorySiteSetting.name : "Default";
};

const moduleTemplate: any = (categorySiteSetting: any) => {
  if (
    categorySiteSetting.settings &&
    categorySiteSetting.settings.module_template_id != null
  ) {
    return categorySiteSetting.settings.module_template.name + " (Customized)";
  } else if (
    categorySiteSetting.settings &&
    categorySiteSetting.settings.module_template_id_default == 0
  ) {
    if (categorySiteSetting.name != null) {
      return "Default Site Setting: Category Page";
    }
    else {
      return "System Default: Category Page"
    }
  } else {
    if (categorySiteSetting.name != null) {
      return "Default Module Template (" + getDefaultModuleTemplate() + ")";
    } else {
      return "System Default (Products Page)";
    }
  }
};
const settingTemplate: any = (categorySiteSetting: any) => {
  if (
    categorySiteSetting.settings &&
    categorySiteSetting.settings.settings_template_id != null
  ) {
    return categorySiteSetting.settings.settings_template.name + " (Customized)";
  } else {
    if (categorySiteSetting.name != null) {
      if (
        categorySiteSetting.settings &&
        categorySiteSetting.settings.settings_template_id_default == 0
      ) {
        return "None";
      } else {
        return "Default Setting Template (" + getSettingsTemplate() + ")";
      }
    } else {
      return "None";
    }
  }
};
let siteSetting = ref({});
const slideKey = ref(0);
const refresh = ref(0);
const slideOver = ref(false);
const setSiteSetting = (categorySiteSetting: any) => {
  siteSetting.value = categorySiteSetting;
  const site_id_local =
    categorySiteSetting.site_id == null ? 0 : categorySiteSetting.site_id;
  slideKey.value = site_id_local + route.params.id;
  setSlideover(true);
};
const setSlideover = (value: boolean) => {
  slideOver.value = value;
};
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  categorySiteSettings = await geCategorySiteSettings(idParem);
  dataLoaded.value = true;
});
</script>
<template>
  <div class="col-span-12 lg:col-span-9">
    <!-- BEGIN: Post Content -->
    <div class="col-span-12 intro-y">
      <div class="p-1 md:p-5 intro-y box xl:mt-5">
        <div class="col-span-12 lg:col-span-9 2xl:col-span-10" v-if="!dataLoaded">
          <div class="rounded-lg box intro-y mt-3">
            <TableLoading />
          </div>
        </div>
        <div v-if="dataLoaded">
          <Disclosure.Group :key="refresh" variant="boxed">
            <Disclosure v-for="categorySiteSetting in categorySiteSettings" :key="categorySiteSettings.site_id">
              <Disclosure.Button>
                <b>{{ siteName(categorySiteSetting) }}</b>
              </Disclosure.Button>
              <Disclosure.Panel>
                <div class="mt-2 rounded-md text-xs md:text-sm">
                  <div class="flex items-center">
                    <span class="font-medium">Settings Template:</span>
                    <div class="ml-2">{{ settingTemplate(categorySiteSetting) }}</div>
                  </div>
                  <div class="flex items-center mt-3">
                    <span class="font-medium">Module Template:</span>
                    <div class="ml-2">{{ moduleTemplate(categorySiteSetting) }}</div>
                  </div>
                  <div class="mt-4 flex items-left">
                    <Button variant="primary" class="flex" @click="(event) => {
                        setSiteSetting(categorySiteSetting);
                      }
                      ">Edit</Button>
                    <Button @click="setValueAndOpenModal(categorySiteSetting)" variant="primary" class="ml-2 flex">Manage
                      Module Settings</Button>
                  </div>
                </div>
              </Disclosure.Panel>
            </Disclosure>
          </Disclosure.Group>
        </div>
      </div>
    </div>
  </div>
  <ModuleSection :key="module_template_id" :getModulesSection="getCategorySiteSettingsModulesSection"
    :modalShow="modalShow" :setModel="setModal" :site_id="site_id" :module_template_id="module_template_id"
    :product_id="idParem" />
  <SiteSetting :key="slideKey" :setSlideover="setSlideover" :slideover="slideOver" :refreshSetting="refreshSetting"
    v-model="siteSetting" />
</template>