<script lang="ts" setup>
import { toRefs } from "vue";
import { FormInline } from "~/components/enigma/base-components/Form";
import { InputField, SubmitButton, EditorField } from "~/components/form";

const props = defineProps({
  modelValue: {
    required: true,
    type: Object,
  },
});
const { modelValue: site } = toRefs(props);

const { errors, loading, updateSiteMeta,getSite } = useSites();

let form = reactive({
  meta_title: site.value.meta_title,
  meta_keywords: site.value.meta_keywords,
  meta_desc: site.value.meta_desc,
});
const emit = defineEmits(["update:modelValue"]);
const siteValidationAndUpdate = async () => {
  const updatedSite = await updateSiteMeta(form,site.value.id);
  if(updatedSite != null) emit("update:modelValue", updatedSite);
  validationFocus(form, errors);
};
</script>
<template>
  <FormInline class="mt-5 first:mt-0 flex-wrap">
    <InputField
      name="meta_title"
      :submit-function="siteValidationAndUpdate"
      v-model="form"
      :error="errors.meta_title"
      title="Meta Title"
      :required="true"
      :formInline="true"
    />
  </FormInline>
  <FormInline class="mt-5 first:mt-0 flex-wrap">
    <InputField
      name="meta_keywords"
      :submit-function="siteValidationAndUpdate"
      v-model="form"
      :error="errors.meta_keywords"
      title="Meta Keywords"
      :required="true"
      :formInline="true"
    />
  </FormInline>
  <FormInline class="mt-5 first:mt-0 flex-wrap">
    <InputField
      name="meta_desc"
      :submit-function="siteValidationAndUpdate"
      v-model="form"
      :error="errors.meta_desc"
      title="Meta Description"
      :required="true"
      :formInline="true"
    />
  </FormInline>
  <div class="mt-5 text-right">
    <SubmitButton :createFunction="siteValidationAndUpdate" :loading="loading" />
  </div>
</template>
