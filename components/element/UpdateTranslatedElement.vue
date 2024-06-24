<script lang="ts" setup>
import { toRefs } from "vue";
import { SubmitButton, EditorField } from "~/components/form";

const props = defineProps({
  language_id: {
    required: true,
    type: Number,
  },
  element_id: {
    required: true,
    type: Number,
  },
});
const { updateTranslatedPage, getTranslatedPage, errors, loading } = useElements();
const { language_id, element_id } = toRefs(props);

const elementTranslation = await getTranslatedPage(element_id.value, language_id.value);

let form: any = reactive({});
const elementValidationAndAdd = async () => {
  await updateTranslatedPage(form, element_id.value, language_id.value);
  validationFocus(form, errors);
};
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  const elementTranslation = await getTranslatedPage(element_id.value, language_id.value);
  form = reactive({
    element_content:
      elementTranslation.value != null
        ? elementTranslation.value.content
          ? elementTranslation.value.content
          : ""
        : "",
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
    <EditorField name="element_content" v-model="form" :error="errors.element_content" title="Content"
      :required="true" />
  </div>
  <div class="mt-5 text-right">
    <SubmitButton :createFunction="elementValidationAndAdd" :loading="loading" />
  </div>
</template>
