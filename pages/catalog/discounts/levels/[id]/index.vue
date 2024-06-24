<script lang="ts" setup>
import _ from "lodash";
import { Tab } from "~/components/enigma/base-components/Headless";
import Tabs from "~/components/tabs/Tabs.vue";
import Basic from "~/components/discount/level/Basic.vue";
import Products from "~/components/discount/level/Products.vue";

const route = useRoute();

definePageMeta({
  middleware: ["auth"],
  layout: "simple-menu-new",
});
const idParem = parseInt(route.params.id.toString());

useHead({
  title: "Edit Discount Level: " + useRuntimeConfig().public.company,
});
const { getDiscountLevel } = useDiscountLevel();
let discountLevel:any = ref({})

const tabList = [
  { title: "Info", description: "Edit Basic Information", icon: "Info" },
  { title: "Manage Products", description: "Update Discount Level Products", icon: "GanttChartSquare" },
];
const ready = ref(false)
onMounted(async () => {
  await nextTick();
  discountLevel = await getDiscountLevel(idParem);
  ready.value = true;
});
</script>
<template>
  <div class="mt-8">
    <div class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
      <h2 class="mt-2 mr-auto text-lg mb-3 font-medium intro-y">
        {{ discountLevel.name }}
      </h2>
    </div>
    <div class="col-span-12 lg:col-span-12">
      <!-- BEGIN: Post Content -->
      <div class="col-span-12 intro-y box xl:mt-5">
        <div  v-if="!ready">
          <div class="rounded-lg box intro-y lg:mt-14">
            <TableLoading />
          </div>
        </div>
        <Tab.Group class="intro-y box"  v-if="ready">
          <Tabs :tablist="tabList" />
          <Tab.Panels>
            <Tab.Panel class="p-0 md:p-5">
              <Basic v-model="discountLevel" />
            </Tab.Panel>
            <Tab.Panel class="p-0 md:p-5">
              <Products />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  </div>
</template>
