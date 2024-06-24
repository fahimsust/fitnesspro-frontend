<script setup>
import { Tab } from "~/components/enigma/base-components/Headless";
import Tabs from "~/components/tabs/Tabs.vue";
import InventorySetting from "~/components/product/inventory/InventorySetting.vue";
import InventoryVarriant from "~/components/product/inventory/InventoryVarriant.vue";
import { toRefs } from "vue";

const { variantList } = useProductVariant();

const props = defineProps({
  modelValue: {
    required: true,
    type: Object,
  },
});
const product = ref(props.modelValue);
const tabList = [
  { title: "Variants", description: "Manage Variants Inventory", icon: "Menu" },
  { title: "Settings", description: "Update Default Inventory", icon: "Setting" },
];
</script>

<template>
  <div class="col-span-12 intro-y box xl:mt-5" v-if="product.parent == null">
    <InventorySetting v-model="product" class="p-8" v-if="product.options_count == 0" />
    <Tab.Group class="intro-y box" v-if="product.options_count > 0">
      <Tabs :tablist="tabList" />
      <Tab.Panels>
        <Tab.Panel class="p-5">
          <InventoryVarriant v-model="product" />
        </Tab.Panel>
        <Tab.Panel class="p-5">
          <InventorySetting v-model="product" />
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  </div>
</template>
