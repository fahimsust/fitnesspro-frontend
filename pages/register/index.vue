<script setup lang="ts">
import _ from "lodash";
import { InputField, SubmitButton } from "~/components/form";
import Button from "~/components/enigma/base-components/Button";
import Basic from "~/components/signup/Basic.vue";
import MembershipLevel from "~/components/signup/MembershipLevel.vue";
import Address from "~/components/signup/Address.vue";
import PaymentMethod from "~/components/signup/PaymentMethod.vue";
import DiscountCode from "~/components/signup/DiscountCode.vue";
import Affiliate from "~/components/signup/Affiliate.vue";

definePageMeta({
  middleware: ["guest"],
  layout: "front-end",
});

useHead({
  title: "Sign Up: " + useRuntimeConfig().public.company,
});
const reloadComponent = ref(0)
const { accountData } = useAccount();

let step = ref(1);
const account = await accountData();
if (account.value) {
  step.value = 2;
}
const goToStep = (stepNumber: number) => {
  reloadComponent.value = reloadComponent.value + 1
  step.value = stepNumber;
};
</script>

<template>
  <div class="flex items-center mt-8">
    <h2 class="mr-auto text-lg font-medium intro-y">
      Account Membership Signup
    </h2>
  </div>
  <!-- BEGIN: Wizard Layout -->
  <div class="py-10 mt-5 intro-y box sm:py-20">
    <div class="flex justify-center">
      <!-- Step 1 Button -->
      <Button @click="() => {
        if (step > 1) goToStep(1);
      }
        " :class="[
    step === 1
      ? 'bg-primary text-white cursor-default'
      : 'bg-slate-100 text-slate-500',
    'w-10 h-10 mx-2 rounded-full intro-y',
    step > 1 ? 'cursor-pointer' : 'cursor-default',
  ]" :variant="step === 1 ? 'primary' : 'outline-primary'">
        1
      </Button>

      <!-- Step 2 Button -->
      <Button @click="() => {
        if (step > 2) goToStep(2);
      }
        " :class="[
    step === 2
      ? 'bg-primary text-white cursor-default'
      : 'bg-slate-100 text-slate-500',
    'w-10 h-10 mx-2 rounded-full intro-y',
    step > 2 ? 'cursor-pointer' : 'cursor-default',
  ]" :variant="step === 2 ? 'primary' : 'outline-primary'">
        2
      </Button>

      <!-- Step 3 Button -->
      <Button @click="() => {
        if (step > 3) goToStep(3);
      }
        " :class="[
    step === 3
      ? 'bg-primary text-white cursor-default'
      : 'bg-slate-100 text-slate-500',
    'w-10 h-10 mx-2 rounded-full intro-y',
    step > 3 ? 'cursor-pointer' : 'cursor-default',
  ]" :variant="step === 3 ? 'primary' : 'outline-primary'">
        3
      </Button>

      <!-- Step 4 Button -->
      <Button @click="() => {
        if (step > 4) goToStep(4);
      }
        " :class="[
    step === 4
      ? 'bg-primary text-white cursor-default'
      : 'bg-slate-100 text-slate-500',
    'w-10 h-10 mx-2 rounded-full intro-y',
    step > 4 ? 'cursor-pointer' : 'cursor-default',
  ]" :variant="step === 4 ? 'primary' : 'outline-primary'">
        4
      </Button>

      <!-- Step 5 Button -->
      <Button @click="() => {
        if (step > 5) goToStep(5);
      }
        " :class="[
    step === 5
      ? 'bg-primary text-white cursor-default'
      : 'bg-slate-100 text-slate-500',
    'w-10 h-10 mx-2 rounded-full intro-y',
    step > 5 ? 'cursor-pointer' : 'cursor-default',
  ]" :variant="step === 5 ? 'primary' : 'outline-primary'">
        5
      </Button>
      <!-- Step 6 Button -->
      <Button @click="() => {
        if (step > 6) goToStep(6);
      }
        " :class="[
    step === 6
      ? 'bg-primary text-white cursor-default'
      : 'bg-slate-100 text-slate-500',
    'w-10 h-10 mx-2 rounded-full intro-y',
    step > 6 ? 'cursor-pointer' : 'cursor-default',
  ]" :variant="step === 6 ? 'primary' : 'outline-primary'">
        6
      </Button>
    </div>

    <transition enter-active-class="transition-opacity duration-300" leave-active-class="transition-opacity duration-300"
      enter-class="opacity-0" leave-to-class="opacity-0">
      <Basic v-if="step === 1" :key="reloadComponent" :goToStep="goToStep" />
    </transition>
    <transition enter-active-class="transition-opacity duration-300" leave-active-class="transition-opacity duration-300"
      enter-class="opacity-0" leave-to-class="opacity-0">
      <MembershipLevel v-if="step === 2" :key="reloadComponent" :goToStep="goToStep" />
    </transition>
    <transition enter-active-class="transition-opacity duration-300" leave-active-class="transition-opacity duration-300"
      enter-class="opacity-0" leave-to-class="opacity-0">
      <Address v-if="step === 3" :key="reloadComponent" :goToStep="goToStep" />
    </transition>
    <transition enter-active-class="transition-opacity duration-300" leave-active-class="transition-opacity duration-300"
      enter-class="opacity-0" leave-to-class="opacity-0">
      <PaymentMethod v-if="step === 4" :key="reloadComponent" :goToStep="goToStep" />
    </transition>
    <transition enter-active-class="transition-opacity duration-300" leave-active-class="transition-opacity duration-300"
      enter-class="opacity-0" leave-to-class="opacity-0">
      <DiscountCode v-if="step === 5" :key="reloadComponent" :goToStep="goToStep" />
    </transition>
    <transition enter-active-class="transition-opacity duration-300" leave-active-class="transition-opacity duration-300"
      enter-class="opacity-0" leave-to-class="opacity-0">
      <Affiliate v-if="step === 6" :key="reloadComponent" :goToStep="goToStep" />
    </transition>
  </div>
  <!-- END: Wizard Layout -->
</template>
