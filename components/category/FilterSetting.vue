<script setup lang="ts">
import _ from "lodash";
import { reactive } from "vue";
import { toRefs, type PropType } from "vue";
import { FormInline } from "~/components/enigma/base-components/Form";
import { InputField, SubmitButton, CheckBoxField, SelectField } from "~/components/form";
const route = useRoute();
const emit = defineEmits(["update:modelValue"]);

const { updateCategoryFilter, errors, loading } = useCategories();
interface Option {
  id: string;
  name: string;
}
const props = defineProps({
  modelValue: {
    required: true,
    type: Object,
  },
});
const showHide: any = [
  { id: false, name: "Hide" },
  { id: true, name: "Show" },
];
let { modelValue: category } = toRefs(props);
const idParem = parseInt(route.params.id.toString());

let form = reactive({
  rules_match_type: category.value.rules_match_type,
  show_types: category.value.show_types,
  show_brands: category.value.show_brands,
  limit_min_price: category.value.limit_min_price,
  min_price: category.value.min_price,
  limit_max_price: category.value.limit_max_price,
  max_price: category.value.max_price,
  limit_days: category.value.limit_days,
  show_sale: category.value.show_sale,
});
const validateAndCreate = async () => {
  const updatedCategory = await updateCategoryFilter(form, idParem);
  validationFocus(form, errors);
  if (updatedCategory != null) emit("update:modelValue", updatedCategory);
};
</script>

<template>
  <div class="p-1">
    <FormInline class="mt-5 first:mt-0 flex-wrap">
      <SelectField
        :options="showHide"
        name="show_types"
        v-model="form"
        default-option="None"
        :error="errors.show_types"
        title="Type Filtering"
        :formInline="true"
      />
    </FormInline>
    <FormInline class="mt-5 first:mt-0 flex-wrap">
      <SelectField
        :options="showHide"
        name="show_brands"
        v-model="form"
        default-option="None"
        :error="errors.show_brands"
        title="Brand Filtering"
        :formInline="true"
      />
    </FormInline>
    <FormInline class="mt-5 first:mt-0 flex-wrap">
      <InputField
        name="limit_days"
        :submit-function="validateAndCreate"
        type="number"
        v-model="form"
        :error="errors.limit_days"
        title="Only Show Products Created in the Past Number of Days"
        :formInline="true"
      />
    </FormInline>

    <div class="mt-5 text-right">
      <SubmitButton :createFunction="validateAndCreate" :loading="loading" />
    </div>
  </div>
</template>
