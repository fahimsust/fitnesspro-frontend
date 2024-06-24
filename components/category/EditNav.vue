<script setup>
import Lucide from "~/components/enigma/base-components/Lucide";
const route = useRoute();
const className = (menuPosition) => {
  let currentMenu = 1;
  if (route.path.indexOf("manage") != -1) {
    currentMenu = 2;
  }
  if (route.path.indexOf("attributes") != -1) {
    currentMenu = 3;
  }
  if (route.path.indexOf("pricing") != -1) {
    currentMenu = 4;
  }
  if (route.path.indexOf("brand") != -1) {
    currentMenu = 5;
  }
  if (route.path.indexOf("type") != -1) {
    currentMenu = 6;
  }
  if (route.path.indexOf("siteSettings") != -1) {
    currentMenu = 7;
  }
  if (route.path.indexOf("settings") != -1 && route.path.indexOf("siteSettings") == -1) {
    currentMenu = 8;
  }
  return { active_link: currentMenu == menuPosition };
};
</script>
<template>
  <NuxtLink
    :to="'/catalog/categories/' + route.params.id"
    class="flex items-center px-3 py-2 rounded-md"
    :class="className(1)"
  >
    <Lucide icon="ShoppingBag" class="w-4 h-4 mr-2" /> Details
  </NuxtLink>

  <NuxtLink
    :to="'/catalog/categories/' + route.params.id + '/brand'"
    class="flex items-center px-3 py-2 mt-2 rounded-md"
    :class="className(5)"
  >
    <Lucide icon="Codepen" class="w-4 h-4 mr-2" />Brands
  </NuxtLink>
  <NuxtLink
    :to="'/catalog/categories/' + route.params.id + '/type'"
    class="flex items-center px-3 py-2 mt-2 rounded-md"
    :class="className(6)"
  >
    <Lucide icon="Type" class="w-4 h-4 mr-2" />Types
  </NuxtLink>
  <NuxtLink
    :to="'/catalog/categories/' + route.params.id + '/attributes'"
    class="flex items-center px-3 py-2 mt-2 rounded-md"
    :class="className(3)"
  >
    <Lucide icon="AtSign" class="w-4 h-4 mr-2" />Attributes
  </NuxtLink>
  <NuxtLink
    :to="'/catalog/categories/' + route.params.id + '/pricing'"
    class="flex items-center px-3 py-2 mt-2 rounded-md"
    :class="className(4)"
  >
    <Lucide icon="DollarSign" class="w-4 h-4 mr-2" />Pricing
  </NuxtLink>
  <NuxtLink
    :to="'/catalog/categories/' + route.params.id + '/manage'"
    class="flex items-center px-3 py-2 mt-2 rounded-md"
    :class="className(2)"
  >
    <Lucide icon="ShoppingBag" class="w-4 h-4 mr-2" />Products
  </NuxtLink>
  <NuxtLink
    :to="'/catalog/categories/' + route.params.id + '/siteSettings'"
    class="flex items-center px-3 py-2 mt-2 rounded-md"
    :class="className(7)"
  >
    <Lucide icon="Settings" class="w-4 h-4 mr-2" /> Settings
  </NuxtLink>
  <!-- <NuxtLink
    :to="'/catalog/categories/' + route.params.id + '/settings'"
    class="flex items-center px-3 py-2 mt-2 rounded-md"
    :class="className(8)"
  >
    <Lucide icon="Settings" class="w-4 h-4 mr-2" /> Settings
  </NuxtLink> -->
</template>
<style lang="postcss" scoped>
.active_link {
  @apply font-medium bg-white/10 dark:bg-darkmode-700;
}
</style>
