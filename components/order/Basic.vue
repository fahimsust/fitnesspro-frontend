<script setup lang="ts">
import _ from "lodash";
import { reactive } from "vue";
import { toRefs } from "vue";
import Lucide from "~/components/enigma/base-components/Lucide";
import { Menu, Popover } from "~/components/enigma/base-components/Headless";
import Button from "~/components/enigma/base-components/Button";
import SearchDiscount from "./SearchDiscount.vue";
import { FormSelect } from "~/components/enigma/base-components/Form";
import SearchItemProduct from "./SearchItemProduct.vue";
import AddProductDetail from "./AddProductDetail.vue";
import SearchOrderAccount from "./SearchOrderAccount.vue";
import ShowCustomer from "./ShowCustomer.vue";
import { Divide } from "lucide";
import AddShipment from "./AddShipment.vue";
import AddItemNote from "./AddItemNote.vue";
import { FormInput } from "~/components/enigma/base-components/Form";

const props = defineProps({
  modelValue: {
    required: true,
    type: Object,
  },
});
let { modelValue: order } = toRefs(props);
const orderId = order.value.id;

let currency = "";

const { getOrder, updateOrder } = useCompletedOrders();
const { baseCurrency } = useSiteCurrency();

const refresh = async () => {
  order = await getOrder(orderId);
};

const currencyObj = await baseCurrency(order.value.site_id);
if (currencyObj) {
  currency = currencyObj.value.code;
}

const {
  createShipment,
  removeShipment,
  setDeleteId,
  updateShipment,
  shipmentConfirmationModal,
} = useShipments();

const {
  createOrderDiscount,
  removeOrderDiscount,
  setDiscountOrderId,
  discountConfirmationModal,
} = useOrderDiscounts();

const {
  removeOrderItemDiscount,
  createOrderItemDiscount,
  itemConfirmationModal,
  setDiscountItemId,
} = useOrderItemDiscounts();

const createDownloadLoading = ref(false);
const createShipmentLoading = ref(false);
const editedShippingCost: any = ref({});
const editedAdditionalFees = ref(false);
const editedAdditionalDiscount = ref(false);
const modalDiscount = ref(false);
const modalProduct = ref(false);
const modalProductDetail = ref(false);
const modalDiscountItem = ref(false);
const selectedItem = ref<number[]>([]);
const itemPackageToAddDiscount: any = ref();
const discountIdForItem = ref(0);

const itemNoteModal = ref(false);
const shipmentOpen: any = ref({});

const packageId = ref(0);
const productId = ref(0);
const orderItem = ref({ id: 0 });

const openItemNoteModalWithItem = (value: any) => {
  orderItem.value = value;
  openItemNoteModal(true);
};

const openItemNoteModal = (value: boolean) => {
  itemNoteModal.value = value;
};

const openItemListModal = (value: boolean) => {
  modalProduct.value = value;
};

const addItemsToPackage = (value: number) => {
  packageId.value = value;
  openItemListModal(true);
};
const openProductDetailModal = async (product_id: number) => {
  productId.value = product_id;
  setProductDetail(true);
};
const refreshOrderDetails = async () => {
  await refresh();
};
const setProductDetail = (value: boolean) => {
  modalProductDetail.value = value;
};

const setOrderDiscountDelete = (value: boolean) => {
  discountConfirmationModal.value = value;
};
const deleteOrderDiscount = async () => {
  await removeOrderDiscount(orderId);
  await refresh();
};

const deleteOrderDiscountItem = async () => {
  await removeOrderItemDiscount(discountIdForItem.value);
  await refresh();
};

const addDiscountOrder = async (discount_id: number) => {
  const form = reactive({
    discount_id: discount_id,
  });
  await createOrderDiscount(orderId, form);
  handleNewDiscount(false);
  await refresh();
};
const handleNewDiscount = (value: boolean) => {
  modalDiscount.value = value;
};

const handleNewDiscountItem = (value: boolean, check: boolean = false) => {
  if (check) {
    const selectedItems = itemPackageToAddDiscount.value.items.filter((item: any) =>
      selectedItem.value.includes(item.id)
    );

    if (selectedItems.length === 0) {
      swalTopEnd("", `Please select at least one item to add discount`, "error");
      return;
    }
  }
  modalDiscountItem.value = value;
};

