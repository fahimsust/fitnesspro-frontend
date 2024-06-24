<script lang="ts" setup>
import Table from "~/components/enigma/base-components/Table";
import SiteSettingSelectBox from "~/components/category/SiteSettingSelectBox.vue";
import ModuleTemplateSelectBox from "~/components/category/ModuleTemplateSelectBox.vue";
import ModuleSection from "~/components/moduleTemplate/ModuleSection.vue"
import { reactive } from "vue";
import Button from "~/components/enigma/base-components/Button";

definePageMeta({
  middleware: ["auth"],
  layout: "edit-category",
});

useHead({
  title: "Manage Category Site Settings: " + useRuntimeConfig().public.company,
});

const {
  geCategorySiteSettings,
  addUpdateCategorySiteSetting,
  getSettingTemplate,
} = useCategorySiteSetting();
const { getCategorySiteSettingsModulesSection } = useSettingModuleTemplate();
const route = useRoute();
const idParem = parseInt(route.params.id.toString());

const dataLoaded = ref(false)
let categorySiteSettings:any = ref([]);
let moduleTemplates:any = ref([]);
let settingTemplates:any = ref([]);


const fetchData = async ()=>{
  categorySiteSettings = await geCategorySiteSettings(idParem);
  moduleTemplates = await getModuleTemplate();
  settingTemplates = await getSettingTemplate();
  dataLoaded.value = true
}

