<script setup>
import _ from "lodash";
import { reactive } from "vue";
import { FormInline } from "~/components/enigma/base-components/Form";
import { InputField, SubmitButton } from "~/components/form";
const emit = defineEmits(["update:modelValue"]);
const { updateMeta, errors, loading, updateTranslatedMeta } = useProducts();
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
  meta_title: product.value.meta_title,
  meta_desc: product.value.meta_desc,
  meta_keywords: product.value.meta_keywords,
});
let translatedForm = reactive({
  meta_title: languageId.value > 1 ? transLatedData.value.meta_title : "",
  meta_desc: languageId.value > 1 ? transLatedData.value.meta_desc : "",
  meta_keywords: languageId.value > 1 ? transLatedData.value.meta_keywords : "",
});
const validateAndCreate = async () => {
  if (languageId.value == 1) {
    const updatedProduct = await updateMeta(form, product.value.id);
    if (updatedProduct != null) emit("update:modelValue", updatedProduct);
  } else {
    await updateTranslatedMeta(translatedForm, product.value.id, languageId.value);
    await getTranslated.value();
  }
  validationFocus(form, errors);
};
</script>

<template>
  <div class="p-1" v-if="languageId == 1">
    <FormInline class="mt-5 first:mt-0 flex-wrap">
      <InputField
        name="meta_title"
        :submit-function="validateAndCreate"
        v-model="form"
        :error="errors.meta_title"
        title="Meta Title"
        :formInline="true"
      />
    </FormInline>
    <FormInline class="mt-5 first:mt-0 flex-wrap">
      <InputField
        name="meta_desc"
        :submit-function="validateAndCreate"
        v-model="form"
        :error="errors.meta_desc"
        title="Meta Description"
        :formInline="true"
      />
    </FormInline>
    <FormInline class="mt-5 first:mt-0 flex-wrap">
      <InputField
        name="meta_keywords"
        :submit-function="validateAndCreate"
        v-model="form"
        :error="errors.meta_keywords"
        title="Meta Keywords"
        :formInline="true"
      />
    </FormInline>
    <div class="mt-5 text-right">
      <SubmitButton :createFunction="validateAndCreate" :loading="loading" />
    </div>
  </div>
  <div class="p-1" v-else>
    <FormInline class="mt-5 first:mt-0 flex-wrap">
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
    <FormInline class="mt-5 first:mt-0 flex-wrap">
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
    <FormInline class="mt-5 first:mt-0 flex-wrap">
      <InputField
        name="meta_keywords"
        :placeholder="form.meta_keywords"
        :submit-function="validateAndCreate"
        v-model="translatedForm"
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
