<script setup>
import _ from "lodash";
import { reactive } from "vue";
import { FormInline } from "~/components/enigma/base-components/Form";
import { InputField, SubmitButton } from "~/components/form";
const emit = defineEmits(["update:modelValue"]);
const { updateCustomInfo, errors, loading, updateTranslatedCustomInfo } = useProducts();
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
  customs_description: product.value.customs_description,
  tariff_number: product.value.tariff_number,
  country_origin: product.value.country_origin,
});
let translatedForm = reactive({
  customs_description:
    languageId.value > 1 ? transLatedData.value.customs_description : "",
});
const validateAndCreate = async () => {
  if (languageId.value == 1) {
    const updatedProduct = await updateCustomInfo(form, product.value.id);
    if (updatedProduct != null) emit("update:modelValue", updatedProduct);
  } else {
    await updateTranslatedCustomInfo(translatedForm, product.value.id, languageId.value);
    await getTranslated.value();
  }
  validationFocus(form, errors);
};
</script>

<template>
  <div class="p-1">
    <FormInline class="mt-5 first:mt-0 flex-wrap" v-if="languageId == 1">
      <InputField
        :submit-function="validateAndCreate"
        name="customs_description"
        v-model="form"
        :error="errors.customs_description"
        title="Customs Description"
        :formInline="true"
      />
    </FormInline>
    <FormInline class="mt-5 first:mt-0 flex-wrap" v-else>
      <InputField
        :submit-function="validateAndCreate"
        name="customs_description"
        :placeholder="form.customs_description"
        v-model="translatedForm"
        :error="errors.customs_description"
        :title="'Customs Description (' + language.code.slice(0, 2) + ')'"
        :formInline="true"
      />
    </FormInline>
    <FormInline class="mt-5 first:mt-0 flex-wrap" v-if="languageId == 1">
      <InputField
        name="tariff_number"
        :submit-function="validateAndCreate"
        v-model="form"
        :error="errors.tariff_number"
        title="Tariff Number"
        :formInline="true"
      />
    </FormInline>
    <FormInline class="mt-5 first:mt-0 flex-wrap" v-if="languageId == 1">
      <InputField
        name="country_origin"
        :submit-function="validateAndCreate"
        v-model="form"
        :error="errors.country_origin"
        title="Country of Origin"
        :formInline="true"
      />
    </FormInline>
    <div class="mt-5 text-right">
      <SubmitButton :createFunction="validateAndCreate" :loading="loading" />
    </div>
  </div>
</template>
