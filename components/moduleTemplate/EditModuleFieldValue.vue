<script lang="ts" setup>
import { toRefs, type PropType } from "vue";
import Lucide from "~/components/enigma/base-components/Lucide";
import { Slideover, Menu } from "~/components/enigma/base-components/Headless";

import {
  CancelButton,
} from "~/components/form";
import {
  FormLabel,
  FormInput,
  FormSelect,
} from "~/components/enigma/base-components/Form";

const props = defineProps({
  setSlideover: {
    required: true,
    type: Function,
  },
  setModel: {
    required: true,
    type: Function,
  },
  slideover: {
    required: true,
    type: Boolean,
  },
  site_id: {
    required: true,
    type: Number,
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
  settings_template_id: {
    required: false,
    type: Number,
    default: 0,
  },
  section: {
    required: false,
    type: String,
    default: ""
  },
  module_id: {
    required: true,
    type: Number,
  },
  section_id: {
    required: true,
    type: Number,
  },
  section_name: {
    required: true,
    type: String,
  },
  module_name: {
    required: true,
    type: String,
  }
});
const { setSlideover, slideover, setModel, module_id, site_id, section, product_id, section_id, category_id, settings_template_id, product_template } = toRefs(props);
const {
  getSiteSettingsModulesValue,
  addUpdateSiteSettingsModulesValue,
  getProductSiteSettingsModulesValue,
  addUpdateProductSiteSettingsModulesValue,
  getCategorySiteSettingsModulesValue,
  addUpdateCategorySiteSettingsModulesValue,
  getCategoryTemplateSettingsModulesValue,
  addUpdateCategoryTemplateSettingsModulesValue,
  getProductTemplateSettingsModulesValue,
  addUpdateProductTemplateSettingsModulesValue,
  errors,
} = useSettingModuleTemplate();

let moduleFieldValues: any = null




let form = reactive({
  site_id: site_id.value == 0 ? null : site_id.value,
  product_id: product_id.value,
  category_id: category_id.value,
  settings_template_id: settings_template_id.value,
  section: section.value,
  section_id: section_id.value,
  module_id: module_id.value,
  field_id: null,
  custom_value: ''
});
const saveChange = async (moduleFieldValue: any, value: string) => {
  if (is_change.value == true) {
    form.field_id = moduleFieldValue.field.id
    form.custom_value = value
    await optionValueValidationAndEdit()
  }
}

const optionValueValidationAndEdit = async () => {
  if (product_id.value != 0) {
    await addUpdateProductSiteSettingsModulesValue(form);
  }
  else if (category_id.value != 0) {
    await addUpdateCategorySiteSettingsModulesValue(form);
  }
  else if (settings_template_id.value != 0) {
    if (product_template.value) {
      await addUpdateProductTemplateSettingsModulesValue(form);
    }
    else {
      await addUpdateCategoryTemplateSettingsModulesValue(form);
    }

  }
  else {
    await addUpdateSiteSettingsModulesValue(form);
  }
  validationFocus(form, errors);
  is_change.value = false
};
const openModalAndSlideOver = (value: boolean) => {
  setSlideover.value(value);
  setModel.value(true);
}
const is_change = ref(false)
const dataLoaded = ref(false)
onMounted(async () => {
  if (product_id.value != 0) {
    moduleFieldValues = await getProductSiteSettingsModulesValue(site_id.value, product_id.value, module_id.value, section_id.value)
  }
  else if (category_id.value != 0) {
    moduleFieldValues = await getCategorySiteSettingsModulesValue(site_id.value, category_id.value, module_id.value, section_id.value)
  }
  else if (settings_template_id.value != 0) {
    if (product_template.value) {
      moduleFieldValues = await getProductTemplateSettingsModulesValue(settings_template_id.value, module_id.value, section_id.value)
    }
    else {
      moduleFieldValues = await getCategoryTemplateSettingsModulesValue(settings_template_id.value, module_id.value, section_id.value)
    }
  }
  else {
    moduleFieldValues = await getSiteSettingsModulesValue(site_id.value, section.value, module_id.value, section_id.value)
  }
  dataLoaded.value = true
})
</script>
<template>
  <Slideover backdrop="static" :open="slideover" @close="() => {
    openModalAndSlideOver(false);
  }
    ">
    <Slideover.Panel>
      <a @click="(event) => {
        event.preventDefault();
        openModalAndSlideOver(false);
      }
        " class="absolute top-3 right-4" href="#">
        <Lucide icon="X" class="w-8 h-8" />
      </a>
      <Slideover.Title>
        <h2 class="mr-auto text-base font-medium">
          Fill out the custom fields for modules
        </h2>
      </Slideover.Title>

      <Slideover.Description>
        <div class="mb-5">
          <h5 class="mt-3 text-lg font-medium leading-none text-pending">
            {{ section_name }}
          </h5>
          <h6 class="mt-3 font-medium leading-none text-slate-500">
            {{ module_name }}
          </h6>
        </div>
        <div v-if="!dataLoaded">
          <div class="rounded-lg box intro-y mt-3">
            <TableLoading />
          </div>
        </div>
        <div v-if="dataLoaded" v-for="(moduleFieldValue, index) in moduleFieldValues" :class="{ 'mt-4': index != 0 }">
          <FormLabel>{{ moduleFieldValue.field.field_name }}</FormLabel>
          <FormInput v-if="moduleFieldValue.field_setting.options.length == 0"
            :type="moduleFieldValue.field_setting.type" v-model="moduleFieldValue.custom_value"
            :placeholder="moduleFieldValue.field.field_name"
            @blur="saveChange(moduleFieldValue, ($event.target as HTMLInputElement).value)"
            @change="is_change = true" />
          <FormSelect v-if="moduleFieldValue.field_setting.options.length > 0" v-model="moduleFieldValue.custom_value"
            @change="is_change = true; saveChange(moduleFieldValue, ($event.target as HTMLInputElement).value)">
            <option :value="null">Select</option>
            <option :value="option.id" v-for="option in moduleFieldValue.field_setting.options" :key="option.id">
              {{ option.name }}
            </option>
          </FormSelect>
        </div>
      </Slideover.Description>
      <Slideover.Footer>
        <CancelButton :cancelFunction="openModalAndSlideOver" buttonText="Done" />
      </Slideover.Footer>
    </Slideover.Panel>
  </Slideover>
</template>
<style lang="postcss" scoped>
.input_class {
  @apply disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:bg-darkmode-800/50 dark:disabled:border-transparent [&[readonly]]:bg-slate-100 [&[readonly]]:cursor-not-allowed [&[readonly]]:dark:bg-darkmode-800/50 [&[readonly]]:dark:border-transparent transition duration-200 ease-in-out w-full text-sm border-slate-200 shadow-sm rounded-md placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary focus:border-opacity-40 dark:bg-darkmode-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:placeholder:text-slate-500/80 flex-1;
}
</style>
