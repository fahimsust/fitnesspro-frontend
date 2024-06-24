<script setup lang="ts">
import _ from "lodash";
import { toRefs } from "vue";
import Show from "~/components/address/Show.vue";
import Table from "~/components/enigma/base-components/Table";
import Lucide from "~/components/enigma/base-components/Lucide";
import { FormSwitch, FormSelect } from "~~/components/enigma/base-components/Form";
import EditAddress from "./EditAddress.vue";
import AddAddress from "./AddAddress.vue";
import IntSwitch from "../form/IntSwitch.vue";
import Button from "~/components/enigma/base-components/Button";

const props = defineProps({
  modelValue: {
    required: true,
    type: Object,
  },
});
let { modelValue: customer } = toRefs(props);
const modalShow = ref(false);
const accountAddress: any = ref({ id: 0 })
const setAddressModal = (addressValue: object) => {
  accountAddress.value = addressValue
  setModal(true)
};
const setModal = (value: boolean) => {
  modalShow.value = value
}

const showDeleted = ref(false)
const customerId = customer.value.id;
const { addressList, updateAccountAddress, deleteAccountAddress, retrieveAccountAddress } = useCustomerAddress();
const changeHide = async () => {
  showDeleted.value = !showDeleted.value
  await addressList(customerId, !showDeleted.value)
}
const addKey = ref(0)
const modalShowAdd = ref(false);
const setModalAdd = (value: boolean) => {
  addKey.value = addKey.value + 1
  modalShowAdd.value = value
}
const refreshData = async () => {
  await addressList(customerId, !showDeleted.value)
}
const changeStatus = async (accountAddress: any, value: boolean, id: number) => {
  let form = {
    status: value,
    is_billing: accountAddress.is_billing,
    is_shipping: accountAddress.is_shipping,
    ...accountAddress.address
  };
  await updateAccountAddress(form, id, true)
  await refreshData()
};
const updateData = async (accountAddress: any, fieldName: string, value: any) => {
  let form = {
    status: accountAddress.status,
    is_billing: accountAddress.is_billing,
    is_shipping: accountAddress.is_shipping,
    ...accountAddress.address
  };
  form[fieldName] = !value
  await updateAccountAddress(form, accountAddress.id, true)
  await refreshData()
}
let accountAddresses:any = ref([]);
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  accountAddresses = await addressList(customerId, !showDeleted.value)
  dataLoaded.value = true
});
</script>

