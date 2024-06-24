<script setup>
import { toRefs } from "vue";
import Lucide from "~/components/enigma/base-components/Lucide";
import { Slideover, Menu } from "~/components/enigma/base-components/Headless";
import {
  InputField,
  SelectField,
  SubmitButton,
  CancelButton,
  CheckBoxField,
} from "~/components/form";
const route = useRoute();
const props = defineProps({
  setSlideover: {
    required: true,
    type: Function,
  },
  slideover: {
    required: true,
    type: Boolean,
  },
  modelValue: {
    required: true,
    type: Object,
  },
  refreshSetting: {
    required: true,
    type: Function,
  },
});
const emit = defineEmits(["update:modelValue"]);
const {
  getModuleTemplate,
  getLayout,
  getSettingTemplate,
  getDisplayTemplateZoom,
  getDisplayTemplateDetail,
  addUpdateProductSiteSetting,
  getDisplayTemplateThumbnail,
  errors,
  loading,
} = useProductSiteSetting();

const defaultTemplates = [
  { id: 0, name: "Use Site's Setting" },
  { id: 1, name: "Select different option" },
];
const defaultSettingTemplates = [
  { id: 0, name: "None" },
  { id: 1, name: "Select different option" },
];
let moduleTemplates = ref([]);
let layoutTemplates = ref([]);
let settingTemplate = ref([]);
let zoomDisplay = ref([]);
let detailDisplay = ref([]);
let thumbDisplay = ref([]);
const dataLoaded = ref(false)
const fetchData = async () => {
  moduleTemplates = await getModuleTemplate();
  layoutTemplates = await getLayout();
  settingTemplate = await getSettingTemplate();
  zoomDisplay = await getDisplayTemplateZoom();
  detailDisplay = await getDisplayTemplateDetail();
  thumbDisplay = await getDisplayTemplateThumbnail();
  dataLoaded.value = true
}
const {
  setSlideover,
  slideover,
  modelValue: productSiteSetting,
  refreshSetting,
} = toRefs(props);

const getSettingValue = (name) => {
  let value = null;
  if (productSiteSetting.value.settings != null) {
    if (productSiteSetting.value.settings[name + "_default"] == 1) {
      value = productSiteSetting.value.settings[name];
    }
  }
  return value;
};
const getSettingDefaultValue = (name) => {
  let value = null;
  if (productSiteSetting.value.settings != null) {
    value = productSiteSetting.value.settings[name];
  }
  return value;
};
const changeFrom = () => {
  if (form.settings_template_id_default != 1) {
    form.settings_template_id = null;
  }
  if (form.layout_id_default != 1) {
    form.layout_id = null;
  }
  if (form.module_template_id_default != 1) {
    form.module_template_id = null;
  }
  if (form.product_detail_template_default != 1) {
    form.product_detail_template = null;
  }
  if (form.product_thumbnail_template_default != 1) {
    form.product_thumbnail_template = null;
  }
  if (form.product_zoom_template_default != 1) {
    form.product_zoom_template = null;
  }
};
let form = reactive({
  site_id: productSiteSetting.value.site_id,
  settings_template_id: getSettingValue("settings_template_id"),
  layout_id: getSettingValue("layout_id"),
  module_template_id: getSettingValue("module_template_id"),
  product_detail_template: getSettingValue("product_detail_template"),
  product_thumbnail_template: getSettingValue("product_thumbnail_template"),
  product_zoom_template: getSettingValue("product_zoom_template"),

  settings_template_id_default: getSettingDefaultValue("settings_template_id_default"),
  layout_id_default: getSettingDefaultValue("layout_id_default"),
  module_template_id_default: getSettingDefaultValue("module_template_id_default"),
  product_detail_template_default: getSettingDefaultValue(
    "product_detail_template_default"
  ),
  product_thumbnail_template_default: getSettingDefaultValue(
    "product_thumbnail_template_default"
  ),
  product_zoom_template_default: getSettingDefaultValue("product_zoom_template_default"),
});

