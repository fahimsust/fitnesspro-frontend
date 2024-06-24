<script setup>
import _ from "lodash";
import { reactive } from "vue";
import { FormInline } from "~/components/enigma/base-components/Form";
import { InputField, SubmitButton, CheckBoxField } from "~/components/form";
import TomSelectField from "~/components/form/TomSelectField.vue";

const loadingInitial = ref(false);

const emit = defineEmits(["update:modelValue"]);

const { updateDetail, errors, loading, getProduct, brands, categories } = useProducts();
const props = defineProps({
  modelValue: {
    required: true,
    type: Object,
  },
});
const product = ref(props.modelValue);
let brandList = ref([]);
let categoryList = ref([]);
loadingInitial.value = false;

let form = reactive({
  brand_id:
    product.value.details.brand_id == undefined
      ? ""
      : String(product.value.details.brand_id),
  default_category_id:
    product.value.details.default_category_id == undefined
      ? ""
      : String(product.value.details.default_category_id),
  downloadable: product.value.details.downloadable,
  downloadable_file: product.value.details.downloadable_file,
  create_children_auto: product.value.details.create_children_auto,
  display_children_grid: product.value.details.display_children_grid,
  override_parent_description: product.value.details.override_parent_description,
  allow_pricing_discount: product.value.details.allow_pricing_discount,
});
const validateAndCreate = async () => {
  const updatedProduct = await updateDetail(form, product.value.id);
  if (updatedProduct != null) emit("update:modelValue", updatedProduct);
  validationFocus(form, errors);
};
const dataLoaded = ref(false)
onMounted(async()=>{
  await nextTick();
  brandList = await brands();
  categoryList = await categories();
  dataLoaded.value = true
})
</script>
<template>
  <FormInline class="mt-5 first:mt-0 flex-wrap" v-if="dataLoaded">
    <TomSelectField
      :options="brandList"
      optionTitle="name"
      name="brand_id"
      v-model="form"
      :error="errors.brand_id"
      title="Brand"
      :formInline="true"
    />
  </FormInline>
  <FormInline class="mt-5 first:mt-0 flex-wrap" v-if="dataLoaded">
    <TomSelectField
      :options="categoryList"
      optionTitle="title"
      name="default_category_id"
      v-model="form"
      :error="errors.default_category_id"
      title="Default Category"
      :formInline="true"
    />
  </FormInline>
  <FormInline class="mt-5 first:mt-0 flex-wrap">
    <check-box-field
      name="downloadable"
      v-model="form"
      :error="errors.downloadable"
      title="Downloadable?"
      :formInline="true"
    />
  </FormInline>
  <FormInline v-if="form.downloadable == 1" class="mt-5 first:mt-0 flex-wrap">
    <InputField
      name="downloadable_file"
      :submit-function="validateAndCreate"
      v-model="form"
      :error="errors.downloadable_file"
      title="Link to Download"
      :formInline="true"
    />
  </FormInline>
  <FormInline class="mt-5 first:mt-0 flex-wrap">
    <check-box-field
      name="create_children_auto"
      v-model="form"
      :error="errors.create_children_auto"
      title="Automaticaly Create Children?"
      :formInline="true"
    />
  </FormInline>
  <FormInline class="mt-5 first:mt-0 flex-wrap">
    <check-box-field
      name="display_children_grid"
      v-model="form"
      :error="errors.display_children_grid"
      title="Display Children Grid?"
      :formInline="true"
    />
  </FormInline>
  <FormInline class="mt-5 first:mt-0 flex-wrap">
    <check-box-field
      name="override_parent_description"
      v-model="form"
      :error="errors.override_parent_description"
      title="Override Parent Description?"
      :formInline="true"
    />
  </FormInline>
  <FormInline class="mt-5 first:mt-0 flex-wrap">
    <check-box-field
      name="allow_pricing_discount"
      v-model="form"
      :error="errors.allow_pricing_discount"
      title="Allow Pricing Discount?"
      :formInline="true"
    />
  </FormInline>

  <div class="mt-5 text-right">
    <SubmitButton :createFunction="validateAndCreate" :loading="loading" />
  </div>
</template>
