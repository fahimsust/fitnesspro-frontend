<script setup lang="ts">
import _ from "lodash";
import { Tab } from "~/components/enigma/base-components/Headless";
import Tabs from "~/components/tabs/Tabs.vue";
import Basic from "~/components/customer/Basic.vue";
import AccountAddress from "~~/components/customer/AccountAddress.vue";
import AccountMembership from "~~/components/customer/AccountMembership.vue";
import AccountSpecialty from "~/components/customer/AccountSpecialty.vue";
import AccountOrders from "./AccountOrders.vue";
import AccountPhotos from "./AccountPhotos.vue";
import AccountFiles from "./AccountFiles.vue";
import AccountCertificate from "./AccountCertificate.vue";
import Button from "~/components/enigma/base-components/Button";
import AccountAdminEmail from "./AccountAdminEmail.vue";

const props = defineProps({
  modelValue: {
    required: true,
    type: Object,
  },
});
let { modelValue: customer } = toRefs(props);
const menuItems = [
  { title: "Details", description: "Edit Basic Information", icon: null },
  { title: "Addresses", description: "Customer Address", icon: null },
  { title: "Membership", description: "Customer Membership", icon: null },
  { title: "Specialties", description: "Customer Specialties", icon: null },
  { title: "Sent Emails", description: "Sent Emails List", icon: null },
  { title: "Orders", description: "Customer Orders", icon: null },
  { title: "Photos", description: "Customer Photos", icon: null },
  { title: "Files", description: "Customer Files", icon: null },
  { title: "Certificates", description: "Customer Certificates", icon: null },
];
const activeTab = ref("Details");
function isActive(tab: string) {
  return activeTab.value === tab;
}

function setActive(tab: string) {
  activeTab.value = tab;
  mobileMenuOpen.value = !mobileMenuOpen.value;
}
const mobileMenuOpen = ref(false);
function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value;
}
</script>

<template>
  <div class="flex flex-col md:flex-row space-y-4 md:space-y-0">
    <!-- Sidebar -->
    <div class="md:w-64 text-white bg-primary box">
      <div class="flex items-center md:pl-4 h-16 border-b border-gray-700">
        <button @click="toggleMobileMenu" class="md:hidden p-4 focus:outline-none">
          <svg class="h-6 text-white hover:text-gray-300 transition duration-300 ease-in-out" fill="none"
            stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
        <span class="text-lg font-semibold text-left"> {{ customer.fullname }}</span>

      </div>
      <nav :class="[mobileMenuOpen ? 'block' : 'hidden', 'md:block mt-4 md:mt-0']">
        <ul>
          <li v-for="(item, index) in menuItems" :key="index">
            <a :class="[isActive(item.title) ? 'bg-white bg-opacity-10 font-bold' : '', 'block p-4 hover:bg-white hover:bg-opacity-10 transition duration-300 ease-in-out']"
              @click="setActive(item.title)" href="#">
              {{ item.title }}
            </a>
          </li>
        </ul>
      </nav>
    </div>

    <!-- Main Content -->
    <div class="flex-1 p-4">
      <div v-if="activeTab === 'Details'">
        <Basic v-model="customer" />
      </div>
      <div v-if="activeTab === 'Addresses'">
        <AccountAddress v-model="customer" />
      </div>
      <div v-if="activeTab === 'Membership'">
        <AccountMembership v-model="customer" />
      </div>
      <div v-if="activeTab === 'Specialties'">
        <AccountSpecialty v-model="customer" />
      </div>
      <div v-if="activeTab === 'Sent Emails'">
        <AccountAdminEmail v-model="customer" />
      </div>
      <div v-if="activeTab === 'Orders'">
        <AccountOrders v-model="customer" />
      </div>
      <div v-if="activeTab === 'Photos'">
        <AccountPhotos v-model="customer" />
      </div>
      <div v-if="activeTab === 'Files'">
        <AccountFiles v-model="customer" />
      </div>
      <div v-if="activeTab === 'Certificates'">
        <AccountCertificate v-model="customer" />
      </div>
    </div>
  </div>
</template>