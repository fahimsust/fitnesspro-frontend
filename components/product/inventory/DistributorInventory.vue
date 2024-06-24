<script lang="ts" setup>
import Table from "~/components/enigma/base-components/Table";
import { FormSelect } from "~/components/enigma/base-components/Form";
import { ref } from "vue";
const props = defineProps({
  modelValue: {
    required: true,
    type: Object,
  },
  popup: {
    required: false,
    type: Boolean,
    default: false,
  },
});
const product = ref(props.modelValue);
const popup = ref(props.popup);
const { productDistributors, updateDistributorInventory, availabilities } = useProducts();
let productDistributorInventories:any = ref([]);
let availabilityList:any = ref([]);

const setValue = async (distributorInventory: any) => {
  let form: any = reactive({
    outofstockstatus_id: distributorInventory.outofstockstatus_id,
    distributor_id: distributorInventory.id,
    stock_qty: distributorInventory.stock_qty,
    cost: distributorInventory.cost,
  });
  await updateDistributorInventory(form, product.value.id);
};
const modifyValue = (distributorInventory: any) => {
  if (is_change.value == true) {
    setValue(distributorInventory);
    is_change.value = false;
  }
};
const is_change = ref(false);
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  productDistributorInventories = await productDistributors(product.value.id);
  availabilityList = await availabilities();
  dataLoaded.value = true
});
</script>

<template>
  <div class="mt-2 intro-y xl:mt-4 overflow-x-auto">
    <Table class="-mt-2 hover">
      <Table.Thead variant="dark" class="text-xs">
        <Table.Tr>
          <Table.Th class="whitespace-nowrap pt-5">DISTRIBUTOR</Table.Th>
          <Table.Th class="whitespace-nowrap pt-5">STOCK QTYE</Table.Th>
          <Table.Th class="whitespace-nowrap pt-5">OUT OF STOCK STATUS</Table.Th>
          <Table.Th class="whitespace-nowrap pt-5">COST</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody class="py-0">
        <Table.Tr v-if="!dataLoaded" class="intro-x">
          <Table.Td colspan="4" class="py-0 px-0">
            <TableLoading />
          </Table.Td>
        </Table.Tr>
        <Table.Tr v-if="productDistributorInventories.length == 0 && dataLoaded" class="intro-x">
          <Table.Td colspan="4" class="py-0 px-0">
            <AlertGray />
          </Table.Td>
        </Table.Tr>
        <Table.Tr
          v-for="inventory in productDistributorInventories"
          :key="inventory.id"
          class="intro-x"
        >
          <Table.Td class="p-4">
            {{ inventory.name }}
          </Table.Td>
          <Table.Td class="p-4">
            <input
              class="input_class"
              type="text"
              v-model="inventory.stock_qty"
              @blur="modifyValue(inventory)"
              @change="is_change = true"
            />
          </Table.Td>
          <Table.Td class="p-4">
            <FormSelect
              v-model="inventory.outofstockstatus_id"
              @change="setValue(inventory)"
            >
              <option>Use variant's default</option>
              <option
                :value="availability.id"
                v-for="availability in availabilityList"
                :key="availability.id"
              >
                {{ availability.name }}
              </option>
            </FormSelect>
          </Table.Td>
          <Table.Td class="p-4">
            <input
              class="input_class"
              type="text"
              placeholder="use variant's cost"
              v-model="inventory.cost"
              @blur="modifyValue(inventory)"
              @change="is_change = true"
            />
          </Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  </div>
</template>
<style lang="postcss" scoped>
.input_class {
  @apply disabled:bg-slate-100 
  disabled:cursor-not-allowed 
  dark:disabled:bg-darkmode-800/50 dark:disabled:border-transparent [&[readonly]]:bg-slate-100 [&[readonly]]:cursor-not-allowed [&[readonly]]:dark:bg-darkmode-800/50 [&[readonly]]:dark:border-transparent transition duration-200 ease-in-out w-full text-sm border-slate-200 shadow-sm rounded-md placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary focus:border-opacity-40 dark:bg-darkmode-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:placeholder:text-slate-500/80 flex-1;
}
</style>
