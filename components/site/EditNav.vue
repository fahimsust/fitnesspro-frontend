<script setup>
import Lucide from "~/components/enigma/base-components/Lucide";
const route = useRoute();
const className = (menuPosition) => {
  let currentMenu = 1;
  if (route.path.indexOf("siteSetting") != -1) {
    currentMenu = 2;
  }
  if (route.path.indexOf("paymentMethod") != -1) {
    currentMenu = 3;
  }
  if (route.path.indexOf("offlineMessage") != -1) {
    currentMenu = 5;
  }
  if (route.path.indexOf("category") != -1) {
    currentMenu = 6;
  }
  if (route.path.indexOf("messageTemplate") != -1) {
    currentMenu = 7;
  }
  if (route.path.indexOf("language") != -1) {
    currentMenu = 8;
  }
  if (route.path.indexOf("layouts") != -1) {
    currentMenu = 9;
  }
  if (route.path.indexOf("modules") != -1) {
    currentMenu = 10;
  }
  if (route.path.indexOf("currency") != -1) {
    currentMenu = 11;
  }
  return { active_link: currentMenu == menuPosition };
};
</script>
<template>
  <NuxtLink
    :to="'/settings/sites/' + route.params.id"
    class="flex items-center px-3 py-2 rounded-md"
    :class="className(1)"
  >
    <Lucide icon="Newspaper" class="w-4 h-4 mr-2" /> Details
  </NuxtLink>
  <NuxtLink
    :to="'/settings/sites/' + route.params.id + '/offlineMessage'"
    class="flex items-center px-3 py-2 mt-2 rounded-md"
    :class="className(5)"
  >
    <Lucide icon="Cast" class="w-4 h-4 mr-2" />Offline
  </NuxtLink>
  <NuxtLink
    :to="'/settings/sites/' + route.params.id + '/siteSetting'"
    class="flex items-center px-3 py-2 mt-2 rounded-md"
    :class="className(2)"
  >
    <Lucide icon="Settings" class="w-4 h-4 mr-2" /> Settings
  </NuxtLink>
  <NuxtLink
    :to="'/settings/sites/' + route.params.id + '/paymentMethod'"
    class="flex items-center px-3 py-2 mt-2 rounded-md"
    :class="className(3)"
  >
    <Lucide icon="DollarSign" class="w-4 h-4 mr-2" />Payments Methods
  </NuxtLink>
  <NuxtLink
    :to="'/settings/sites/' + route.params.id + '/category'"
    class="flex items-center px-3 py-2 mt-2 rounded-md"
    :class="className(6)"
  >
    <Lucide icon="Grid" class="w-4 h-4 mr-2" />Categories
  </NuxtLink>
  <NuxtLink
    :to="'/settings/sites/' + route.params.id + '/messageTemplate'"
    class="flex items-center px-3 py-2 mt-2 rounded-md"
    :class="className(7)"
  >
    <Lucide icon="Square" class="w-4 h-4 mr-2" />Message Template
  </NuxtLink>
  <NuxtLink
    :to="'/settings/sites/' + route.params.id + '/language'"
    class="flex items-center px-3 py-2 mt-2 rounded-md"
    :class="className(8)"
  >
    <Lucide icon="Flag" class="w-4 h-4 mr-2" />Languages
  </NuxtLink>
  <NuxtLink
    :to="'/settings/sites/' + route.params.id + '/currency'"
    class="flex items-center px-3 py-2 mt-2 rounded-md"
    :class="className(11)"
  >
    <Lucide icon="Globe" class="w-4 h-4 mr-2" />Currency
  </NuxtLink>
  <NuxtLink
    :to="'/settings/sites/' + route.params.id + '/layouts'"
    class="flex items-center px-3 py-2 mt-2 rounded-md"
    :class="className(9)"
  >
    <Lucide icon="Layout" class="w-4 h-4 mr-2" />Layouts
  </NuxtLink>
  <NuxtLink
    :to="'/settings/sites/' + route.params.id + '/modules'"
    class="flex items-center px-3 py-2 mt-2 rounded-md"
    :class="className(10)"
  >
    <Lucide icon="Codepen" class="w-4 h-4 mr-2" />Modules
  </NuxtLink>
</template>
<style lang="postcss" scoped>
.active_link {
  @apply font-medium bg-white/10 dark:bg-darkmode-700;
}
</style>
