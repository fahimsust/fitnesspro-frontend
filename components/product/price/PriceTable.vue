<script lang="ts" setup>
import Lucide from "~/components/enigma/base-components/Lucide";
import Table from "~/components/enigma/base-components/Table";

import { FormSwitch } from "~/components/enigma/base-components/Form";
import { Disclosure } from "~/components/enigma/base-components/Headless";

const props = defineProps({
  priceList: {
    required: true,
    type: Object,
  },
  setValue: {
    required: true,
    type: Function,
  },
  siteName: {
    required: true,
    type: String,
  },
  setPrice: {
    required: true,
    type: Function,
  },
});
const { priceList, setValue, setPrice } = toRefs(props);
const modifyPrice = (fieldName: string, value: any, priceObj: any) => {
  if (is_change.value == true) {
    setValue.value(fieldName, value, priceObj);
    is_change.value = false;
  }
};
const is_change = ref(false);
</script>
<template>
  <Disclosure>
    <Disclosure.Button>
      {{ siteName }}
    </Disclosure.Button>
    <Disclosure.Panel class="leading-relaxed text-slate-600 dark:text-slate-500">
      <div class="overflow-x-auto">
        <Table class="border-spacing-y-[10px] border-separate -mt-2 hover">
          <Table.Thead variant="dark" class="text-xs">
            <Table.Tr>
              <Table.Th class="whitespace-nowrap">REGULAR PRICE</Table.Th>
              <Table.Th class="whitespace-nowrap">SALE PRICE</Table.Th>
              <Table.Th class="whitespace-nowrap">ON SALE</Table.Th>
              <Table.Th class="whitespace-nowrap">PUBLISH</Table.Th>
              <Table.Th class="whitespace-nowrap"></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr class="intro-x" v-for="price in priceList">
              <Table.Td>
                <input
                  class="input_class"
                  type="text"
                  v-model="price.price_reg"
                  @blur="modifyPrice('price_reg', ($event.target as HTMLInputElement).value, price)"
                  @change="is_change = true"
                />
              </Table.Td>
              <Table.Td>
                <input
                  class="input_class"
                  type="text"
                  v-model="price.price_sale"
                  @blur="modifyPrice('price_sale', ($event.target as HTMLInputElement).value, price)"
                  @change="is_change = true"
                />
              </Table.Td>
              <Table.Td>
                <FormSwitch>
                  <FormSwitch.Input
                    type="checkbox"
                    id="onsale"
                    v-model="price.onsale"
                    @click="setValue('onsale', ($event.target as HTMLInputElement).value, price)"
                  />
                </FormSwitch>
              </Table.Td>

              <Table.Td>
                <FormSwitch>
                  <FormSwitch.Input
                    type="checkbox"
                    id="status"
                    v-model="price.status"
                    @click="setValue('status', ($event.target as HTMLInputElement).value, price)"
                  />
                </FormSwitch>
              </Table.Td>
              <Table.Td>
                <NuxtLink
                  class="flex text-danger cursor-pointer"
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
          </Table.Tbody>
        </Table>
      </div>
    </Disclosure.Panel>
  </Disclosure>
</template>