const setOrderItemDiscountDelete = (value: boolean) => {
  itemConfirmationModal.value = value;
};
const addDiscountToPackageItem = async (discount_id: number) => {
  const selectedItems = itemPackageToAddDiscount.value.items.filter((item: any) =>
    selectedItem.value.includes(item.id)
  );

  if (selectedItems.length === 0) {
    swalTopEnd("", `Please select at least one item to add discount`, "error");
    return;
  }
  const form = reactive({
    items: selectedItems.map((object: { id: any }) => object.id),
  });

  await createOrderItemDiscount(discount_id, form);
  itemPackageToAddDiscount.value = null;
  await refresh();
  modalDiscountItem.value = false;
};

const updateAdditionalFees = async (event: any) => {
  if (event.target !== null && event.target.value !== null && event.target.value >= 0) {
    const form = reactive({
      addtl_fee: event.target.value,
    });
    await updateOrder(form, orderId);
  } else {
    swalTopEnd(
      "",
      `Please enter a valid positive number for the additional fees`,
      "error"
    );
  }
  await refresh();
  editedAdditionalFees.value = false;
};
const updateAdditionalDiscount = async (event: any) => {
  if (event.target !== null && event.target.value !== null && event.target.value >= 0) {
    const form = reactive({
      addtl_discount: event.target.value,
    });
    await updateOrder(form, orderId);
  } else {
    swalTopEnd(
      "",
      `Please enter a valid positive number for the additional discount`,
      "error"
    );
  }
  await refresh();
  editedAdditionalDiscount.value = false;
};

const updateShippingCost = async (event: any, shipment_id: number) => {
  if (event.target !== null && event.target.value !== null && event.target.value >= 0) {
    const form = reactive({
      ship_cost: event.target.value,
    });
    await updateShipment(form, orderId, shipment_id);
  } else {
    swalTopEnd("", `Please enter a valid positive number for the shipping cost`, "error");
  }
  await refresh();
  editedShippingCost.value[shipment_id] = false;
};

const deleteShipment = async () => {
  await removeShipment(orderId);
  await refresh();
};
const setShipmentDelete = (value: boolean) => {
  shipmentConfirmationModal.value = value;
};
const showShipmentModal = ref(false);
const is_downloads = ref(false);
const handleNewDownloadable = async () => {
  is_downloads.value = true;
  openShipmentAdd(true);
};
const handleNewShipment = async () => {
  is_downloads.value = false;
  openShipmentAdd(true);
};
const openShipmentAdd = (value: boolean) => {
  showShipmentModal.value = value;
};
const updateDistributor = async (event: any, shipment_id: number) => {
  const form = reactive({
    distributor_id: event.target.value,
  });
  await updateShipment(form, orderId, shipment_id);
  await refresh();
};
const updateOrderStatus = async (event: any, shipment_id: number) => {
  const form = reactive({
    order_status_id: event.target.value,
  });
  await updateShipment(form, orderId, shipment_id);
  await refresh();
};
const {
  removeShipmentPackage,
  createShipmentPackage,
  packageConfirmationModal,
  setDeleteIdPackage,
  updateShipmentPackage,
} = useShipmentPackages();

const {
  removeOrderItem,
  deleteItemConfirmationModal,
  setDeleteIdPackageItem,
  updateOrderItemQty,
  moveOrderItem,
} = useOrderItems();

const createPackage = async (shipment_id: number) => {
  await createShipmentPackage(shipment_id);
  await refresh();
};

const checkItemChecked = (itemPackage: any) => {
  let selectedItems = [];
  if (itemPackage.items.length > 0 && selectedItem.value) {
    const items = itemPackage.items.map((object: { id: any }) => object.id);
    selectedItems = selectedItem.value.filter((item: any) => items.includes(item));
  }
  if (selectedItems.length > 0) {
    return true;
  }
  return false;
};

const deleteItemConfirm = (value: boolean, check: boolean = false) => {
  if (check) {
    const selectedItems = itemPackageToAddDiscount.value.items.filter((item: any) =>
      selectedItem.value.includes(item.id)
    );

    if (selectedItems.length === 0) {
      swalTopEnd("", `Please select at least one item to delete`, "error");
      return;
    }
  }
  deleteItemConfirmationModal.value = value;
};
const deleteItemsFromPackage = async () => {
  const selectedItems = itemPackageToAddDiscount.value.items.filter((item: any) =>
    selectedItem.value.includes(item.id)
  );

  if (selectedItems.length === 0) {
    swalTopEnd("", `Please select at least one item to delete`, "error");
    return;
  }
  const form = reactive({
    items: selectedItems.map((object: { id: any }) => object.id),
  });

  await removeOrderItem(itemPackageToAddDiscount.value.id, form);
  itemPackageToAddDiscount.value = null;
  await refresh();
  deleteItemConfirmationModal.value = false;
};

