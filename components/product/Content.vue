<script setup>
import _ from "lodash";
import { reactive } from "vue";
import { SubmitButton, EditorField } from "~/components/form";
const emit = defineEmits(["update:modelValue"]);

const {
  updateContent,
  errors,
  loading,
  getProduct,
  updateTranslatedContent,
} = useProducts();
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
const {
  modelValue: product,
  transLatedData,
  languageId,
  language,
  getTranslated,
} = toRefs(props);

let form = reactive({
  summary: product.value.details
    ? product.value.details.summary
      ? product.value.details.summary
      : ""
    : "",
  description: product.value.details
    ? product.value.details.description
      ? product.value.details.description
      : ""
    : "",
});

let translatedForm = reactive({
  summary:
    languageId.value > 1
      ? transLatedData.value.summary
        ? transLatedData.value.summary
        : ""
      : "",
  description:
    languageId.value > 1
      ? transLatedData.value.description
        ? transLatedData.value.description
        : ""
      : "",
});

const validateAndCreate = async () => {
  if (languageId.value == 1) {
    const updatedProduct = await updateContent(form, product.value.id);
    if (updatedProduct != null) emit("update:modelValue", updatedProduct);
  } else {
    await updateTranslatedContent(translatedForm, product.value.id, languageId.value);
    await getTranslated.value();
  }
  validationFocus(form, errors);
};
</script>

<template>
  <div class="mt-5">
    <EditorField
      name="description"
      v-if="languageId == 1"
      v-model="form"
      :error="errors.description"
      title="Product Description"
      :required="true"
    />
    <EditorField
      name="description"
      v-else
      v-model="translatedForm"
      :placeholder="stripHtml(form.description)"
      :error="errors.description"
      :title="'Product Description (' + language.code.slice(0, 2) + ')'"
      :required="true"
    />
  </div>
  <div class="mt-5">
    <EditorField
      name="summary"
      v-model="form"
      v-if="languageId == 1"
      :error="errors.summary"
      minHeight="100px"
      title="Product Summary"
      :required="true"
    />
    <EditorField
      name="summary"
      v-model="translatedForm"
      v-else
      :error="errors.summary"
      :placeholder="stripHtml(form.summary)"
      minHeight="100px"
      :title="'Product Summary (' + language.code.slice(0, 2) + ')'"
      :required="true"
    />
  </div>
  <div class="mt-5 text-right">
    <SubmitButton :createFunction="validateAndCreate" :loading="loading" />
  </div>
</template>
