import { defineStore } from "pinia";
import { useStorage, useLocalStorage } from "@vueuse/core"

interface DarkModeState {
  darkModeValue: boolean;
}

export const useDarkModeStore = defineStore("darkMode", {
  state: (): DarkModeState => ({
    darkModeValue: false,
  }),
  getters: {
    darkMode(state) {
      return state.darkModeValue;
    },
  },
  actions: {
    setDarkMode(darkMode: boolean) {
      // localStorage.setItem("darkMode", darkMode.toString());
      this.darkModeValue = darkMode;
    },
  },
  persist: true,
});
