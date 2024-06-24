<script setup lang="ts">
import _ from "lodash";
import { toRefs } from "vue";
import Table from "~/components/enigma/base-components/Table";
import Lucide from "~/components/enigma/base-components/Lucide";
import CreateMembership from "./CreateMembership.vue";
import Button from "~/components/enigma/base-components/Button";
const route = useRoute();

const props = defineProps({
  modelValue: {
    required: true,
    type: Object,
  },
});
let { modelValue: customer } = toRefs(props);
const modalShow = ref(false);
const setModal = (value: boolean) => {
  modalShow.value = value;
};
const customerId = customer.value.id;
const {
  activeMemberShip,
  memberShipList,
  deleteConfirmationModal,
  cancelMembership,
  setCancelId,
} = useCustomerMembership();
const filteredMembers: any = ref([]);
const refreshData = async () => {
  await memberShipList(customerId);
  await activeMemberShip(customerId);
  filteredMembers.value = members.value.filter(
    (member: any) => member.id !== activeMember.value.id
  );
};
const setConfirmationModal = (value: boolean) => {
  deleteConfirmationModal.value = value;
};
const cancelAndRefresh = async () => {
  await cancelMembership();
  await refreshData();
};

let members: any = ref([]);
let activeMember: any = ref({});
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  members = await memberShipList(customerId)
  activeMember = await activeMemberShip(customerId)
  filteredMembers.value = members.value.filter(
    (member: any) => member.id !== activeMember.value.id
  );
  dataLoaded.value = true
});
</script>

<template>
  <div class="p-1">
    <Button variant="primary" class="mr-2 shadow-md" @click="setModal(true)">
      Start New Membership</Button>
    <h3 class="mt-2 mb-3 text-success font-semibold">Active Membership</h3>
    <div class="overflow-y-auto col-span-12">
      <Table class="border-spacing-y-[10px] border-separate -mt-2 hover">
        <Table.Thead variant="dark">
          <Table.Tr>
            <Table.Th class="whitespace-nowrap">ID</Table.Th>
            <Table.Th class="whitespace-nowrap">START</Table.Th>
            <Table.Th class="whitespace-nowrap">END</Table.Th>
            <Table.Th class="whitespace-nowrap">ORDER ID</Table.Th>
            <Table.Th class="whitespace-nowrap">PRICE</Table.Th>
            <Table.Th class="whitespace-nowrap">PAID</Table.Th>
            <Table.Th class="whitespace-nowrap"></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr v-if="!dataLoaded" class="intro-x">
            <Table.Td colspan="7" class="py-0 px-0">
              <TableLoading />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-if="!activeMember && dataLoaded" class="intro-x">
            <Table.Td colspan="7" class="py-0 px-0">
              <AlertGray />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-if="activeMember" :key="activeMember.id" class="intro-x">
            <Table.Td>
              {{ activeMember.id }}<br />
              {{ activeMember.product ? activeMember.product.title : "" }}
            </Table.Td>
            <Table.Td>
              {{ formatDateTime(activeMember.start_date) }}
            </Table.Td>
            <Table.Td>
              {{ formatDateTime(activeMember.end_date) }}
            </Table.Td>
            <Table.Td>
              {{ activeMember.order_id }}
            </Table.Td>
            <Table.Td>
              {{ activeMember.subscription_price }}
            </Table.Td>
            <Table.Td>
              {{ activeMember.amount_paid }}
            </Table.Td>
            <Table.Td>
              <div class="flex items-center justify-center">
                <NuxtLink
                  class="flex items-center justify-center bg-red-500 text-white px-4 py-2 border border-transparent rounded-md hover:bg-red-600 cursor-pointer"
                  @click="(event: any) => {
                    event.preventDefault();
                    setCancelId(activeMember.id);
                    setConfirmationModal(true);
                    event.stopPropagation();
                  }">
                  <Lucide icon="MinusCircle" class="w-4 h-4 mr-1" />
                  <span>Cancel</span>
                </NuxtLink>
              </div>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </div>

    <h3 class="mt-5 mb-3 text-success font-semibold">Membership History</h3>
    <div class="overflow-y-auto col-span-12">
      <Table class="border-spacing-y-[10px] border-separate -mt-2 hover">
        <Table.Thead variant="dark">
          <Table.Tr>
            <Table.Th class="whitespace-nowrap">ID</Table.Th>
            <Table.Th class="whitespace-nowrap">START</Table.Th>
            <Table.Th class="whitespace-nowrap">END</Table.Th>
            <Table.Th class="whitespace-nowrap">ORDER ID</Table.Th>
            <Table.Th class="whitespace-nowrap">PRICE</Table.Th>
            <Table.Th class="whitespace-nowrap">PAID</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr v-if="!dataLoaded" class="intro-x">
            <Table.Td colspan="7" class="py-0 px-0">
              <TableLoading />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-if="members.length == 0 && dataLoaded" class="intro-x">
            <Table.Td colspan="7" class="py-0 px-0">
              <AlertGray />
            </Table.Td>
          </Table.Tr>
          <Table.Tr class="intro-x" v-for="member in filteredMembers" :key="member.id">
            <Table.Td>
              {{ member.id }}<br />
              {{ member.product ? member.product.title : "" }}
            </Table.Td>
            <Table.Td>
              {{ formatDateTime(member.start_date) }}
            </Table.Td>
            <Table.Td>
              {{ formatDateTime(member.end_date) }}
            </Table.Td>
            <Table.Td>
              {{ member.order_id }}
            </Table.Td>
            <Table.Td>
              {{ member.subscription_price }}<br />
              {{
                member.cancelled != null
                  ? "Cancelled : " + formatDateTime(member.cancelled)
                  : ""
              }}
            </Table.Td>
            <Table.Td>
              {{ member.amount_paid }}
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </div>
  </div>
  <CreateMembership :modalShow="modalShow" v-model="customer" :setModal="setModal" :fetchList="refreshData" />
  <Confirmation buttonStringMain="Unsubscribe" v-model="deleteConfirmationModal"
    :setConfirmationModal="setConfirmationModal" :set-id="setCancelId"
    sub-header="Do you really want to cancel this subscription?" :functionToRun="cancelAndRefresh" />
</template>
