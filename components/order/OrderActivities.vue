<script setup lang="ts">
import _ from "lodash";
import Table from "~/components/enigma/base-components/Table";

const props = defineProps({
  modelValue: {
    required: true,
    type: Object,
  },
});
let { modelValue: order } = toRefs(props);
const orderId = order.value.id;
const {
  getOrderActives,
} = useOrderActivities();


const dataLoaded = ref(false)
let activities: any = ref([]);
let lastPage: any = ref(1);
let currentPage: any = ref(1);


const fetchData = async () => {
  const result = await getOrderActives(orderId);
  activities = result.activities;
  lastPage = result.lastPage;
  currentPage = result.currentPage;
  dataLoaded.value = true
}
const refresh = async () => {
  await getOrderActives(orderId);
}
onMounted(async () => {
  await nextTick();
  await fetchData();
});

</script>

<template>
  <div class="p-2">
    <h3 class="mt-2 text-xl text-success font-semibold">Order Activity</h3>
    <div class="overflow-y-auto col-span-12 mt-2">
      <Table class="border-spacing-y-[10px] border-separate -mt-2">
        <Table.Thead variant="dark">
          <Table.Tr>
            <Table.Th class="whitespace-nowrap">DESCRIPTION</Table.Th>
            <Table.Th class="whitespace-nowrap">DATE</Table.Th>
            <Table.Th class="whitespace-nowrap">USER</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr v-if="!dataLoaded" class="intro-x">
            <Table.Td colspan="3" class="py-0 px-0">
              <TableLoading />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-if="activities.length == 0 && dataLoaded" class="intro-x">
            <Table.Td colspan="3" class="py-0 px-0">
              <AlertGray />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-for="orderActivity in activities">
            <Table.Td>
              {{ orderActivity.description }}
            </Table.Td>
            <Table.Td>
              {{ formatDateTime(orderActivity.created) }}
            </Table.Td>
            <Table.Td>
              {{ orderActivity.admin_user.name }}
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </div>
    <PaginationModal v-model="currentPage" v-if="dataLoaded" :getList="refresh" :numberOfPages="lastPage" />
  </div>
</template>
