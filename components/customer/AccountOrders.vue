<script setup lang="ts">
import _ from "lodash";
import { toRefs } from "vue";
import Table from "~/components/enigma/base-components/Table";
import ShowOrder from "./ShowOrder.vue";

const props = defineProps({
  modelValue: {
    required: true,
    type: Object,
  },
});
let { modelValue: customer } = toRefs(props);
const customerId = customer.value.id;
const { accountOrderList } = useCustomerOrders();
const order = ref({id:0})
const modalShow = ref(false)
const setModal = (value:boolean) =>{
  modalShow.value = value   
}                        
const setOrderShowModal = (orderDetails:any)=>{                       
  order.value = orderDetails
  setModal(true)
}
let orders:any = ref([]);
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  orders = await accountOrderList(customerId)
  dataLoaded.value = true
});
</script>

<template>
  <div class="p-1">
    <div class="overflow-y-auto col-span-12">
      <Table class="border-spacing-y-[10px] border-separate -mt-2 hover">
        <Table.Thead variant="dark">
          <Table.Tr>
            <Table.Th class="whitespace-nowrap">ID</Table.Th>
            <Table.Th class="whitespace-nowrap">ORDER NO</Table.Th>
            <Table.Th class="whitespace-nowrap">CREATED</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr v-if="!dataLoaded" class="intro-x">
            <Table.Td colspan="3" class="py-0 px-0">
              <TableLoading />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-if="orders.length == 0 && dataLoaded" class="intro-x">
            <Table.Td colspan="3" class="py-0 px-0">
              <AlertGray />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-for="order in orders" :key="order.id" class="intro-x">
            <Table.Td>
              {{ order.id }}
            </Table.Td>
            <Table.Td class="cursor-pointer" @click="setOrderShowModal(order)">
              {{ order.order_no }}
            </Table.Td>
            <Table.Td>
              {{ formatDateTime(order.created_at) }}
            </Table.Td>

          </Table.Tr>
        </Table.Tbody>
      </Table>
    </div>
  </div>
  <ShowOrder v-if="order.id > 0" :modal-show="modalShow" :set-modal="setModal" :order_id="order.id" />
</template>
