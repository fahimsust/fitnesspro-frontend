<template>
  <div class="flex h-full flex-col">
    <!-- Top nav-->
    <header class="relative flex h-16 flex-shrink-0 items-center bg-white">
      <!-- Logo area -->
      <div class="absolute inset-y-0 left-0 md:static md:flex-shrink-0">
        <a href="/dashboard" class="flex h-16 w-16 items-center justify-center bg-sky-500 
          focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-600 md:w-20">
          <img class="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=white" :alt="company" />
        </a>
      </div>

      <!-- Picker area -->
      <div class="mx-auto md:hidden">
        <div class="relative">
            <slot name="mobileSectionNav" />
        </div>
      </div>

      <!-- Menu button area -->
      <div class="absolute inset-y-0 right-0 flex items-center pr-4 sm:pr-6 md:hidden">
        <!-- Mobile menu button -->
        <button type="button"
          class="-mr-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-slate-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-600"
          @click="mobileMenuOpen = true">
          <span class="sr-only">Open main menu</span>
          <Bars3Icon class="block h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      <!-- Desktop nav area -->
      <div class="hidden md:flex md:min-w-0 md:flex-1 md:items-center md:justify-between">
        <!-- <div class="min-w-0 flex-1">
          <div class="relative max-w-2xl text-gray-400 focus-within:text-gray-500">
            <label for="desktop-search" class="sr-only">Search</label>
            <input id="desktop-search" type="search" placeholder="Search"
              class="block w-full border-transparent pl-12 placeholder-gray-500 focus:border-transparent focus:ring-0 sm:text-sm" />
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-4">
              <MagnifyingGlassIcon class="h-5 w-5" aria-hidden="true" />
            </div>
          </div>
        </div> -->
        <div class="ml-6 flex flex-1 items-center space-x-10 pr-4 justify-between">
          <slot name="sectionNav" />
          
          <div class="flex items-center space-x-8">
            <span class="inline-flex">
              <a href="#" class="-mx-1 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500">
                <span class="sr-only">View notifications</span>
                <BellIcon class="h-6 w-6" aria-hidden="true" />
              </a>
            </span>

            <Menu as="div" class="relative inline-block text-left">
              <MenuButton
                class="flex rounded-full bg-white text-gray-400 hover:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2">
                <span class="sr-only">Open user menu</span>

                <UserCircleIcon class="h-6 w-6" aria-hidden="true" />
              </MenuButton>

              <transition enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95">
                <MenuItems
                  class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div class="py-1">
                    <MenuItem v-slot="{ active }">
                    <a href="#" :class="[active ? 'bg-slate-100' : '', 'block px-4 py-2 text-sm text-gray-700']">{{
                        user.data.name
                    }}</a>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                    <a href="#" @click="logout"
                      :class="[active ? 'bg-slate-100' : '', 'block px-4 py-2 text-sm text-gray-700']">Sign Out</a>
                    </MenuItem>
                  </div>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
      </div>

      <!-- Mobile menu, show/hide this `div` based on menu open/closed state -->
      <TransitionRoot as="template" :show="mobileMenuOpen">
        <Dialog as="div" class="relative z-40 md:hidden" @close="mobileMenuOpen = false">
          <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0"
            enter-to="opacity-100" leave="transition-opacity ease-linear duration-300" leave-from="opacity-100"
            leave-to="opacity-0">
            <div class="hidden sm:fixed sm:inset-0 sm:block sm:bg-gray-600 sm:bg-opacity-75" />
          </TransitionChild>

          <div class="fixed inset-0 z-40">
            <TransitionChild as="template" enter="transition ease-out duration-150 sm:ease-in-out sm:duration-300"
              enter-from="transform opacity-0 scale-110 sm:translate-x-full sm:scale-100 sm:opacity-100"
              enter-to="transform opacity-100 scale-100  sm:translate-x-0 sm:scale-100 sm:opacity-100"
              leave="transition ease-in duration-150 sm:ease-in-out sm:duration-300"
              leave-from="transform opacity-100 scale-100 sm:translate-x-0 sm:scale-100 sm:opacity-100"
              leave-to="transform opacity-0 scale-110  sm:translate-x-full sm:scale-100 sm:opacity-100">
              <DialogPanel
                class="fixed inset-0 z-40 h-full w-full bg-white sm:inset-y-0 sm:left-auto sm:right-0 sm:w-full sm:max-w-sm sm:shadow-lg"
                aria-label="Global">
                <div class="flex h-16 items-center justify-between px-4 sm:px-6">
                  <a href="#">
                    <img class="block h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=sky&shade=500"
                      alt="Your Company" />
                  </a>
                  <button type="button"
                    class="-mr-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-slate-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-600"
                    @click="mobileMenuOpen = false">
                    <span class="sr-only">Close main menu</span>
                    <XMarkIcon class="block h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <!-- <div class="max-w-8xl mx-auto mt-2 px-4 sm:px-6">
                  <div class="relative text-gray-400 focus-within:text-gray-500">
                    <label for="mobile-search" class="sr-only">Search all inboxes</label>
                    <input id="mobile-search" type="search" placeholder="Search all inboxes"
                      class="block w-full rounded-md border-gray-300 pl-10 placeholder-gray-500 focus:border-sky-600 focus:ring-sky-600" />
                    <div class="absolute inset-y-0 left-0 flex items-center justify-center pl-3">
                      <MagnifyingGlassIcon class="h-5 w-5" aria-hidden="true" />
                    </div>
                  </div>
                </div> -->
                <div class="max-w-8xl mx-auto py-3 px-2 sm:px-4">
                  <NuxtLink v-for="item in sidebarNavigation" :key="item.name" :to="item.href" 
                  :class="[item.href == route.path ? 'bg-gray-900 text-white' : 'text-gray-400 hover:bg-gray-700',
                  'block py-2 px-3 font-medium text-gray-900 hover:bg-slate-100 rounded-sm flex gap-1']">
                    <component :is="item.icon" class="h-6 w-6" aria-hidden="true" />
                    <span>{{ item.name }}</span>
                  </NuxtLink>
                </div>
                <div class="border-t border-gray-200 pt-4 pb-3">
                  <div class="max-w-8xl mx-auto flex items-center px-4 sm:px-6">
                    <div class="flex-shrink-0 flex gap-1 text-gray-400">
                      <UserCircleIcon class="h-8 w-8" />
                      <span class="self-center text-gray-800">
                        {{ user.data.name }}
                      </span>
                    </div>
                    <div class="ml-3 min-w-0 flex-1">
                      <div class="truncate text-base font-medium text-gray-800">{{ user.name }}</div>
                      <div class="truncate text-sm font-medium text-gray-500">{{ user.email }}</div>
                    </div>
                    <a href="#" class="ml-auto flex-shrink-0 bg-white p-2 text-gray-400 hover:text-gray-500">
                      <span class="sr-only">View notifications</span>
                      <BellIcon class="h-6 w-6" aria-hidden="true" />
                    </a>
                  </div>
                  <div class="max-w-8xl mx-auto mt-3 space-y-1 px-2 sm:px-4">
                    <button v-for="item in userNavigation" :key="item.name" @click="logout"
                      class="block rounded-md py-2 px-3 text-base font-medium text-gray-900 hover:bg-gray-50">{{
                          item.name
                      }}</button>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </TransitionRoot>
    </header>

    <!-- Bottom section -->
    <div class="flex min-h-0 flex-1 overflow-hidden">
      <!-- Narrow sidebar-->
      <nav aria-label="Sidebar" class="hidden md:block md:flex-shrink-0 md:overflow-y-auto md:bg-gray-800">
        <div class="relative flex w-20 flex-col space-y-3 p-3">
          <NuxtLink v-for="item in sidebarNavigation" :key="item.name" :to="item.href"
            :class="[item.href == route.path ? 'bg-gray-900 text-white' : 'text-gray-400 hover:bg-gray-700', 'flex-shrink-0 inline-flex items-center justify-center h-14 w-14 rounded-lg']">
            <span class="sr-only">{{ item.name }}</span>
            <component :is="item.icon" class="h-6 w-6" aria-hidden="true" />
          </NuxtLink>
        </div>
      </nav>

      <!-- Main area -->
      <main class="min-w-0 flex-1 border-t border-gray-200 lg:flex">
        <!-- Primary column -->
        <section aria-labelledby="primary-heading"
          class="flex h-full min-w-0 flex-1 flex-col overflow-y-auto lg:order-last">
          <h1 id="primary-heading" class="sr-only">Home</h1>
          <!-- Your content -->
          <div class="bg-sky-700 pb-20">
            <Disclosure v-if="hasPageNav" as="nav" class="bg-sky-700">
              <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div class="border-b border-sky-500">
                  <div class="flex h-14 items-center justify-between px-4 sm:px-0">
                    <div class="lg:flex items-baseline space-x-4">
                      <slot name="pageNav" />
                    </div>
                  </div>
                </div>
              </div>
            </Disclosure>
            <header class="py-5">
              <div class="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 class="text-2xl tracking-tight text-white">
                  <slot name="heading" />
                </h1>
                <slot name="headingAction" />
              </div>
            </header>
          </div>

          <main class="-mt-20">
            <div class="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
              <slot />
            </div>
          </main>
        </section>

        <!-- Secondary column (hidden on smaller screens) -->
        <!-- <aside class="hidden lg:order-first lg:block lg:flex-shrink-0">
          <div class="relative flex h-full w-96 flex-col overflow-y-auto border-r border-gray-200 bg-slate-100">
          </div>
        </aside> -->
      </main>
    </div>
  </div>
