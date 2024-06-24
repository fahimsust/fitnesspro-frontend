<script setup lang="ts">
import { ref, toRefs } from "vue";
import Lucide from "~/components/enigma/base-components/Lucide";
import { Dialog } from "~/components/enigma/base-components/Headless";
import Button from "~/components/enigma/base-components/Button";
const props = defineProps({
  setConfirmationModal: {
    required: true,
    type: Function,
  },
  modelValue: {
    required: true,
    type: Boolean,
  },
  setId: {
    required: true,
    type: Function,
  },
  functionToRun: {
    required: true,
    type: Function,
  },
  header: {
    required: false,
    type: String,
    default: "Are you sure?",
  },
  subHeader: {
    required: false,
    type: String,
    default: "Do you really want to archive this record?",
  },
  buttonStringMain: {
    required: false,
    type: String,
    default: "Archive",
  },
  buttonStringCancel: {
    required: false,
    type: String,
    default: "Cancel",
  },
});
const loading = ref(false)
const deleteButtonRef = ref(null);
const {
  setConfirmationModal,
  modelValue: confirmationModal,
  setId,
  functionToRun,
} = toRefs(props);
</script>
<template>
  <Dialog :open="confirmationModal" @close="() => {
    setConfirmationModal(false);
    setId(0);
  }" :initialFocus="deleteButtonRef">
    <Dialog.Panel>
      <div class="p-5 text-center">
        <Lucide icon="XCircle" class="w-16 h-16 mx-auto mt-3 text-danger" />
        <div class="mt-5 text-3xl">{{ header }}</div>
        <div class="mt-2 text-slate-500">
          {{ subHeader }}
        </div>
      </div>

      <div class="px-5 pb-8 text-center">
        <Button variant="outline-secondary" type="button" @click="() => {
          setConfirmationModal(false);
          setId(0);
        }" class="w-24 mr-1">
          {{ buttonStringCancel }}
        </Button>
        <Button variant="danger" type="button" :disabled="loading" @click="async () => {
          loading = true;
          await functionToRun();
          loading = false;
        }" class="w-24" ref="deleteButtonRef">
          <span v-if="!loading">{{ buttonStringMain }}</span>
          <div v-else class="border-t-transparent border-solid border-4 border-white rounded-full w-5 h-5 animate-spin">
          </div>
        </Button>
      </div>
    </Dialog.Panel>
  </Dialog>
  <!-- END: Delete Confirmation Modal -->
</template>
