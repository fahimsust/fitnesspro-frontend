<script setup>
import { computed } from "vue";
import Lucide from "~/components/enigma/base-components/Lucide";
const route = useRoute();
const props = defineProps({
  modelValue: {
    required: true,
    type: Object,
  },
});
const product = ref(props.modelValue);
const className = (menuPosition) => {
  let currentMenu = 1;
  if (route.path.indexOf("price") != -1) {
    currentMenu = 2;
  }
  if (route.path.indexOf("accessories") != -1) {
    currentMenu = 3;
  }
  if (route.path.indexOf("related") != -1) {
    currentMenu = 4;
  }
  if (route.path.indexOf("inventory") != -1) {
    currentMenu = 5;
  }
  if (route.path.indexOf("forms") != -1) {
    currentMenu = 6;
  }
  if (route.path.indexOf("settings") != -1) {
    currentMenu = 7;
  }
  if (route.path.indexOf("options") != -1) {
    currentMenu = 8;
  }
  if (route.path.indexOf("image") != -1) {
    currentMenu = 9;
  }
  if (route.path.indexOf("attributes") != -1) {
    currentMenu = 10;
  }
  return { active_link: currentMenu == menuPosition };
};
</script>
<template>
  <NuxtLink
    :to="'/catalog/products/' + route.params.id"
    class="flex items-center px-3 py-2 rounded-md"
    :class="className(1)"
  >
    <Lucide icon="ShoppingBag" class="w-4 h-4 mr-2" /> Details
  </NuxtLink>
  <NuxtLink
    :to="'/catalog/products/' + route.params.id + '/attributes'"
    class="flex items-center px-3 py-2 mt-2 rounded-md"
    :class="className(10)"
  >
    <Lucide icon="Codesandbox" class="w-4 h-4 mr-2" /> Attributes
  </NuxtLink>
  <NuxtLink
    :to="'/catalog/products/' + route.params.id + '/image'"
    class="flex items-center px-3 py-2 mt-2 rounded-md"
    :class="className(9)"
  >
    <Lucide icon="Image" class="w-4 h-4 mr-2" /> Images
  </NuxtLink>
  <NuxtLink
    v-if="product.parent_product == null"
    :to="'/catalog/products/' + route.params.id + '/options'"
    class="flex items-center px-3 py-2 mt-2 rounded-md"
    :class="className(8)"
  >
    <Lucide icon="CheckCircle" class="w-4 h-4 mr-2" /> Options
  </NuxtLink>
  <NuxtLink
    :to="'/catalog/products/' + route.params.id + '/price'"
    class="flex items-center px-3 py-2 mt-2 rounded-md"
    :class="className(2)"
  >
    <Lucide icon="DollarSign" class="w-4 h-4 mr-2" /> Pricing
  </NuxtLink>
  <NuxtLink
    :to="'/catalog/products/' + route.params.id + '/inventory'"
    class="flex items-center px-3 py-2 mt-2 rounded-md"
    :class="className(5)"
  >
    <Lucide icon="Layers" class="w-4 h-4 mr-2" /> Inventory
  </NuxtLink>

  <NuxtLink
    :to="'/catalog/products/' + route.params.id + '/accessories'"
    class="flex items-center px-3 py-2 mt-2 rounded-md"
    :class="className(3)"
  >
    <Lucide icon="Database" class="w-4 h-4 mr-2" /> Accessories
  </NuxtLink>
  <NuxtLink
    :to="'/catalog/products/' + route.params.id + '/related'"
    class="flex items-center px-3 py-2 mt-2 rounded-md"
    :class="className(4)"
  >
    <Lucide icon="Package" class="w-4 h-4 mr-2" /> Related Products
  </NuxtLink>
  <NuxtLink
    :to="'/catalog/products/' + route.params.id + '/forms'"
    class="flex items-center px-3 py-2 mt-2 rounded-md"
    :class="className(6)"
  >
    <Lucide icon="Sidebar" class="w-4 h-4 mr-2" /> Custom Forms
  </NuxtLink>
  <NuxtLink
    :to="'/catalog/products/' + route.params.id + '/settings'"
    class="flex items-center px-3 py-2 mt-2 rounded-md"
    :class="className(7)"
  >
    <Lucide icon="Settings" class="w-4 h-4 mr-2" /> Site Settings
  </NuxtLink>
</template>
<style lang="postcss" scoped>
.active_link {
  @apply font-medium bg-white/10 dark:bg-darkmode-700;
}
</style>
