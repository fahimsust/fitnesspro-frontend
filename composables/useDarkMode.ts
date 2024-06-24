import { useDarkModeStore } from "../store/enigma/colors/dark-mode";

export const useDarkMode = (useDarkModeStore) => {
    const darkMode = computed(() => useDarkModeStore().darkMode);

    const setDarkModeClass = () => {
        const el = document.querySelectorAll("html")[0];
        darkMode.value ? el.classList.add("dark") : el.classList.remove("dark");
    };

    const switchMode = () => {
      useDarkModeStore().setDarkMode(!darkMode.value);
      setDarkModeClass();
    };

    return {
        darkMode,
        setDarkModeClass,
        switchMode
    }
}