<script setup lang="ts">
import { LockClosedIcon } from "@heroicons/vue/20/solid";
import DarkModeSwitcher from "../components/enigma/DarkModeSwitcher";
import logoUrl from "../assets/images/logo-icon.png";
import { FormInput, FormCheck } from "../components/enigma/base-components/Form";
import Button from "../components/enigma/base-components/Button";
import LoadingIcon from "~/components/enigma/base-components/LoadingIcon/LoadingIcon.vue";

definePageMeta({
  middleware: ["guest-member"],
  layout: false,
});

useHead({
  title: "Sign In",
});

const router = useRouter();
const route = useRoute();
const { login } = useAccountAuth();

let form = {
  username: null,
  password: null,
  remember: false,
};

const status = ref(
  (route.query.reset ?? "").length > 0 ? atob(route.query.reset as string) : ""
);
const errors = ref<Record<string, string[]>>({});
const loading = ref(false)
async function submitForm() {
  loading.value = true
  errors.value = {};
  status.value = "";
  await login(form);
  loading.value = false
}
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
              Sign In
            </h2>
            <form @submit.prevent="submitForm" method="POST">
              <div class="mt-8 intro-x">
                <FormInput type="text" v-model="form.username" name="username"
                  class="block px-4 py-3 intro-x login__input min-w-full xl:min-w-[350px]" placeholder="Username" />
                <FormInput type="password" v-model="form.password" name="password"
                  class="block px-4 py-3 mt-4 intro-x login__input min-w-full xl:min-w-[350px]" placeholder="Password" />
              </div>
              <div class="flex mt-4 text-xs intro-x text-slate-600 dark:text-slate-500 sm:text-sm">
                <div class="flex items-center mr-auto">
                  <FormCheck.Input v-model="form.remember" id="remember-me" type="checkbox" class="mr-2 border" />
                  <label class="cursor-pointer select-none" htmlFor="remember-me">
                    Remember me
                  </label>
                </div>
                <NuxtLink to="/frontend/forgot-password">Forgot Password?</NuxtLink>
              </div>
              <div class="mt-5 text-center intro-x xl:mt-8 xl:text-left">
                <Button type="submit" v-if="loading == false" variant="primary" class="w-full px-4 py-3 align-top xl:w-32 xl:mr-3">
                  Login
                </Button>
                <Button  variant="primary" class="w-full px-4 py-3 align-top xl:w-32 xl:mr-3">
                    login...
                    <LoadingIcon icon="oval" color="white" class="w-4 h-4 ml-2" />
                </Button>
              </div>
            </form>
          </div>
        </div>
        <!-- END: Login Form -->
      </div>
    </div>
  </div>
</template>
