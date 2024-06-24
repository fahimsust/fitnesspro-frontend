<script lang="ts" setup>
import { toRefs } from "vue";
import { SubmitButton, EditorField,InputField } from "~/components/form";
import { FormInline } from "~/components/enigma/base-components/Form";

const props = defineProps({
  language_id: {
    required: true,
    type: Number,
  },
  faq_id: {
    required: true,
    type: Number,
  },
});
const { updateTranslatedFaq, getTranslatedFaq, errors, loading } = useFaqs();
const { language_id, faq_id } = toRefs(props);

const faqTranslation = await getTranslatedFaq(faq_id.value, language_id.value);

let form:any = reactive({});
const faqValidationAndAdd = async () => {
  await updateTranslatedFaq(form, faq_id.value, language_id.value);
  validationFocus(form, errors);
};
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  const faqTranslation = await getTranslatedFaq(faq_id.value, language_id.value);
  form = reactive({
    answer:faqTranslation.value != null?faqTranslation.value.answer:null,
    question:
      faqTranslation.value != null
        ? faqTranslation.value.question
          ? faqTranslation.value.question
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
  <FormInline class="mt-5 first:mt-0 flex-wrap" v-if="dataLoaded">
    <InputField
      name="question"
      :submit-function="faqValidationAndAdd"
      v-model="form"
      :error="errors.question"
      title="Question"
      :required="true"
      :formInline="true"
    />
  </FormInline>
  <div class="mt-5" v-if="dataLoaded">
    <EditorField
      name="answer"
      :submit-function="faqValidationAndAdd"
      v-model="form"
      :error="errors.answer"
      title="Answer"
      :required="true"
    />
  </div>
  <div class="mt-5 text-right">
    <SubmitButton :createFunction="faqValidationAndAdd" :loading="loading" />
  </div>
</template>
