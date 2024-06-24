<script setup lang="ts">
import { useRoute } from "vue-router";
import { useDarkModeStore } from "~/store/enigma/colors/dark-mode";
import MobileMenu from "../components/enigma/MobileMenu";
import TopBar from "../components/enigma/TopBar";
import MenuLink from "./TopMenu/MenuLink.vue";
import Button from "~/components/enigma/base-components/Button";
import _ from "lodash";
import { useTopMenuStore } from "~/store/enigma/menus/top-menu";
import { type FormattedMenu, nestedMenu } from "./TopMenu/top-menu";
import { watch, reactive, computed, onMounted } from "vue";

const darkMode = computed(() => useDarkModeStore().darkMode);
const router = useRouter();

const route = useRoute();
let formattedMenu = reactive<Array<FormattedMenu>>([]);
const setFormattedMenu = (computedFormattedMenu: Array<FormattedMenu>) => {
  Object.assign(formattedMenu, computedFormattedMenu);
};
const setDarkModeClass = () => {
  const el = document.querySelectorAll("html")[0];
  darkMode.value ? el.classList.add("dark") : el.classList.remove("dark");
};
const topMenuStore = useTopMenuStore();
const topMenu = computed(() => nestedMenu(topMenuStore.menu, route));

watch(topMenu, () => {
  setFormattedMenu(topMenu.value);
});

onMounted(() => {
  setFormattedMenu(topMenu.value);
  setDarkModeClass();
});
const login = () => {
  router.push("/login");
};
const { isMemberLoggedIn, account, logout } = useAccountAuth()
</script>

<template>
  <div class="py-5 md:py-0">
    <DarkModeSwitcher />
    <!-- BEGIN: Top Menu -->
    <Button @click="logout" class="ml-16 mt-5" variant="primary" v-if="isMemberLoggedIn">Logout</Button>
    <Button @click="login" class="ml-16 mt-5" variant="primary" v-if="!isMemberLoggedIn">Login</Button>
    <nav :class="[
      'relative z-50 hidden pt-4 -mt-4 md:block',

      // Animation
      'opacity-0 animate-[0.4s_ease-in-out_0.2s_intro-top-menu] animate-fill-mode-forwards',
    ]">
      <ul class="flex flex-wrap px-6 xl:px-[50px]">
        <li v-for="(menu, menuKey) in formattedMenu" :class="[
          'relative [&:hover>ul]:block [&:hover>a>div:nth-child(2)>svg]:rotate-180',
          !menu.active &&
          '[&:hover>a]:bg-slate-100 [&:hover>a]:dark:bg-transparent',
          !menu.active &&
          '[&:hover>a]:before:content-[\'\'] [&:hover>a]:before:block [&:hover>a]:before:inset-0 [&:hover>a]:before:rounded-full [&:hover>a]:xl:before:rounded-xl [&:hover>a]:before:absolute [&:hover>a]:before:z-[-1] [&:hover>a]:before:border-b-[3px] [&:hover>a]:before:border-solid [&:hover>a]:before:border-black/[0.08] [&:hover>a]:before:dark:bg-darkmode-700',
        ]" :key="menuKey">
          <MenuLink :class="{
            // Animation
            [`opacity-0 translate-y-[50px] animate-[0.4s_ease-in-out_0.3s_intro-menu] animate-fill-mode-forwards animate-delay-${(menuKey + 1) * 10
              }`]: !menu.active,
          }" :menu="menu" level="first"></MenuLink>
          <!-- BEGIN: Second Child -->
          <ul v-if="menu.subMenu" :class="[
            'shadow-[0px_3px_20px_#00000014] dark:shadow-[0px_3px_7px_#0000001c] bg-slate-100 dark:bg-darkmode-600 hidden w-56 absolute rounded-md z-20 px-0 mt-1',
            'before:content-[\'\'] before:block before:absolute before:w-full before:h-full before:bg-white/[0.04] before:inset-0 before:rounded-md before:z-[-1] dark:before:bg-black/10',
            'after:content-[\'\'] after:w-full after:h-1 after:absolute after:top-0 after:left-0 after:-mt-1 after:cursor-pointer',
          ]">
            <li v-for="(subMenu, subMenuKey) in menu.subMenu"
              class="px-5 relative [&:hover>ul]:block [&:hover>a>div:nth-child(2)>svg]:-rotate-90" :key="subMenuKey">
              <MenuLink :menu="subMenu" level="second"></MenuLink>
              <!-- BEGIN: Third Child -->
              <ul v-if="subMenu.subMenu" :class="[
                'shadow-[0px_3px_20px_#00000014] dark:shadow-[0px_3px_7px_#0000001c] left-[100%] bg-slate-100 dark:bg-darkmode-600 hidden w-56 absolute rounded-md mt-0 ml-0 top-0 z-20 px-0',
                'before:content-[\'\'] before:block before:absolute before:w-full before:h-full before:bg-white/[0.04] before:inset-0 before:rounded-md before:z-[-1] dark:before:bg-black/10',
                'after:content-[\'\'] after:w-full after:h-1 after:absolute after:top-0 after:left-0 after:-mt-1 after:cursor-pointer',
              ]">
                <li v-for="(lastSubMenu, lastSubMenuKey) in subMenu.subMenu"
                  class="px-5 relative [&:hover>ul]:block [&:hover>a>div:nth-child(2)>svg]:-rotate-90"
                  :key="lastSubMenuKey">
                  <MenuLink :menu="lastSubMenu" level="third"></MenuLink>
                </li>
              </ul>
              <!-- END: Third Child -->
            </li>
          </ul>
          <!-- END: Second Child -->
        </li>
      </ul>
    </nav>
    <!-- END: Top Menu -->
    <!-- BEGIN: Content -->
    <div :class="[
      'max-w-full md:max-w-none px-4 md:px-5 min-w-0 min-h-screen bg-slate-100 flex-1 pb-10 mt-5 relative dark:bg-darkmode-700',
      'before:content-[\'\'] before:w-full before:h-px before:block',
      'w-11/12 mx-auto'
    ]">
      <RouterView />
    </div>

    <!-- END: Content -->
  </div>
</template>
