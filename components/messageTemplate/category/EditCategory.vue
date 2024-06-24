<script lang="ts" setup>
import { toRefs } from "vue";
import Lucide from "~/components/enigma/base-components/Lucide";
import { Dialog } from "~/components/enigma/base-components/Headless";
import { InputField, SubmitButton, CancelButton, SelectField } from "~/components/form";

const props = defineProps({
  setModal: {
    required: true,
    type: Function,
  },
  modalShow: {
    required: true,
    type: Boolean,
  },
  refresh: {
    required: true,
    type: Function,
  },
  modelValue: {
    required: true,
    type: Object,
  }
});
const { updateMessageTemplateCategory, list, errors, loading } = useMessageTemplateCategories();
const { setModal, modalShow, refresh, modelValue: templateMessageCategory } = toRefs(props);

let templates:any = ref([]);
interface Template {
  id: any;
  parent_id: number | null;
}
const isChildTemplate = (template: Template, parentId: number): boolean => {
  if (template.parent_id === null) {
    return false;
  } else if (template.parent_id === parentId) {
    return true;
  } else {
    const parentTemplate = templates.value.find((t: Template) => t.id === template.parent_id);
    return parentTemplate ? isChildTemplate(parentTemplate, parentId) : false;
  }
};

let filteredTemplates: any = ref([]);

let form = reactive({
  name: templateMessageCategory.value.name,
  parent_id: templateMessageCategory.value.parent_id
});

const updateTemplateCategory = async () => {
  await updateMessageTemplateCategory(form, templateMessageCategory.value.id);
  await refresh.value();
  validationFocus(form, errors);
  if (Object.keys(errors).length == 0) {
    setModal.value(false)
  }
};
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  templates = await list();
  filteredTemplates = templates.value.filter((template: Template) => {
    return template.id !== templateMessageCategory.value.id &&
      !isChildTemplate(template, templateMessageCategory.value.id);
  });
  dataLoaded.value = true
});
</script>
<template>
  <Dialog backdrop="static" :open="modalShow" @close="() => {
    setModal(false);
  }
    ">
    <Dialog.Panel>
      <a @click="(event) => {
        event.preventDefault();
        setModal(false);
      }
        " class="absolute top-3 right-4" href="#">
        <Lucide icon="X" class="w-8 h-8" />
      </a>
      <Dialog.Title>
        <h2 class="mr-auto text-base font-medium">Edit Message Template</h2>
      </Dialog.Title>

      <Dialog.Description>
        <div>
          <InputField name="name" :submit-function="updateTemplateCategory" type="text" v-model="form"
            :error="errors.name" title="Name" />
        </div>
        <div class="mt-3" v-if="dataLoaded">
          <SelectField :options="filteredTemplates" name="parent_id" :submit-function="updateTemplateCategory"
            v-model="form" :error="errors.name" title="Parent" default-option="Root Category" />
        </div>
      </Dialog.Description>
      <Dialog.Footer>
        <SubmitButton :createFunction="updateTemplateCategory" :loading="loading" />
      </Dialog.Footer>
    </Dialog.Panel>
  </Dialog>
</template>
