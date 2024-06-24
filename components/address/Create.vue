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
  saveAddress: {
    required: true,
    type: Function,
  },
  setSlideover: {
    required: true,
    type: Function,
  },
  countries: {
    required: true,
    type: Array as PropType<Array<Option>>,
  },
  modelValue: {
    required: true,
    type: Boolean,
  },
  accountSave: {
    required: false,
    type: Boolean,
    default: false
  },
});

const { saveAddress, setSlideover, modelValue: slideover, countries, accountSave } = toRefs(props);

const { createAddress, errors: addressErrors, stateList, loading: addressLoading } = useAddresses();
const { saveBillingAddress, errors: accountErrors, loading: accountLoading } = useAccount();
let errors: { [key: string]: any; } = reactive({})
let loading = ref(false)
if (accountSave.value == true) {
  errors.value = addressErrors
  loading.value = addressLoading.value
}
else {
  errors.value = accountErrors
  loading.value = accountLoading.value
}



let formData = reactive({
  label: "",
  company: "",
  first_name: "",
  last_name: "",
  address_1: "",
  address_2: "",
  city: "",
  state_id: "",
  country_id: "",
  postal_code: "",
  email: "",
  phone: "",
});
let states: any = [];
const country_id = ref(0);
const loadingStates = ref(false);
const getState = async (id: number) => {
  loadingStates.value = true;
  states = await stateList(id);
  country_id.value = id;
  loadingStates.value = false;
};

const addressValidationAndAdd = async () => {
  if (accountSave.value == true) {
    await saveBillingAddress(formData);
    validationFocus(formData, errors);
    await saveAddress.value();
  }
  else {
    const address_id = await createAddress(formData);
    validationFocus(formData, errors);
    if (address_id != undefined) saveAddress.value(address_id);
  }

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
        <h2 class="mr-auto text-base font-medium">Create Address</h2>
      </Slideover.Title>

      <Slideover.Description>
        <div class="px-5 py-6 sm:px-6 space-y-8 divide-y divide-gray-200 sm:space-y-5">
          <div class="space-y-6 sm:space-y-5">
            <div class="space-y-6 sm:space-y-5">
              <div>
                <InputField :submit-function="addressValidationAndAdd" name="label" v-model="formData"
                  :error="errors.label" title="Label" />
              </div>
              <div class="mt-3">
                <InputField :submit-function="addressValidationAndAdd" name="first_name" v-model="formData"
                  :error="errors.first_name" title="First Name" />
              </div>
              <div class="mt-3">
                <InputField :submit-function="addressValidationAndAdd" name="last_name" v-model="formData"
                  :error="errors.last_name" title="Last Name" />
              </div>

              <div class="mt-3">
                <InputField :submit-function="addressValidationAndAdd" name="email" type="email" v-model="formData"
                  :error="errors.email" title="Email" placeholder="xxx@xxx.com" />
              </div>
              <div class="mt-3">
                <InputField :submit-function="addressValidationAndAdd" name="phone" v-model="formData"
                  :error="errors.phone" title="phone" />
              </div>
              <div class="mt-3">
                <InputField :submit-function="addressValidationAndAdd" name="company" v-model="formData"
                  :error="errors.company" title="company" />
              </div>
              <div class="mt-3">
                <InputField :submit-function="addressValidationAndAdd" name="address_1" v-model="formData"
                  :error="errors.address_1" title="Address 1" />
              </div>
              <div class="mt-3">
                <InputField :submit-function="addressValidationAndAdd" name="address_2" v-model="formData"
                  :error="errors.address_2" title="Address 2" />
              </div>
              <div class="mt-3">
                <SelectField :options="countries" :submit-function="addressValidationAndAdd" name="country_id"
                  :runFunction="getState" v-model="formData" :error="errors.country_id" title="Country" />
              </div>
              <div class="mt-3 relative" v-if="states">
                <SelectField v-if="!loadingStates" :options="states" :submit-function="addressValidationAndAdd"
                  :key="country_id" name="state_id" v-model="formData" :error="errors.state_id" title="State" />
                <div v-if="loadingStates" class="absolute inset-0 flex items-center justify-center  bg-opacity-50">
                  <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
                </div>
              </div>
              <div class="mt-3">
                <InputField :submit-function="addressValidationAndAdd" name="city" v-model="formData" :error="errors.city"
                  title="City" />
              </div>
              <div class="mt-3">
                <InputField :submit-function="addressValidationAndAdd" name="postal_code" v-model="formData"
                  :error="errors.postal_code" title="Zip Code" />
              </div>
            </div>
          </div>
        </div>
      </Slideover.Description>
      <Slideover.Footer>
        <CancelButton :cancelFunction="setSlideover" />
        <SubmitButton :createFunction="addressValidationAndAdd" :loading="loading" />
      </Slideover.Footer>
    </Slideover.Panel>
  </Slideover>
</template>
