<script setup lang="ts">
import _ from "lodash";
import Table from "~/components/enigma/base-components/Table";
import Button from "~/components/enigma/base-components/Button";
import SearchReferral from "./SearchReferral.vue";
import Lucide from "../../components/enigma/base-components/Lucide";

const props = defineProps({
  modelValue: {
    required: true,
    type: Object,
  },
});
const router = useRouter();
let { modelValue: order } = toRefs(props);
const orderId:any = order.value.id;
const {
  getOrderAffiliate,
  createOrderAffiliate,
  removeOrderAffiliate,
  affiliateConfirmationModal,
  errors,
  loading
} = useOrderAffiliate();

const { getOrder } = useCompletedOrders();
const refresh = async()=>{
  await getOrderAffiliate(orderId);
  order = await getOrder(orderId);
}
const removeAffiliate = async(id:number)=>{
  await removeOrderAffiliate(orderId);
  await refresh();
}
const addReferral = async(id:number)=>{
  const form = reactive({
    affiliate_id:id
  });
  await createOrderAffiliate(form,orderId);
  await refresh();
}
const setConfirmationModal = (value: boolean) => {
  affiliateConfirmationModal.value = value;
};
const modalShow = ref(false);
const setModel = (value: boolean) => {
  modalShow.value = value;
};
const show = (value:any)=>{
  const referralUrl = "/affiliates/referrals/?keyword=" + value.order_no;
  window.open(referralUrl, '_blank');
}

const dataLoaded = ref(false)
let affiliates: any = ref([]);
let lastPage: any = ref(1);
let currentPage: any = ref(1);


const fetchData = async () => {
  const result = await getOrderAffiliate(orderId);
  affiliates = result.affiliates;
  lastPage = result.lastPage;
  currentPage = result.currentPage;
  dataLoaded.value = true
}
onMounted(async () => {
  await nextTick();
  await fetchData();
});

</script>

<template>
  <div class="p-2">
    <h2  v-if="order.affiliate" class="text-lg font-medium intro-y">Assigned Affiliate</h2>
    <Table class="border-spacing-y-[10px] border-separate -mt-2" v-if="order.affiliate">
        <Table.Thead variant="dark">
          <Table.Tr>
            <Table.Th class="whitespace-nowrap">NAME</Table.Th>
            <Table.Th class="whitespace-nowrap">EMAIL</Table.Th>
            <Table.Th class="whitespace-nowrap"></Table.Th>         
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td>
              {{ order.affiliate.name }}          
            </Table.Td>
            <Table.Td>
              {{ order.affiliate.email }}
            </Table.Td>
            <Table.Td>
              <div class="flex items-center justify-center">
                <NuxtLink
                  class="flex items-center text-danger cursor-pointer"
                  @click="
                    (event) => {
                      event.preventDefault();
                      setConfirmationModal(true);
                      event.stopPropagation();
                    }
                  "
                >
                  <Lucide icon="Trash2" class="w-4 h-4 mr-1" />
                  <span class="hidden">Unassign</span>
                </NuxtLink>
                </div>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
    </Table>
    <Button variant="primary" class="mr-2 mt-2 shadow-md" v-if="!order.affiliate" @click="setModel(true)">
      Assign an affiliate</Button>
    <div class="overflow-y-auto col-span-12 mt-2">
      <h2  v-if="order.affiliate" class="text-lg font-medium intro-y">Referrals</h2>
      <Table class="border-spacing-y-[10px] border-separate -mt-2">
        <Table.Thead variant="dark">
          <Table.Tr>
            <Table.Th class="whitespace-nowrap">NAME</Table.Th>
            <Table.Th class="whitespace-nowrap">AMOUNT</Table.Th>
            <Table.Th class="whitespace-nowrap">STATUS</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr v-if="!dataLoaded" class="intro-x">
            <Table.Td colspan="3" class="py-0 px-0">
              <TableLoading />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-if="affiliates.length == 0 && dataLoaded" class="intro-x">
            <Table.Td colspan="3" class="py-0 px-0">
              <AlertGray />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-for="affiliate in affiliates" class="cursor-pointer" @click="()=>{
            show(affiliate.order) 
          }">
            <Table.Td>
              {{ affiliate.affiliate.name }}
            </Table.Td>
            <Table.Td>
              {{ affiliate.amount }}
            </Table.Td>
            <Table.Td>
              {{ affiliate.status.name }}
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </div>
    <PaginationModal v-model="currentPage" v-if="dataLoaded" :getList="refresh" :numberOfPages="lastPage" />
  </div>
  <SearchReferral :modal-show="modalShow" :set-model="setModel" :add="addReferral" />
  <Confirmation
    v-model="affiliateConfirmationModal"
    :setConfirmationModal="setConfirmationModal"
    :set-id="()=>{}"
    :functionToRun="removeAffiliate"
    buttonStringMain="Unassign"
  />
</template>