const {
  getModuleTemplate,
} = useProductSiteSetting();
const defaulSettingTemplates = [
  { id: 0, name: "None" },
  { id: 1, name: "Select different option" },
];
const defaultModuleTemplates = [
  { id: 0, name: "Use Site's Module Template" },
  { id: 1, name: "Select different option" },
];
const module_template_id = ref(0);
const site_id = ref(0);
const modalShow = ref(false);
const setModal = (value: boolean) => {
  modalShow.value = value;
};
const setValue = async (categorySiteSetting: any) => {
  let form: any = reactive({
    settings_template_id: categorySiteSetting.settings.settings_template_id,
    settings_template_id_default:
      categorySiteSetting.settings.settings_template_id_default,

    module_template_id: categorySiteSetting.settings.module_template_id,
    module_template_id_default:
      categorySiteSetting.settings.module_template_id_default,
    site_id: categorySiteSetting.site_id,
  });
  if (
    (form.settings_template_id_default != 1 || form.settings_template_id != null)
    &&
    (form.module_template_id_default != 1 || form.module_template_id != null)
  ) {
    if (form.module_template_id_default != 1) {
      form.module_template_id = null;
    }
    if (form.settings_template_id_default != 1) {
      form.settings_template_id = null;
    }
    await addUpdateCategorySiteSetting(form, idParem);
    await refreshSetting();
  }
};
const refreshSetting = async () => {
  categorySiteSettings = await geCategorySiteSettings(idParem);
};
const setValueAndOpenModal = (categorySiteSetting: any) => {
  site_id.value = categorySiteSetting.site_id == null ? 0 : categorySiteSetting.site_id;
  if (
    categorySiteSetting.settings &&
    categorySiteSetting.settings.module_template_id != null &&
    categorySiteSetting.settings.module_template_id != -1
  ) {
    module_template_id.value = categorySiteSetting.settings.module_template_id;
  }
  setModal(true);
};
onMounted(async () => {
  await nextTick();
  await fetchData();
});
</script>
<template>
  <div class="col-span-12 lg:col-span-9">
    <!-- BEGIN: Post Content -->
    <div class="col-span-12 intro-y">
      <div class="p-5 intro-y box xl:mt-5">
        <div class="overflow-x-auto mb-5">
          <Table class="border-spacing-y-[10px] border-separate mt-2 hover">
            <Table.Thead variant="dark">
              <Table.Tr>
                <Table.Th class="whitespace-nowrap">SITE</Table.Th>
                <Table.Th class="whitespace-nowrap">SETTING TEMPLATE ID</Table.Th>
                <Table.Th class="whitespace-nowrap">MODULE TEMPLATE ID</Table.Th>
                <Table.Th class="whitespace-nowrap"></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr v-if="!dataLoaded" class="intro-x">
                <Table.Td colspan="4" class="py-0 px-0">
                  <TableLoading />
                </Table.Td>
              </Table.Tr>
              <Table.Tr v-if="categorySiteSettings.length == 0 && dataLoaded" class="intro-x">
                <Table.Td colspan="4" class="py-0 px-0">
                  <AlertGray />
                </Table.Td>
              </Table.Tr>
              <template v-for="categorySiteSetting in categorySiteSettings" :key="categorySiteSetting.site_id">
                <Table.Tr class="intro-x" v-if="!categorySiteSetting.site_id">
                  <Table.Td class="py-2 px-5">
                    <b>Default Site</b>
                  </Table.Td>
                  <Table.Td>
                    <SiteSettingSelectBox :setting-templates="settingTemplates"
                      :defaul-setting-templates="defaulSettingTemplates" :set-value="setValue"
                      :category-site-setting="categorySiteSetting" />
                  </Table.Td>
                  <Table.Td>
                    <ModuleTemplateSelectBox :module-templates="moduleTemplates"
                      :defaul-module-templates="defaultModuleTemplates" :set-value="setValue"
                      :category-site-setting="categorySiteSetting" />
                  </Table.Td>
                  <Table.Td>
                    <Button @click="setValueAndOpenModal(categorySiteSetting)" variant="primary" class="ml-2 flex">Module
                      Settings</Button>
                  </Table.Td>
                </Table.Tr>
              </template>
            </Table.Tbody>
          </Table>
        </div>

        <h2 class="pt-5 font-bold">Sites</h2>

        <div class="overflow-x-auto">
          <Table class="border-spacing-y-[10px] border-separate mt-2 hover">
            <Table.Thead variant="dark">
              <Table.Tr>
                <Table.Th class="whitespace-nowrap">SITE</Table.Th>
                <Table.Th class="whitespace-nowrap">SETTING TEMPLATE ID</Table.Th>
                <Table.Th class="whitespace-nowrap">MODULE TEMPLATE ID</Table.Th>
                <Table.Th class="whitespace-nowrap"></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr v-if="!dataLoaded" class="intro-x">
                <Table.Td colspan="4" class="py-0 px-0">
                  <TableLoading />
                </Table.Td>
              </Table.Tr>
              <Table.Tr v-if="categorySiteSettings.length == 0 && dataLoaded" class="intro-x">
                <Table.Td colspan="4" class="py-0 px-0">
                  <AlertGray />
                </Table.Td>
              </Table.Tr>
              <template v-for="categorySiteSetting in categorySiteSettings" :key="categorySiteSetting.site_id">
                <Table.Tr class="intro-x" v-if="categorySiteSetting.site_id">
                  <Table.Td class="py-2 px-5">
                    <b>{{ categorySiteSetting.name }}</b>
                  </Table.Td>
                  <Table.Td>
                    <SiteSettingSelectBox :setting-templates="settingTemplates"
                      :defaul-setting-templates="defaulSettingTemplates" :set-value="setValue"
                      :category-site-setting="categorySiteSetting" />
                  </Table.Td>
                  <Table.Td>
                    <ModuleTemplateSelectBox :module-templates="moduleTemplates"
                      :defaul-module-templates="defaultModuleTemplates" :set-value="setValue"
                      :category-site-setting="categorySiteSetting" />
                  </Table.Td>
                  <Table.Td>
                    <Button @click="setValueAndOpenModal(categorySiteSetting)" variant="primary" class="ml-2 flex">Module
                      Settings</Button>
                  </Table.Td>
                </Table.Tr>
              </template>
            </Table.Tbody>
          </Table>
        </div>
      </div>
    </div>
  </div>
  <ModuleSection :key="module_template_id" :getModulesSection="getCategorySiteSettingsModulesSection"
    :modalShow="modalShow" :setModel="setModal" :site_id="site_id" :module_template_id="module_template_id"
    :category_id="idParem" />
</template>
