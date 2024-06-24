<script lang="ts" setup>
import _ from "lodash";
import CustomerEdit from "~/components/customer/CustomerEdit.vue";

const route = useRoute();

definePageMeta({
  middleware: ["auth"],
  layout: "simple-menu-new",
});
const idParam = parseInt(route.params.id.toString());

useHead({
  title: "Edit Customer: " + useRuntimeConfig().public.company,
});
const { getCustomer } = useCustomers();
let customer:any = ref([]);
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  customer = await getCustomer(idParam);
  dataLoaded.value = true
});

</script>
<template>
  <div v-if="!dataLoaded">
    <div class="rounded-lg box intro-y mt-3">
      <TableLoading />
    </div>
  </div>
  <div class="mt-8" v-if="dataLoaded">
    <div class="col-span-12 lg:col-span-12">
      <!-- BEGIN: Post Content -->
      <div class="col-span-12 intro-y box xl:mt-5">
        <CustomerEdit v-model="customer" />
      </div>
    </div>
  </div>
</template>
