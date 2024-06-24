<script lang="ts" setup>
import { toRefs } from "vue";
import { SelectField } from "~/components/form";
import ModuleSection from "~/components/moduleTemplate/ModuleSection.vue"
import Button from "~/components/enigma/base-components/Button";
const props = defineProps({
  modelValue: {
    required: true,
    type: Object,
  },
  fieldName: {
    required: true,
    type: String,
  },
  section: {
    required: false,
    type: String,
    default: "default"
  }
});
const { modelValue: setting, fieldName, section } = toRefs(props);

const { getModuleTemplate } = useProductSiteSetting();
const { updateModuleTemplate, errors } = useSiteModuleTemplate();
const route = useRoute();
const idParem = parseInt(route.params.id.toString());

let form = reactive({
  module_template_id: setting.value[fieldName.value],
  field_name: fieldName.value,
});

const emit = defineEmits(["update:modelValue"]);
const validateAndUpdateLayout = async () => {
  const siteSetting = await updateModuleTemplate(form, idParem);
  validationFocus(form, errors);
  if (Object.keys(errors).length == 0) {
    emit("update:modelValue", siteSetting);
  }
};
const modalShow = ref(false);
const setModal = (value: boolean) => {
  modalShow.value = value;
};
const { getSiteSettingsModulesSection } = useSettingModuleTemplate();
let moduleTemplates: any = ref([]);
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  moduleTemplates = await getModuleTemplate();
  dataLoaded.value = true
})
</script>
<template>
  <div class="my-2" v-if="dataLoaded">
    <SelectField :options="moduleTemplates" name="module_template_id" type="text" v-model="form"
      :error="errors.module_template_id" :runFunction="validateAndUpdateLayout" title="Default Module Template"
      :withLabel="false" />
    <Button @click="setModal(true)" variant="primary" class="mt-3 flex">Manage Module Settings</Button>
  </div>
  <ModuleSection :key="form.module_template_id" :getModulesSection="getSiteSettingsModulesSection" :modalShow="modalShow"
    :setModel="setModal" :site_id="idParem" :module_template_id="form.module_template_id" :section="section" />
</template>
