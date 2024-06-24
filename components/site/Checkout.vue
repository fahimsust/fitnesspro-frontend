<script lang="ts" setup>
import _ from "lodash";
import { ref } from "vue";
import Table from "~/components/enigma/base-components/Table";
import Button from "~/components/enigma/base-components/Button";
import Lucide from "~/components/enigma/base-components/Lucide";
import AddCheckoutPayment from "~/components/site/AddCheckoutPayment.vue"

const {
  getSiteCheckoutPaymentMethods,
  deleteSiteCheckoutPaymentMethod,
  deleteConfirmationModal,
  editCheckoutSitePaymentMethod,
  setArchiveId,
} = useSitePaymentMethodCheckout();
const route = useRoute();
const idParem = parseInt(route.params.id.toString());

const removeCheckoutPaymentMethod = () => {
  deleteSiteCheckoutPaymentMethod(idParem);
};
const setConfirmationModal = (value: boolean) => {
  deleteConfirmationModal.value = value;
};
const keyModal = ref(0)
const modalShow = ref(false);
const setModal = (value: boolean) => {
  keyModal.value = keyModal.value + 1
  modalShow.value = value;
};

const refresh = async () => {
  await getSiteCheckoutPaymentMethods(idParem);
};
const modifyFee = async (obj: any) => {
  if (is_change.value == true) {
    let form = reactive({
      payment_method_id: obj.payment_method_id,
      gateway_account_id: obj.gateway_account_id,
      fee: obj.fee,
    });
    await editCheckoutSitePaymentMethod(form, idParem);
    is_change.value = false;
  }
};
const is_change = ref(false);
let checkoutPaymentMethods: any = ref([]);
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  checkoutPaymentMethods = await getSiteCheckoutPaymentMethods(idParem);
  dataLoaded.value = true
})
</script>

<template>
  <div class="p-1">
    <Button @click="() => setModal(true)" variant="primary" class="mr-2 shadow-md">
      Add Payment Method
    </Button>

    <div class="overflow-x-auto" v-if="checkoutPaymentMethods">
      <Table class="border-spacing-y-[10px] border-separate mt-2 hover">
        <Table.Thead variant="dark">
          <Table.Tr>
            <Table.Th class="whitespace-nowrap">Payment Account</Table.Th>
            <Table.Th class="whitespace-nowrap">Payment Method</Table.Th>
            <Table.Th class="whitespace-nowrap">Fee</Table.Th>
            <Table.Th class="whitespace-nowrap text-center"></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr v-if="!dataLoaded" class="intro-x">
            <Table.Td colspan="4" class="py-0 px-0">
              <TableLoading />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-if="checkoutPaymentMethods.length == 0 && dataLoaded" class="intro-x">
            <Table.Td colspan="4" class="py-0 px-0">
              <AlertGray />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-for="checkoutPaymentMethod in checkoutPaymentMethods" :key="checkoutPaymentMethods.id"
            class="intro-x">
            <Table.Td>
              <div v-if="checkoutPaymentMethod.payment_account">
                {{ checkoutPaymentMethod.payment_account.gateway.name }}: {{
                  checkoutPaymentMethod.payment_account.name }}
              </div>
            </Table.Td>
            <Table.Td>
              {{ checkoutPaymentMethod.payment_method.name }}
            </Table.Td>
            <Table.Td>
              <input class="input_class" type="text" v-model="checkoutPaymentMethod.fee"
                @blur="modifyFee(checkoutPaymentMethod)" @change="is_change = true" />
            </Table.Td>

            <Table.Td>
              <div class="flex items-center justify-center">
                <NuxtLink class="flex text-danger text-center cursor-pointer" @click="(event) => {
                  event.preventDefault();
                  setArchiveId(checkoutPaymentMethod.payment_method.id, checkoutPaymentMethod.payment_account.id);
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
  <AddCheckoutPayment :key="keyModal" :refresh="refresh" :modal-show="modalShow" :set-modal="setModal" />
  <Confirmation v-model="deleteConfirmationModal" buttonStringMain="Remove"
    subHeader="Do you want to remove this payment method?" :setConfirmationModal="setConfirmationModal"
    :set-id="setArchiveId" :functionToRun="removeCheckoutPaymentMethod" />
</template>
