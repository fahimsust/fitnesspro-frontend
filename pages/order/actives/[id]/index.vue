<script lang="ts" setup>
import _ from "lodash";
import OrderEdit from "~/components/order/OrderEdit.vue";

const route = useRoute();

definePageMeta({
  middleware: ["auth"],
  layout: "simple-menu-new",
});
const idParam = parseInt(route.params.id.toString());

useHead({
  title: "Order Details: " + useRuntimeConfig().public.company,
});
const dataLoaded = ref(false)
let order:any = ref({})
const { getOrder } = useCompletedOrders();
//const order = await getOrder(idParam);
const refresh = async()=>{
  order = await getOrder(idParam);
}
onMounted(async () => {
  await nextTick();
  await refresh();
  dataLoaded.value = true
});

</script>
<template>
  <div class="mt-8">
    <div class="col-span-12 lg:col-span-12">
      <!-- BEGIN: Post Content -->
      <div class="col-span-12 intro-y box xl:mt-5">
        <TableLoading v-if="!dataLoaded" />
        <OrderEdit v-model="order" v-if="dataLoaded"  :refresh="refresh" />
      </div>
    </div>
  </div>
</template>
