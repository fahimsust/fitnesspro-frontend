<script setup>
import _ from "lodash";
import { reactive } from "vue";
import { FormInline } from "~/components/enigma/base-components/Form";
import { InputField, SubmitButton, SelectField } from "~/components/form";
const emit = defineEmits(["update:modelValue"]);

const { updateAddToCartSetting, errors, loading, getProduct } = useProducts();
const props = defineProps({
  modelValue: {
    required: true,
    type: Object,
  },
});
let product = ref(props.modelValue);

const cartSetting = [
  { id: "1", name: "External" },
  { id: "2", name: "None" },
];
let form = reactive({
  addtocart_external_label: product.value.addtocart_external_label,
  addtocart_external_link: product.value.addtocart_external_link,
  addtocart_setting: product.value.addtocart_setting,
});
const validateAndCreate = async () => {
  const updatedProduct = await updateAddToCartSetting(form, product.value.id);
  validationFocus(form, errors);
  if (updatedProduct != null) emit("update:modelValue", updatedProduct);
};
</script>

<template>
  <FormInline class="mt-5 first:mt-0 flex-wrap">
    <SelectField
      :options="cartSetting"
      :submit-function="validateAndCreate"
      default-option="Default"
      name="addtocart_setting"
      v-model="form"
      :error="errors.addtocart_setting"
      title="Add To Cart Setting"
      :formInline="true"
    />
  </FormInline>
  <FormInline v-if="form.addtocart_setting == 1" class="mt-5 first:mt-0 flex-wrap">
    <InputField
      :submit-function="validateAndCreate"
      name="addtocart_external_label"
      v-model="form"
      :error="errors.addtocart_external_label"
      title="Add To Cart External Label"
      :formInline="true"
    />
  </FormInline>
  <FormInline v-if="form.addtocart_setting == 1" class="mt-5 first:mt-0 flex-wrap">
    <InputField
      :submit-function="validateAndCreate"
      name="addtocart_external_link"
      v-model="form"
      :error="errors.addtocart_external_link"
      title="Add To Cart External Link"
      :formInline="true"
    />
  </FormInline>

  <div class="mt-5 text-right">
    <SubmitButton :createFunction="validateAndCreate" :loading="loading" />
  </div>
</template>
