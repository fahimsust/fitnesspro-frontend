<script lang="ts" setup>
import { toRefs } from "vue";
import Lucide from "~/components/enigma/base-components/Lucide";
import { Dialog } from "~/components/enigma/base-components/Headless";
import OrderEdit from "../order/OrderEdit.vue";

const props = defineProps({
  setModal: {
    required: true,
    type: Function,
  },
  modalShow: {
    required: true,
    type: Boolean,
  },
  order_id: {
    required: true,
    type: Number,
  },
});
const { getOrder } = useCompletedOrders();

const { setModal, modalShow, order_id } = toRefs(props);
const refresh = async () => {
  await getOrder(order_id.value);
}
let order:any = ref({});
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  order = await getOrder(order_id.value);
  dataLoaded.value = true
});
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
        " class="absolute top-3 right-4" href="#">
        <Lucide icon="X" class="w-8 h-8" />
      </a>
      <Dialog.Title>
        <h2 class="mr-auto text-base font-medium">Order</h2>
      </Dialog.Title>

      <Dialog.Description class="max-h-[75vh] overflow-auto">
        <div v-if="!dataLoaded">
          <div class="rounded-lg box intro-y mt-3">
            <TableLoading />
          </div>
        </div>
        <OrderEdit v-model="order" v-if="dataLoaded" :refresh="refresh" />
      </Dialog.Description>
    </Dialog.Panel>
  </Dialog>
</template>
