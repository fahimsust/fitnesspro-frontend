<script lang="ts" setup>
import _ from "lodash";
import { ref } from "vue";
import Table from "~/components/enigma/base-components/Table";
import Button from "~/components/enigma/base-components/Button";
import Lucide from "~/components/enigma/base-components/Lucide";
import AddSubscriptionPayment from "~~/components/site/AddSubscriptionPayment.vue";

const {
  getSiteSubscriptionPaymentMethods,
  deleteSiteSubscriptionPaymentMethod,
  deleteConfirmationModal,
  setArchiveId,
} = useSitePaymentMethodSubscription();
const route = useRoute();
const idParem = parseInt(route.params.id.toString());

const removeSubscriptionPaymentMethod = () => {
  deleteSiteSubscriptionPaymentMethod(idParem);
};
const setConfirmationModal = (value: boolean) => {
  deleteConfirmationModal.value = value;
};
const modalShow = ref(false);
const setModal = (value: boolean) => {
  modalShow.value = value;
};

const refresh = async () => {
  await getSiteSubscriptionPaymentMethods(idParem);
};
let subscriptionPaymentMethods: any = ref([])
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  subscriptionPaymentMethods = await getSiteSubscriptionPaymentMethods(idParem);
  dataLoaded.value = true
})
</script>

<template>
  <div class="p-1">
    <Button @click="() => setModal(true)" variant="primary" class="mr-2 shadow-md">
      Add Payment Method
    </Button>

    <div class="overflow-x-auto">
      <Table class="border-spacing-y-[10px] border-separate mt-2 hover">
        <Table.Thead variant="dark">
          <Table.Tr>
            <Table.Th class="whitespace-nowrap">Payment Account</Table.Th>
            <Table.Th class="whitespace-nowrap">Payment Method</Table.Th>
            <Table.Th class="whitespace-nowrap text-center"></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr v-if="!dataLoaded" class="intro-x">
            <Table.Td colspan="3" class="py-0 px-0">
              <TableLoading />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-if="subscriptionPaymentMethods.length == 0 && dataLoaded" class="intro-x">
            <Table.Td colspan="3" class="py-0 px-0">
              <AlertGray />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-for="subscriptionPaymentMethod in subscriptionPaymentMethods" :key="subscriptionPaymentMethod.id"
            class="intro-x">
            <Table.Td>
              <div v-if="subscriptionPaymentMethod.payment_account">
                {{ subscriptionPaymentMethod.payment_account.gateway.name }}: {{ subscriptionPaymentMethod.payment_account.name }}
              </div>
            </Table.Td>
            <Table.Td>
              {{ subscriptionPaymentMethod.payment_method.name }}
            </Table.Td>

            <Table.Td>
              <div class="flex items-center justify-center">
                <NuxtLink class="flex text-danger text-center cursor-pointer" @click="(event) => {
                    event.preventDefault();
                    setArchiveId(subscriptionPaymentMethod.payment_method.id, subscriptionPaymentMethod.payment_account.id);
                    setConfirmationModal(true);
                  }
                  ">
                  <Lucide icon="Trash2" class="w-4 h-4 mr-1" />
                  <span class="hidden">Remove</span>
                </NuxtLink>
              </div>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </div>
  </div>
  <AddSubscriptionPayment :refresh="refresh" :modal-show="modalShow" :set-modal="setModal" />
  <Confirmation v-model="deleteConfirmationModal" buttonStringMain="Remove"
    subHeader="Do you want to remove this payment method?" :setConfirmationModal="setConfirmationModal"
    :set-id="setArchiveId" :functionToRun="removeSubscriptionPaymentMethod" />
</template>
