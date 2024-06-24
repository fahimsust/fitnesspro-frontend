<script lang="ts" setup>
import { toRefs } from "vue";
import Lucide from "~/components/enigma/base-components/Lucide";
import { Dialog } from "~/components/enigma/base-components/Headless";
import {
  InputField,
  SubmitButton,
  CancelButton,
  SelectField,
  CheckBoxField,
} from "~/components/form";

const props = defineProps({
  setModal: {
    required: true,
    type: Function,
  },
  modalShow: {
    required: true,
    type: Boolean,
  },
  refresh: {
    required: true,
    type: Function,
  },
});
const input = ref<HTMLInputElement>();
const {
  createAccountType,
  errors,
  loading,
  messageTemplates,
  loyaltyPrograms,
} = useAccountType();
const { setModal, modalShow, refresh } = toRefs(props);

const filters = [
  { id: 0, name: "Don't Filter" },
  { id: 1, name: "Show Only Assigned Products" },
  { id: 2, name: "Hide Assigned Products" },
];
const { accountStatuses } = useCustomers();
const { discountLevels } = useDiscountLevel();
const { affiliateLevels } = useAffiliates();
const { customForms } = useCustomForms();
let statuses:any = ref([]);
let templates:any = ref([]);
let levels:any = ref([]);
let affiliates:any = ref([]);
let forms:any = ref([]);
let loyalties:any = ref([]);
const dataLoaded = ref(false)
const fetchData = async()=>{
  statuses = await accountStatuses();
  templates = await messageTemplates();
  levels = await discountLevels();
  affiliates = await affiliateLevels();
  forms = await customForms();
  loyalties = await loyaltyPrograms();
  dataLoaded.value = true
}
let form = reactive({
  name: "",
  default_account_status: 1,
  custom_form_id: null,
  email_template_id_creation_admin: null,
  email_template_id_creation_user: null,
  email_template_id_activate_user: null,
  discount_level_id: null,
  verify_user_email: 0,
  filter_products: 0,
  filter_categories: 0,
  loyaltypoints_id: null,
  use_specialties: 0,
  membership_level_id: null,
  email_template_id_verify_email: null,
  affiliate_level_id: null,
});

const typeValidationAndAdd = async () => {
  await createAccountType(form);
  await refresh.value();
  validationFocus(form, errors);
  if (Object.keys(errors).length == 0) {
    setModal.value(false);
  }
};
onMounted(async()=>{
  await nextTick();
  await fetchData();
})
</script>
<template>
  <Dialog backdrop="static" :open="modalShow" size="xl" @close="() => {
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
        <h2 class="mr-auto text-base font-medium">Add Account Type</h2>
      </Dialog.Title>

      <Dialog.Description class="max-h-[75vh] overflow-auto">
        <div v-if="!dataLoaded">
          <div class="rounded-lg box intro-y mt-3">
            <TableLoading />
          </div>
        </div>
        <div class="grid grid-cols-12 gap-4 gap-y-3" v-if="dataLoaded">
          <div class="col-span-6 xs:col-span-12">
            <InputField name="name" type="text" v-model="form" :error="errors.name" title="Name" />
          </div>
          <div class="col-span-6 xs:col-span-12">
            <SelectField :options="statuses" name="default_account_status" v-model="form" :hasDefault="false"
              :error="errors.default_account_status" title="Default Status" />
          </div>
          <div class="mt-3 col-span-6 xs:col-span-12">
            <SelectField :options="filters" name="filter_products" v-model="form" :hasDefault="false"
              :error="errors.filter_products" title="Filter Products" />
          </div>
          <div class="mt-3 col-span-6 xs:col-span-12">
            <SelectField :options="filters" name="filter_categories" v-model="form" :hasDefault="false"
              :error="errors.filter_categories" title="Filter Categories" />
          </div>
          <div class="mt-3 col-span-6 xs:col-span-12">
            <SelectField :options="affiliates" name="affiliate_level_id" v-model="form" defaultOption="None"
              :error="errors.affiliate_level_id" title="Affiliate Level (Used If Accounts Linked to Affiliates)" />
          </div>
          <div class="mt-3 col-span-6 xs:col-span-12">
            <CheckBoxField name="use_specialties" v-model="form" :error="errors.use_specialties"
              title="Use Specialties" />
          </div>
          <div class="mt-3 col-span-6 xs:col-span-12">
            <SelectField :options="forms" name="custom_form_id" v-model="form" defaultOption="None"
              :error="errors.custom_form_id" title="Custom Form" />
          </div>
          <div class="mt-3 col-span-6 xs:col-span-12">
            <SelectField :options="loyalties" name="loyaltypoints_id" v-model="form" defaultOption="None"
              :error="errors.loyaltypoints_id" title="Loyalty Program" />
          </div>
          <div class="mt-3 col-span-6 xs:col-span-12">
            <SelectField :options="levels" name="discount_level_id" v-model="form" defaultOption="None"
              :error="errors.discount_level_id" title="Discount Level" />
          </div>
          <div class="mt-3 col-span-6 xs:col-span-12">
            <SelectField :options="templates" name="email_template_id_creation_admin" v-model="form" defaultOption="None"
              :error="errors.email_template_id_creation_admin" title="Email to Admin On Creation" />
          </div>
          <div class="mt-3 col-span-6 xs:col-span-12">
            <SelectField :options="templates" name="email_template_id_creation_user" v-model="form" defaultOption="None"
              :error="errors.email_template_id_creation_user" title="Email to User On Creation" />
          </div>
          <div class="mt-3 col-span-6 xs:col-span-12">
            <SelectField :options="templates" name="email_template_id_activate_user" v-model="form" defaultOption="None"
              :error="errors.email_template_id_activate_user" title="Email to User on Activation" />
          </div>
          <div class="mt-3 col-span-6 xs:col-span-12">
            <CheckBoxField name="verify_user_email" v-model="form" :error="errors.verify_user_email"
              title="Verify User Email Before Login" />
          </div>
        </div>
      </Dialog.Description>
      <Dialog.Footer>
        <SubmitButton :createFunction="typeValidationAndAdd" :loading="loading" />
      </Dialog.Footer>
    </Dialog.Panel>
  </Dialog>
</template>
