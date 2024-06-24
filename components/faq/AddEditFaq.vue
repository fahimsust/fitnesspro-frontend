<script lang="ts" setup>
import { toRefs } from "vue";
import { FormInline } from "~/components/enigma/base-components/Form";
import { InputField, SubmitButton, EditorField, CheckBoxField } from "~/components/form";
import TomSelectField from "~/components/form/TomSelectField.vue";

const props = defineProps({
  modelValue: {
    required: false,
    type: Object,
    default: { question: null, answer: "", rank: 0, status: true, url: null },
  },
});
const router = useRouter();
const { addFaq, updateFaq, getFaq, errors, loading } = useFaqs();
const { getFaqCategoryList, addFaqCategory } = useFaqCategory();
let { modelValue: faq } = toRefs(props);
let categoryList: any = ref([]);

interface Form {
  question: string;
  answer: string;
  rank: number;
  status: boolean;
  url: string;
  categories_id: any;
}
let form: Form = reactive({
  question: faq.value.question,
  answer: faq.value.question ? faq.value.question : "",
  rank: faq.value.rank,
  status: faq.value.status,
  url: faq.value.url,
  categories_id: faq.value.faq_categories ? faq.value.faq_categories.map((object: { categories_id: any }) => object.categories_id) : [],
});
const onChange = async (value: any) => {
  if (value && Array.isArray(value)) {
    for (let val of value) {
      let find = categoryList.value.find((category: any) => category.id.toString() === val.toString());
      if (!find) {
        find = categoryList.value.find((category: any) => category.title.toString() === val.toString());
        if (!find) {
          const categoryData: any = {
            'title': val,
            'url': createSlug(val),
            'status': true,
            'rank': 1
          };
          const category: any = await addFaqCategory(categoryData);
          await getFaqCategoryList();
          const categoryIdString = category.id.toString();
          form.categories_id.pop();
          form.categories_id = form.categories_id.concat(categoryIdString);
        }
      }
    }
  }
}
const faqValidationAndAdd = async () => {
  let newFaq: any = faq;
  if (faq.value.id == undefined) {
    newFaq = await addFaq(form);
    if (Object.keys(errors).length == 0) {
      router.push("/content/faq/" + newFaq.id);
    }
  } else {
    await updateFaq(form, faq.value.id);
    faq = await getFaq(faq.value.id);
  }
  validationFocus(form, errors);
};
const onChangeQuestion = () => {
  if (faq.value.id == undefined) {
    form.url = createSlug(form.question)
  }
}
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  categoryList = await getFaqCategoryList();
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
    <FormInline class="mt-5 first:mt-0 flex-wrap">
      <InputField name="question" :blur="onChangeQuestion" :submit-function="faqValidationAndAdd" v-model="form"
        :error="errors.question" title="Question" :required="true" :formInline="true" />
    </FormInline>
    <div class="mt-5">
      <EditorField name="answer" v-model="form" :error="errors.answer" title="Answer" :required="true" />
    </div>
    <FormInline class="mt-5 first:mt-0 flex-wrap">
      <InputField name="url" :key="form.url" :submit-function="faqValidationAndAdd" v-model="form" :error="errors.url"
        title="Url" :required="true" :formInline="true" />
    </FormInline>
    <FormInline class="mt-5 first:mt-0 flex-wrap">
      <InputField name="rank" :submit-function="faqValidationAndAdd" v-model="form" type="number" :error="errors.rank"
        title="Rank" :required="true" :formInline="true" />
    </FormInline>
    <FormInline class="mt-5 first:mt-0 flex-wrap">
      <TomSelectField optionTitle="title" :multiple="true" :callBack="() => onChange(form.categories_id)"
        v-if="categoryList" :options="categoryList" name="categories_id" v-model="form" :error="errors.categories_id"
        title="Category" :formInline="true" />
    </FormInline>
    <FormInline class="mt-5 first:mt-0 flex-wrap">
      <CheckBoxField name="status" v-model="form" :error="errors.status" title="Active?" :formInline="true" />
    </FormInline>
    <div class="mt-5 text-right">
      <SubmitButton :createFunction="faqValidationAndAdd" :loading="loading" />
    </div>
  </div>
</template>
