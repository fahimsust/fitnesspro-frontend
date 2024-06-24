<script lang="ts" setup>
import ProductImage from "~/components/product/ProductImage.vue";

definePageMeta({
  middleware: ["auth"],
  layout: "edit-product",
});

useHead({
  title: "Edit Product Images: " + useRuntimeConfig().public.company,
});

const { getProduct } = useProducts();
const route = useRoute();
const idParem = parseInt(route.params.id.toString());
let product:any = ref({})
const dataLoaded = ref(false)
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
    <ProductImage v-model="product" />
  </div>
</template>
