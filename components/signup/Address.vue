<script lang="ts" setup>
import { toRefs } from "vue";
import { InputField, SubmitButton } from "~/components/form";
import Button from "~/components/enigma/base-components/Button";
import Show from "~/components/address/Show.vue";
import Create from "~/components/address/Create.vue";

const props = defineProps({
  goToStep: {
    required: true,
    type: Function,
  },
});
const { goToStep } = toRefs(props);

const {
  billingAddresses,
  defaultBilling,
  updateBillingAddress,
  errors,
  loading,
} = useAccount();
const { countryList } = useAddresses();
const countries = await countryList();
const slideOver = ref(false);
const setSlideOver = (value: boolean) => {
  slideOver.value = value;
};
const createAddress = async () => {
  await billingAddresses();
  await defaultBilling();
  setSlideOver(false)
};

const defaultAddress = await defaultBilling();
const addresses = await billingAddresses();

const updateDefaultAddress = async (address_id: number) => {
  await updateBillingAddress({ address_id: address_id });
  await defaultBilling();
  await billingAddresses();
};
const validateAndCreate = async () => {
  goToStep.value(4);
};
</script>
<template>
  <div class="px-5 mt-10">
    <div class="text-lg font-medium text-center">Billing Address</div>
  </div>
  <div class="px-5 pt-10 mt-10 border-t sm:px-20 border-slate-200/60 dark:border-darkmode-400">
    <div class="text-base font-medium">Billing addresses</div>
    <div class="grid grid-cols-12 gap-6 mt-5 gap-y-6">
      <div class="col-span-12 intro-y" v-if="addresses.length == 0">
        <AlertGray />
      </div>
      <div class="col-span-12 intro-y sm:col-span-6 cursor-pointer" :key="address.id" v-for="address in addresses" @click="() => {
        updateDefaultAddress(address.pivot.id);
      }
        " :class="{
    'bg-blue-100': defaultAddress && defaultAddress.id === address.id,
    'cursor-default': defaultAddress && defaultAddress.id === address.id,
  }">
        <Show :modelValue="address" />
      </div>
    </div>
    <div class="mt-5">
      <Button @click="() => {
        setSlideOver(true);
      }
        " variant="primary" class="mr-2 shadow-md">
        Create New Address
      </Button>
    </div>
    <create :countries="countries" :setSlideover="setSlideOver" v-model="slideOver" :saveAddress="createAddress"
      :accountSave="true" />
    <div class="flex items-center justify-center col-span-12 mt-5 intro-y sm:justify-end">
      <SubmitButton buttonText="Next" :createFunction="validateAndCreate" :loading="loading" />
    </div>
  </div>
</template>
