<script setup>
import _ from "lodash";
import { reactive } from "vue";
import { FormInline } from "~/components/enigma/base-components/Form";
import { InputField, SubmitButton } from "~/components/form";
const emit = defineEmits(["update:modelValue"]);
const { updateProduct, errors, loading, updateTranslatedProduct } = useProducts();
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

let translatedForm = reactive({
  title: languageId.value > 1 ? transLatedData.value.title : "",
  subtitle: languageId.value > 1 ? transLatedData.value.subtitle : "",
  url_name: languageId.value > 1 ? transLatedData.value.url_name : "",
});

let form = reactive({
  title: product.value.title,
  subtitle: product.value.subtitle,
  url_name: product.value.url_name,
  product_no: product.value.product_no,
  weight: product.value.weight,
});
const validateAndCreate = async () => {
  if (languageId.value == 1) {
    const updatedProduct = await updateProduct(form, product.value.id);
    if (updatedProduct != null) emit("update:modelValue", updatedProduct);
  } else {
    await updateTranslatedProduct(translatedForm, product.value.id, languageId.value);
    await getTranslated.value();
  }
  validationFocus(form, errors);
};
</script>

<template>
  <div class="p-1" v-if="languageId == 1">
    <FormInline class="mt-5 first:mt-0 flex-wrap">
      <InputField
        name="title"
        :submit-function="validateAndCreate"
        v-model="form"
        :error="errors.title"
        title="Product Title"
        :required="true"
        :formInline="true"
      />
    </FormInline>
    <FormInline v-if="product.parent_product == null" class="mt-5 first:mt-0 flex-wrap">
      <InputField
        name="subtitle"
        :submit-function="validateAndCreate"
        v-model="form"
        :error="errors.subtitle"
        title="Sub-title"
        :formInline="true"
      />
    </FormInline>
    <FormInline class="mt-5 first:mt-0 flex-wrap">
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
    <FormInline class="mt-5 first:mt-0 flex-wrap">
      <InputField
        name="product_no"
        :submit-function="validateAndCreate"
        v-model="form"
        :error="errors.product_no"
        title="SKU"
        :formInline="true"
      />
    </FormInline>
    <FormInline class="mt-5 first:mt-0 flex-wrap">
      <InputField
        name="weight"
        :submit-function="validateAndCreate"
        type="number"
        v-model="form"
        :error="errors.weight"
        title="Weight"
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
        name="title"
        :placeholder="form.title"
        :submit-function="validateAndCreate"
        v-model="translatedForm"
        :error="errors.title"
        :title="'Product Title (' + language.code.slice(0, 2) + ')'"
        :required="true"
        :formInline="true"
      />
    </FormInline>
    <FormInline v-if="product.parent_product == null" class="mt-5 first:mt-0 flex-wrap">
      <InputField
        name="subtitle"
        :placeholder="form.subtitle"
        :submit-function="validateAndCreate"
        v-model="translatedForm"
        :error="errors.subtitle"
        :title="'Sub-title (' + language.code.slice(0, 2) + ')'"
        :formInline="true"
      />
    </FormInline>
    <FormInline class="mt-5 first:mt-0 flex-wrap">
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
    <div class="mt-5 text-right">
      <SubmitButton :createFunction="validateAndCreate" :loading="loading" />
    </div>
  </div>
</template>
