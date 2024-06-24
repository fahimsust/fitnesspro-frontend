<script setup lang="ts">
import _ from "lodash";
import { reactive } from "vue";
import { toRefs, type PropType } from "vue";
import { FormInline } from "~/components/enigma/base-components/Form";
import { InputField, SubmitButton, EditorField } from "~/components/form";
import TomSelectField from "~/components/form/TomSelectField.vue";
const route = useRoute();
const emit = defineEmits(["update:modelValue"]);

interface Option {
  id: string;
  name: string;
}
const props = defineProps({
  modelValue: {
    required: true,
    type: Object,
  },
  transLatedData: {
    required: false,
    type: Object,
    default: {},
  },
  language: {
    required: false,
    type: Object,
    default: {},
  },
  languageId: {
    required: false,
    type: Number,
    default: 1,
  },
  getTranslated: {
    required: false,
    type: Function,
    default: () => {},
  },
  parentCategoryList: {
    required: true,
    type: Array as PropType<Array<Option>>,
  },
});
let {
  modelValue: category,
  transLatedData,
  languageId,
  language,
  getTranslated,
} = toRefs(props);
const idParem = parseInt(route.params.id.toString());
const { updateCategory, errors, loading, updateTranslationCategory } = useCategories();

let form = reactive({
  title: category.value.title,
  subtitle: category.value.subtitle,
  url_name: category.value.url_name,
  parent_id: category.value.parent_id == null ? "" : category.value.parent_id,
  description: category.value.description == null ? "" : category.value.description,
});
let translatedForm = reactive({
  title: languageId.value > 1 ? transLatedData.value.title : "",
  subtitle: languageId.value > 1 ? transLatedData.value.subtitle : "",
  url_name: languageId.value > 1 ? transLatedData.value.url_name : "",
  description:
    languageId.value > 1
      ? transLatedData.value.description == null
        ? ""
        : transLatedData.value.description
      : "",
});
const validateAndCreate = async () => {
  if (languageId.value == 1) {
    const updatedCategory = await updateCategory(form, idParem);
    if (updatedCategory != null) emit("update:modelValue", updatedCategory);
  } else {
    await updateTranslationCategory(translatedForm, idParem, languageId.value);
    await getTranslated.value();
  }
  validationFocus(translatedForm, errors);
};
</script>

<template>
  <div class="p-1">
    <FormInline class="mt-5 first:mt-0 flex-wrap" v-if="languageId == 1">
      <InputField
        name="title"
        :submit-function="validateAndCreate"
        v-model="form"
        :error="errors.title"
        title="Title"
        :required="true"
        :formInline="true"
      />
    </FormInline>
    <FormInline class="mt-5 first:mt-0 flex-wrap" v-if="languageId > 1">
      <InputField
        name="title"
        :placeholder="form.title"
        v-model="translatedForm"
        :submit-function="validateAndCreate"
        :error="errors.title"
        :title="'Title (' + language.code.slice(0, 2) + ')'"
        :required="true"
        :formInline="true"
      />
    </FormInline>
    <FormInline class="mt-5 first:mt-0 flex-wrap" v-if="languageId == 1">
      <InputField
        name="subtitle"
        :submit-function="validateAndCreate"
        v-model="form"
        :error="errors.subtitle"
        title="Sub-Title"
        :formInline="true"
      />
    </FormInline>
    <FormInline class="mt-5 first:mt-0 flex-wrap" v-if="languageId > 1">
      <InputField
        name="subtitle"
        :placeholder="form.subtitle"
        :submit-function="validateAndCreate"
        v-model="translatedForm"
        :error="errors.subtitle"
        :title="'Sub-Title  (' + language.code.slice(0, 2) + ')'"
        :formInline="true"
      />
    </FormInline>
    <FormInline class="mt-5 first:mt-0 flex-wrap" v-if="languageId == 1">
      <InputField
        name="url_name"
        :submit-function="validateAndCreate"
        v-model="form"
        :error="errors.url_name"
        title="URL Slug"
        :required="true"
        :formInline="true"
      />
    </FormInline>
    <FormInline class="mt-5 first:mt-0 flex-wrap" v-if="languageId > 1">
      <InputField
        name="url_name"
        :placeholder="form.url_name"
        :submit-function="validateAndCreate"
        v-model="translatedForm"
        :error="errors.url_name"
        :title="'URL Slug (' + language.code.slice(0, 2) + ')'"
        :required="true"
        :formInline="true"
      />
    </FormInline>
    <div class="mt-5" v-if="languageId == 1">
      <EditorField
        name="description"
        v-model="form"
        :error="errors.description"
        title="Description"
      />
    </div>
    <div class="mt-5" v-if="languageId > 1">
      <EditorField
        name="description"
        :placeholder="stripHtml(form.description)"
        v-model="translatedForm"
        :error="errors.description"
        :title="'Description (' + language.code.slice(0, 2) + ')'"
      />
    </div>
    <FormInline class="mt-5 first:mt-0 flex-wrap" v-if="languageId == 1">
      <TomSelectField
        :options="parentCategoryList"
        name="parent_id"
        v-model="form"
        :error="errors.parent_id"
        title="Parent Category"
        optionTitle="title"
        :formInline="true"
      />
    </FormInline>

    <div class="mt-5 text-right">
      <SubmitButton :createFunction="validateAndCreate" :loading="loading" />
    </div>
  </div>
</template>