<template>
  <div class="p-1">
    <div class="flex justify-between items-center">
      <!-- Button on the left -->
      <Button variant="primary" class="mr-2 mb-3 shadow-md" @click="setModalAdd(true)">
        Add Address
      </Button>

      <!-- Switch on the right -->
      <div class="flex items-center">
        <FormSwitch.Input type="checkbox" v-model="showDeleted" @click="changeHide()" class="mr-2" />
        <span :class="{ 'text-green-500': showDeleted, 'text-red-500': !showDeleted }">
          {{ showDeleted ? 'Hide Deleted Address' : 'Show Deleted Address' }}
        </span>
      </div>
    </div>

    <div class="overflow-y-auto col-span-12">
      <Table class="border-spacing-y-[10px] border-separate -mt-2 hover">
        <Table.Thead variant="dark">
          <Table.Tr>
            <Table.Th class="whitespace-nowrap">LABEL</Table.Th>
            <Table.Th class="whitespace-nowrap">ADDRESS</Table.Th>
            <Table.Th class="whitespace-nowrap">DEFAULT BILLING</Table.Th>
            <Table.Th class="whitespace-nowrap">DEFAULT SHIPPING</Table.Th>
            <Table.Th class="whitespace-nowrap">STATUS</Table.Th>
            <Table.Th class="whitespace-nowrap"></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr v-if="!dataLoaded" class="intro-x">
            <Table.Td colspan="6" class="py-0 px-0">
              <TableLoading />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-if="accountAddresses.length == 0 && dataLoaded" class="intro-x">
            <Table.Td colspan="6" class="py-0 px-0">
              <AlertGray />
            </Table.Td>
          </Table.Tr>
          <Table.Tr @click="() => { setAddressModal(accountAddress) }"
            :class="{ 'cursor-pointer': true, 'line-through': accountAddress.status == -1 ? true : false }"
            v-for="accountAddress in accountAddresses" :key="accountAddress.id" class="intro-x">
            <Table.Td>
              {{ accountAddress.address.label }}
            </Table.Td>
            <Table.Td>
              <div class="space-y-2">
                <div class="text-gray-600 font-medium">
                  {{ accountAddress.address.first_name }} {{ accountAddress.address.last_name }}
                </div>
                <div v-if="accountAddress.address.company" class="text-gray-500 text-sm">
                  {{ accountAddress.address.company }}
                </div>
              </div>

              <div class="text-gray-600 space-y-1">
                <div>
                  {{ accountAddress.address.address_1 }}
                </div>
                <div v-if="accountAddress.address.address_2">
                  {{ accountAddress.address.address_2 }}
                </div>
                <div>
                  {{ accountAddress.address.city }}{{ accountAddress.address.state_province ? ", " +
                    accountAddress.address.state_province.name : "" }} {{ accountAddress.address.postal_code }}
                </div>
                <div v-if="accountAddress.address.country" class="font-medium">
                  {{ accountAddress.address.country?.name }}
                </div>
              </div>
            </Table.Td>
            <Table.Td>
              <FormSwitch.Input type="checkbox" :key="accountAddress.is_billing" v-model="accountAddress.is_billing"
                @click="(event: any) => {
                  event.preventDefault();
                  updateData(accountAddress, 'is_billing', accountAddress.is_billing)
                  event.stopPropagation();
                }
                  " />
            </Table.Td>
            <Table.Td>
              <FormSwitch.Input type="checkbox" :key="accountAddress.is_shipping" v-model="accountAddress.is_shipping"
                @click="(event: any) => {
                  event.preventDefault();
                  updateData(accountAddress, 'is_shipping', accountAddress.is_shipping)
                  event.stopPropagation();
                }
                  " />
            </Table.Td>
            <Table.Td>
              <IntSwitch :key="accountAddress.status" :cat_id="accountAddress.id" v-model="accountAddress.status"
                :change-status="(value: any, id: any) => {
                  changeStatus(accountAddress, value, id)
                }" />
            </Table.Td>
            <Table.Td>
              <div class="flex items-center justify-center">
                <NuxtLink v-if="accountAddress.status >= 0" class="flex text-danger cursor-pointer" @click="(event) => {
                  event.preventDefault();
                  deleteAccountAddress(accountAddress.id, accountAddress.account_id, !showDeleted);
                  event.stopPropagation();
                }
                  ">
                  <Lucide icon="Trash2" class="w-4 h-4 mr-1" />
                  <span class="hidden">Delete</span>
                </NuxtLink>
                <NuxtLink v-if="accountAddress.status == -1" class="flex text-success cursor-pointer" @click="(event) => {
                  event.preventDefault();
                  retrieveAccountAddress(accountAddress.id, accountAddress.account_id, !showDeleted);
                  event.stopPropagation();
                }
                  ">
                  <Lucide icon="ArchiveRestore" class="w-4 h-4 mr-1" />
                  <span class="hidden">Restore</span>
                </NuxtLink>
              </div>
            </Table.Td>

          </Table.Tr>
        </Table.Tbody>
      </Table>
    </div>
  </div>
  <EditAddress v-if="accountAddress.id > 0" :key="accountAddress.id" v-model="accountAddress" :modalShow="modalShow"
    :setModal="setModal" :fetchList="refreshData" />

  <AddAddress :key="addKey" :modalShow="modalShowAdd" :setModal="setModalAdd" :fetchList="refreshData" />
</template>
