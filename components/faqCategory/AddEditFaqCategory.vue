<script lang="ts" setup>
import { toRefs } from "vue";
import { FormInline } from "~/components/enigma/base-components/Form";
import { InputField, SubmitButton, EditorField,CheckBoxField } from "~/components/form";

const props = defineProps({
  modelValue: {
    required: false,
    type: Object,
    default: { title: null, rank: 0, status:true, url:null },
  },
});
const router = useRouter();
const { addFaqCategory, updateFaqCategory, errors, loading } = useFaqCategory();
const { modelValue: faq } = toRefs(props);

let form = reactive({
  title: faq.value.title,
  rank: faq.value.rank,

  status: faq.value.status,
  url: faq.value.url,
});
const faqCategoryValidationAndAdd = async () => {
  let newFaq: any = faq;
  if (faq.value.id == undefined) {
    newFaq = await addFaqCategory(form);
    if (Object.keys(errors).length == 0) {
      router.push("/content/faq/category/" + newFaq.id);
    }
  } else {
    await updateFaqCategory(form, faq.value.id);
  }
  validationFocus(form, errors);
};
const onChangeTitle = ()=>{
 if(faq.value.id == undefined)
 {
    form.url = createSlug(form.title)
 }
}
</script>
<template>
  
  <FormInline class="mt-5 first:mt-0 flex-wrap">
    <InputField
      name="title"
      :submit-function="faqCategoryValidationAndAdd"
      v-model="form"
      :blur="onChangeTitle"
      :error="errors.title"
      title="Title"
      :required="true"
      :formInline="true"
    />
  </FormInline>
  <FormInline class="mt-5 first:mt-0 flex-wrap">
    <InputField
      :key="form.url"
      name="url"
      :submit-function="faqCategoryValidationAndAdd"
      v-model="form"
      :error="errors.url"
      title="Url"
      :required="true"
      :formInline="true"
    />
  </FormInline>
  <FormInline class="mt-5 first:mt-0 flex-wrap">
    <InputField
      name="rank"
      :submit-function="faqCategoryValidationAndAdd"
      v-model="form"
      type="number"
      :error="errors.rank"
      title="Rank"
      :required="true"
      :formInline="true"
    />
  </FormInline>
  <FormInline class="mt-5 first:mt-0 flex-wrap">
      <CheckBoxField name="status" v-model="form" :error="errors.status"
        title="Active?" :formInline="true" />
  </FormInline>
  <div class="mt-5 text-right">
    <SubmitButton :createFunction="faqCategoryValidationAndAdd" :loading="loading" />
  </div>
</template>
