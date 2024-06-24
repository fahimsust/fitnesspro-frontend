<script setup lang="ts">
import _ from "lodash";
import Table from "~/components/enigma/base-components/Table";
import Button from "~/components/enigma/base-components/Button";

const props = defineProps({
  modelValue: {
    required: true,
    type: Object,
  },
});
let { modelValue: order } = toRefs(props);
const orderId:any = order.value.id;
const {
  getOrderTransactions,
} = useOrderTransactions();

let transactions:any = ref([]);
const dataLoaded = ref(false)
const fetchData = async () => {
  transactions = await getOrderTransactions(orderId);
  dataLoaded.value = true
}
onMounted(async () => {
  await nextTick();
  await fetchData();
});

</script>

<template>
  <div class="p-2">
    <Button variant="primary" class="mr-2 mt-2 shadow-md" @click="()=>{}">Add Charge</Button>
    <h3 class="mt-2 text-xl text-success font-semibold">Order Transactions</h3>
    <div class="overflow-y-auto col-span-12 mt-2">
      <Table class="border-spacing-y-[10px] border-separate -mt-2">
        <Table.Thead variant="dark">
          <Table.Tr>
            <Table.Th class="whitespace-nowrap">ACCOUNT</Table.Th>
            <Table.Th class="whitespace-nowrap">TRANSACTION NO.</Table.Th>
            <Table.Th class="whitespace-nowrap">AMOUNT</Table.Th>
            <Table.Th class="whitespace-nowrap">NOTE</Table.Th>
            <Table.Th class="whitespace-nowrap">DATE</Table.Th>
            <Table.Th class="whitespace-nowrap">STATUS</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr v-if="!dataLoaded" class="intro-x">
            <Table.Td colspan="6" class="py-0 px-0">
              <TableLoading />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-if="transactions.length == 0 && dataLoaded" class="intro-x">
            <Table.Td colspan="6" class="py-0 px-0">
              <AlertGray />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-for="transaction in transactions">
            <Table.Td>
              {{ transaction.payment_account.name }}
            </Table.Td>
            <Table.Td>
              {{ transaction.transaction_no }}
            </Table.Td>
            <Table.Td>
              {{ transaction.amount }}
            </Table.Td>
            <Table.Td>
              {{ transaction.notes }}
            </Table.Td>
            <Table.Td>
              {{ formatDateTime(transaction.created_at) }}
            </Table.Td>
            <Table.Td>
              {{ transaction.status == 1?"Authorized":transaction.status == 2?"Captured":"Voided" }}
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </div>
  </div>
</template>
