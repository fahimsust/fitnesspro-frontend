<script setup lang="ts">
import _ from "lodash";
import Lucide from "~/components/enigma/base-components/Lucide";
import { FormInline } from "~/components/enigma/base-components/Form";
import { InputField, SubmitButton, EditorField, CheckBoxField, TextAreaField } from "~/components/form";
import TomSelectField from "~/components/form/TomSelectField.vue";
import TomSelect from "~/components/enigma/base-components/TomSelect";
import { useQueryParamStore } from "~/store/enigma/query-param";
definePageMeta({
  middleware: ["auth"],
  layout: "simple-menu-new",
});

useHead({
  title: "Add Message Template: " + useRuntimeConfig().public.company,
});
useQueryParamStore().setQueryParam({})

const {
  createMessageTemplate,
  errors,
  loading
} = useMessageTemplates();

const {
  list,
  createMessageTemplateCategory
} = useMessageTemplateCategories();

let categoryList:any = ref([]);
interface Form {
  name: string;
  subject: string;
  alt_body: string;
  html_body: string;
  note: string;
  category_id: any;
}

let form: Form = reactive({
  name: "",
  subject: "",
  alt_body: "",
  html_body: "",
  note: "",
  category_id: [],
});
const validateAndCreate = async () => {
  let find = categoryList.value.find((val: any) => val.id.toString() == form.category_id.toString())
  if (find) {
    form.category_id = parseInt(form.category_id)
  }
  await createMessageTemplate(form);
  validationFocus(form, errors);
};
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
const dataLoaded = ref(false)
const fetchData = async ()=>{
  categoryList = await list();
  dataLoaded.value = true
}
onMounted(async () => {
  await nextTick();
  await fetchData();
});
</script>
<template>
  <div class="flex items-center mt-8 intro-y">
    <h2 class="mr-auto text-lg font-medium">Add Message Template</h2>
  </div>
  <div class="grid grid-cols-11 pb-20 mt-5 gap-x-6">
    <div class="col-span-11 overflow-auto intro-y lg:overflow-visible">
      <div class="p-5 mt-5 intro-y box">
        <div class="p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400">
          <div class="flex items-center pb-5 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400">
            <Lucide icon="ChevronDown" class="w-4 h-4 mr-2" /> Info
          </div>
          <div class="mt-5">
            <FormInline class="mt-5 first:mt-0 flex-wrap">
              <InputField :submit-function="validateAndCreate" name="name" v-model="form" :error="errors.name"
                title="Name" :required="true" />
            </FormInline>
            <FormInline class="mt-5 first:mt-0 flex-wrap">
              <InputField :required="true" :submit-function="validateAndCreate" name="subject" v-model="form"
                :error="errors.subject" title="Subject" />
            </FormInline>
            <FormInline class="mt-5 first:mt-0 flex-wrap" v-if="dataLoaded">
              <TomSelectField :callBack="()=>onChange(form.category_id)" v-if="categoryList" :options="categoryList" name="category_id" v-model="form"
                :error="errors.category_id" title="Category" :formInline="true" />
            </FormInline>
          </div>
        </div>
      </div>
      <div class="p-5 mt-5 intro-y box">
        <div class="p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400">
          <div class="flex items-center pb-5 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400">
            <Lucide icon="ChevronDown" class="w-4 h-4 mr-2" /> Details
          </div>
          <div class="mt-5">
            <EditorField :required="true" name="html_body" v-model="form" :error="errors.html_body" title="HTML" />
          </div>
          <div class="mt-5">
            <TextAreaField :required="true" name="alt_body" :rows="15" v-model="form" :error="errors.alt_body"
              title="Plain Text" />
          </div>
          <div class="mt-5">
            <TextAreaField name="note" v-model="form" :error="errors.note" title="Note (Location, admin notes)" />
          </div>
        </div>
        <div class="mt-5 text-right">
          <SubmitButton :createFunction="validateAndCreate" :loading="loading" />
        </div>
      </div>


    </div>
  </div>
</template>
