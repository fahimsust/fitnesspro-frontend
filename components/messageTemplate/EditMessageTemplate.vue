<script lang="ts" setup>
import { toRefs } from "vue";
import _ from "lodash";
import { InputField, SubmitButton, EditorField, CheckBoxField, TextAreaField } from "~/components/form";
import TomSelectField from "~/components/form/TomSelectField.vue";
const props = defineProps({
  modelValue: {
    required: false,
    type: Object,
    default: { name: null, category_id: null, alt_body: "", html_body: "", note: null },
  },
});

const {
  updateMessageTemplate,
  errors,
  loading
} = useMessageTemplates();
const { modelValue: messageTemplate } = toRefs(props);

const {
  list,
  createMessageTemplateCategory
} = useMessageTemplateCategories();



let categoryList: any = ref([]);
interface Form {
  name: string;
  subject: string;
  alt_body: string;
  html_body: string;
  note: string;
  category_id: any;
}

let form: Form = reactive({
  name: messageTemplate.value.name,
  subject: messageTemplate.value.subject,
  alt_body: convertLineBreaksPlain(messageTemplate.value.alt_body),
  html_body: decodeHtml(messageTemplate.value.html_body),
  note: messageTemplate.value.note,
  category_id: messageTemplate.value.category_id !== null ? [messageTemplate.value.category_id] : [],
});
const onChange = async(value:any)=>{
  if(value)
  {
    let find = categoryList.value.find((val: any) => val.id.toString() === value.toString())
    if(!find)
    {
      find = categoryList.value.find((val: any) => val.name.toString() === value.toString())
      if(!find)
      {
        const category = await createMessageTemplateCategory({'name':value})
        await list();
        form.category_id = [category.id.toString()]
      }
    }
  }
}
const validateAndCreate = async () => {
  let find = categoryList.value.find((val: any) => val.id.toString() == form.category_id.toString())
  if (find) {
    form.category_id = parseInt(form.category_id)
  }
  await updateMessageTemplate(form, messageTemplate.value.id);
  await list();
  validationFocus(form, errors);
  form.category_id = form.category_id !== null ? [form.category_id] : "";
};
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  categoryList = await list();
  dataLoaded.value = true
});
</script>
<template>
  <div class="mt-3">
    <InputField :submit-function="validateAndCreate" name="name" v-model="form" :error="errors.name" title="Name"
      :required="true" />
  </div>
  <div class="mt-3">
    <InputField :required="true" :submit-function="validateAndCreate" name="subject" v-model="form"
      :error="errors.subject" title="Subject" />
  </div>
  <div class="mt-3" v-if="dataLoaded">
    <TomSelectField 
    :callBack="()=>onChange(form.category_id)"
    :options="categoryList" name="category_id" v-model="form" :error="errors.category_id"
      title="Category" />
  </div>

  <div class="mt-3">
    <EditorField :required="true" name="html_body" v-model="form" :error="errors.html_body" title="HTML" />
  </div>
  <div class="mt-3">
    <TextAreaField :required="true" name="alt_body" :rows="15" v-model="form" :error="errors.alt_body"
      title="Plain Text" />
  </div>
  <div class="mt-3">
    <TextAreaField name="note" v-model="form" :error="errors.note" title="Note (Location, admin notes)" />
  </div>
  <div class="mt-3 text-right col-span-12">
    <SubmitButton :createFunction="validateAndCreate" :loading="loading" />
  </div>
</template>
