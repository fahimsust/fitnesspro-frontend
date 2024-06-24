<script setup>
import { computed } from "vue";
import Lucide from "~/components/enigma/base-components/Lucide";
const route = useRoute();
const className = (menuPosition) => {
  let currentMenu = 1;
  if (route.path.indexOf("referrals") != -1) {
    currentMenu = 2;
  }
  if (route.path.indexOf("payments") != -1) {
    currentMenu = 3;
  }
  return { active_link: currentMenu == menuPosition };
};
</script>
<template>
  <NuxtLink
    :to="'/affiliates/' + route.params.id"
    class="flex items-center px-3 py-2 rounded-md"
    :class="className(1)"
  >
    <Lucide icon="Newspaper" class="w-4 h-4 mr-2" /> Details
  </NuxtLink>
  <NuxtLink
    :to="'/affiliates/' + route.params.id + '/referrals'"
    class="flex items-center px-3 py-2 mt-2 rounded-md"
    :class="className(2)"
  >
    <Lucide icon="Star" class="w-4 h-4 mr-2" /> Referrals
  </NuxtLink>
  <NuxtLink
    :to="'/affiliates/' + route.params.id + '/payments'"
    class="flex items-center px-3 py-2 mt-2 rounded-md"
    :class="className(3)"
  >
    <Lucide icon="DollarSign" class="w-4 h-4 mr-2" /> Payments
  </NuxtLink>
</template>
<style lang="postcss" scoped>
.active_link {
  @apply font-medium bg-white/10 dark:bg-darkmode-700;
}
</style>
