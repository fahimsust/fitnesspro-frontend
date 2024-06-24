<script lang="ts" setup>
import { toRefs } from "vue";
import { SubmitButton, EditorField, InputField, TextAreaField } from "~/components/form";

const props = defineProps({
  language_id: {
    required: true,
    type: Number,
  },
  message_template_id: {
    required: true,
    type: Number,
  }
});

const { updateTranslatedMessageTemplate, getTranslatedMessageTemplate, errors, loading } = useMessageTemplates();
const { language_id, message_template_id } = toRefs(props);

let form: any = reactive({});
const messageTemplateValidationAndAdd = async () => {
  await updateTranslatedMessageTemplate(form, message_template_id.value, language_id.value);
  validationFocus(form, errors);
};
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  const messageTemplateTranslation = await getTranslatedMessageTemplate(message_template_id.value, language_id.value);
  form = reactive({
    alt_body:
      messageTemplateTranslation.value != null
        ? messageTemplateTranslation.value.alt_body
          ? messageTemplateTranslation.value.alt_body
          : ""
        : "",
    html_body:
      messageTemplateTranslation.value != null
        ? messageTemplateTranslation.value.html_body
          ? messageTemplateTranslation.value.html_body
          : ""
        : "",
    subject:
      messageTemplateTranslation.value != null
        ? messageTemplateTranslation.value.subject
          ? messageTemplateTranslation.value.subject
          : ""
        : "",
  });
  dataLoaded.value = true
});
</script>
<template>
  <div v-if="!dataLoaded">
    <div class="rounded-lg box intro-y mt-3">
      <TableLoading />
    </div>
  </div>
  <div v-if="dataLoaded">
    <div class="mt-5">
      <InputField :required="true" :submit-function="messageTemplateValidationAndAdd" name="subject" v-model="form"
        :error="errors.subject" title="Subject" :formInline="true" />
    </div>
    <div class="mt-5">
      <EditorField :required="true" name="html_body" v-model="form" :error="errors.html_body" title="HTML" />
    </div>
    <div class="mt-5">
      <TextAreaField :required="true" name="alt_body" :rows="15" v-model="form" :error="errors.alt_body"
        title="Plain Text" />
    </div>
    <div class="mt-5 text-right">
      <SubmitButton :createFunction="messageTemplateValidationAndAdd" :loading="loading" />
    </div>
  </div>
</template>
