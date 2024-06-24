<script setup lang="ts">
import { useDarkModeStore } from "~/store/enigma/colors/dark-mode";
import { computed, onMounted } from "vue";
import { FormSwitch } from "~/components/enigma/base-components/Form";

const darkMode = computed(() => useDarkModeStore().darkMode);

const setDarkModeClass = () => {
  const el = document.querySelectorAll("html")[0];
  darkMode.value ? el.classList.add("dark") : el.classList.remove("dark");
};

const switchMode = (event: any) => {
  useDarkModeStore().setDarkMode(!darkMode.value);
  setDarkModeClass();
  event.stopPropagation();
};
</script>

<template>
  <FormSwitch.Label> DarkMode </FormSwitch.Label>
  <FormSwitch.Input
    class="ml-2 bg-darkmode-800 before:bg-white"
    v-model="darkMode"
    type="checkbox"
    @click="switchMode($event)"
  />
</template>
