<script lang="ts" setup>
import { toRefs } from "vue";
import Lucide from "~/components/enigma/base-components/Lucide";
import { Dialog } from "~/components/enigma/base-components/Headless";
import CustomerEdit from "../customer/CustomerEdit.vue";

const props = defineProps({
  setModal: {
    required: true,
    type: Function,
  },
  modalShow: {
    required: true,
    type: Boolean,
  },
  customer: {
    required: true,
    type: Object,
  },
});
const { setModal, modalShow, customer } = toRefs(props);
</script>
<template>
  <Dialog backdrop="static" size="xxl" :open="modalShow" @close="() => {
      setModal(false);
    }
    ">
    <Dialog.Panel>
      <a @click="(event) => {
        event.preventDefault();
        setModal(false);
      }
        " class="absolute top-2 right-2" href="#">
        <Lucide icon="X" class="w-8 h-8" />
      </a>

      <Dialog.Description>
        <CustomerEdit v-model="customer" />
      </Dialog.Description>
    </Dialog.Panel>
  </Dialog>
</template>
