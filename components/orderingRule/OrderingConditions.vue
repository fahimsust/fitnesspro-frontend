<script lang="ts" setup>
import { computed } from "vue";
import Disclosure from "~/components/enigma/base-components/Headless/Disclosure";
import OrderingCondition from "./OrderingCondition.vue";
import Button from "~/components/enigma/base-components/Button";
import AddCondition from "./AddCondition.vue";

const {
  list,
  deleteCondition,
  errors,
  deleteConfirmationModal,
  setDeleteId,
  updateCondition,
} = useOrderingCondition();
const route = useRoute();
const idParem = parseInt(route.params.id.toString());
let conditions:any = ref([]);
const modalShow = ref(false);
const disclosureGroupKey = ref(0);
const setModal = (value: boolean) => {
  modalShow.value = value;
};
const refresh = async () => {
  await list(idParem);
  disclosureGroupKey.value = disclosureGroupKey.value + 1;
};
const modifyCondition = async (form: object, id: number) => {
  await updateCondition(form, id);
  validationFocus(form, errors);
};
const removeCondition = async () => {
  await deleteCondition(idParem);
  await refresh();
};
const setConfirmationModal = (value: boolean) => {
  deleteConfirmationModal.value = value;
};

const setConfirm = (id: number) => {
  setDeleteId(id);
  setConfirmationModal(true);
};
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  conditions = await list(idParem);
  dataLoaded.value = true
});
</script>
<template>
  <div class="col-span-12 lg:col-span-9">
    <div class="col-span-12 intro-y">
      <Button @click="() => setModal(true)" variant="primary" class="mr-2 shadow-md">
        Add Condition
      </Button>
      <div v-if="!dataLoaded">
        <div class="rounded-lg box intro-y mt-3">
          <TableLoading />
        </div>
      </div> 
      <AlertGray v-if="conditions.length == 0 && dataLoaded" class="mt-3" />
      <div class="mt-3" v-if="dataLoaded">
        <Disclosure.Group variant="boxed" :key="disclosureGroupKey">
          <OrderingCondition
            v-for="condition in conditions"
            :condition="condition"
            :modify-condition="modifyCondition"
            :errors="errors"
            :set-confirm="setConfirm"
          />
        </Disclosure.Group>
      </div>
    </div>
  </div>
  <Confirmation
    v-model="deleteConfirmationModal"
    buttonStringMain="Remove"
    subHeader="Do you want to remove this condition from this ordering rules?"
    :setConfirmationModal="setConfirmationModal"
    :set-id="setDeleteId"
    :functionToRun="removeCondition"
  />
  <AddCondition
    :rule_id="idParem"
    :modal-show="modalShow"
    :set-modal="setModal"
    :refresh="refresh"
  />
</template>
