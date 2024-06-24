<script lang="ts" setup>
import { Tab } from "~/components/enigma/base-components/Headless";
import Tabs from "~/components/tabs/Tabs.vue";
import AccessoryField from "~/components/product/accessory/AccessoryField.vue";
import ProductAccessory from "~/components/product/accessory/ProductAccessory.vue";

definePageMeta({
  middleware: ["auth"],
  layout: "edit-product",
});

useHead({
  title: "Manage Product Accessory: " + useRuntimeConfig().public.company,
});
const tabList = [
  {
    title: "Standard",
    description: "Manage Product Accessory",
    icon: "BoxIcon",
  },
  {
    title: "Fields",
    description: "Manage Accessory Fields",
    icon: "LayoutIcon",
  },
];
</script>
<template>
  <div class="col-span-12 lg:col-span-9">
    <!-- BEGIN: Post Content -->
    <div class="col-span-12 intro-y">
      <div class="px-5 intro-y xl:mt-5">
        <Tab.Group class="intro-y box">
          <Tabs :tablist="tabList" />
          <Tab.Panels>
            <Tab.Panel class="p-0 md:p-5">
              <ProductAccessory />
            </Tab.Panel>
            <Tab.Panel class="p-0 md:p-5">
              <AccessoryField />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  </div>
</template>
