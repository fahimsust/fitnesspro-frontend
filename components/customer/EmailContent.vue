<script setup lang="ts">
import { toRefs } from "vue";
import {
  Dialog,
} from "~/components/enigma/base-components/Headless";
import {
  CancelButton,
} from "~/components/form";
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
  modelValue: {
    required: true,
    type: String,
  },
});

const {
  setModal,
  modalShow,
  modelValue: content
} = toRefs(props);
</script>

<template>
  <Dialog backdrop="static" size="xl" :open="modalShow" @close="() => {
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
        <h2 class="mr-auto text-base font-medium">Email Content</h2>
      </Dialog.Title>

      <Dialog.Description class="max-h-[75vh] overflow-auto">
        <div v-html="decodeHtml(content)"></div>
      </Dialog.Description>
      <Dialog.Footer>
      </Dialog.Footer>
    </Dialog.Panel>
  </Dialog>
</template>
