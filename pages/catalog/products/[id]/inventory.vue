<script lang="ts" setup>
import Inventory from "~/components/product/inventory/Inventory.vue";

const route = useRoute();
const idParem = parseInt(route.params.id.toString());
definePageMeta({
  middleware: ["auth"],
  layout: "edit-product",
});

useHead({
  title: "Edit Product: " + useRuntimeConfig().public.company,
});
const { getProduct } = useProducts();
let product: any = ref({});
const tabList = [
  { title: "Settings", description: "Update Product Inventory", icon: "Settings" },
  { title: "Variants", description: "Update Variants Inventory", icon: "Menu" },
];
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  product = await getProduct(idParem);
  dataLoaded.value = true
})
</script>
<template>
  <div class="col-span-12 lg:col-span-9">
    <div v-if="!dataLoaded">
      <div class="rounded-lg box intro-y mt-3">
        <TableLoading />
      </div>
    </div>
    <!-- BEGIN: Post Content -->
    <div class="col-span-12 intro-y" v-if="dataLoaded">
      <Suspense>
        <Inventory v-model="product" />
      </Suspense>
    </div>
  </div>
</template>
