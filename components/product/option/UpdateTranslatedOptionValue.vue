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
  updateTranslatedProductOptionValue,
  getTranslatedProductOptionValue,
  errors,
  loading,
} = useProductOption();
const { language_id, option } = toRefs(props);
let form: any = reactive({});
const optionValueValidationAndAdd = async () => {
  await updateTranslatedProductOptionValue(form, option.value.id, language_id.value);
  validationFocus(form, errors);
};
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  const oprionValueTranslated = await getTranslatedProductOptionValue(
    option.value.id,
    language_id.value
  );
  form = reactive({
    name: oprionValueTranslated.value != null ? oprionValueTranslated.value.name : "",
    display: oprionValueTranslated.value != null ? oprionValueTranslated.value.display : "",
  })
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
      <InputField :placeholder="option.name" name="name" :submit-function="optionValueValidationAndAdd" type="text"
        v-model="form" :error="errors.name" title="Name" />
    </div>
    <div class="mt-3">
      <InputField :placeholder="option.display" name="display" :submit-function="optionValueValidationAndAdd"
        type="text" v-model="form" :error="errors.display" title="Display Name" />
    </div>
    <div class="mt-5 text-right">
      <SubmitButton :createFunction="optionValueValidationAndAdd" :loading="loading" />
    </div>
  </div>
</template>
