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

const { errors, loading, updateSite } = useSites();

let form = reactive({
  name: site.value.name,
  domain: site.value.domain,
  email: site.value.email,
  phone: site.value.phone,
  url: site.value.url,
  logo_url: site.value.logo_url,
});
const emit = defineEmits(["update:modelValue"]);
const siteValidationAndUpdate = async () => {
  const updatedSite = await updateSite(form,site.value.id);
  if(updateSite != null) emit("update:modelValue", updatedSite);
  validationFocus(form, errors); 
};
</script>
<template>
  <FormInline class="mt-5 first:mt-0 flex-wrap">
    <InputField
      name="name"
      :submit-function="siteValidationAndUpdate"
      v-model="form"
      :error="errors.name"
      title="Name of Site"
      :required="true"
      :formInline="true"
    />
  </FormInline>
  <FormInline class="mt-5 first:mt-0 flex-wrap">
    <InputField
      name="domain"
      :submit-function="siteValidationAndUpdate"
      v-model="form"
      :error="errors.domain"
      title="Domain"
      :formInline="true"
    />
  </FormInline>
  <FormInline class="mt-5 first:mt-0 flex-wrap">
    <InputField
      name="email"
      type="email"
      :submit-function="siteValidationAndUpdate"
      v-model="form"
      :error="errors.email"
      title="Email Address"
      :required="true"
      :formInline="true"
    />
  </FormInline>
  <FormInline class="mt-5 first:mt-0 flex-wrap">
    <InputField
      name="phone"
      :submit-function="siteValidationAndUpdate"
      v-model="form"
      :error="errors.phone"
      title="Phone"
      :required="true"
      :formInline="true"
    />
  </FormInline>
  <FormInline class="mt-5 first:mt-0 flex-wrap">
    <InputField
      name="url"
      :submit-function="siteValidationAndUpdate"
      v-model="form"
      :error="errors.url"
      title="URL"
      :required="true"
      :formInline="true"
    />
  </FormInline>
  <FormInline class="mt-5 first:mt-0 flex-wrap">
    <InputField
      name="logo_url"
      :submit-function="siteValidationAndUpdate"
      v-model="form"
      :error="errors.logo_url"
      title="Logo URL"
      :formInline="true"
    />
  </FormInline>
  
  <div class="mt-5 text-right">
    <SubmitButton :createFunction="siteValidationAndUpdate" :loading="loading" />
  </div>
</template>
