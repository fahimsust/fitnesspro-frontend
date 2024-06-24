<script setup lang="ts">
import _ from "lodash";
import { reactive } from "vue";
import { FormInline } from "~/components/enigma/base-components/Form";
import { InputField, SubmitButton, CheckBoxField } from "~/components/form";
const route = useRoute();
const emit = defineEmits(["update:modelValue"]);

const { updateMenuSetting, errors, loading } = useCategories();
const props = defineProps({
  modelValue: {
    required: true,
    type: Object,
  },
});
let { modelValue: category } = toRefs(props);
const idParem = parseInt(route.params.id.toString());

let form = reactive({
  rank: category.value.rank,
  show_in_list: category.value.show_in_list,
  menu_class: category.value.menu_class,
});
const validateAndCreate = async () => {
  const updatedCategory = await updateMenuSetting(form, idParem);
  validationFocus(form, errors);
  if (updatedCategory != null) emit("update:modelValue", updatedCategory);
};
</script>

<template>
  <div class="p-1">
    <FormInline class="mt-5 first:mt-0 flex-wrap">
      <InputField
        name="rank"
        v-model="form"
        type="number"
        :error="errors.rank"
        :submit-function="validateAndCreate"
        title="Rank"
        :required="true"
        :formInline="true"
      />
    </FormInline>
    <FormInline class="mt-5 first:mt-0 flex-wrap">
      <check-box-field
        name="show_in_list"
        v-model="form"
        :error="errors.show_in_list"
        title="Show In List"
        :formInline="true"
      />
    </FormInline>
    <FormInline class="mt-5 first:mt-0 flex-wrap">
      <InputField
        name="menu_class"
        v-model="form"
        :submit-function="validateAndCreate"
        :error="errors.menu_class"
        title="Menu Class"
        :formInline="true"
      />
    </FormInline>
    <div class="mt-5 text-right">
      <SubmitButton :createFunction="validateAndCreate" :loading="loading" />
    </div>
  </div>
</template>
