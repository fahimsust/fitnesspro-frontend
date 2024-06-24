<script setup lang="ts">
import _ from "lodash";
import { reactive } from "vue";
import { FormInline } from "~/components/enigma/base-components/Form";
import { InputField, SubmitButton, EditorField, SelectField } from "~/components/form";
const emit = defineEmits(["update:modelValue"]);

interface Option {
  id: any;
  name: string;
}

const props = defineProps({
  refreshTemplate: {
    required: true,
    type: Function,
  },
  template: {
    required: true,
    type: Object
  }
});
const { updateModuleTemplate, errors, loading } = useModuleTemplates();
const { template, refreshTemplate } = toRefs(props);
const {
  getModuleTemplate
} = useProductSiteSetting();

let templates: any = ref([]);

let form = reactive({
  name: template.value.name,
  parent_template_id: template.value.parent_template_id
});

const templateValidationAndEdit = async () => {
  await updateModuleTemplate(form, template.value.id);
  validationFocus(form, errors);
  if (Object.keys(errors).length == 0) {
    await refreshTemplate.value(template.value.id);
  }
};
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  templates = await getModuleTemplate();
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
    <div>
      <InputField :auto-focus="true" name="name" :submit-function="templateValidationAndEdit" type="text" v-model="form"
        :error="errors.name" title="Name" />
    </div>
    <div class="mt-3">
      <SelectField v-if="templates" :options="templates" name="parent_template_id" v-model="form" :hasDefault="false"
        :error="errors.parent_template_id" title="Parent Template" />
    </div>
    <div class="mt-5 text-right">
      <SubmitButton :createFunction="templateValidationAndEdit" :loading="loading" />
    </div>
  </div>
</template>