const movePackageLoading = ref(false);
const movePackage = async (shipment_id: number) => {
  if (shipmentToMove.value && packageToMove.value) {
    movePackageLoading.value = true;
    const form = reactive({
      shipment_id: shipment_id,
    });
    await updateShipmentPackage(form, shipmentToMove.value.id, packageToMove.value.id);
    await refresh();
    movePackageLoading.value = false;
  }
  cancelMovePackageItem();
};

const movePackageItem = async (package_id: number) => {
  if (itemToMovePackage.value && itemToMove.value) {
    movePackageLoading.value = true;
    const form = reactive({
      package_id: package_id,
    });
    await moveOrderItem(form, itemToMovePackage.value.id, itemToMove.value.id);
    await refresh();
    movePackageLoading.value = false;
  }
  cancelMovePackageItem();
};

const printShipment = (shipment_id: number) => {
  const printPageUrl = `/order/actives/shipment/${shipment_id}`;
  const newTab = window.open(printPageUrl, "_blank");
};
const shipment_id_package_delete = ref(0);
const deletePackage = async () => {
  if (shipment_id_package_delete.value > 0) {
    await removeShipmentPackage(shipment_id_package_delete.value);
    await refresh();
  }
};
const setPackageDelete = (value: boolean) => {
  packageConfirmationModal.value = value;
};
const { distributors } = useProducts();
const distributorList: any = await distributors();
const { shipmentStatuses } = useCompletedOrders();
const statusList: any = await shipmentStatuses();
const editQuantity = (item: any) => {
  item.editingQuantity = true;
};
const saveQuantity = async (event: any, itemPackage: any, item: any) => {
  if (event.target !== null && event.target.value !== null && event.target.value >= 0) {
    const form = reactive({
      product_qty: event.target.value,
    });
    await updateOrderItemQty(form, itemPackage.id, item.id);
  } else {
    swalTopEnd("", `Please enter a valid positive number for item quantity`, "error");
  }
  await refresh();
  item.editingQuantity = false;
};
const packageToMove: any = ref();
const shipmentToMove: any = ref();
const itemToMove: any = ref();
const itemToMovePackage: any = ref();
const startMovePackage = (shipmentPackage: any, shipment: any) => {
  packageToMove.value = shipmentPackage;
  shipmentToMove.value = shipment;
  itemToMove.value = null;
  itemToMovePackage.value = null;
};
const startMoveItem = (item: any, shipment: any, shipmentPackage: any) => {
  shipmentToMove.value = shipment;
  itemToMove.value = item;
  packageToMove.value = null;
  itemToMovePackage.value = shipmentPackage;
};
const cancelMovePackageItem = () => {
  shipmentToMove.value = null;
  itemToMove.value = null;
  packageToMove.value = null;
  itemToMovePackage.value = null;
};
const checkShipmentToMove = (shipment: any) => {
  if (
    packageToMove.value &&
    shipmentToMove.value &&
    shipmentToMove.value.id != shipment.id &&
    shipmentToMove.value.distributor_id == shipment.distributor_id
  ) {
    return true;
  }
  return false;
};
const checkItemToMove = (shipment: any, itemPackage: any) => {
  if (
    itemToMove.value &&
    itemToMovePackage.value &&
    shipmentToMove.value &&
    itemToMovePackage.value.id != itemPackage.id &&
    shipmentToMove.value.distributor_id == shipment.distributor_id
  ) {
    return true;
  }
  return false;
};

const getUniqueDiscountIds = (discounts: { id: number }[]) => {
  const uniqueDiscountIds = new Set(discounts.map((discount) => discount.id));
  return Array.from(uniqueDiscountIds);
};

