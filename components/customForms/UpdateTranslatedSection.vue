<script lang="ts" setup>
import { toRefs } from "vue";
import { InputField } from "~/components/form";

const props = defineProps({
  language_id: {
    required: true,
    type: Number,
  },
  section_id: {
    required: true,
    type: Number,
  },
  title:{
    required: true,
    type:String,
  }
});
const {
  updateTranslatedSection,
  getTranslatedSection,
  errors,
  loading,
} = useCustomFormSections();
const { language_id, section_id,title } = toRefs(props);

let form:any = reactive({});
const sectionValidationAndUpdate = async () => {
  await updateTranslatedSection(form, section_id.value, language_id.value);
  validationFocus(form, errors);
};
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  const setTranslation = await getTranslatedSection(section_id.value, language_id.value);
  form = reactive({
  title: setTranslation.value != null ? setTranslation.value.title : "",
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
  <div class="mt-5" v-if="dataLoaded">
    <InputField
      :withLabel="false"
      name="title"
      v-model="form"
      :error="errors.name"
      :placeholder="title"
      :submit-function="sectionValidationAndUpdate"
      title="title"
    />
    <div class="text-xs text-slate-500 mt-2 text-right">Press Enter For Save</div>
  </div>
</template>
