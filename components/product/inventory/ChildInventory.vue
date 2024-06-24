<script setup>
import { Disclosure } from "~/components/enigma/base-components/Headless";
import Lucide from "~/components/enigma/base-components/Lucide";
import Tippy from "~/components/enigma/base-components/Tippy";
import InventorySetting from "~/components/product/inventory/InventorySetting.vue";
import DistributorInventory from "~/components/product/inventory/DistributorInventory.vue";
const props = defineProps({
  modelValue: {
    required: true,
    type: Object,
  },
});
const product = ref(props.modelValue);
</script>

<template>
  <Disclosure.Group variant="boxed">
    <Disclosure>
      <Disclosure.Button>
        <Tippy
          content="Edit Default Inventory"
          class="flex items-center font-bold text-md"
          aria-controls="content"
          aria-selected="true"
        >
          Default Inventory
        </Tippy>
      </Disclosure.Button>
      <Disclosure.Panel class="leading-relaxed text-slate-600 dark:text-slate-500">
        <InventorySetting v-model="product" />
      </Disclosure.Panel>
    </Disclosure>
    <Disclosure>
      <Disclosure.Button>
        <Tippy
          content="Update Distributor Inventory"
          class="flex items-center font-bold text-md"
          aria-controls="content"
          aria-selected="true"
        >
          Distributor Inventory
        </Tippy>
      </Disclosure.Button>
      <Disclosure.Panel class="leading-relaxed text-slate-600 dark:text-slate-500">
        <DistributorInventory v-model="product" />
      </Disclosure.Panel>
    </Disclosure>
  </Disclosure.Group>
</template>
