<script lang="ts" setup>
import featured from "~~/components/category/Featured.vue";
import hide from "~~/components/category/Hide.vue";
import show from "~~/components/category/Show.vue";
import Tabs from "~~/components/tabs/Tabs.vue";
import { Tab } from "~/components/enigma/base-components/Headless";

definePageMeta({
  middleware: ["auth"],
  layout: "edit-category",
});
useHead({
  title: "Manage Featured Product: " + useRuntimeConfig().public.company,
});
const tabList = [
  { title: "Feature", description: "Add/Delete Featured Product", icon: "Star" },
  {
    title: "Show",
    description: "Add/Remove From Show Product",
    icon: "Eye",
  },
  { title: "Hide", description: "Add/Remove From Hide Product", icon: "EyeOff" },
];
</script>
<template>
  <div class="col-span-12 lg:col-span-9">
    <!-- BEGIN: Post Content -->
    <div class="col-span-12 intro-y box md:mt-5">
      <Tab.Group class="intro-y box">
        <Tabs :tablist="tabList" />
        <Tab.Panels>
          <Tab.Panel class="p-0 md:p-5">
            <featured />
          </Tab.Panel>
        </Tab.Panels>
        <Tab.Panels>
          <Tab.Panel class="p-0 md:p-5">
            <show />
          </Tab.Panel>
        </Tab.Panels>
        <Tab.Panels>
          <Tab.Panel class="p-0 md:p-5">
            <hide />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  </div>
</template>
