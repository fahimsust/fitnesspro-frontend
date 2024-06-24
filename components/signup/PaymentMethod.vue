<script lang="ts" setup>
import { toRefs } from "vue";
import { SelectField, SubmitButton } from "~/components/form"

const props = defineProps({
  goToStep: {
    required: true,
    type: Function,
  },
});
const { goToStep } = toRefs(props)
const { paymentMethods, savePaymentMethod, errors, loading, accountPaymentMethods } = useAccount()
const payments = await paymentMethods();
const accountPayment = await accountPaymentMethods();
let form = reactive({
  payment_method_id: accountPayment.value.id,
});

const validateAndCreate = async () => {
  await savePaymentMethod(form);
  validationFocus(form, errors);
  if (Object.keys(errors).length == 0) {
    goToStep.value(5);
  }
};
</script>
<template>
  <div class="px-5 mt-10">
    <div class="text-lg font-medium text-center">Payment Method</div>
  </div>
  <div class="px-5 pt-10 mt-10 border-t sm:px-20 border-slate-200/60 dark:border-darkmode-400">
    <div class="grid grid-cols-12 gap-4 mt-5 gap-y-5">
      <div class="col-span-12 intro-y sm:col-span-12">
        <SelectField name="payment_method_id" :options="payments" v-model="form" :error="errors.payment_method_id"
          title="Select Payment Method" :required="true" />
      </div>
      <div class="flex items-center justify-center col-span-12 mt-5 intro-y sm:justify-end">
        <SubmitButton buttonText="Next" :createFunction="validateAndCreate" :loading="loading" />
      </div>
    </div>
  </div>
</template>