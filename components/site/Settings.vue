<script lang="ts" setup>
import { toRefs } from "vue";
import { SubmitButton, CheckBoxField } from "~/components/form";
import { FormInline } from "~/components/enigma/base-components/Form";

const props = defineProps({
  modelValue: {
    required: true,
    type: Object,
  },
});
const route = useRoute();
const { modelValue: setting } = toRefs(props);
const idParem = parseInt(route.params.id.toString());

const { errors, loading, updateSiteSetting, getSiteSetting } = useSiteSetting();

let form = reactive({
  home_show_categories_in_body: setting.value ? setting.value.home_show_categories_in_body : false,
  home_feature_show: setting.value ? setting.value.home_feature_show : false,
  catalog_show_categories_in_body: setting.value ? setting.value.catalog_show_categories_in_body : false,
  catalog_feature_show: setting.value ? setting.value.catalog_feature_show : false,
  default_show_categories_in_body: setting.value ? setting.value.default_show_categories_in_body : false,
});
const emit = defineEmits(["update:modelValue"]);
const siteSettingValidationAndUpdate = async () => {
  await updateSiteSetting(form, idParem);
  validationFocus(form, errors);
  const updatedSiteSetting = await getSiteSetting(idParem);
  emit("update:modelValue", updatedSiteSetting);
};
</script>
<template>
  <h2 class="pt-5 font-bold">Defaults</h2>
  <hr class="my-2"/>
  <FormInline class="mt-5 first:mt-0 flex-wrap">
    <check-box-field name="default_show_categories_in_body" v-model="form" :error="errors.default_show_categories_in_body"
      title="Do not show categories in body of page" :formInline="true" />
  </FormInline>
 
  <h2 class="pt-5 font-bold">Home</h2>
  <hr class="my-2"/>
  <FormInline class="mt-5 first:mt-0 flex-wrap">
    <check-box-field name="home_show_categories_in_body" v-model="form" :error="errors.home_show_categories_in_body"
      title="DON'T Show Categories in Body" :formInline="true" />
  </FormInline>
  <FormInline class="mt-5 first:mt-0 flex-wrap">
    <check-box-field name="home_feature_show" v-model="form" :error="errors.home_feature_show" title="DON'T Show Featured Products"
      :formInline="true" />
  </FormInline>
  <h2 class="pt-5 font-bold">Categories</h2>
  <hr class="my-2"/>
  <FormInline class="mt-5 first:mt-0 flex-wrap">
    <check-box-field name="catalog_show_categories_in_body" v-model="form" :error="errors.catalog_show_categories_in_body"
      title="	DON'T Show Categories in Body" :formInline="true" />
  </FormInline>
  <FormInline class="mt-5 first:mt-0 flex-wrap">
    <check-box-field name="catalog_feature_show" v-model="form" :error="errors.catalog_feature_show"
      title="DON'T Show Featured Products" :formInline="true" />
  </FormInline>
  
  <div class="mt-5 text-right">
    <SubmitButton :createFunction="siteSettingValidationAndUpdate" :loading="loading" />
  </div>
</template>
