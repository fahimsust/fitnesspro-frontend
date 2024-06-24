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
  defaulSettingTemplates: {
    required: true,
    type: Object,
  },
  settingTemplates: {
    required: true,
    type: Object,
  },
});
const { categorySiteSetting, setValue, defaulSettingTemplates, settingTemplates } = toRefs(
  props
);
if (categorySiteSetting.value.settings.settings_template_id_default == null) {
  if (categorySiteSetting.value.site_id == null) {
    categorySiteSetting.value.settings.settings_template_id_default = 0;
  } else {
    categorySiteSetting.value.settings.settings_template_id_default = -1;
  }
}
if (categorySiteSetting.value.settings.settings_template_id == null) {
  categorySiteSetting.value.settings.settings_template_id = -1;
}
const saveValue = (siteSettingCategory: any) => {
  if (siteSettingCategory.settings.settings_template_id == -1) {
    siteSettingCategory.settings.settings_template_id = null;
  }
  if (siteSettingCategory.settings.settings_template_id_default == -1) {
    siteSettingCategory.settings.settings_template_id_default = null;
  }
  setValue.value(siteSettingCategory);
};
</script>

<template>
  <FormSelect
    v-model="categorySiteSetting.settings.settings_template_id_default"
    @change="saveValue(categorySiteSetting)"
  >
    <option value="-1" v-if="categorySiteSetting.site_id">
      Use Default Category Setting
    </option>
    <option :value="option.id" v-for="option in defaulSettingTemplates" :key="option.id">
      {{ option.name }}
    </option>
  </FormSelect>
  <FormSelect
    v-if="categorySiteSetting.settings.settings_template_id_default == 1"
    class="mt-2"
    v-model="categorySiteSetting.settings.settings_template_id"
    @change="saveValue(categorySiteSetting)"
  >
    <option value="-1">Select Setting Template</option>
    <option :value="option.id" v-for="option in settingTemplates" :key="option.id">
      {{ option.name }}
    </option>
  </FormSelect>
</template>
