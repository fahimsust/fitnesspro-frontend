<script setup lang="ts">
import _ from "lodash";
import { toRefs } from "vue";
import { FormSelect } from "~/components/enigma/base-components/Form";

const props = defineProps({
  categorySiteSetting: {
    required: true,
    type: Object,
  },
  setValue: {
    required: true,
    type: Function,
  },
  defaulModuleTemplates: {
    required: true,
    type: Object,
  },
  moduleTemplates: {
    required: true,
    type: Object,
  },
});
const { categorySiteSetting, setValue, defaulModuleTemplates, moduleTemplates } = toRefs(
  props
);
if (categorySiteSetting.value.settings.module_template_id_default == null) {
    categorySiteSetting.value.settings.module_template_id_default = -1;
}
if (categorySiteSetting.value.settings.module_template_id == null) {
  categorySiteSetting.value.settings.module_template_id = -1;
}
const saveValue = (siteSettingCategory: any) => {
  if (siteSettingCategory.settings.module_template_id == -1) {
    siteSettingCategory.settings.module_template_id = null;
  }
  if (siteSettingCategory.settings.module_template_id_default == -1) {
    siteSettingCategory.settings.module_template_id_default = null;
  }
  setValue.value(siteSettingCategory);
};
</script>

<template>
  <FormSelect
    v-model="categorySiteSetting.settings.module_template_id_default"
    @change="saveValue(categorySiteSetting)"
  >
    <option value="-1">
      Use Setting Template Module Template
    </option>
    <option :value="option.id" v-for="option in defaulModuleTemplates" :key="option.id">
      {{ option.name }}
    </option>
  </FormSelect>
  <FormSelect
    v-if="categorySiteSetting.settings.module_template_id_default == 1"
    class="mt-2"
    v-model="categorySiteSetting.settings.module_template_id"
    @change="saveValue(categorySiteSetting)"
  >
    <option value="-1">Select Module Template</option>
    <option :value="option.id" v-for="option in moduleTemplates" :key="option.id">
      {{ option.name }}
    </option>
  </FormSelect>
</template>
