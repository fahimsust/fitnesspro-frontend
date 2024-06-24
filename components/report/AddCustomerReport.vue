<script setup lang="ts">
import { ref, toRefs } from "vue";
import {
  Dialog,
} from "~/components/enigma/base-components/Headless";
import {
  InputField,
  SelectField,
  SubmitButton,
  TomSelectField
} from "~/components/form";
import DatePickerField from "~/components/form/DatePickerField.vue";
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
const { all } = useAccountType();
const { specialities } = useSpeciality();
const { membershipLevels } = useConditionMembership();
const { loading, errors, createReport } = useCustomerReports();

const formatDateTime = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// Set start_date to 1 month prior with 00:00:00 time

let formData = reactive({
  name: null,
  start_date: null as string | null,
  end_date: null as string | null,
  account_status: 0,
  account_type_id: [],
  ship_to_country: null,
  ship_to_city: null,
  ship_to_state: null,
  has_ordered: 0,
  has_travel_ordered:0,
  specialties: [],
  specialty_allany: 0,
  membership_level: null
});

let startDate = new Date(); // Current date and time
startDate.setMonth(startDate.getMonth() - 1); // Set month 1 month back
startDate.setDate(1); // Set day to 1st of the month
startDate.setHours(0, 0, 0, 0); // Set time to 00:00:00
formData.start_date = startDate.toISOString(); // Convert to ISO string format

// Set end_date to current date with 23:59:59 time
let endDate = new Date(); // Current date and time
endDate.setHours(23, 59, 59, 0); // Set time to 23:59:59
formData.end_date = endDate.toISOString();

const createCustomerReport = async () => {
  if (formData.start_date)
    formData.start_date = formatDateTime(startDate);
  if (formData.end_date)
    formData.end_date = formatDateTime(endDate);
  await createReport(formData);
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
const statusOptions = [
  {
    id: 0, name: "All Customers"
  },
  {
    id: 1, name: "Customers that Last Logged In"
  },
  {
    id: 2, name: "Customers with Active Membership"
  },
  {
    id: 5, name: "Customers with Non-Active Memberships"
  },
  {
    id: 3, name: "Customers with Memberships Created/Renewed"
  },
  {
    id: 4, name: "Customers with Memberships Expiring"
  }
]
const orderOptions = [
  {
    id: 0, name: "Ordered or Not"
  },
  {
    id: 1, name: "Ordered"
  },
  {
    id: 2, name: "Not Ordered"
  }
]
const travelOrderOptions = [
  {
    id: 0, name: "Ordered or Not Travel Product"
  },
  {
    id: 1, name: "Travel Product Ordered"
  },
  {
    id: 2, name: "Travel Product Not Ordered"
  }
]
const allAny = [
  {
    id: 0, name: "All"
  },
  {
    id: 1, name: "Any"
  }
]

let accountTypes:any = ref([]);
let specialityList:any = ref([]);
let memberships:any = ref([]);
let countries:any = ref([]);
const dataLoaded = ref(false)
onMounted(async()=>{
  await nextTick();
  accountTypes = await all();
  specialityList = await specialities();
  memberships = await membershipLevels();
  countries = await countryList();
  dataLoaded.value = true
})

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
        <h2 class="mr-auto text-base font-medium">Add Customer Report</h2>
      </Dialog.Title>

      <Dialog.Description class="max-h-[75vh] overflow-auto">
        <div v-if="!dataLoaded">
          <div class="rounded-lg box intro-y mt-3">
            <TableLoading />
          </div>
        </div>
        <div class="grid grid-cols-12 gap-4 gap-y-3" v-if="dataLoaded">

          <div class="col-span-12 xs:col-span-12">
            <InputField :submit-function="createCustomerReport" name="name" v-model="formData" :error="errors.name"
              title="Name" />
          </div>
          <div class="col-span-6 xs:col-span-12">
            <DatePickerField :enable-time-picker="true" name="start_date" v-model="formData" :required="true"
              :error="errors.start_date" title="Start Date" />
          </div>
          <div class="col-span-6 xs:col-span-12">
            <DatePickerField :enable-time-picker="true" name="end_date" v-model="formData" :required="true"
              :error="errors.end_date" title="End Date" />
          </div>
          <div class="col-span-6 xs:col-span-12">
            <SelectField :options="statusOptions" :submit-function="createCustomerReport" name="account_status"
              :hasDefault="false" v-model="formData" :error="errors.account_status" title="Target Customer" />
          </div>
          <div class="col-span-6 xs:col-span-12">
            <TomSelectField :multiple="true" :hasDefault="false" :options="accountTypes" name="account_type_id"
              v-model="formData" :error="errors.account_type_id" title="Account Type" />
          </div>
          <div class="col-span-12 xs:col-span-12">
            <InputField :submit-function="createCustomerReport" name="ship_to_city" v-model="formData"
              :error="errors.ship_to_city" title="City" />
          </div>
          <div class="col-span-6 xs:col-span-12">
            <SelectField :options="countries" :submit-function="createCustomerReport" name="ship_to_country"
              :runFunction="getState" v-model="formData" :error="errors.ship_to_country" title="Country" />
          </div>
          <div class="col-span-6 xs:col-span-12" v-if="!loadingStates">
            <TomSelectField :multiple="true" :hasDefault="false" :options="states" name="ship_to_state"
              v-model="formData" :error="errors.ship_to_state" title="States" />
          </div>
          <div class="col-span-6 xs:col-span-12" v-if="loadingStates">
            <div class="absolute inset-0 flex items-center justify-center  bg-opacity-50">
              <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
            </div>
          </div>

          <div class="col-span-6 xs:col-span-12">
            <TomSelectField :multiple="true" :hasDefault="false" :options="specialityList" name="specialties" v-model="formData"
              :error="errors.specialties" title="Specialty" />
          </div>
          <div class="col-span-6 xs:col-span-12">
            <SelectField :options="allAny" :submit-function="createCustomerReport" name="specialty_allany"
              :hasDefault="false" v-model="formData" :error="errors.specialty_allany" title="Match Specialties by" />
          </div>
          <div class="col-span-6 xs:col-span-12">
            <SelectField :options="orderOptions" :submit-function="createCustomerReport" name="has_ordered"
              :hasDefault="false" v-model="formData" :error="errors.has_ordered" title="Customers that have" />
          </div>
          <div class="col-span-6 xs:col-span-12">
            <SelectField :options="travelOrderOptions" :submit-function="createCustomerReport" name="has_travel_ordered"
              :hasDefault="false" v-model="formData" :error="errors.has_travel_ordered" title="Customers that have" />
          </div>
          <div class="col-span-6 xs:col-span-12">
            <SelectField :options="memberships" :submit-function="createCustomerReport" name="membership_level"
              v-model="formData" :error="errors.membership_level" title="Membership Level" />
          </div>
        </div>
      </Dialog.Description>
      <Dialog.Footer>
        <SubmitButton :createFunction="createCustomerReport" :loading="loading" />
      </Dialog.Footer>
    </Dialog.Panel>
  </Dialog>
</template>
