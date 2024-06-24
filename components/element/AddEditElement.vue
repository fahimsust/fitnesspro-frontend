<script lang="ts" setup>
import { toRefs } from "vue";
import { FormInline } from "~/components/enigma/base-components/Form";
import { InputField, SubmitButton, EditorField } from "~/components/form";

const props = defineProps({
  modelValue: {
    required: false,
    type: Object,
    default: { title: null, content: "", notes: null },
  },
});
const router = useRouter();
const { addElement, updateElement, errors, loading } = useElements();
const { modelValue: element } = toRefs(props);

let form = reactive({
  title: element.value.title,
  element_content: element.value.content ? element.value.content : "",
  notes: element.value.notes,
});
const elementValidationAndAdd = async () => {
  let newElement: any = element;
  if (element.value.id == undefined) {
    newElement = await addElement(form);
    if (Object.keys(errors).length == 0) {
      router.push("/content/elements/" + newElement.id);
    }
  } else {
    await updateElement(form, element.value.id);
  }
  validationFocus(form, errors);
};
</script>
<template>
  <FormInline class="mt-5 first:mt-0 flex-wrap">
    <InputField
      name="title"
      :submit-function="elementValidationAndAdd"
      v-model="form"
      :error="errors.title"
      title="Title (Name of Element)"
      :required="true"
      :formInline="true"
    />
  </FormInline>
  <div class="mt-5">
    <EditorField
      name="element_content"
      v-model="form"
      :error="errors.element_content"
      title="Content"
      :required="true"
    />
  </div>
  <FormInline class="mt-5 first:mt-0 flex-wrap">
    <InputField
      name="notes"
      :submit-function="elementValidationAndAdd"
      v-model="form"
      :error="errors.notes"
      title="Notes (Location, admin notes)"
      :formInline="true"
    />
  </FormInline>
  <div class="mt-5 text-right">
    <SubmitButton :createFunction="elementValidationAndAdd" :loading="loading" />
  </div>
</template>
