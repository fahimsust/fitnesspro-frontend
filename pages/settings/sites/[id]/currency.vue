<script lang="ts" setup>
import _ from "lodash";
import SiteCurrency from "~/components/site/SiteCurrency.vue";
definePageMeta({
  middleware: ["auth"],
  layout: "edit-site",
});
useHead({
  title: "Edit Site: " + useRuntimeConfig().public.company,
});
</script>
<template>
  <div class="col-span-12 lg:col-span-9">
    <div class="col-span-12 intro-y">
      <div class="p-5 intro-y box xl:mt-5">
        <SiteCurrency />
      </div>
    </div>
  </div>
</template>