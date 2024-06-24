<script lang="ts" setup>
import { toRefs } from "vue";
import { InputField } from "~/components/form";

const props = defineProps({
  language_id: {
    required: true,
    type: Number,
  },
  option_id: {
    required: true,
    type: Number,
  },
  display: {
    required: true,
    type: String,
  }
});
const {
  updateTranslatedAttributeOption,
  getTranslatedAttributeOption,
  errors,
} = useAttributeOption();
const { language_id, option_id, display } = toRefs(props);

let form: any = reactive({});
const optionValidationAndUpdate = async () => {
  await updateTranslatedAttributeOption(form, option_id.value, language_id.value);
  validationFocus(form, errors);
};
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  const optionTranslation = await getTranslatedAttributeOption(
    option_id.value,
    language_id.value
  );
  form = reactive({
    display: optionTranslation.value != null ? optionTranslation.value.display : "",
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
    <InputField :withLabel="false" name="display" v-model="form" :error="errors.display" :placeholder="display"
      :submit-function="optionValidationAndUpdate" title="Display" />
    <div class="text-xs text-slate-500 mt-2 text-right">Press Enter For Save</div>
  </div>
</template>