const settingValidationAndEdit = async () => {
  changeFrom();
  let newSetting = await addUpdateProductSiteSetting(form, route.params.id);
  await refreshSetting.value();
  validationFocus(form, errors);
  emit("update:modelValue", newSetting);
};
onMounted(async () => {
  await nextTick();
  await fetchData();
})
</script>
<template>
  <Slideover backdrop="static" :open="slideover" @close="() => {
    setSlideover(false);
  }
    ">
    <Slideover.Panel>
      <a @click="(event) => {
        event.preventDefault();
        setSlideover(false);
      }
        " class="absolute top-3 right-4" href="#">
        <Lucide icon="X" class="w-8 h-8" />
      </a>
      <Slideover.Title>
        <h2 class="mr-auto text-base font-medium">Site Setting</h2>
      </Slideover.Title>

      <Slideover.Description>
        <div v-if="!dataLoaded">
          <div class="rounded-lg box intro-y mt-3">
            <TableLoading />
          </div>
        </div>
        <div v-if="dataLoaded">
          <div class="mt-3">
            <SelectField :options="defaultSettingTemplates" default-option="Use Default Product Setting"
              name="settings_template_id_default" v-model="form" :error="errors.settings_template_id_default"
              title="Settings Template" />
          </div>
          <div class="mt-3" v-if="form.settings_template_id_default == 1">
            <SelectField :required="true" :options="settingTemplate" default-option="Select Template"
              name="settings_template_id" v-model="form" :error="errors.settings_template_id"
              title="Other Settings Template" />
          </div>

          <div class="mt-3">
            <SelectField :options="defaultTemplates" default-option="Use Default Product Layout"
              name="layout_id_default" v-model="form" :error="errors.layout_id_default" title="Layout" />
          </div>
          <div class="mt-3" v-if="form.layout_id_default == 1">
            <SelectField :required="true" :options="layoutTemplates" default-option="Select Template" name="layout_id"
              v-model="form" :error="errors.layout_id" title="Other Layout" />
          </div>

          <div class="mt-3">
            <SelectField :options="defaultTemplates" default-option="Use Default Product Module Template"
              name="module_template_id_default" v-model="form" :error="errors.module_template_id_default"
              title="Module Template" />
          </div>
          <div class="mt-3" v-if="form.module_template_id_default == 1">
            <SelectField :required="true" :options="moduleTemplates" default-option="Select Template"
              name="module_template_id" v-model="form" :error="errors.module_template_id"
              title="Other Module Template" />
          </div>

          <div class="mt-3">
            <SelectField :options="defaultTemplates" default-option="Use Default Product Thumbnail Template"
              name="product_thumbnail_template_default" v-model="form"
              :error="errors.product_thumbnail_template_default" title="Thumbnail Display Template" />
          </div>
          <div class="mt-3" v-if="form.product_thumbnail_template_default == 1">
            <SelectField :required="true" :options="thumbDisplay" default-option="Select Template"
              name="product_thumbnail_template" v-model="form" :error="errors.product_thumbnail_template"
              title="Other Thumbnail Display Template" />
          </div>

          <div class="mt-3">
            <SelectField :options="defaultTemplates" default-option="Use Default Product Detail Template"
              name="product_detail_template_default" v-model="form" :error="errors.product_detail_template_default"
              title="Detail Display Template" />
          </div>
          <div class="mt-3" v-if="form.product_detail_template_default == 1">
            <SelectField :required="true" :options="detailDisplay" default-option="Select Template"
              name="product_detail_template" v-model="form" :error="errors.product_detail_template"
              title="Other Detail Display Template" />
          </div>

          <div class="mt-3">
            <SelectField :options="defaultTemplates" default-option="Use Default" name="product_zoom_template_default"
              v-model="form" :error="errors.product_zoom_template_default" title="Zoom Display Template" />
          </div>
          <div class="mt-3" v-if="form.product_zoom_template_default == 1">
            <SelectField :required="true" :options="zoomDisplay" default-option="Select Template"
              name="product_zoom_template" v-model="form" :error="errors.product_zoom_template"
              title="Other Zoom Display Template" />
          </div>
        </div>
      </Slideover.Description>
      <Slideover.Footer>
        <CancelButton :cancelFunction="setSlideover" />
        <SubmitButton :createFunction="settingValidationAndEdit" :loading="loading" />
      </Slideover.Footer>
    </Slideover.Panel>
  </Slideover>
</template>
