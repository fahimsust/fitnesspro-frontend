<script lang="ts" setup>
import _ from "lodash";
import Show from "~/components/address/Show.vue";

const route = useRoute();

definePageMeta({
  middleware: ["auth"],
  layout: "simple-menu-new",
});
const idParam = parseInt(route.params.id.toString());

useHead({
  title: "Order Details: " + useRuntimeConfig().public.company,
});
const dataLoaded = ref(false)
const { getAbandonedOrder } = useAbandonedOrder();
let order:any = ref({})
let currency = ''
const { baseCurrency } = useSiteCurrency();

onMounted(async () => {
  await nextTick();
  order = await getAbandonedOrder(idParam);
  const currencyObj = await baseCurrency(order.value.site_id);
  if (currencyObj) {
    currency = currencyObj.value.code
  }
  dataLoaded.value = true
});

</script>
<template>
  <div class="mt-8">
    <div class="col-span-12 lg:col-span-12" v-if="dataLoaded">
      <h2 class="mt-2 mb-2 text-lg font-medium intro-y">Order No : {{order.order?order.order.order_no:''}}</h2>
      <!-- BEGIN: Post Content -->
      <div class="col-span-12 box border-2 p-3">
        <div v-if="order.items.length == 0" class="box p-3 rounded dark:bg-gray-800">
          No item added for this package
        </div>
        <div v-if="order.items.length > 0" v-for="(item, index) in order.items" :key="item.id"
          :class="{ 'mt-0': index === 0, 'mt-2': index !== 0, }" class="bg-gray-100 p-2 rounded dark:bg-gray-800">
          <div class="flex flex-col items-center space-y-2 md:flex-row md:space-y-0 md:space-x-2 justify-between">
            <div class="flex-1">
              <div class="font-semibold">{{ item.cart_item.product.title }}</div>
              <div v-if="item.cart_item.option_values" class="text-sm text-gray-600">
                <template v-for="option in item.cart_item.option_values">
                  <div>
                    {{ option.option_value.option.display }}: {{ option.option_value.display }}
                  </div>
                </template>
              </div>
            </div>

            <div class="flex-1 text-left md:text-center">
              <span v-if="item.cart_item.onsale">
                <del class="text-gray-500 text-sm line-through">{{ item.cart_item.price_reg }}</del>
                <span class="text-red-600 ml-4 font-semibold">{{ item.cart_item.price_sale }}</span>
              </span>
              <span v-else>
                {{ formatNumberWithTwoDecimals(item.cart_item.price_reg) }}
              </span>
            </div>

            <div class="flex-1 text-left md:text-center">
              <span>Quantity : {{ item.cart_item.qty }}</span>
            </div>

            <div class="flex-1 text-left md:text-center">
              <div class="text-red-600 ml-4 font-semibold" v-if="calculateDiscount(item.discounts, item.cart_item.onsale ? item.cart_item.price_sale : item.cart_item.price_reg) > 0">
                Discount : - {{ calculateDiscount(item.discounts, item.cart_item.onsale ?
                  item.cart_item.price_sale :
                  item.cart_item.price_reg) }}
              </div>  
            </div>

            <div class="flex-1 text-left md:text-right">
              {{ formatNumberWithTwoDecimals(calculateTotalCost(item.cart_item, item.discounts)) }}
            </div>
          </div>
        </div>
      </div>
      <div class="mt-2 box p-3">
        <div class="bg-gray-100 p-2 font-semibold rounded dark:bg-gray-800">
          <div class="flex justify-between mt-1 pb-1 border-b-gray-200 border-b-2">
            <span>Sub-total:</span>
            <span class="text-right">{{ formatNumberWithTwoDecimals(subTotal(order)) }}</span>
          </div>
          <div class="flex justify-between mt-1 pb-1 border-b-gray-200 border-b-2">
            <span>Total Shipping Fee:</span>
            <span class="text-right">{{ formatNumberWithTwoDecimals(totalShipping(order.shipments)) }}</span>
          </div>
          <div class="flex justify-between mt-1">
            <span>Total:</span>
            <span class="text-right">{{ formatNumberWithTwoDecimals(grandTotal(order)) }}</span>
          </div>
        </div>
      </div>
      <div class="overflow-y-auto col-span-12 mt-5">
        <div class="grid grid-cols-12 gap-4 gap-y-3">
          <div class="col-span-6 xs:col-span-12">
            <h3 class="mb-3 text-success font-semibold text-lg">Shipping Address</h3>
            <div class="box dark:bg-gray-800" v-if="order.shipping_address">
              <Show v-model="order.shipping_address" />
            </div>
            <div class="box dark:bg-gray-800 p-3" v-else>
              No Shipping Address Found
            </div>
          </div>
          <div class="col-span-6 xs:col-span-12">
            <h3 class="mb-3 text-success font-semibold text-lg">Billing Address</h3>
            <div class="box dark:bg-gray-800" v-if="order.billing_address">
              <Show v-model="order.billing_address" />
            </div>
            <div class="box dark:bg-gray-800 p-3" v-else>
              No Billing Address Found
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
