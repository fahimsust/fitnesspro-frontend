<script lang="ts" setup>
import { toRefs } from "vue";
import { InputField, SelectField, SubmitButton, CancelButton } from "~/components/form";

const props = defineProps({
  language_id: {
    required: true,
    type: Number,
  },
  option: {
    required: true,
    type: Object,
  },
});
const {
  getProductOption,
  updateTranslatedProductOption,
  getTranslatedProductOption,
  errors,
  loading,
} = useProductOption();
const { language_id, option } = toRefs(props);

let form: any = reactive({});
const optionValidationAndAdd = async () => {
  await updateTranslatedProductOption(form, option.value.id, language_id.value);
  validationFocus(form, errors);
};
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  const oprionTranslated = await getTranslatedProductOption(
    option.value.id,
    language_id.value
  );
  form = reactive({
    name: oprionTranslated.value != null ? oprionTranslated.value.name : "",
    display: oprionTranslated.value != null ? oprionTranslated.value.display : "",
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
    <div>
      <InputField name="name" :placeholder="option.name" :submit-function="optionValidationAndAdd" type="text"
        v-model="form" :required="true" :error="errors.name" title="Name" />
    </div>
    <div class="mt-3">
      <InputField name="display" :placeholder="option.display" :submit-function="optionValidationAndAdd" type="text"
        v-model="form" :required="true" :error="errors.display" title="Display Name" />
    </div>
    <div class="mt-5 text-right">
      <SubmitButton :createFunction="optionValidationAndAdd" :loading="loading" />
    </div>
  </div>
</template>
