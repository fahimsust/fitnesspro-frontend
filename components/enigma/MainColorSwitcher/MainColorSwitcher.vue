<script setup lang="ts">
import { useDarkModeStore } from "../../../store/enigma/colors/dark-mode";
import { useColorSchemeStore, type ColorSchemes } from "../../../store/enigma/colors/color-scheme";
import { computed, onMounted } from "vue";

const colorScheme = computed(() => useColorSchemeStore().setColorScheme);
const darkMode = computed(() => useDarkModeStore().darkMode);

const setColorSchemeClass = () => {
  const el = document.querySelectorAll("html")[0];
  el.setAttribute("class", colorScheme.value.toString());
  darkMode.value && el.classList.add("dark");
};

const switchColorScheme = (colorScheme: ColorSchemes) => {
  useColorSchemeStore().setColorScheme(colorScheme);
  setColorSchemeClass();
};

onMounted(() => setColorSchemeClass())
</script>

<template>
  <!-- BEGIN: Main Color Switcher -->
  <div
    class="fixed bottom-0 right-0 z-50 flex items-center justify-center h-12 px-5 mb-10 border rounded-full shadow-md box mr-52"
  >
    <div class="hidden mr-4 sm:block text-slate-600 dark:text-slate-200">
      Color Scheme
    </div>
    <a
      @click="switchColorScheme('default')"
      :class="[
        'block w-8 h-8 cursor-pointer bg-cyan-900 rounded-full border-4 mr-1 hover:border-slate-200',
        {
          'border-slate-300 dark:border-darkmode-800/80':
            colorScheme.toString() == 'default',
        },
        { 'border-white dark:border-darkmode-600': colorScheme.toString() != 'default' },
      ]"
    ></a>
    <a
      @click="switchColorScheme('theme-1')"
      :class="[
        'block w-8 h-8 cursor-pointer bg-blue-800 rounded-full border-4 mr-1 hover:border-slate-200',
        {
          'border-slate-300 dark:border-darkmode-800/80':
            colorScheme.toString() == 'theme-1',
        },
        { 'border-white dark:border-darkmode-600': colorScheme.toString() != 'theme-1' },
      ]"
    ></a>
    <a
      @click="switchColorScheme('theme-2')"
      :class="[
        'block w-8 h-8 cursor-pointer bg-blue-900 rounded-full border-4 mr-1 hover:border-slate-200',
        {
          'border-slate-300 dark:border-darkmode-800/80':
            colorScheme.toString() == 'theme-2',
        },
        { 'border-white dark:border-darkmode-600': colorScheme.toString() != 'theme-2' },
      ]"
    ></a>
    <a
      @click="switchColorScheme('theme-3')"
      :class="[
        'block w-8 h-8 cursor-pointer bg-emerald-900 rounded-full border-4 mr-1 hover:border-slate-200',
        {
          'border-slate-300 dark:border-darkmode-800/80':
            colorScheme.toString() == 'theme-3',
        },
        { 'border-white dark:border-darkmode-600': colorScheme.toString() != 'theme-3' },
      ]"
    ></a>
    <a
      @click="switchColorScheme('theme-4')"
      :class="[
        'block w-8 h-8 cursor-pointer bg-indigo-900 rounded-full border-4 hover:border-slate-200',
        {
          'border-slate-300 dark:border-darkmode-800/80':
            colorScheme.toString() == 'theme-4',
        },
        { 'border-white dark:border-darkmode-600': colorScheme.toString() != 'theme-4' },
      ]"
    ></a>
  </div>
  <!-- END: Main Color Switcher -->
</template>
