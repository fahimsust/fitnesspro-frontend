<script setup lang="ts">
import AddEditFaqCategory from '~/components/faqCategory/AddEditFaqCategory.vue';
import { useQueryParamStore } from "~/store/enigma/query-param";


definePageMeta({
  middleware: ["auth"],
  layout: "simple-menu-new",
});
useHead({
  title: "Create Element: " + useRuntimeConfig().public.company,
});
useQueryParamStore().setQueryParam({})
</script>

<template>
  <div class="mt-8">
    <div class="col-span-12 lg:col-span-12">
      <h2 class="mt-2 mr-auto text-lg font-medium intro-y">Add FAQ Category</h2>
    </div>
    <div class="col-span-12 lg:col-span-12">
      <!-- BEGIN: Post Content -->
      <div class="col-span-12 intro-y box p-5 xl:mt-5">
        <AddEditFaqCategory />
      </div>
      <!-- END: Data List -->
    </div>
  </div>
</template>
