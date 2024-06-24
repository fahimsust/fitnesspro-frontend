<script lang="ts" setup>
import { toRefs } from "vue";
import { FormInline } from "~/components/enigma/base-components/Form";
import { InputField, SubmitButton, EditorField } from "~/components/form";

const router = useRouter();
const { addSite, errors, loading } = useSites();

let form = reactive({
  name: null,
  domain: null,
  email: null,
  phone: null,
  url: null,
  meta_title: null,
  meta_keywords: null,
  meta_desc: null,
  logo_url: null,
});
const siteValidationAndAdd = async () => {
  const site = await addSite(form);
  if (Object.keys(errors).length == 0) {
    router.push("/settings/sites/" + site.id);
  }
  validationFocus(form, errors);
};
</script>
<template>
  <FormInline class="mt-5 first:mt-0 flex-wrap">
    <InputField
      name="name"
      :submit-function="siteValidationAndAdd"
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
      :submit-function="siteValidationAndAdd"
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
      :submit-function="siteValidationAndAdd"
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
      :submit-function="siteValidationAndAdd"
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
      :submit-function="siteValidationAndAdd"
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
      :submit-function="siteValidationAndAdd"
      v-model="form"
      :error="errors.logo_url"
      title="Logo URL"
      :formInline="true"
    />
  </FormInline>
  <hr class="my-4"/>
  <h2 class="mt-2 mr-auto text-lg font-medium intro-y">Meta Information</h2>
  <FormInline class="mt-5 first:mt-0 flex-wrap">
    <InputField
      name="meta_title"
      :submit-function="siteValidationAndAdd"
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
      :submit-function="siteValidationAndAdd"
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
      :submit-function="siteValidationAndAdd"
      v-model="form"
      :error="errors.meta_desc"
      title="Meta Description"
      :required="true"
      :formInline="true"
    />
  </FormInline>
  <div class="mt-5 text-right">
    <SubmitButton :createFunction="siteValidationAndAdd" :loading="loading" />
  </div>
</template>
