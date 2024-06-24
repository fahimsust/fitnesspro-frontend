<script setup lang="ts">
import _ from "lodash";
import { reactive } from "vue";
import { FormInline } from "~/components/enigma/base-components/Form";
import { InputField, SubmitButton } from "~/components/form";
const emit = defineEmits(["update:modelValue"]);

const { updateMeta, updateTranslatedMeta, errors, loading } = usePages();
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
const route = useRoute();
const idParem = parseInt(route.params.id.toString());
const { modelValue: page, translatedData, languageId, language } = toRefs(props);

let translatedFrom = reactive({
  meta_title: languageId.value == 1 ? "" : translatedData.value.meta_title,
  meta_description: languageId.value == 1 ? "" : translatedData.value.meta_description,
  meta_keywords: languageId.value == 1 ? "" : translatedData.value.meta_keywords,
});
let form = reactive({
  meta_title: page.value.meta_title,
  meta_description: page.value.meta_description,
  meta_keywords: page.value.meta_keywords,
});
const validateAndCreate = async () => {
  if (languageId.value > 1) {
    await updateTranslatedMeta(translatedFrom, idParem, languageId.value);
  } else {
    const updatedPage = await updateMeta(form, idParem);
    if (updatedPage != null) emit("update:modelValue", updatedPage);
  }
  validationFocus(form, errors);
};
</script>

<template>
  <div class="p-1">
    <FormInline class="mt-5 first:mt-0 flex-wrap" v-if="languageId == 1">
      <InputField
        name="meta_title"
        :submit-function="validateAndCreate"
        v-model="form"
        :error="errors.meta_title"
        title="Meta Title"
        :formInline="true"
      />
    </FormInline>
    <FormInline class="mt-5 first:mt-0 flex-wrap" v-if="languageId > 1">
      <InputField
        name="meta_title"
        :placeholder="form.meta_title"
        :submit-function="validateAndCreate"
        v-model="translatedFrom"
        :error="errors.meta_title"
        :title="'Meta Title (' + language.code.slice(0, 2) + ')'"
        :formInline="true"
      />
    </FormInline>
    <FormInline class="mt-5 first:mt-0 flex-wrap" v-if="languageId == 1">
      <InputField
        name="meta_description"
        :submit-function="validateAndCreate"
        v-model="form"
        :error="errors.meta_description"
        title="Meta Description"
        :formInline="true"
      />
    </FormInline>
    <FormInline class="mt-5 first:mt-0 flex-wrap" v-if="languageId > 1">
      <InputField
        name="meta_description"
        :placeholder="form.meta_description"
        :submit-function="validateAndCreate"
        v-model="translatedFrom"
        :error="errors.meta_description"
        :title="'Meta Description (' + language.code.slice(0, 2) + ')'"
        :formInline="true"
      />
    </FormInline>
    <FormInline class="mt-5 first:mt-0 flex-wrap" v-if="languageId == 1">
      <InputField
        name="meta_keywords"
        :submit-function="validateAndCreate"
        v-model="form"
        :error="errors.meta_keywords"
        title="Meta Keywords"
        :formInline="true"
      />
    </FormInline>
    <FormInline class="mt-5 first:mt-0 flex-wrap" v-if="languageId > 1">
      <InputField
        name="meta_keywords"
        :placeholder="form.meta_keywords"
        :submit-function="validateAndCreate"
        v-model="translatedFrom"
        :error="errors.meta_keywords"
        :title="'Meta Keywords (' + language.code.slice(0, 2) + ')'"
        :formInline="true"
      />
    </FormInline>
    <div class="mt-5 text-right">
      <SubmitButton :createFunction="validateAndCreate" :loading="loading" />
    </div>
  </div>
</template>
