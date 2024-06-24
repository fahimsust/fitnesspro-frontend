<script lang="ts" setup>
import { toRefs, type PropType } from "vue";
import Lucide from "~/components/enigma/base-components/Lucide";
import { Dialog } from "~/components/enigma/base-components/Headless";
import { InputField, SubmitButton, CancelButton, SelectField } from "~/components/form";

interface Option {
  id: any;
  name: string;
}

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
  templates: {
    required: true,
    type: Array as PropType<Array<Option>>,
  }
});
const { createModuleTemplate, errors, loading } = useModuleTemplates();
const { setModal, modalShow, templates, refresh } = toRefs(props);

let form = reactive({
  name: "",
  parent_template_id: ""
});

const templateValidationAndAdd = async () => {
  await createModuleTemplate(form);
  validationFocus(form, errors);
  if (Object.keys(errors).length == 0) {
    await refresh.value();
    setModal.value(false)
  }
};
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
        <h2 class="mr-auto text-base font-medium">Add Module Template</h2>
      </Dialog.Title>

      <Dialog.Description>
        <div>
          <InputField :auto-focus="true" name="name" :submit-function="templateValidationAndAdd" type="text"
            v-model="form" :error="errors.name" title="Name" />
        </div>
        <div class="mt-3">
          <SelectField v-if="templates" :options="templates" name="parent_template_id" v-model="form" :hasDefault="false"
            :error="errors.parent_template_id" title="Parent Template" />
        </div>

      </Dialog.Description>
      <Dialog.Footer>
        <SubmitButton :createFunction="templateValidationAndAdd" :loading="loading" />
      </Dialog.Footer>
    </Dialog.Panel>
  </Dialog>
</template>