</template>
<script setup>
import {
  Dialog,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
  TransitionRoot,
  Disclosure, 
  DisclosureButton, 
  DisclosurePanel
} from '@headlessui/vue'

import {
  Bars3Icon,
  BellIcon,
  FlagIcon,
  InboxIcon,
  NoSymbolIcon,
  PencilSquareIcon,
  UserCircleIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  ChartPieIcon,
  ShoppingCartIcon,
  SwatchIcon,
  UsersIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  BanknotesIcon,
  ChevronDownIcon
} from '@heroicons/vue/24/outline'

import { storeToRefs } from 'pinia';

import { onMounted, useSlots } from 'vue';

const { isLoggedIn, user, logout } = useAuth()
const route = useRoute()

useHead({
  htmlAttrs: {
    class: "h-full bg-gray-100"
  },
  bodyAttrs: {
    class: "h-full overflow-hidden"
  }
})

const company = useRuntimeConfig().public.company

const sidebarNavigation = [
  { name: 'Orders', href: '/orders', icon: ShoppingCartIcon },
  { name: 'Catalog', href: '/catalog', icon: SwatchIcon },
  { name: 'Customers', href: '/customers', icon: UsersIcon },
  { name: 'Reports', href: '/reports', icon: ChartPieIcon },
  { name: 'Content', href: '/content/pages', icon: DocumentTextIcon },
  { name: 'Affiliates', href: '/affiliates', icon: BanknotesIcon },
  { name: 'Settings', href: '/settings/sites', icon: AdjustmentsHorizontalIcon },
]

const userNavigation = [
  { name: 'Log out', click: "logout" },
]

const mobileMenuOpen = ref(false)

const slots = useSlots()

const hasPageNav = computed(() =>  slots.pageNav)
</script>