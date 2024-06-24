<script setup lang="ts">
import _ from "lodash";
import Basic from "~/components/order/Basic.vue";
import OrderActivities from "~/components/order/OrderActivities.vue";
import OrderNotes from "./OrderNotes.vue";
import OrderTransaction from "./OrderTransaction.vue";
import OrderAddress from "./OrderAddress.vue";
import OrderEmail from "./OrderEmail.vue";
import OrderCustomForms from "./OrderCustomForms.vue";


const props = defineProps({
  modelValue: {
    required: true,
    type: Object,
  },
  refresh: {
    required: true,
    type: Function,
  }
});
let { modelValue: order } = toRefs(props);
const menuItems = [
  { title: "Items", description: "Edit Details", icon: null },
  { title: order.value.account ? "Account " + order.value.account.username : 'Account Management', description: "Account Management", icon: null },
  { title: "Activities", description: "Orders Logs", icon: null },
  { title: "Notes", description: "Order Notes", icon: null },
  { title: "Custom Data", description: "Order Custom Forms", icon: null },
  { title: "Transactions", description: "Order Transaction", icon: null },
  { title: "Address", description: "Order Address", icon: null },
  { title: "Affiliate", description: "Orders Affiliate", icon: null },
  { title: "Email", description: "Email", icon: null }
];
const activeTab = ref("Items");
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
        <span class="text-lg font-semibold text-left"> Order No. {{ order.order_no }}</span>

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
    <div class="flex-1 p-2">
      <div v-if="activeTab === 'Items'">
        <Basic v-model="order" />
      </div>
      <div v-if="activeTab.indexOf('Account') !== -1">
        <OrderAccount v-model="order" />
      </div>
      <div v-if="activeTab === 'Activities'">
        <OrderActivities v-model="order" />
      </div>
      <div v-if="activeTab === 'Notes'">
        <OrderNotes v-model="order" />
      </div>
      <div v-if="activeTab === 'Custom Data'">
        <OrderCustomForms v-model="order" />
      </div>
      <div v-if="activeTab === 'Transactions'">
        <OrderTransaction v-model="order" />
      </div>
      <div v-if="activeTab === 'Address'">
        <OrderAddress v-model="order" :refresh="refresh" />
      </div>
      <div v-if="activeTab === 'Affiliate'">
        <OrderAffiliate v-model="order" />
      </div>
      <div v-if="activeTab === 'Email'">
        <OrderEmail v-model="order" />
      </div>
    </div>
  </div>
</template>