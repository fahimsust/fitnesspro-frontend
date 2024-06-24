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
  rule_id: {
    required: true,
    type: Number,
  },
});
const { createCondition, errors, loading } = useOrderingCondition();
const { setModal, modalShow, refresh, rule_id } = toRefs(props);
const type = [
  { id: "required_account_specialty", name: "Required Specialty" },
  { id: "required_account_type", name: "Required Account Type" },
];
let form = reactive({
  rule_id: rule_id.value,
  type: "",
});

const conditionValidationAndAdd = async () => {
  await createCondition(form);
  await refresh.value();
  validationFocus(form, errors);
  if (Object.keys(errors).length == 0) {
    setModal.value(false);
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
        <h2 class="mr-auto text-base font-medium">Add Condition</h2>
      </Dialog.Title>

      <Dialog.Description>
        <div class="mt-3">
          <SelectField :options="type" :submit-function="conditionValidationAndAdd" name="type" v-model="form"
            :error="errors.type" title="Condition" />
        </div>
      </Dialog.Description>
      <Dialog.Footer>
        <SubmitButton :createFunction="conditionValidationAndAdd" :loading="loading" />
      </Dialog.Footer>
    </Dialog.Panel>
  </Dialog>
</template>