const getDiscountDisplay = (
  uniqueDiscountId: number,
  allDiscounts: { id: number; display: string }[]
) => {
  const count = allDiscounts.filter((discount) => discount.id === uniqueDiscountId)
    .length;
  const currentDiscount = allDiscounts.find(
    (discount) => discount.id === uniqueDiscountId
  );
  if (count > 1) return `${currentDiscount?.display} x ${count}`;

  return `${currentDiscount?.display}`;
};
</script>
<template>
  <div class="container mx-auto">
    <!-- Order -->
    <div class="md:p-2 rounded shadow-md">
      <div class="flex justify-end mt-4 space-x-2">
        <Button variant="primary" @click="handleNewDownloadable">
          <span v-if="createDownloadLoading">
            <i class="animate-spin mr-2 fas fa-spinner"></i> Creating...
          </span>
          <span v-else>New Downloadable</span>
        </Button>
        <Button variant="primary" @click="handleNewShipment">
          <span v-if="createShipmentLoading">
            <i class="animate-spin mr-2 fas fa-spinner"></i> Creating...
          </span>
          <span v-else>New Shipment</span>
        </Button>
        <Button variant="primary" @click="handleNewDiscount(true)">Apply Discount</Button>
      </div>
      <div
        v-for="shipment in order.shipments"
        :key="shipment.id"
        :class="{
          'pb-1': shipmentOpen != undefined && shipmentOpen[shipment.id] == true,
        }"
        class="mt-8 border-2 p-4 dark:border-gray-600 dark:text-white relative"
      >
        <div
          v-if="checkShipmentToMove(shipment)"
          @click="movePackage(shipment.id)"
          class="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center cursor-pointer"
        >
          <div class="text-white text-2xl p-2">
            Click here to relocate the package to this shipment
          </div>
        </div>

        <div
          class="flex flex-col mb-4 md:flex-row md:space-y-0 md:space-x-2 md:justify-between"
        >
          <div class="flex flex-row justify-between">
            <h3 class="text-lg font-bold text-[#74B6E0] mb-2">
              {{ shipment.is_downloads ? "Downloadable #" : "Shipment #"
              }}{{ shipment.id }}
            </h3>
            <div class="md:hidden flex flex-row">
              <Menu>
                <Menu.Button variant="primary">
                  <Lucide icon="GripVertical" class="w-6 h-6 mt-1 cursor-pointer" />
                </Menu.Button>
                <Menu.Items class="w-48">
                  <Menu.Item @click="createPackage(shipment.id)">
                    <Lucide icon="Plus" class="w-4 h-4 mr-2" />Create Package
                  </Menu.Item>
                  <Menu.Item
                    @click="
                      () => {
                        setDeleteId(shipment.id);
                        setShipmentDelete(true);
                      }
                    "
                  >
                    <Lucide icon="Trash" class="w-4 h-4 mr-2 text-danger" />Delete
                    Shipment
                  </Menu.Item>
                  <Menu.Item @click="printShipment(shipment.id)">
                    <Lucide icon="Printer" class="w-4 h-4 mr-2" />Print Shipment
                  </Menu.Item>
                </Menu.Items>
              </Menu>
              <Lucide
                @click="shipmentOpen[shipment.id] = false"
                icon="ChevronDown"
                v-if="shipmentOpen != undefined && shipmentOpen[shipment.id] == true"
                class="w-6 h-6 mt-1 cursor-pointer"
              />
              <Lucide
                @click="shipmentOpen[shipment.id] = true"
                icon="ChevronUp"
                v-if="
                  shipmentOpen[shipment.id] == undefined ||
                  shipmentOpen[shipment.id] == false
                "
                class="w-6 h-6 mt-1 cursor-pointer"
              />
            </div>
          </div>

          <div class="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
            <div class="dropdown">
              <FormSelect
                @change="updateDistributor($event, shipment.id)"
                class="w-full dark:bg-gray-600 dark:text-white"
                v-model="shipment.distributor_id"
              >
                <option
                  :value="distributor.id"
                  v-for="distributor in distributorList"
                  :key="distributor.id"
                >
                  {{ distributor.name }}
                </option>
              </FormSelect>
            </div>
            <div class="dropdown">
              <FormSelect
                @change="updateOrderStatus($event, shipment.id)"
                class="w-full dark:bg-gray-600 dark:text-white"
                v-model="shipment.order_status_id"
              >
                <option :value="status.id" v-for="status in statusList" :key="status.id">
                  {{ status.name }}
                </option>
              </FormSelect>
            </div>
            <div class="hidden md:flex flex-row">
              <Menu>
                <Menu.Button variant="primary">
                  <Lucide icon="GripVertical" class="w-8 h-8 mt-1 cursor-pointer" />
                </Menu.Button>
                <Menu.Items class="w-48">
                  <Menu.Item @click="createPackage(shipment.id)">
                    <Lucide icon="Plus" class="w-4 h-4 mr-2" />Create Package
                  </Menu.Item>
                  <Menu.Item
                    @click="
                      () => {
                        setDeleteId(shipment.id);
                        setShipmentDelete(true);
                      }
                    "
                  >
                    <Lucide icon="Trash" class="w-4 h-4 mr-2 text-danger" />Delete
                    Shipment
                  </Menu.Item>
                  <Menu.Item @click="printShipment(shipment.id)">
                    <Lucide icon="Printer" class="w-4 h-4 mr-2" />Print Shipment
                  </Menu.Item>
                </Menu.Items>
              </Menu>
              <Lucide
                @click="shipmentOpen[shipment.id] = false"
                icon="ChevronDown"
                v-if="shipmentOpen != undefined && shipmentOpen[shipment.id] == true"
                class="w-8 h-8 mt-1 cursor-pointer"
              />
              <Lucide
                @click="shipmentOpen[shipment.id] = true"
                icon="ChevronUp"
                v-if="
                  shipmentOpen[shipment.id] == undefined ||
                  shipmentOpen[shipment.id] == false
                "
                class="w-8 h-8 mt-1 cursor-pointer"
              />
            </div>
          </div>
        </div>
        <div
          class="fade-enter-active fade-leave-active fade-enter fade-leave-to"
          v-if="
            shipmentOpen[shipment.id] == undefined || shipmentOpen[shipment.id] == false
          "
        >
          <div
            v-if="shipment.packages.length == 0"
            class="mt-4 bg-gray-100 p-2 rounded dark:bg-gray-800"
          >
            No package added for this shipment
          </div>
          <div
            v-if="shipment.packages.length > 0"
            v-for="itemPackage in shipment.packages"
            :key="itemPackage.id"
            :class="{
              'border-2 border-blue-500 p-2':
                packageToMove && itemPackage.id === packageToMove.id,
              'relative p-2': checkItemToMove(shipment, itemPackage),
            }"
            class="mt-4 border-b-2 pb-4 p-0 dark:border-gray-600 dark:text-white"
          >
            <div
              v-if="checkItemToMove(shipment, itemPackage)"
              @click="movePackageItem(itemPackage.id)"
              class="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center cursor-pointer"
            >
              <div class="text-white text-2xl p-2">
                Click here to relocate the item to this package
              </div>
            </div>
            <div
              class="flex flex-row justify-between bg-gray-100 p-2 rounded dark:bg-gray-800"
            >
              <h4 class="text-base font-semibold text-gray-800 dark:text-white">
                Package #{{ itemPackage.id }}
              </h4>
              <Menu>
                <Menu.Button variant="primary">
                  <Lucide icon="GripVertical" class="w-6 h-6 cursor-pointer" />
                </Menu.Button>
                <Menu.Items class="w-48">
                  <Menu.Item @click="addItemsToPackage(itemPackage.id)">
                    <Lucide icon="Plus" class="w-4 h-4 mr-2" />Add Items
                  </Menu.Item>

                  <Menu.Item
                    @click="
                      () => {
                        setDeleteIdPackage(itemPackage.id);
                        shipment_id_package_delete = shipment.id;
                        setPackageDelete(true);
                      }
                    "
                  >
                    <Lucide icon="Trash" class="w-4 h-4 mr-2 text-danger" />Delete Package
                  </Menu.Item>
                  <Menu.Item
                    v-if="!packageToMove || itemPackage.id != packageToMove.id"
                    @click="startMovePackage(itemPackage, shipment)"
                  >
                    <Lucide icon="Move" class="w-4 h-4 mr-2" />Move Package
                  </Menu.Item>
                  <Menu.Item
                    v-if="packageToMove && itemPackage.id == packageToMove.id"
                    @click="cancelMovePackageItem"
                  >
                    <Lucide icon="Ban" class="w-4 h-4 mr-2" />Cancel Move
                  </Menu.Item>
                </Menu.Items>
              </Menu>
            </div>

            <div
              v-if="itemPackage.items.length > 0 && checkItemChecked(itemPackage)"
              class="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0 mt-4"
            >
              <Button
                variant="danger"
                @click="
                  () => {
                    itemPackageToAddDiscount = itemPackage;
                    deleteItemConfirm(true, true);
                  }
                "
                >Delete Items</Button
              >
              <Button
                variant="success"
                @click="
                  () => {
                    itemPackageToAddDiscount = itemPackage;
                    handleNewDiscountItem(true, true);
                  }
                "
                >Add Discount</Button
              >
            </div>
            <div
              v-if="itemPackage.items.length == 0"
              class="mt-4 bg-gray-100 p-2 rounded dark:bg-gray-800"
            >
              No item added for this package
            </div>
            <div
              v-if="itemPackage.items.length > 0"
              v-for="(item, index) in itemPackage.items"
              :key="item.id"
              :class="{
                'mt-4': index === 0,
                'mt-2': index !== 0,
                'border-2 border-blue-500 p-2': itemToMove && item.id === itemToMove.id,
              }"
              class="bg-gray-100 p-2 rounded dark:bg-gray-800"
            >
              <div
                class="flex flex-col md:items-center space-y-2 md:flex-row md:space-y-0 md:space-x-2 justify-between"
              >
                <div class="flex flex-row space-x-2 playwright-item-move">
                  <Lucide
                    v-if="!itemToMove || item.id != itemToMove.id"
                    icon="Move"
                    class="w-4 h-4 text-green-500 cursor-pointer"
                    @click="startMoveItem(item, shipment, itemPackage)"
                  />
                  <Lucide
                    v-if="itemToMove && item.id == itemToMove.id"
                    icon="XCircle"
                    class="w-4 h-4 mr-2 text-red-500 cursor-pointer"
                    @click="cancelMovePackageItem"
                  />

                  <input
                    type="checkbox"
                    :value="item.id"
                    v-model="selectedItem"
                    class="mr-2"
                  />
                </div>

                <div class="flex-1" v-if="item.product">
                  <div class="font-semibold">{{ item.product.title }}</div>
                  <div v-if="item.option_values" class="text-sm text-gray-600">
                    <template v-for="option in item.option_values">
                      <div>
                        {{ option.option_value.option.display }}:
                        {{ option.option_value.display }}
                      </div>
                    </template>
                  </div>
                  <div class="text-sm text-gray-600 flex flex-row">
                    <span class="mt-1">Note : {{ item.product_notes }}</span>
                    <Lucide
                      icon="Edit"
                      class="w-4 h-4 ml-2 mt-1 text-green-500 cursor-pointer playwright-edit-item"
                      @click="openItemNoteModalWithItem(item)"
                    />
                  </div>
                </div>

                <div class="flex-1 text-left md:text-center">
                  <span v-if="item.product_onsale">
                    <del class="text-gray-500 text-sm line-through">{{
                      formatNumberWithTwoDecimals(item.product_price)
                    }}</del>
                    <span class="text-red-600 ml-4 font-semibold">{{
                      formatNumberWithTwoDecimals(item.product_saleprice)
                    }}</span>
                  </span>
                  <span v-else>
                    {{ formatNumberWithTwoDecimals(item.product_price) }}
                  </span>
                </div>

                <div class="flex-1 text-left md:text-center" @click="editQuantity(item)">
                  <span v-if="!item.editingQuantity"
                    >Quantity : {{ item.product_qty }}</span
                  >
                  <FormInput
                    v-else
                    type="number"
                    id="product_qty"
                    v-model="item.product_qty"
                    @keydown.enter.prevent="saveQuantity($event, itemPackage, item)"
                    @blur="saveQuantity($event, itemPackage, item)"
                    autofocus
                    class="h-8 w-16"
                  />
                </div>

                <div
                  class="flex-1 text-left md:text-center"
                  v-if="
                    calculateDiscount(item.discounts, item.price, item.product_qty) > 0
                  "
                >
                  Discount : -
                  {{ calculateDiscount(item.discounts, item.price, item.product_qty) }}
                </div>

                <div class="flex-1 text-left md:text-right">
                  {{ formatNumberWithTwoDecimals(calculateTotalCost(item)) }}
                </div>
              </div>
              <div v-if="item.discounts.length > 0" class="p-2 border-2 mt-2">
                <h4 class="font-bold mb-2 text-[#74B6E0]">Discounts</h4>
                <div class="mt-2 bg-gray-100 rounded dark:bg-gray-800">
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div
                      v-for="discount in item.discounts"
                      class="bg-white p-2 rounded-md shadow-md dark:bg-gray-700 dark:text-white mb-2 md:mb-0"
                    >
                      <div class="flex justify-between items-center">
                        <div>
                          <span class="font-semibold">{{ discount.display }}</span>
                          <span v-if="discount.pivot.qty > 1" class="font-semibold">
                            x {{ discount.pivot.qty }}</span
                          >
                        </div>
                        <div class="flex justify-between items-center">
                          <div class="font-semibold">
                            {{ calculateDiscount([discount], item.price, item.product_qty) }}
                          </div>
                          <Lucide
                          icon="XCircle"
                          @click="
                            () => {
                              discountIdForItem = discount.id;
                              setDiscountItemId(item.id);
                              setOrderItemDiscountDelete(true);
                            }
                          "
                          class="w-4 h-4 mr-2 ml-2 text-red-500 cursor-pointer playwright-item-discount-delete"
                        />
                        </div>
                        
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4">
            <div class="flex justify-between bg-gray-100 p-2 rounded dark:bg-gray-800">
              <span>Shipping:</span>
              <span
                v-if="
                  editedShippingCost == undefined ||
                  editedShippingCost[shipment.id] == undefined ||
                  editedShippingCost[shipment.id] === false
                "
              >
                <span class="text-right" @click="editedShippingCost[shipment.id] = true">
                  {{ formatNumberWithTwoDecimals(shipment.ship_cost) }}
                </span>
              </span>
              <span v-else>
                <FormInput
                  type="number"
                  step="0.01"
                  min="0"
                  id="ship_cost"
                  class="w-48 h-8 text-right"
                  v-model="shipment.ship_cost"
                  @blur="updateShippingCost($event, shipment.id)"
                  @keydown.enter.prevent="updateShippingCost($event, shipment.id)"
                  autofocus
                />
              </span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="order.discounts.length > 0" class="p-4 border-2 mt-2">
        <h4 class="text-lg font-bold mb-2 text-[#74B6E0]">Discounts</h4>
        <div class="mt-2 bg-gray-100 p-2 rounded dark:bg-gray-800">
          <div class="grid grid-cols-1 md:grid-cols-3 md:gap-4">
            <!-- Display each discount with delete button -->
            <div
              v-for="(discount, index) in order.discounts"
              :key="index"
              class="bg-white p-2 rounded-md shadow-md dark:bg-gray-700 dark:text-white mb-2 md:mb-0"
            >
              <div class="flex justify-between items-center">
                <span class="font-semibold">{{ discount.display }}</span>
                <div class="flex justify-between items-center">
                  <div class="font-semibold">
                    {{ calculateDiscountOrder([discount],order.subTotal) }}
                  </div>
                  <Lucide
                    icon="XCircle"
                    @click="
                      () => {
                        setDiscountOrderId(discount.id);
                        setOrderDiscountDelete(true);
                      }
                    "
                    class="w-4 h-4 mr-2 ml-3 text-red-500 cursor-pointer playwright-discount-delete"
                  />
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="p-2 border-2 mt-2 md:w-96 ml-auto">
        <div class="bg-gray-100 p-2 rounded dark:bg-gray-800">
          <div class="flex justify-between mt-1">
            <span class="flex-grow">Sub-total:</span>
            <span class="text-right">{{
              formatNumberWithTwoDecimals(order.subTotal)
            }}</span>
          </div>
          <div class="flex justify-between mt-1" v-if="order.discountTotal > 0">
            <span class="flex-grow">Discounts:</span>
            <span class="text-right"
              >- {{ formatNumberWithTwoDecimals(order.discountTotal) }}</span
            >
          </div>
          <div class="flex justify-between mt-1">
            <span class="flex-grow">Total Shipping Fee:</span>
            <span class="text-right">{{
              formatNumberWithTwoDecimals(order.shippingTotal)
            }}</span>
          </div>
          <div class="flex justify-between mt-1">
            <span class="flex-grow">Addtl. Fee:</span>
            <span
              v-if="editedAdditionalFees === false"
              @click="editedAdditionalFees = true"
              class="text-right"
              >{{ formatNumberWithTwoDecimals(order.addtl_fee) }}</span
            >
            <span v-else>
              <FormInput
                type="number"
                step="0.01"
                min="0"
                id="addtl_fee"
                class="w-48 h-8 text-right"
                v-model="order.addtl_fee"
                @blur="updateAdditionalFees($event)"
                @keydown.enter.prevent="updateAdditionalFees($event)"
                autofocus
              />
            </span>
          </div>
          <div class="flex justify-between mt-1" v-if="order.payment_method_fee > 0">
            <span class="flex-grow">Payment Method Fee:</span>
            <span class="text-right">
              {{ formatNumberWithTwoDecimals(order.payment_method_fee) }}</span
            >
          </div>
          <div class="flex justify-between mt-1">
            <span class="flex-grow">Addtl. Discount:</span>
            <span
              v-if="editedAdditionalDiscount === false"
              @click="editedAdditionalDiscount = true"
              class="text-right"
              >- {{ formatNumberWithTwoDecimals(order.addtl_discount) }}</span
            >
            <span v-else>
              <FormInput
                type="number"
                step="0.01"
                min="0"
                id="addtl_discount"
                class="w-48 h-8 text-right"
                v-model="order.addtl_discount"
                @blur="updateAdditionalDiscount($event)"
                @keydown.enter.prevent="updateAdditionalDiscount($event)"
                autofocus
              />
            </span>
          </div>
          <div class="flex justify-between mt-1">
            <span class="flex-grow">Total:</span>
            <span class="text-right">
              {{ formatNumberWithTwoDecimals(order.total) }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>

  <Confirmation
    v-model="packageConfirmationModal"
    buttonStringMain="Remove"
    subHeader="Do you want to remove this package?"
    :setConfirmationModal="setPackageDelete"
    :set-id="setDeleteIdPackage"
    :functionToRun="deletePackage"
  />

  <Confirmation
    v-model="shipmentConfirmationModal"
    buttonStringMain="Remove"
    subHeader="Do you want to remove this shipment?"
    :setConfirmationModal="setShipmentDelete"
    :set-id="setDeleteId"
    :functionToRun="deleteShipment"
  />

  <Confirmation
    v-model="deleteItemConfirmationModal"
    buttonStringMain="Remove"
    subHeader="Do you want to remove this items?"
    :setConfirmationModal="deleteItemConfirm"
    :set-id="setDeleteIdPackageItem"
    :functionToRun="deleteItemsFromPackage"
  />

  <Confirmation
    v-model="discountConfirmationModal"
    buttonStringMain="Remove"
    subHeader="Do you want to remove this order discount?"
    :setConfirmationModal="setOrderDiscountDelete"
    :set-id="setDiscountOrderId"
    :functionToRun="deleteOrderDiscount"
  />

  <Confirmation
    v-model="itemConfirmationModal"
    buttonStringMain="Remove"
    subHeader="Do you want to remove this order item discount?"
    :setConfirmationModal="setOrderItemDiscountDelete"
    :set-id="setDiscountItemId"
    :functionToRun="deleteOrderDiscountItem"
  />

  <SearchDiscount
    :add="addDiscountOrder"
    v-if="modalDiscount"
    :key="modalDiscount ? 'true' : 'false'"
    :setModel="handleNewDiscount"
    :order_id="orderId"
    :modalShow="modalDiscount"
  />

  <SearchItemProduct
    :add="openProductDetailModal"
    v-if="modalProduct"
    :key="modalProduct ? 'true' : 'false'"
    :setModel="openItemListModal"
    :modalShow="modalProduct"
  />

  <AddProductDetail
    :add="refreshOrderDetails"
    v-if="modalProductDetail"
    :key="modalProductDetail ? 'true' : 'false'"
    :setModel="setProductDetail"
    :package_id="packageId"
    :product_id="productId"
    :modalShow="modalProductDetail"
  />

  <SearchDiscount
    :add="addDiscountToPackageItem"
    v-if="modalDiscountItem"
    :key="modalDiscountItem ? 'true' : 'false'"
    :setModel="handleNewDiscountItem"
    :modalShow="modalDiscountItem"
  />

  <AddShipment
    :refresh="refresh"
    v-if="showShipmentModal"
    :key="is_downloads ? 1 : 0"
    :modal-show="showShipmentModal"
    :set-modal="openShipmentAdd"
    :order-id="order.id"
    :distributor-list="distributorList"
    :is_downloads="is_downloads"
  />

  <AddItemNote
    :refresh="refresh"
    v-if="orderItem.id > 0"
    :key="orderItem.id"
    :modal-show="itemNoteModal"
    :set-modal="openItemNoteModal"
    :orderItem="orderItem"
  />

  <div
    v-if="movePackageLoading"
    class="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center cursor-not-allowed"
  >
    <div class="text-white text-2xl p-2">Loading...</div>
  </div>
</template>
