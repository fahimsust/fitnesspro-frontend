<script setup lang="ts">
import Table from "~/components/enigma/base-components/Table";
import Lucide from "~/components/enigma/base-components/Lucide";
import { FormSwitch, FormSelect } from "~/components/enigma/base-components/Form";
import { ref, toRefs } from "vue";
const props = defineProps({
  price: {
    required: true,
    type: Object,
  },
  setValue: {
    required: true,
    type: Function,
  },
  setPrice: {
    required: true,
    type: Function,
  },
});
const { setValue, price, setPrice } = toRefs(props);
const modifyPrice = (fieldName: string, value: any, priceObj: any) => {
  if (is_change.value == true) {
    setValue.value(fieldName, value, priceObj);
    is_change.value = false;
  }
};
const is_change = ref(false);
const is_hovering = ref(false);
</script>
<template>
  <Table.Tr
    class="intro-x py-2"
    :class="{ 'bg-primary': is_hovering, 'text-white': is_hovering }"
    @mouseenter="is_hovering = true"
    @mouseleave="is_hovering = false"
  >
    <Table.Td colspan="9" class="px-5 border-b-0">
      <b>({{ price.product.id }}) {{ price.product.title }}</b>
    </Table.Td>
  </Table.Tr>
  <Table.Tr
    class="intro-x py-2"
    :class="{ 'bg-primary': is_hovering, 'text-white': is_hovering }"
    @mouseenter="is_hovering = true"
    @mouseleave="is_hovering = false"
  >
    <Table.Td class="py-0 px-5 pb-3">
      {{ price.site ? price.site.name : "" }}
    </Table.Td>
    <Table.Td class="py-0 px-5 pb-3 text-black">
      <input
        class="input_class"
        type="text"
        v-model="price.price_reg"
        @blur="modifyPrice('price_reg', ($event.target as HTMLInputElement).value, price)"
        @change="is_change = true"
      />
    </Table.Td>
    <Table.Td class="py-0 px-5 pb-3 text-black">
      <input
        class="input_class"
        type="text"
        v-model="price.price_sale"
        @blur="modifyPrice('price_sale', ($event.target as HTMLInputElement).value, price)"
        @change="is_change = true"
      />
    </Table.Td>
    <Table.Td class="py-0 px-5 pb-3">
      <FormSwitch>
        <FormSwitch.Input
          type="checkbox"
          id="onsale"
          v-model="price.onsale"
          @click="setValue('onsale', ($event.target as HTMLInputElement).value, price)"
        />
      </FormSwitch>
    </Table.Td>

    <Table.Td class="py-0 px-5 pb-3">
      <FormSwitch>
        <FormSwitch.Input
          type="checkbox"
          id="status"
          v-model="price.status"
          @click="setValue('status', ($event.target as HTMLInputElement).value, price)"
        />
      </FormSwitch>
    </Table.Td>
    <Table.Td class="py-0 px-5 pb-3">
      <NuxtLink
        class="flex cursor-pointer"
        :class="{ 'text-white': is_hovering, 'text-danger': !is_hovering }"
        @click="
          (_) => {
            setPrice(price, true);
          }
        "
      >
        <Lucide icon="Settings" class="w-4 h-4 mr-1" />
        <span class="hidden">Price Setting</span>
      </NuxtLink>
    </Table.Td>
  </Table.Tr>
</template>
