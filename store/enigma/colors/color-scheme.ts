import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core"

const colorSchemes = [
  "default",
  "theme-1",
  "theme-2",
  "theme-3",
  "theme-4",
] as const;

export type ColorSchemes = typeof colorSchemes[number];

interface ColorSchemeState {
  colorSchemeValue: ColorSchemes;
}

const getColorScheme = (colorScheme) => {
  return colorSchemes.filter((item, key) => {
    return item === colorScheme;
  })[0]
}

export const useColorSchemeStore = defineStore("colorScheme", {
  state: (): ColorSchemeState => ({
    colorSchemeValue: "theme-1",
    // localStorage.getItem("colorScheme") === null
    // ? "default"
    // : getColorScheme(),
  }),
  getters: {
    colorScheme(state) {
      return getColorScheme(this.colorSchemeValue);
    },
  },
  actions: {
    setColorScheme(colorScheme: ColorSchemes) {
      this.colorSchemeValue = colorScheme;
    },
  },
  persist: true
});
