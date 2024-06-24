<script lang="ts" setup>
import { toRefs } from "vue";
import { InputField, SubmitButton,SelectField, CheckBoxField } from "~/components/form";

const props = defineProps({
  modelValue: {
    required: true,
    type: Object,
  },
  languageId: {
    required: false,
    type: Number,
    default: 1,
  }
});
const emit = defineEmits(["update:modelValue"]);
const { updateCustomForm, errors, loading,getCustomForm,getTranslatedForm, updateTranslatedForm } = useCustomForms();
const { getLanguage } = useLanguages();
const { modelValue:customForm, languageId } = toRefs(props);

let language:any = ref({});

let transLatedData:any = ref({});

let form = reactive({
  name: customForm.value.name,
  status:customForm.value.status,
});
let translatedFrom:any = reactive({});

const formValidationAndEdit = async () => {
  if (languageId.value > 1) {
    await updateTranslatedForm(translatedFrom, customForm.value.id, languageId.value);
    await getTranslatedForm(customForm.value.id, languageId.value)
  } else {
    const updatedCustomForm = await updateCustomForm(form,customForm.value.id);
    if(updatedCustomForm != null) emit("update:modelValue", updatedCustomForm);
  }
  
  validationFocus(form, errors);
};
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  language = await getLanguage(languageId.value);
  transLatedData = await getTranslatedForm(customForm.value.id, languageId.value);
  translatedFrom = reactive({
    name: languageId.value == 1 ? "" : transLatedData.value.name,
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
  <div class="p-1" v-if="dataLoaded">
    <div class="mt-0" v-if="languageId == 1">
      <InputField
        name="name"
        :submit-function="formValidationAndEdit"
        type="text"
        v-model="form"
        :error="errors.name"
        title="Name"
        :formInline="true"
      />
    </div>
    <div class="mt-0" v-if="languageId != 1">
      <InputField
        name="name"
        :placeholder="form.name"
        :submit-function="formValidationAndEdit"
        v-model="translatedFrom"
        :error="errors.name"
        :title="'Name (' + language.code.slice(0, 2) + ')'"
        :required="true"
        :formInline="true"
      />
    </div>
    <div class="mt-5" v-if="languageId == 1">
      <CheckBoxField title="Status" name="status" v-model="form" />
    </div>
    
    <div class="mt-5 text-right">
      <SubmitButton :createFunction="formValidationAndEdit" :loading="loading" />
    </div>
  </div>
</template>
