<script setup lang="ts">
import { ref, toRefs, type PropType } from "vue";
import { Slideover, Menu } from "~/components/enigma/base-components/Headless";
import Lucide from "~/components/enigma/base-components/Lucide";
import { InputField, SelectField, SubmitButton, CancelButton } from "~/components/form";
interface Option {
  id: string;
  name: string;
}

const props = defineProps({
  updateCurrentAddress: {
    required: true,
    type: Function,
  },
  setSlideover: {
    required: true,
    type: Function,
  },
  modelValue: {
    required: true,
    type: Boolean,
  },
  address: {
    required: true,
    type: Object,
  },
  countries: {
    required: true,
    type: Array as PropType<Array<Option>>,
  },
});

const {
  updateCurrentAddress,
  setSlideover,
  modelValue: slideover,
  address,
  countries,
} = toRefs(props);
const country = [
  {
    id: 1,
    name: "United States",
  },
];
const state = [
  {
    id: 1,
    name: "Alaxa",
  },
];
const { updateAddress, errors, loading, countryList, stateList } = useAddresses();

let formData = reactive({
  label: address.value.label,
  company: address.value.company,
  first_name: address.value.first_name,
  last_name: address.value.last_name,
  address_1: address.value.address_1,
  address_2: address.value.address_2,
  city: address.value.city,
  state_id: address.value.state_id,
  country_id: address.value.country_id,
  postal_code: address.value.postal_code,
  email: address.value.email,
  phone: address.value.phone,
});

const addressValidationAndUpdate = async () => {
  const address_id = await updateAddress(formData, address.value.id);
  validationFocus(formData, errors);
  if (address_id != undefined) updateCurrentAddress.value(address_id);
};
let states: any = [];
const country_id = ref(0);
if (address.value.country_id) {
  country_id.value = address.value.country_id;
  states = await stateList(country_id.value);
}
const loadingStates = ref(false);
const getState = async (id: number) => {
  loadingStates.value = true;
  states = await stateList(id);
  country_id.value = id;
  loadingStates.value = false;
};
</script>

<template>
  <Slideover backdrop="static" :open="slideover" @close="() => {
    setSlideover(false);
  }
    ">
    <Slideover.Panel>
      <a @click="(event) => {
        event.preventDefault();
        setSlideover(false);
      }
        " class="absolute top-3 right-4" href="#">
        <Lucide icon="X" class="w-8 h-8" />
      </a>
      <Slideover.Title>
        <h2 class="mr-auto text-base font-medium">Edit Address</h2>
      </Slideover.Title>

      <Slideover.Description>
        <div class="px-5 py-6 sm:px-6 space-y-8 divide-y divide-gray-200 sm:space-y-5">
          <div class="space-y-6 sm:space-y-5">
            <div class="space-y-6 sm:space-y-5">
              <div>
                <InputField :submit-function="addressValidationAndUpdate" name="label" v-model="formData"
                  :error="errors.label" title="Label" />
              </div>
              <div class="mt-3">
                <InputField :submit-function="addressValidationAndUpdate" name="first_name" v-model="formData"
                  :error="errors.first_name" title="First Name" />
              </div>
              <div class="mt-3">
                <InputField :submit-function="addressValidationAndUpdate" name="last_name" v-model="formData"
                  :error="errors.last_name" title="Last Name" />
              </div>

              <div class="mt-3">
                <InputField :submit-function="addressValidationAndUpdate" name="email" type="email" v-model="formData"
                  :error="errors.email" title="Email" placeholder="xxx@xxx.com" />
              </div>
              <div class="mt-3">
                <InputField :submit-function="addressValidationAndUpdate" name="phone" v-model="formData"
                  :error="errors.phone" title="phone" />
              </div>
              <div class="mt-3">
                <InputField :submit-function="addressValidationAndUpdate" name="company" v-model="formData"
                  :error="errors.company" title="company" />
              </div>
              <div class="mt-3">
                <InputField :submit-function="addressValidationAndUpdate" name="address_1" v-model="formData"
                  :error="errors.address_1" title="Address 1" />
              </div>
              <div class="mt-3">
                <InputField :submit-function="addressValidationAndUpdate" name="address_2" v-model="formData"
                  :error="errors.address_2" title="Address 2" />
              </div>
              <div class="mt-3">
                <SelectField :options="countries" :submit-function="addressValidationAndUpdate" name="country_id"
                  :runFunction="getState" v-model="formData" :error="errors.country_id" title="Country" />
              </div>
              <div class="mt-3" v-if="states">
                <SelectField v-if="!loadingStates" :options="states" :submit-function="addressValidationAndUpdate"
                  :key="country_id" name="state_id" v-model="formData" :error="errors.state_id" title="State" />
                <div v-if="loadingStates" class="absolute inset-0 flex items-center justify-center  bg-opacity-50">
                  <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
                </div>
              </div>
              <div class="mt-3">
                <InputField :submit-function="addressValidationAndUpdate" name="city" v-model="formData"
                  :error="errors.city" title="City" />
              </div>
              <div class="mt-3">
                <InputField :submit-function="addressValidationAndUpdate" name="postal_code" v-model="formData"
                  :error="errors.postal_code" title="Zip Code" />
              </div>
            </div>
          </div>
        </div>
      </Slideover.Description>
      <Slideover.Footer>
        <CancelButton :cancelFunction="setSlideover" />
        <SubmitButton :createFunction="addressValidationAndUpdate" :loading="loading" />
      </Slideover.Footer>
    </Slideover.Panel>
  </Slideover>
</template>
