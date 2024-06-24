<script setup lang="ts">
import { ref, toRefs } from "vue";
import { Dialog } from "~/components/enigma/base-components/Headless";
import Table from "~/components/enigma/base-components/Table";
import Button from "~/components/enigma/base-components/Button";
import Create from "~/components/address/Create.vue";
import Edit from "~/components/address/Edit.vue";
import Show from "~/components/address/Show.vue";
import Lucide from "~/components/enigma/base-components/Lucide";
const props = defineProps({
  setModel: {
    required: true,
    type: Function,
  },
  account: {
    required: false,
    type: Object,
    default: {},
  },
  modelShow: {
    required: true,
    type: Boolean,
  },
  updateAddressById: {
    required: true,
    type: Function,
  },
  modelValue: {
    required: true,
    type: Object,
  },
});

const addAddress = () => {
  setSlideover(true);
};

const { list, getAddress, countryList } = useAddresses();
const { setModel, modelShow, account, updateAddressById } = toRefs(props);

let { modelValue: address } = toRefs(props);

const addresses = ref<any[]>([]);
const countries = await countryList();
let selectedAddress = ref(0);
if (address.value.id != undefined) selectedAddress = ref(address.value.id!);

const searchByKeyword = async (keyword: string) => {
  addresses.value = [];
  let tampAddress = [];
  if (account) tampAddress = await list(keyword, account.value.id!);
  else tampAddress = await list(keyword);
  if (tampAddress) {
    tampAddress.value.forEach(function (element: any) {
      if (address.value.id == 0 || address.value.id != element.id)
        addresses.value.push(element);
    });
  }
};
const emit = defineEmits(["update:modelValue"]);
const closeModel = () => {
  setModel.value(false);
};
const updateAddressAndGetAddress = async (id: number) => {
  await updateAddressById.value(id);
  address = await getAddress(id);
  emit("update:modelValue", address.value);
  selectedAddress.value = id;
};
const saveAddress = async (id: number) => {
  await updateAddressAndGetAddress(id);
  setSlideover(false);
};
const selectAddress = async (id: number) => {
  await updateAddressAndGetAddress(id);
};
const updateAddress = async (id: number) => {
  await updateAddressAndGetAddress(id);
  setSlideoverEdit(false);
};

const keywordString = ref("");

const slideOver = ref(false);

const setSlideover = (value: boolean) => {
  slideOver.value = value;
};
const slideOverEdit = ref(false);

const setSlideoverEdit = (value: boolean) => {
  slideOverEdit.value = value;
};
</script>
<template>
  <Dialog size="lg" :open="modelShow" @close="() => {
    setModel(false);
  }
    ">
    <Dialog.Panel class="p-3 text-center">
      <a @click="(event) => {
        event.preventDefault();
        setModel(false);
      }
        " class="absolute top-3 right-4" href="#">
        <Lucide icon="X" class="w-8 h-8" />
      </a>
      <Dialog.Title>
        <h2 v-if="account.first_name" class="mr-auto text-base font-medium">
          {{ account.first_name }} {{ account.last_name }} Addresses
        </h2>
        <h2 v-else class="mr-auto text-base font-medium">System Addresses</h2>
      </Dialog.Title>
      <Dialog.Description class="grid grid-cols-12 gap-4 gap-y-3 max-h-[70vh] overflow-auto">
        <div class="col-span-12 intro-y md:col-span-12 lg:col-span-12">
          <div class="box bg-darkmode-800">
            <h2 v-if="address.id != undefined"
              class="bg-dark text-white dark:bg-black/30 p-2 text-md font-medium truncate">
              Current Address
            </h2>
            <Show v-if="address.id != undefined" v-model="address" :editAddress="setSlideoverEdit" />
            <div v-if="address.id == undefined" class="flex items-start px-5 pt-5 pb-3">
              <div class="flex flex-col items-center w-full lg:flex-row">
                <div class="mt-3 text-center lg:ml-0 lg:text-left lg:mt-0">
                  <a href="" class="font-large font-bold text-error text-red-600">No Address Found
                  </a>
                  <div class="text-slate-500 text-xs mt-0.5">
                    Please Create A New Address
                  </div>
                </div>
              </div>
            </div>
            <div class="p-3 text-center border-t lg:text-right border-slate-200/60 dark:border-darkmode-400">
              <Button variant="secondary" class="px-2 py-1" @click="addAddress">
                Create New Address
              </Button>
            </div>
          </div>
        </div>
        <div class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
          <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
            <div class="relative w-90 text-slate-500">
              <enter-search placeholder="Press enter for search" v-model="keywordString"
                :searchByKeyword="searchByKeyword" />
            </div>
          </div>
        </div>
        <div class="overflow-y-auto col-span-12 max-h-40">

          <Table class="mt-2 hover w-full">
            <Table.Thead class="bg-dark text-white dark:bg-black/30">
              <Table.Tr>
                <Table.Th class="py-2 border-b-0 whitespace-nowrap">Label</Table.Th>
                <Table.Th class="py-2 border-b-0 whitespace-nowrap">Name</Table.Th>
                <Table.Th class="py-2 text-center border-b-0 whitespace-nowrap">
                  Address
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr v-if="keywordString != '' && addresses.length == 0" class="intro-x">
                <Table.Td colspan="3" class="py-0 px-0">
                  <AlertGray />
                </Table.Td>
              </Table.Tr>
              <Table.Tr v-if="keywordString == ''" class="intro-x">
                <Table.Td colspan="3" class="py-0 px-0">
                  <AlertGray alert-text="Please search for get the result" />
                </Table.Td>
              </Table.Tr>
              <Table.Tr v-for="address in addresses" :key="address.id"
                :class="{ 'bg-primary text-white': selectedAddress == address.id }" class="intro-x cursor-pointer" @click="() => {
                  if (selectedAddress != address.id) selectAddress(address.id);
                }
                  ">
                <Table.Td class="w-40 py-2 truncate">
                  {{ address.label }}
                </Table.Td>
                <Table.Td class="py-2 truncate">
                  {{ address.first_name }} {{ address.last_name }}
                </Table.Td>
                <Table.Td class="py-2 truncate">
                  <div>
                    {{ address.address_1 }}
                  </div>
                  <div v-if="address.address_2">
                    {{ address.address_2 }}
                  </div>
                  <div>
                    {{ address.city
                    }}{{
  address.state_province ? ", " + address.state_province.name : ""
}}
                    {{ address.postal_code }}
                  </div>
                  <div v-if="address.country">
                    {{ address.country?.name }}
                  </div>
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </div>

        <create :countries="countries" :setSlideover="setSlideover" v-model="slideOver" :saveAddress="saveAddress" />
        <Edit :countries="countries" v-if="address" :key="address.id" :setSlideover="setSlideoverEdit"
          v-model="slideOverEdit" :updateCurrentAddress="updateAddress" :address="address" />
      </Dialog.Description>
      <Dialog.Footer class="py-2">
        <Button type="button" variant="primary" @click="() => {
          setModel(false);
        }
          " class="w-20 mr-1">
          Done
        </Button>
      </Dialog.Footer>
    </Dialog.Panel>
  </Dialog>
</template>
