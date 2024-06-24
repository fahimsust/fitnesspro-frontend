<script lang="ts" setup>
import _ from "lodash";
import { Tab } from "~/components/enigma/base-components/Headless";
import Tabs from "~/components/tabs/Tabs.vue";
import Basic from "~/components/discount/Basic.vue";
import DiscountAdvantage from "~~/components/discount/DiscountAdvantage.vue";
import DiscountRules from "~~/components/discount/DiscountRules.vue";

const route = useRoute();

definePageMeta({
  middleware: ["auth"],
  layout: "simple-menu-new",
});
const idParam = parseInt(route.params.id.toString());

useHead({
  title: "Edit Discount: " + useRuntimeConfig().public.company,
});
const { getDiscount } = useDiscount();
let discount:any = ref({})
const ready = ref(false)

const tabList = [
  { title: "Info", description: "Edit Basic Information", icon: "Info" },
  { title: "Advantage", description: "Update Discount Advantage", icon: "PackagePlus" },
  { title: "Rules", description: "Update Discount Rules", icon: "PencilRuler" },
];
onMounted(async () => {
  await nextTick();
  discount = await getDiscount(idParam);
  ready.value = true;
});
</script>
<template>
  <div class="mt-8">
    <div class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
      <h2 class="mt-2 mr-auto text-lg mb-3 font-medium intro-y">
        {{ discount.name }} tt
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
        <Tab.Group class="intro-y box" v-if="ready">
          <Tabs :tablist="tabList" />
          <Tab.Panels>
            <Tab.Panel class="p-0 md:p-5">
              <Basic
                v-model="discount"
              />
            </Tab.Panel>
            <Tab.Panel class="p-0 md:p-5">
              <DiscountAdvantage v-model="discount" />
            </Tab.Panel>
            <Tab.Panel class="p-0 md:p-5">
              <DiscountRules v-model="discount" />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  </div>
</template>
