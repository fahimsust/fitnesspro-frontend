<script setup lang="ts">
import AddEditFaq from "~~/components/faq/AddEditFaq.vue";
import { useQueryParamStore } from "~/store/enigma/query-param";

definePageMeta({
  middleware: ["auth"],
  layout: "simple-menu-new",
});
useHead({
  title: "Create Faq: " + useRuntimeConfig().public.company,
});
useQueryParamStore().setQueryParam({})
</script>

<template>
  <div class="mt-8">
    <div class="col-span-12 lg:col-span-12">
      <h2 class="mt-2 mr-auto text-lg font-medium intro-y">Add Faq</h2>
    </div>
    <div class="col-span-12 lg:col-span-12">
      <!-- BEGIN: Post Content -->
      <div class="col-span-12 intro-y box p-5 xl:mt-5">
        <AddEditFaq />
      </div>
      <!-- END: Data List -->
    </div>
  </div>
</template>
