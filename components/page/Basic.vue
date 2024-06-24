<script setup lang="ts">
import _ from "lodash";
import { reactive } from "vue";
import { FormInline } from "~/components/enigma/base-components/Form";
import { InputField, SubmitButton,EditorField } from "~/components/form";
const emit = defineEmits(["update:modelValue"]);

const { updatePage, updateTranslatedPage, errors, loading } = usePages();
const props = defineProps({
  modelValue: {
    required: true,
    type: Object,
  },
  languageId: {
    required: false,
    type: Number,
    default: 1,
  },
  translatedData: {
    required: false,
    type: Object,
    default: {},
  },
  language: {
    required: true,
    type: Object,
  },
});

const { modelValue: page, translatedData, languageId, language } = toRefs(props);

let form = reactive({
  title: page.value.title,
  page_content: page.value.content ? page.value.content : "",
  url_name: page.value.url_name,
  notes: page.value.notes,
});
let translatedFrom = reactive({
  title: languageId.value == 1 ? "" : translatedData.value.title,
  page_content:
    languageId.value == 1
      ? ""
      : translatedData.value.content
      ? translatedData.value.content
      : "",
  url_name: languageId.value == 1 ? "" : translatedData.value.url_name,
});
const validateAndCreate = async () => {
  if (languageId.value > 1) {
    await updateTranslatedPage(translatedFrom, page.value.id, languageId.value);
  } else {
    const updatedPage = await updatePage(form, page.value.id);
    if (updatedPage != null) emit("update:modelValue", updatedPage);
  }
  validationFocus(form, errors);
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

    <FormInline class="mt-5 first:mt-0 flex-wrap" v-if="languageId != 1">
      <InputField
        name="title"
        :placeholder="form.title"
        :submit-function="validateAndCreate"
        v-model="translatedFrom"
        :error="errors.title"
        :title="'Title (' + language.code.slice(0, 2) + ')'"
        :required="true"
        :formInline="true"
      />
    </FormInline>

    <FormInline class="mt-5 first:mt-0 flex-wrap" v-if="languageId == 1">
      <InputField
        name="url_name"
        :submit-function="validateAndCreate"
        v-model="form"
        :error="errors.url_name"
        title="Url Slug"
        :required="true"
        :formInline="true"
      />
    </FormInline>
    <FormInline class="mt-5 first:mt-0 flex-wrap" v-if="languageId != 1">
      <InputField
        name="url_name"
        :placeholder="form.url_name"
        :submit-function="validateAndCreate"
        v-model="translatedFrom"
        :error="errors.url_name"
        :title="'Url Slug (' + language.code.slice(0, 2) + ')'"
        :required="true"
        :formInline="true"
      />
    </FormInline>
    <div class="mt-5" v-if="languageId == 1">
      <EditorField
        name="page_content"
        v-model="form"
        :error="errors.page_content"
        title="Content"
      />
    </div>
    <div class="mt-5" v-if="languageId != 1">
      <EditorField
        name="page_content"
        :placeholder="stripHtml(form.page_content)"
        v-model="translatedFrom"
        :error="errors.page_content"
        :title="'Content (' + language.code.slice(0, 2) + ')'"
      />
    </div>
    <FormInline class="mt-5 first:mt-0 flex-wrap" v-if="languageId == 1">
      <InputField
        name="notes"
        :submit-function="validateAndCreate"
        v-model="form"
        :error="errors.notes"
        title="Notes (Location, admin notes)"
        :formInline="true"
      />
    </FormInline>
    <div class="mt-5 text-right">
      <SubmitButton :createFunction="validateAndCreate" :loading="loading" />
    </div>
  </div>
</template>
