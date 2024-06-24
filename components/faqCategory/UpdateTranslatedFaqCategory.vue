<script lang="ts" setup>
import { toRefs } from "vue";
import { SubmitButton, InputField } from "~/components/form";
import { FormInline } from "~/components/enigma/base-components/Form";

const props = defineProps({
  language_id: {
    required: true,
    type: Number,
  },
  faq_category_id: {
    required: true,
    type: Number,
  },
});
const { updateTranslatedFaqCategory, getTranslatedFaqCategory, errors, loading } = useFaqCategory();
const { language_id, faq_category_id } = toRefs(props);

let form: any = reactive({});
const faCategoryValidationAndAdd = async () => {
  await updateTranslatedFaqCategory(form, faq_category_id.value, language_id.value);
  validationFocus(form, errors);
};
let faqTranslation: any = ref({});
const dataLoaded = ref(false)
const fetchData = async () => {
  faqTranslation = await getTranslatedFaqCategory(faq_category_id.value, language_id.value);
  form = reactive({
    title: faqTranslation.value != null ? faqTranslation.value.title : null,
  });
  dataLoaded.value = true
}
onMounted(async () => {
  await nextTick();
  await fetchData();
})
</script>
<template>
  <FormInline class="mt-5 first:mt-0 flex-wrap" v-if="dataLoaded">
    <InputField name="title" :submit-function="faCategoryValidationAndAdd" v-model="form" :error="errors.title"
      title="Title" :required="true" :formInline="true" />
  </FormInline>
  <div class="mt-5 text-right">
    <SubmitButton :createFunction="faCategoryValidationAndAdd" :loading="loading" />
  </div>
</template>
