<script setup>
import _ from "lodash";
import { reactive } from "vue";
import { FormInline } from "~/components/enigma/base-components/Form";
import { InputField, SubmitButton } from "~/components/form";
const route = useRoute();
const emit = defineEmits(["update:modelValue"]);

const { updateMeta, errors, loading, updateTranslationMeta } = useCategories();
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
});
let {
  modelValue: category,
  transLatedData,
  languageId,
  language,
  getTranslated,
} = toRefs(props);
const idParem = parseInt(route.params.id.toString());
let form = reactive({
  meta_title: category.value.meta_title,
  meta_desc: category.value.meta_desc,
  meta_keywords: category.value.meta_keywords,
});
let translatedForm = reactive({
  meta_title: languageId.value > 1 ? transLatedData.value.meta_title : "",
  meta_desc: languageId.value > 1 ? transLatedData.value.meta_desc : "",
  meta_keywords: languageId.value > 1 ? transLatedData.value.meta_keywords : "",
});
const validateAndCreate = async () => {
  if (languageId.value == 1) {
    const updatedCategory = await updateMeta(form, idParem);
    if (updatedCategory != null) emit("update:modelValue", updatedCategory);
  } else {
    await updateTranslationMeta(translatedForm, idParem, languageId.value);
    await getTranslated.value();
  }
  validationFocus(form, errors);
};
</script>

<template>
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
  <FormInline class="mt-5 first:mt-0 flex-wrap" v-else>
    <InputField
      name="meta_title"
      :placeholder="form.meta_title"
      :submit-function="validateAndCreate"
      v-model="translatedForm"
      :error="errors.meta_title"
      :title="'Meta Title (' + language.code.slice(0, 2) + ')'"
      :formInline="true"
    />
  </FormInline>
  <FormInline class="mt-5 first:mt-0 flex-wrap" v-if="languageId == 1">
    <InputField
      name="meta_desc"
      :submit-function="validateAndCreate"
      v-model="form"
      :error="errors.meta_desc"
      title="Meta Description"
      :formInline="true"
    />
  </FormInline>
  <FormInline class="mt-5 first:mt-0 flex-wrap" v-else>
    <InputField
      name="meta_desc"
      :placeholder="form.meta_desc"
      :submit-function="validateAndCreate"
      v-model="translatedForm"
      :error="errors.meta_desc"
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
  <FormInline class="mt-5 first:mt-0 flex-wrap" v-else>
    <InputField
      name="meta_keywords"
      :placeholder="form.meta_keywords"
      v-model="translatedForm"
      :submit-function="validateAndCreate"
      :error="errors.meta_keywords"
      :title="'Meta Keywords (' + language.code.slice(0, 2) + ')'"
      :formInline="true"
    />
  </FormInline>
  <div class="mt-5 text-right">
    <SubmitButton :createFunction="validateAndCreate" :loading="loading" />
  </div>
</template>
