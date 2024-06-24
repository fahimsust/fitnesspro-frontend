<script lang="ts" setup>
import { toRefs } from "vue";
import { SubmitButton, InputField } from "~/components/form";
import { FormInline } from "~/components/enigma/base-components/Form";

const props = defineProps({
  language_id: {
    required: true,
    type: Number,
  },
  site_id: {
    required: true,
    type: Number,
  },
});
const { updateTranslatedSite, getTranslatedSite, getSite, errors, loading } = useSites();
const { language_id, site_id } = toRefs(props);

let form: any = reactive({});

const siteValidationAndUpdate = async () => {
  await updateTranslatedSite(form, site_id.value, language_id.value);
  validationFocus(form, errors);
};
let siteTranslation: any = ref({});
let site: any = ref({});
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  siteTranslation = await getTranslatedSite(site_id.value, language_id.value);
  site = await getSite(site_id.value)
  form = reactive({
    meta_title: siteTranslation.value != null
      ? siteTranslation.value.meta_title : "",
    meta_keywords: siteTranslation.value != null
      ? siteTranslation.value.meta_keywords : "",
    meta_desc: siteTranslation.value != null
      ? siteTranslation.value.meta_desc : "",
  });
  dataLoaded.value = true
})
</script>
<template>
  <div v-if="!dataLoaded">
    <div class="rounded-lg box intro-y mt-3">
      <TableLoading />
    </div>
  </div>
  <div v-if="dataLoaded">
    <FormInline class="mt-5 first:mt-0 flex-wrap">
      <InputField name="meta_title" :placeholder="site.meta_title" :submit-function="siteValidationAndUpdate"
        v-model="form" :error="errors.meta_title" title="Meta Title" :required="true" :formInline="true" />
    </FormInline>
    <FormInline class="mt-5 first:mt-0 flex-wrap">
      <InputField name="meta_keywords" :placeholder="site.meta_keywords" :submit-function="siteValidationAndUpdate"
        v-model="form" :error="errors.meta_keywords" title="Meta Keywords" :required="true" :formInline="true" />
    </FormInline>
    <FormInline class="mt-5 first:mt-0 flex-wrap">
      <InputField name="meta_desc" :placeholder="site.meta_desc" :submit-function="siteValidationAndUpdate"
        v-model="form" :error="errors.meta_desc" title="Meta Description" :required="true" :formInline="true" />
    </FormInline>
  </div>
  <div class="mt-5 text-right">
    <SubmitButton :createFunction="siteValidationAndUpdate" :loading="loading" />
  </div>
</template>
