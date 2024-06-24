<script lang="ts" setup>
import { toRefs } from "vue";
import { Dialog } from "~/components/enigma/base-components/Headless";
import { CancelButton, SelectField, SubmitButton } from "~/components/form";
import Lucide from "~/components/enigma/base-components/Lucide";


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
const route = useRoute();
const idParem = parseInt(route.params.id.toString());
const { setModal, modalShow, refresh } = toRefs(props);
const { addCategoryRule, errors, loading } = useCategoryRule();

let form = reactive({
  match_type: "any",
});
const options = [
  { id: "any", "name": 'any' },
  { id: "all", "name": 'all' }
]
const ruleValidationAndAdd = async () => {
  await addCategoryRule(form, idParem)
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
        <h2 class="mr-auto text-base font-medium">Add Rule</h2>
      </Dialog.Title>

      <Dialog.Description>
        <div>
          <SelectField name="match_type" v-model="form" default-option="Select" :error="errors.match_type" title="Match"
            :options="options" />
        </div>
      </Dialog.Description>
      <Dialog.Footer>
        <SubmitButton :createFunction="ruleValidationAndAdd" :loading="loading" />
      </Dialog.Footer>
    </Dialog.Panel>
  </Dialog>
</template>
