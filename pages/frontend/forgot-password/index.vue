<script setup lang="ts">
import _ from "lodash";
import DarkModeSwitcher from "~/components/enigma/DarkModeSwitcher";
import logoUrl from "~/assets/images/logo-icon.png";
import { InputField, SubmitButton, EditorField } from "~/components/form";

definePageMeta({
  middleware: ["guest-member"],
  layout: false,
});

useHead({
  title: "Forgot Password",
});

const { forgotPassword, loading, errors } = useAccountAuth();

let form = {
  email: null,
};
const submitData = async () => {
  await forgotPassword(form);
  validationFocus(form, errors);
};
</script>
<template>
  <div :class="[
    '-m-3 sm:-mx-8 p-3 sm:px-8 relative h-screen lg:overflow-hidden bg-primary xl:bg-white dark:bg-darkmode-800 xl:dark:bg-darkmode-600',
    'before:hidden before:xl:block before:content-[\'\'] before:w-[57%] before:-mt-[28%] before:-mb-[16%] before:-ml-[13%] before:absolute before:inset-y-0 before:left-0 before:transform before:rotate-[-4.5deg] before:bg-primary/20 before:rounded-[100%] before:dark:bg-darkmode-400',
    'after:hidden after:xl:block after:content-[\'\'] after:w-[57%] after:-mt-[20%] after:-mb-[13%] after:-ml-[13%] after:absolute after:inset-y-0 after:left-0 after:transform after:rotate-[-4.5deg] after:bg-primary after:rounded-[100%] after:dark:bg-darkmode-700',
  ]">
    <DarkModeSwitcher />
    <!-- <MainColorSwitcher /> -->
    <div class="container relative z-10 sm:px-10">
      <div class="block grid-cols-2 gap-4 xl:grid">
        <!-- BEGIN: Login Info -->
        <div class="flex-col hidden min-h-screen xl:flex">
          <a href="" class="flex items-center pt-5 -intro-x">
            <img alt="Midone Tailwind HTML Admin Template" class="w-24" :src="logoUrl" />
          </a>
        </div>
        <!-- END: Login Info -->
        <!-- BEGIN: Login Form -->
        <div class="flex h-screen py-5 my-10 xl:h-auto xl:py-0 xl:my-0">
          <div
            class="w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md xl:ml-20 dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto">
            <h2 class="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left">
              Forgot Password
            </h2>
            <div class="mt-4 intro-x">
              <InputField classProp="block px-4 py-3 intro-x login__input min-w-full xl:min-w-[350px]" name="email"
                :submit-function="submitData" v-model="form" :error="errors.email" title="Email" :required="true"
                :formInline="true" />
            </div>
            <div
              class="flex mt-4 justify-between text-right text-xs intro-x text-slate-600 dark:text-slate-500 sm:text-sm">
              <div class="flex items-center mr-auto">
                <NuxtLink to="/login">Back to login</NuxtLink>
              </div>
              <NuxtLink to="/frontend/forgot-username">Forgot Username?</NuxtLink>
            </div>
            <div class="mt-4 text-center intro-x xl:mt-4 xl:text-left">
              <SubmitButton :createFunction="submitData" button-text="submit" button-loading="sending"
                :loading="loading" />
            </div>
          </div>
        </div>
        <!-- END: Login Form -->
      </div>
    </div>
  </div>
</template>
