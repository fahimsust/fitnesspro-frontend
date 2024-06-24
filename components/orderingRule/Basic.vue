<script setup lang="ts">
import _ from "lodash";
import { reactive } from "vue";
import { FormInline } from "~/components/enigma/base-components/Form";
import { InputField, SubmitButton, SelectField } from "~/components/form";
const emit = defineEmits(["update:modelValue"]);

const {
  updateOrderingRule,
  updateTranslatedOrderingRule,
  errors,
  loading,
  getRule,
} = useOrderingRule();
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
const { modelValue: rule, translatedData, languageId, language } = toRefs(props);
const any_all = [
  { id: "any", name: "Any" },
  { id: "all", name: "All" },
];
let form = reactive({
  name: rule.value.name,
  any_all: rule.value.any_all,
});
let translatedFrom = reactive({
  name: languageId.value == 1 ? "" : translatedData.value.name,
});
const validateAndCreate = async () => {
  if (languageId.value > 1) {
    await updateTranslatedOrderingRule(translatedFrom, rule.value.id, languageId.value);
  } else {
    const updatedRule = await updateOrderingRule(form, rule.value.id);
    if(updatedRule != null) emit("update:modelValue", updatedRule);
  }
  validationFocus(form, errors);
  
};
</script>

<template>
  <div class="p-1">
    <FormInline class="mt-5 first:mt-0 flex-wrap" v-if="languageId == 1">
      <InputField
        name="name"
        :submit-function="validateAndCreate"
        type="text"
        v-model="form"
        :error="errors.name"
        title="Name"
        :formInline="true"
      />
    </FormInline>

    <FormInline class="mt-5 first:mt-0 flex-wrap" v-if="languageId != 1">
      <InputField
        name="name"
        :placeholder="form.name"
        :submit-function="validateAndCreate"
        type="text"
        v-model="translatedFrom"
        :error="errors.name"
        :formInline="true"
        :title="'Name (' + language.code.slice(0, 2) + ')'"
      />
    </FormInline>

    <FormInline class="mt-5 first:mt-0 flex-wrap" v-if="languageId == 1">
      <SelectField
        :options="any_all"
        :submit-function="validateAndCreate"
        name="any_all"
        v-model="form"
        :error="errors.any_all"
        title="Match"
        :required="true"
        :formInline="true"
      />
    </FormInline>
    <div class="mt-5 text-right">
      <SubmitButton :createFunction="validateAndCreate" :loading="loading" />
    </div>
  </div>
</template>
