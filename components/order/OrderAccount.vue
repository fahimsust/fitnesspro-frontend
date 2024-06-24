<script setup lang="ts">
import _ from "lodash";
import SearchOrderAccount from "./SearchOrderAccount.vue";
import ShowCustomer from "./ShowCustomer.vue";
import Lucide from "~/components/enigma/base-components/Lucide";
import Button from "~/components/enigma/base-components/Button";

const props = defineProps({
  modelValue: {
    required: true,
    type: Object,
  },
});
const { getOrder } = useCompletedOrders();
let { modelValue: order } = toRefs(props);
const refresh = async () => {
  order = await getOrder(orderId);
};
const orderId = order.value.id;
const modalCustomer = ref(false);
const accountListModal = ref(false);
const {
  accountConfirmationModal,
  unAssignAccount,
  assignAccount,
  setAccountId,
} = useOrderAccounts();
const unassignAccount = () => {
  if (order.value.account) {
    setAccountId(order.value.account.id);
    setOrderAccountDelete(true);
    refresh();
  }
};
const assignAccountToOrder = async (id: number) => {
  await assignAccount(id, orderId);
  assignNewAccount(false);
  refresh();
};
const assignNewAccount = (value: boolean) => {
  accountListModal.value = value;
};

const setOrderAccountDelete = (value: boolean) => {
  accountConfirmationModal.value = value;
};
const unAssignAccountFromOrder = async () => {
  await unAssignAccount(orderId);
  refresh();
};
const setModalCustomer = (value: boolean) => {
  modalCustomer.value = value;
};
</script>

<template>
  <div class="p-2">
    <div class="mt-2 border-2 p-4 dark:border-gray-600 dark:text-white">
      <h3 class="text-lg font-bold mb-4 text-[#74B6E0]">Assigned Account</h3>

      <div v-if="order.account">
        <div class="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
          <div class="flex-1">
            <div class="mb-2">
              <span class="font-semibold">Full Name:</span> {{ order.account.fullname }}
            </div>
            <div class="mb-2">
              <span class="font-semibold">Username:</span> {{ order.account.username }}
            </div>
            <div class="mb-2">
              <span class="font-semibold">Email:</span> {{ order.account.email }}
            </div>
          </div>

          <div class="flex items-center space-x-2">
            <Button variant="danger" @click="unassignAccount">
              <Lucide icon="UserMinus" class="w-4 h-4 mr-2" /> Unassign
            </Button>
            <Button variant="primary" @click="assignNewAccount(true)">
              <Lucide icon="UserPlus" class="w-4 h-4 mr-2" /> Assign New
            </Button>
            <Button variant="primary" @click="setModalCustomer(true)">
              <Lucide icon="User" class="w-4 h-4 mr-2" /> Manage Account
            </Button>
          </div>
        </div>
      </div>

      <div v-else>
        <div class="mt-2 bg-gray-100 p-2 mb-4 rounded dark:bg-gray-800">
          No account assigned to this order.
        </div>
        <Button variant="primary" @click="assignNewAccount(true)">
          <Lucide icon="UserPlus" class="w-4 h-4 mr-2" /> Assign Account
        </Button>
      </div>
    </div>
  </div>
  <SearchOrderAccount
    :add="assignAccountToOrder"
    v-if="accountListModal"
    :key="accountListModal ? 'true' : 'false'"
    :setModel="assignNewAccount"
    :modalShow="accountListModal"
  />
  <Confirmation
    v-model="accountConfirmationModal"
    buttonStringMain="Remove"
    subHeader="Do you want to unassign this account?"
    :setConfirmationModal="setOrderAccountDelete"
    :set-id="setAccountId"
    :functionToRun="unAssignAccountFromOrder"
  />
  <ShowCustomer
    v-if="order.account"
    :modal-show="modalCustomer"
    :set-modal="setModalCustomer"
    :customer="order.account"
  />
</template>
