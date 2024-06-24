<script setup lang="ts">
import { ref, toRefs } from "vue";
import {
  Dialog,
} from "~/components/enigma/base-components/Headless";
import {
  InputField,
  SelectField,
  SubmitButton,
  CancelButton,
  CheckBoxField
} from "~/components/form";
import Lucide from "~/components/enigma/base-components/Lucide"

const props = defineProps({
  fetchList: {
    required: true,
    type: Function,
  },
  setModal: {
    required: true,
    type: Function,
  },
  modalShow: {
    required: true,
    type: Boolean,
  },
});

const {
  fetchList,
  setModal,
  modalShow,
} = toRefs(props);

const { countryList, stateList } = useAddresses();
const { loading, errors, createAccountAddress } = useCustomerAddress();

const route = useRoute();
const idParam = parseInt(route.params.id.toString());

let formData = reactive({
  status: true,
  is_billing: true,
  is_shipping: true,
  is_default_address: false,
  label: null,
  email: null,
  first_name: null,
  last_name: null,
  phone: null,
  address_1: null,
  address_2: null,
  city: null,
  country_id: null,
  state_id: null,
  postal_code: null,
  is_residential: false,
});

const addressValidationAndUpdate = async () => {
  await createAccountAddress(formData, idParam);
  validationFocus(formData, errors);
  if (Object.keys(errors).length == 0) {
    setModal.value(false);
    fetchList.value();
  }
};
let states: any = [];
const country_id = ref(0);
const loadingStates = ref(false);
const getState = async (id: number) => {
  loadingStates.value = true;
  states = await stateList(id);
  country_id.value = id;
  loadingStates.value = false;
};
let countries:any = ref([]);
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  countries = await countryList();
  dataLoaded.value = true
});
</script>

<template>
  <Dialog backdrop="static" size="xl" :open="modalShow" @close="() => {
    setModal(false);
  }
    ">
    <Dialog.Panel>
      <a @click="(event) => {
        event.preventDefault();
        setModal(false);
      }
        " class="absolute top-3 right-4" href="#">
        <Lucide icon="X" class="w-8 h-8" />
      </a>
      <Dialog.Title>
        <h2 class="mr-auto text-base font-medium">Add Address</h2>
      </Dialog.Title>

      <Dialog.Description class="max-h-[75vh] overflow-auto">
        <div class="grid grid-cols-12 gap-4 gap-y-3">
          <div class="mt-3 col-span-6 xs:col-span-12">
            <CheckBoxField name="is_shipping" v-model="formData" :error="errors.is_shipping" title="Use For Shipping" />
          </div>
          <div class="mt-3 col-span-6 xs:col-span-12">
            <CheckBoxField name="is_billing" v-model="formData" :error="errors.is_billing" title="Use For Billing" />
          </div>
          <div class="mt-3 col-span-6 xs:col-span-12">
            <CheckBoxField name="status" v-model="formData" :error="errors.status" title="Active?" />
          </div>
          <div class="col-span-6 xs:col-span-12">
            <InputField :submit-function="addressValidationAndUpdate" name="label" v-model="formData"
              :error="errors.label" title="Label" />
          </div>
          <div class="col-span-6 xs:col-span-12">
            <InputField :submit-function="addressValidationAndUpdate" name="first_name" v-model="formData"
              :error="errors.first_name" title="First Name" />
          </div>
          <div class="col-span-6 xs:col-span-12">
            <InputField :submit-function="addressValidationAndUpdate" name="last_name" v-model="formData"
              :error="errors.last_name" title="Last Name" />
          </div>

          <div class="col-span-6 xs:col-span-12">
            <InputField :submit-function="addressValidationAndUpdate" name="email" type="email" v-model="formData"
              :error="errors.email" title="Email" placeholder="xxx@xxx.com" />
          </div>
          <div class="col-span-6 xs:col-span-12">
            <InputField :submit-function="addressValidationAndUpdate" name="phone" v-model="formData"
              :error="errors.phone" title="phone" />
          </div>
          <div class="col-span-6 xs:col-span-12">
            <InputField :submit-function="addressValidationAndUpdate" name="company" v-model="formData"
              :error="errors.company" title="company" />
          </div>
          <div class="col-span-6 xs:col-span-12">
            <InputField :submit-function="addressValidationAndUpdate" name="address_1" v-model="formData"
              :error="errors.address_1" title="Address 1" />
          </div>
          <div class="col-span-6 xs:col-span-12">
            <InputField :submit-function="addressValidationAndUpdate" name="address_2" v-model="formData"
              :error="errors.address_2" title="Address 2" />
          </div>
          <div class="col-span-6 xs:col-span-12 relative" >
            <div v-if="!dataLoaded" class="absolute inset-0 flex items-center justify-center  bg-opacity-50">
              <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
            </div>
            <SelectField v-if="dataLoaded" :options="countries" :submit-function="addressValidationAndUpdate" name="country_id"
              :runFunction="getState" v-model="formData" :error="errors.country_id" title="Country" />
          </div>
          <div class="col-span-6 xs:col-span-12 relative">
            <SelectField v-if="!loadingStates" :options="states" :submit-function="addressValidationAndUpdate"
              name="state_id" v-model="formData" :error="errors.state_id" title="State" />
            <div v-if="loadingStates" class="absolute inset-0 flex items-center justify-center  bg-opacity-50">
              <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
            </div>
          </div>

          <div class="col-span-6 xs:col-span-12">
            <InputField :submit-function="addressValidationAndUpdate" name="city" v-model="formData" :error="errors.city"
              title="City" />
          </div>
          <div class="col-span-6 xs:col-span-12">
            <InputField :submit-function="addressValidationAndUpdate" name="postal_code" v-model="formData"
              :error="errors.postal_code" title="Zip Code" />
          </div>
          <div class="mt-3 col-span-6 xs:col-span-12">
            <CheckBoxField name="is_residential" v-model="formData" :error="errors.is_residential" title="Residential?" />
          </div>
        </div>
      </Dialog.Description>
      <Dialog.Footer>
        <SubmitButton :createFunction="addressValidationAndUpdate" :loading="loading" />
      </Dialog.Footer>
    </Dialog.Panel>
  </Dialog>
</template>
