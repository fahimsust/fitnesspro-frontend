<script lang="ts" setup>
import _ from "lodash";
import { Tab } from "~/components/enigma/base-components/Headless";
import Subscription from "~/components/site/Subscription.vue";
import Checkout from "~/components/site/Checkout.vue"
import Tabs from "~/components/tabs/Tabs.vue";


definePageMeta({
  middleware: ["auth"],
  layout: "edit-site",
});

useHead({
  title: "Edit Site: " + useRuntimeConfig().public.company,
});
const tabList = [
  { title: "Checkout Options", description: "Checkout Payment Options", icon: "DollerSign" },
  { title: "Subscription Options", description: "Subscription Payment Options", icon: "DollerSign" },
];
</script>
<template>
  <div class="col-span-12 lg:col-span-9">
    <div class="col-span-12 intro-y xl:mt-5">
        <Tab.Group class="intro-y box">
          <Tabs :tablist="tabList" />
          <Tab.Panels>
            <Tab.Panel class="p-0 md:p-5">
              <Checkout />
            </Tab.Panel>
            <Tab.Panel class="p-0 md:p-5">
              <Subscription />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>    
    </div>
  </div>
</template>