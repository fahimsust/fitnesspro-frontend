<script lang="ts" setup>
import { toRefs } from "vue";
import Lucide from "~/components/enigma/base-components/Lucide";
import { Dialog } from "~/components/enigma/base-components/Headless";
import { SelectField, SubmitButton, CancelButton } from "~/components/form";

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
  orderId: {
    required: true,
    type: Number,
  },
  is_downloads: {
    required: true,
    type: Boolean
  },
  distributorList: {
    required: true,
    type: Array<any>,
  }

});
const {
  createShipment,
  errors,
  loadingShipment,
} = useShipments();
const { setModal, modalShow, refresh, orderId, is_downloads } = toRefs(props);

let form = reactive({
  is_downloads: is_downloads.value,
  distributor_id: null
});

const validationAndAdd = async () => {
  await createShipment(form, orderId.value);
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
        <h2 class="mr-auto text-base font-medium">Add Shipment</h2>
      </Dialog.Title>

      <Dialog.Description>
        <div>
          <SelectField :options="distributorList" :submit-function="validationAndAdd" name="distributor_id" v-model="form"
            :error="errors.distributor_id" title="Distributor" />
        </div>
      </Dialog.Description>
      <Dialog.Footer>
        <SubmitButton :createFunction="validationAndAdd" :loading="loadingShipment" />
      </Dialog.Footer>
    </Dialog.Panel>
  </Dialog>
</template>
