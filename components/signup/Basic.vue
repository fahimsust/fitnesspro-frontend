<script lang="ts" setup>
import { toRefs } from "vue";
import { InputField, SubmitButton } from "~/components/form"
import Button from "~/components/enigma/base-components/Button";

const props = defineProps({
  goToStep: {
    required: true,
    type: Function,
  },
});
const { goToStep } = toRefs(props);
const { createAccount, errors, loading, accountData } = useAccount()

const registration = await accountData();

let form = reactive({
  username: registration.value ? registration.value.account.username : "",
  email: registration.value ? registration.value.account.email : "",
  password: "",
  first_name: registration.value ? registration.value.account.first_name : "",
  last_name: registration.value ? registration.value.account.last_name : "",
  phone: registration.value ? registration.value.account.phone : "",
  email_confirmation: registration.value ? registration.value.account.email : "",
  password_confirmation: ""
});

const validateAndCreate = async () => {
  await createAccount(form);
  validationFocus(form, errors);
  if (Object.keys(errors).length == 0) {
    goToStep.value(2);
  }
};
</script>
<template>
  <div class="px-5 mt-10">
    <div class="text-lg font-medium text-center">Basic Account Information</div>
    <div class="mt-2 text-center text-slate-500">
      <b class="text-red-500">*</b> indicates required field
    </div>
  </div>
  <div class="px-5 pt-10 mt-10 border-t sm:px-20 border-slate-200/60 dark:border-darkmode-400">
    <div class="text-base font-medium">Profile Settings</div>
    <div class="grid grid-cols-12 gap-4 mt-5 gap-y-5">
      <div class="col-span-12 intro-y sm:col-span-6">
        <InputField name="username" v-model="form" :error="errors.username" title="Enter the username you'd like to use"
          :required="true" />
      </div>
      <div class="col-span-12 intro-y sm:col-span-6">
        <InputField name="email" type="email" v-model="form" :error="errors.email" title="Your Email Address"
          :required="true" />
      </div>
      <div class="col-span-12 intro-y sm:col-span-6">
        <InputField name="email_confirmation" type="email" v-model="form" :error="errors.email_confirmation"
          title="Retype Email Address to confirm" :required="true" />
      </div>
      <div class="col-span-12 intro-y sm:col-span-6">
        <InputField name="password" type="password" v-model="form" :error="errors.password"
          title="Enter the password you'd like to use" :required="true" />
      </div>
      <div class="col-span-12 intro-y sm:col-span-6">
        <InputField name="password_confirmation" type="password" v-model="form" :error="errors.password_confirmation"
          title="Retype password to confirm" :required="true" />
      </div>
      <div class="col-span-12 intro-y sm:col-span-6">
        <InputField name="first_name" v-model="form" :error="errors.first_name" title="Your First Name"
          :required="true" />
      </div>
      <div class="col-span-12 intro-y sm:col-span-6">
        <InputField name="last_name" v-model="form" :error="errors.last_name" title="Your Last Name" :required="true" />
      </div>
      <div class="col-span-12 intro-y sm:col-span-6">
        <InputField name="phone" v-model="form" :error="errors.phone" title="Your Phone Number" :required="true" />
      </div>
      <div class="flex items-center justify-center col-span-12 mt-5 intro-y sm:justify-end">
        <SubmitButton buttonText="Next" :createFunction="validateAndCreate" :loading="loading" />
      </div>
    </div>
  </div>
</template>
