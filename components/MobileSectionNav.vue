<template>
  <Menu as="div" class="relative inline-block text-left">
    <div>
      <MenuButton
        class="flex w-full flex-1 rounded-md border border-sky-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
      >
        {{ navigation[0].name }}
        <ChevronDownIcon class="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
      </MenuButton>
    </div>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems
        class="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        <div class="py-1">
          <template v-for="item in navigation" :key="item.name">
            <MenuItem>
              <nuxt-link
                :to="item.href"
                :class="[
                  route.path == item.href
                    ? 'bg-slate-100 text-gray-900'
                    : 'text-gray-700',
                  'group flex items-center px-4 py-2 text-sm',
                ]"
              >
                {{ item.name }}
              </nuxt-link>
            </MenuItem>
          </template>
        </div>
      </MenuItems>
    </transition>
  </Menu>
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
} from "@headlessui/vue";

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
  ChevronDownIcon,
} from "@heroicons/vue/24/outline";

const props = defineProps(["nav"]);

const navigation = props.nav;

const route = useRoute();
</script>
