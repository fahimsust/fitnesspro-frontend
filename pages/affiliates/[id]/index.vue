<script setup lang="ts">
import { ref } from "vue";
import {SubmitButton,SelectField,InputField} from "~/components/form";
import Button from "~/components/enigma/base-components/Button";
import Show from "~/components/address/Show.vue";
import AddressSelect from "~/components/AddressSelect.vue";

definePageMeta({
  middleware: ["auth"],
  layout: "edit-affiliate",
});

useHead({
  title: "Affiliate : " + useRuntimeConfig().public.company,
});

const route = useRoute();
const idParam = parseInt(route.params.id.toString());

const {
  errors,
  loading,
  affiliateLevels,
  getAffiliate,
  updateAffiliate,
  updateAddress,
} = useAffiliates();
const { getAddress } = useAddresses();

let affiliateLevel:any = ref([])
let affiliate:any = ref({})

let address_id = ref(0);
let address = ref({id:0});
if (affiliate.value.address_id) {
  address_id.value = affiliate.value.address_id;
  address = await getAddress(address_id.value);
}
const modelShow = ref(false);
const setModel = (value:any) => {
  modelShow.value = value;
};
const updateAddressById = async (id:number) => {
  await updateAddress(idParam, id);
};

let formData:any = reactive({})
const affiliateValidationAndUpdate = async () => {
  await updateAffiliate(formData, idParam);
  validationFocus(formData, errors);
}
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  affiliateLevel = await affiliateLevels();
  affiliate = await getAffiliate(idParam);
  formData = reactive({
  name: affiliate.value.name,
  email: affiliate.value.email,
  password: affiliate.value.password,
  password_confirmation: affiliate.value.password,
  account_id: affiliate.value.account_id,
  affiliate_level_id: affiliate.value.affiliate_level_id,
  status: affiliate.value.status,
});
  dataLoaded.value = true
});
</script>
<template>
  <div class="col-span-12 lg:col-span-9 2xl:col-span-10" v-if="!dataLoaded">
    <div class="rounded-lg box intro-y lg:mt-14">
      <TableLoading />
    </div>
  </div>  
  
  <div class="col-span-12 lg:col-span-9 2xl:col-span-10" v-if="dataLoaded">
    <div class="rounded-lg box intro-y lg:mt-14">
      <div class="px-5 py-6 sm:px-6 space-y-8 divide-y divide-gray-200 sm:space-y-5">
        <div class="space-y-6 sm:space-y-5">
          <div>
            <h2 class="mr-auto text-base font-medium">Details</h2>
            <!-- <p class="mt-1 max-w-2xl text-sm text-gray-500">Use a permanent address where you can
                                    receive mail.</p> -->
          </div>
          <div class="space-y-6 sm:space-y-5">
            <div>
              <InputField
                :submit-function="affiliateValidationAndUpdate"
                name="name"
                v-model="formData"
                :error="errors.name"
                title="Name"
              />
            </div>

            <div class="mt-3">
              <InputField
                :submit-function="affiliateValidationAndUpdate"
                name="email"
                type="email"
                v-model="formData"
                :error="errors.email"
                title="Email"
                placeholder="xxx@xxx.com"
              />
            </div>

            <div class="mt-3">
              <InputField
                :submit-function="affiliateValidationAndUpdate"
                name="password"
                type="text"
                v-model="formData"
                :error="errors.password"
                title="Password"
              />
            </div>
            <div class="mt-3">
              <InputField
                :submit-function="affiliateValidationAndUpdate"
                name="password_confirmation"
                type="text"
                v-model="formData"
                :error="errors.password_confirmation"
                title="Password Confirmation"
              />
            </div>
            <div class="mt-3">
              <InputField
                :submit-function="affiliateValidationAndUpdate"
                name="account_id"
                v-model="formData"
                :error="errors.account_id"
                title="Account Id"
              />
            </div>
            <div class="mt-3">
              <SelectField
                :options="affiliateLevel"
                name="affiliate_level_id"
                v-model="formData"
                :error="errors.affiliate_level_id"
                title="Rate Level"
              />
            </div>
            <div class="mt-3" v-if="address.id != undefined">
              <h3 class="mb-3">Current Address</h3>
              <div class="box dark:bg-darkmode-700">
                <Show v-model="address" />
              </div>
            </div>

            <Button variant="primary" class="mr-2 shadow-md" @click="setModel(true)">
              Manage Affiliate Address
            </Button>
            <div class="mt-5 text-right">
              <SubmitButton
                :createFunction="affiliateValidationAndUpdate"
                :loading="loading"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <AddressSelect
      v-if="affiliate.account_id != undefined"
      v-model="address"
      :account="affiliate.linked_account"
      :modelShow="modelShow"
      :setModel="setModel"
      :updateAddressById="updateAddressById"
    />
    <AddressSelect
      v-else
      v-model="address"
      :modelShow="modelShow"
      :setModel="setModel"
      :updateAddressById="updateAddressById"
    />
  </div>
  
</template>
