<script setup lang="ts">
import _ from "lodash";
import Lucide from "~/components/enigma/base-components/Lucide";
import { FormInline } from "~/components/enigma/base-components/Form";
import { InputField, SubmitButton, EditorField, CheckBoxField } from "~/components/form";
import TomSelectField from "~/components/form/TomSelectField.vue";
import { useQueryParamStore } from "~/store/enigma/query-param";
definePageMeta({
  middleware: ["auth"],
  layout: "simple-menu-new",
});

useHead({
  title: "Add Category: " + useRuntimeConfig().public.company,
});

useQueryParamStore().setQueryParam({})
const { createCategory, errors, loading, parentCategories } = useCategories();

const parentCategoryList = await parentCategories();

let form = reactive({
  title: "",
  subtitle: "",
  url_name: "",
  parent_id: "",
  description: "",
});
const validateAndCreate = async () => {
  await createCategory(form);
  validationFocus(form, errors);
};
</script>
<template>
  <div class="flex items-center mt-8 intro-y">
    <h2 class="mr-auto text-lg font-medium">Add Category</h2>
  </div>
  <div class="grid grid-cols-11 pb-20 mt-5 gap-x-6">
    <div class="col-span-11 overflow-auto intro-y lg:overflow-visible">
      <div class="p-5 mt-5 intro-y box">
        <div class="p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400">
          <div class="flex items-center pb-5 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400">
            <Lucide icon="ChevronDown" class="w-4 h-4 mr-2" /> Display Titles
          </div>
          <div class="mt-5">
            <FormInline class="mt-5 first:mt-0 flex-wrap">
              <InputField name="title" v-model="form" :error="errors.title" title="Category Title" :required="true"
                :formInline="true" />
            </FormInline>
            <FormInline class="mt-5 first:mt-0 flex-wrap">
              <InputField name="subtitle" v-model="form" :error="errors.subtitle" title="Sub-Title" :formInline="true" />
            </FormInline>
            <FormInline class="mt-5 first:mt-0 flex-wrap">
              <InputField name="url_name" v-model="form" :error="errors.url_name" title="URL Slug" :required="true"
                :formInline="true" />
            </FormInline>
          </div>
        </div>
      </div>
      <div class="p-5 mt-5 intro-y box">
        <div class="p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400">
          <div class="flex items-center pb-5 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400">
            <Lucide icon="ChevronDown" class="w-4 h-4 mr-2" /> Category Details
          </div>
          <div class="mt-5">
            <EditorField name="description" v-model="form" :error="errors.description" title="Description" />
          </div>
        </div>
      </div>
      <div class="p-5 mt-5 intro-y box">
        <div class="p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400">
          <div class="flex items-center pb-5 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400">
            <Lucide icon="ChevronDown" class="w-4 h-4 mr-2" /> Parent Category
          </div>
          <FormInline class="mt-5 first:mt-0 flex-wrap">
            <TomSelectField :options="parentCategoryList" name="parent_id" v-model="form" :error="errors.parent_id"
              title="Parent Category" optionTitle="title" :formInline="true" />
          </FormInline>
          <div class="mt-5 text-right">
            <SubmitButton :createFunction="validateAndCreate" :loading="loading" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
