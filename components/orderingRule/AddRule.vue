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
});
const { createOrderingRule, errors, loading } = useOrderingRule();
const { setModal, modalShow, refresh } = toRefs(props);
const any_all = [
  { id: "any", name: "Any" },
  { id: "all", name: "All" },
];
let form = reactive({
  name: "",
  any_all: "",
});
const keyInput = ref(0);

const orderingRuleValidationAndAdd = async () => {
  await createOrderingRule(form);
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
        <h2 class="mr-auto text-base font-medium">Add Ordering Rule</h2>
      </Dialog.Title>

      <Dialog.Description>
        <div>
          <InputField :key="keyInput" name="name" :submit-function="orderingRuleValidationAndAdd" type="text"
            v-model="form" :error="errors.name" title="Name" />
        </div>
        <div class="mt-3">
          <SelectField :options="any_all" :submit-function="orderingRuleValidationAndAdd" name="any_all" v-model="form"
            :error="errors.any_all" title="Match" />
        </div>
      </Dialog.Description>
      <Dialog.Footer>
        <SubmitButton :createFunction="orderingRuleValidationAndAdd" :loading="loading" />
      </Dialog.Footer>
    </Dialog.Panel>
  </Dialog>
</template>
