<script lang="ts" setup>
import { toRefs } from "vue";
import { FormInline } from "~/components/enigma/base-components/Form";
import { EditorField, SubmitButton, InputField } from "~/components/form";

const props = defineProps({
  modelValue: {
    required: true,
    type: Object,
  },
});
const route = useRoute();
const idParam = parseInt(route.params.id.toString());
const { modelValue: messageTemplate } = toRefs(props);
const { errors, loading, updateMessageTemplate } = useSiteMessageTemplate();

let form = reactive({
  html: messageTemplate.value.html,
  alt: messageTemplate.value.alt,
});
const emit = defineEmits(["update:modelValue"]);
const siteValidationAndUpdate = async () => {
  const updatedMessageTemplate = await updateMessageTemplate(form, idParam);
  validationFocus(form, errors);
  if (Object.keys(errors).length == 0) {
    emit("update:modelValue", updatedMessageTemplate);
  }
};
</script>
<template>
  <div class="mt-5">
    <EditorField name="html" v-model="form" :error="errors.html" title="Html" :required="true" />
  </div>
  <FormInline class="mt-5 first:mt-0 flex-wrap">
    <InputField name="alt" :submit-function="siteValidationAndUpdate" v-model="form" :error="errors.alt" title="Alt"
      :formInline="true" />
  </FormInline>

  <div class="mt-5 text-right">
    <SubmitButton :createFunction="siteValidationAndUpdate" :loading="loading" />
  </div>
</template>
