<script setup lang="ts">
import { ref, toRefs, type PropType } from "vue";
import {
  Slideover,
  Dialog,
  Menu,
} from "~/components/enigma/base-components/Headless";
import Lucide from "~/components/enigma/base-components/Lucide";
import {
  InputField,
  SelectField,
  SubmitButton,
  CancelButton,
  CheckBoxField
} from "~/components/form";
import Levels from "./Levels.vue";
import DatePickerField from "~/components/form/DatePickerField.vue";
interface Option {
  id: string;
  name: string;
}

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
  modelValue: {
    required: true,
    type: Object,
  },
});

const {
  fetchList,
  setModal,
  modalShow,
  modelValue: customer
} = toRefs(props);
const { membershipLevels } = useConditionMembership()
const { loading, errors, createAccountMembership } = useCustomerMembership();
const levelOption: any = ref([])
const customerId = customer.value.id;
let formData = reactive({
  start_date: new Date().toISOString().slice(0, 10), // Current date in YYYY-MM-DD format
  end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().slice(0, 10), // One year from now in YYYY-MM-DD format
  amount_paid: 0,
  level_id: null,
  account_id: customerId,
  cancel_active: true,
});

const membershipValidationAndAdd = async () => {
  await createAccountMembership(formData);
  validationFocus(formData, errors);
  if (Object.keys(errors).length == 0) {
    setModal.value(false);
    fetchList.value();
  }
};
let levels: any = ref([]);
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  levels = await membershipLevels();
  if (levels.value.length > 0) {
    levelOption.value = levels.value.map((item: any) => {
      return {
        id: item.id,
        title: item.name,
        price: item.product.pricing_for_current_site ? item.product.pricing_for_current_site.price_reg : item.product.default_cost
      }

    })
    formData.level_id = levelOption.value.length > 0 ? levelOption.value[0].id : null
  }
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
        <h2 class="mr-auto text-base font-medium">Create Membership</h2>
      </Dialog.Title>

      <Dialog.Description class="max-h-[75vh] overflow-auto">

        <div class="grid grid-cols-12 gap-4 gap-y-3">
          <div class="mt-3 col-span-12">
            <div v-if="!dataLoaded" class="absolute inset-0 flex items-center justify-center  bg-opacity-50">
              <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
            </div>
            <Levels v-if="dataLoaded" :options="levelOption" name="level_id" v-model="formData" title="Membership Level"
              :error="errors.level_id" />
          </div>
          <div class="col-span-12 mt-3 intro-y md:col-span-6">
            <DatePickerField :enable-time-picker="true" name="start_date" v-model="formData" :required="true"
              :error="errors.start_date" title="Start Date" />
          </div>
          <div class="col-span-12 mt-3 intro-y md:col-span-6">
            <DatePickerField :enable-time-picker="true" name="end_date" v-model="formData" :required="true"
              :error="errors.end_date" title="End Date" />
          </div>
          <div class="col-span-12 mt-3 intro-y md:col-span-6">
            <CheckBoxField name="cancel_active" v-model="formData" :error="errors.cancel_active"
              title="Cancel Current Active Membership" />
          </div>
          <div class="col-span-12 mt-3 intro-y md:col-span-6">
            <InputField type="number" :submit-function="membershipValidationAndAdd" name="amount_paid"
              v-model="formData" :error="errors.amount_paid" title="Amount Paid" />
          </div>
        </div>

      </Dialog.Description>
      <Dialog.Footer>
        <SubmitButton :createFunction="membershipValidationAndAdd" :loading="loading" />
      </Dialog.Footer>
    </Dialog.Panel>
  </Dialog>
</template>
