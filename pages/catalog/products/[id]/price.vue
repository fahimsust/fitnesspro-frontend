<script lang="ts" setup>
import ProductPrice from "~/components/product/price/ProductPrice.vue";
definePageMeta({
  middleware: ["auth"],
  layout: "edit-product",
});

useHead({
  title: "Edit Product Prices: " + useRuntimeConfig().public.company,
});

const { getProduct } = useProducts();
const route = useRoute();
const idParem = parseInt(route.params.id.toString());
const dataLoaded = ref(false)
let product:any = ref({})
onMounted(async()=>{
  product = await getProduct(idParem);
  dataLoaded.value = true
}) 
</script>
<template>
  <div v-if="!dataLoaded">
    <div class="rounded-lg box intro-y mt-3">
      <TableLoading />
    </div>
  </div> 
  <div class="col-span-12 lg:col-span-9" v-if="dataLoaded">
    <ProductPrice v-model="product" />
  </div>
</template>
