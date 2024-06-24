<script setup lang="ts">
import _ from "lodash";
import { useRoute } from 'vue-router';
const route = useRoute();
const { getShipment } = useShipments();

definePageMeta({
  middleware: ["auth"],
  layout: false,
});

const idParam = parseInt(route.params.id.toString());
const shipment = await getShipment(idParam);

const getPackageRange = () => {
  const packageIds = shipment.value.packages.map((pkg: any) => pkg.id);
  const minPackageId = Math.min(...packageIds);
  const maxPackageId = Math.max(...packageIds);

  return `Shipment #${shipment.value.id}`

  //return `Package ${minPackageId}-${maxPackageId}`;
}

const currency = "$";

// Auto-trigger print when the page is loaded
onMounted(() => {
  window.print();
  window.addEventListener("afterprint", () => {
    // Close the print screen
    window.close();
  });
});
</script>

<template>
  <div class="print-page">
    <!-- Content dynamically populated by the composite API response -->
    <h2>{{ getPackageRange() }}</h2>
    <h3>Order {{ shipment.order.order_no }} - {{ formatDate(shipment.order.created_at) }}</h3>

    <div class="shipping-details">
      <h4>Shipping Information</h4>
      <p>{{ shipment.order.account.fullname }}</p>
      <p v-if="shipment.order.shipping_address">{{ shipment.order.shipping_address.address_1 }}</p>
      <p v-if="shipment.order.shipping_address && shipment.order.shipping_address.address_2">{{
        shipment.order.shipping_address.address_2 }}</p>
      <p v-if="shipment.order.shipping_address">{{ shipment.order.shipping_address.city }}{{
        shipment.order.shipping_address.state_province ? ", " + shipment.order.shipping_address.state_province.name : ""
      }} {{ shipment.order.shipping_address.postal_code }}</p>
      <p v-if="shipment.order.shipping_address && shipment.order.shipping_address.country">{{
        shipment.order.shipping_address.country.name }}</p>
      <p>Phone: {{ shipment.order.account.phone }}</p>
      <p>Email: {{ shipment.order.account.email }}</p>
    </div>

    <!-- Shipments, Packages, and Items -->
    <div v-for="shipmentPackage in shipment.packages" :key="shipmentPackage.id">
      <h4>Package #{{ shipmentPackage.id }}</h4>
      <table class="items-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Product No</th>
            <th class="text-align-center">Quantity</th>
            
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in shipmentPackage.items" :key="item.id">
            <td>
              <div class="item-details">
                <span>{{ item.product.title }}</span>
                <div v-if="item.option_values" class="text-sm text-gray-600">
                  <template v-for="option in item.option_values">
                    <div>
                      {{ option.option_value.option.display }}: {{ option.option_value.display }}
                    </div>
                  </template>
                </div>
              </div>
            </td>
            <td>{{ item.product.product_no }}</td>
            <td class="text-align-center">{{ item.product_qty }}</td>
          </tr>
        </tbody>
      </table>
    </div>    
  </div>
</template>

<style scoped>
/* Add your styling for the print page here */

.print-page {
  font-family: 'Arial', sans-serif;
  max-width: 800px;
  margin: 30px auto;
  padding: 30px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
}

h2, h3, h4 {
  color: #333;
  font-weight: bold;
  padding-bottom: 5px;
  margin-bottom: 10px;
}

h4 {
  margin-top: 10px;
}

span {
  display: block;
  margin-bottom: 5px;
}

.currency {
  font-weight: bold;
}

/* Additional styling for the bill items */
.items .item {
  border-bottom: 1px solid #ddd;
  padding: 10px;
}
.items .item:last-child
{
  border-bottom: none;
}

.shipping-details, .packages, .items {
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 20px;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.items-table th, .items-table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}
.items-table th.text-align-center, .items-table td.text-align-center {
  text-align: center;
}

.items-table th {
  background-color: #f2f2f2;
}

.item-details {
  display: flex;
  flex-direction: column;
}

</style>
