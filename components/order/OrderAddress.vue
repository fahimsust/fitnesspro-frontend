<script setup lang="ts">
import _ from "lodash";
import Button from "~/components/enigma/base-components/Button";
import Show from "~/components/address/Show.vue";
import AddressSelect from "~/components/AddressSelect.vue";

const props = defineProps({
  modelValue: {
    required: true,
    type: Object,
  },
  refresh: {
    required: true,
    type: Function,
  }
});
let { modelValue: order, refresh } = toRefs(props);

const {
  assignAddress,
  loadingAddress,
  errors
} = useOrderAddress()

const modalShow = ref(false);
const setModel = (value: boolean) => {
  modalShow.value = value;
};
const modalShowShipping = ref(false);
const setModelShipping = (value: boolean) => {
  modalShowShipping.value = value;
};
const updateAddressByIdBilling = async (id: any) => {
  const form = reactive({
    address_id: id,
    is_billing: true
  })
  await assignAddress(form, order.value.id)
  refresh.value()
}
const updateAddressByIdShipping = async (id: any) => {
  const form = reactive({
    address_id: id,
    is_billing: false
  })
  await assignAddress(form, order.value.id)
  refresh.value()
}

</script>

<template>
  <div class="p-2">
    <div class="overflow-y-auto col-span-12 mt-2">
      <div class="grid grid-cols-12 gap-4 gap-y-3">
        <div class="col-span-6 xs:col-span-12">
          <h3 class="mb-3 text-success font-semibold text-lg">Shipping Address</h3>
          <div class="box dark:bg-darkmode-700" v-if="order.shipping_address">
            <Show v-model="order.shipping_address" />
          </div>
          <div class="box dark:bg-darkmode-700" v-else>
            No Shipping Address Found
          </div>

        </div>
        <div class="col-span-6 xs:col-span-12">
          <h3 class="mb-3 text-success font-semibold text-lg">Billing Address</h3>
          <div class="box dark:bg-darkmode-700" v-if="order.billing_address">
            <Show v-model="order.billing_address" />
          </div>
          <div class="box dark:bg-darkmode-700" v-else>
            No Billing Address Found
          </div>

        </div>
      </div>
      <div class="grid grid-cols-12 gap-4 gap-y-3">
        <div class="col-span-6 xs:col-span-12"><Button variant="primary" class="mt-5 shadow-md"
            @click="setModelShipping(true)">
            Manage Shipping Address
          </Button></div>
        <div class="col-span-6 xs:col-span-12"> <Button variant="primary" class="mt-5 shadow-md" @click="setModel(true)">
            Manage Billing Address
          </Button></div>
      </div>
    </div>
  </div>
  <AddressSelect v-model="order.billing_address" :account="order.account" :modelShow="modalShow" :setModel="setModel"
    :updateAddressById="updateAddressByIdBilling" />
  <AddressSelect v-model="order.shipping_address" :account="order.account" :modelShow="modalShowShipping"
    :setModel="setModelShipping" :updateAddressById="updateAddressByIdShipping" />
</template>
