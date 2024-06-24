<script setup lang="ts">
import _ from "lodash";
import { ref, toRefs } from "vue";
import Lucide from "~/components/enigma/base-components/Lucide";
import {
  FormSwitch,
  FormSelect,
  FormInput,
} from "~/components/enigma/base-components/Form";
import { Popover } from "~/components/enigma/base-components/Headless";
import Table from "~/components/enigma/base-components/Table";
import Button from "~/components/enigma/base-components/Button";
import Alert from "~/components/enigma/base-components/Alert";
import EditVariantVue from "~/components/product/EditVariant.vue";
import AwaitingVariant from "~/components/product/inventory/AwaitingVariant.vue";
import IntSwitch from "~~/components/form/IntSwitch.vue";

const props = defineProps({
  modelValue: {
    required: true,
    type: Object,
  },
});
const product = ref(props.modelValue);

const {
  variantList,
  setArchiveId,
  summary,
  updateProductVariant,
  deleteProductVariant,
  deleteConfirmationModal,
  resetPage,
} = useProductVariant();
const { distributors, availabilities } = useProducts();
const { productImages } = useProductImage();

let distributorList: any = ref([]);
let availabilityList: any = ref([]);
let images: any = ref([]);
let summaryData: any = ref([]);
let variants: any = ref([])
let keywordString: any = ref('')
let lastPage: any = ref(1)
let currentPage: any = ref(1)
let orderBy:any = ref('');
let orderType:any = ref('');
const dataLoaded = ref(false)
const fetchData = async () => {
  const result = await variantList(
    product.value.id
  );
  variants = result.variants
  keywordString = result.keywordString
  lastPage = result.lastPage
  currentPage = result.currentPage
  orderBy = result.orderBy;
  orderType = result.orderType;
  distributorList = await distributors();
  availabilityList = await availabilities();
  images = await productImages(product.value.id);
  summaryData = await summary(product.value.id);
  dataLoaded.value = true
}


const refreshList = async () => {
  await variantList(product.value.id);
};
const search = async (value: string) => {
  resetPage();
  createNewPathAndPush("keyword", value, true);
  await refreshList();
};
const checkedVariant: any = ref([]);
const product_id = ref(0);
const modalShow = ref(false);
const setModel = (value: boolean) => {
  modalShow.value = value;
};
const editVariant = (id: number) => {
  product_id.value = id;
  setModel(true);
};
const modalShowAwaiting = ref(false);
const setModelAwaiting = (value: boolean) => {
  modalShowAwaiting.value = value;
};
const setConfirmationModal = (value: boolean) => {
  deleteConfirmationModal.value = value;
};
const removeVariant = async () => {
  await deleteProductVariant(product.value.id);
};
const methodNumber = ref(0);
const status = ref(0);
const outOfStock = ref(1);
const distributor = ref(1);
const stockQuantity = ref(1);
const imageId = ref({});
const distributorId = ref(1);
const checkAll = ref(false);

const saveStatus = async () => {
  let form = reactive({
    products: checkedVariant.value,
    status: status.value,
  });
  await updateProductVariant(form, "status");
};
const saveDefaultDistributor = async () => {
  let form = reactive({
    products: checkedVariant.value,
    default_distributor_id: distributorId.value,
  });
  await updateProductVariant(form, "default-distributor");
};
const saveOutOfStock = async () => {
  let form = reactive({
    products: checkedVariant.value,
    default_outofstockstatus_id: outOfStock.value,
  });
  await updateProductVariant(form, "out-of-stock");
};
const saveImage = async () => {
  let form = reactive({
    products: checkedVariant.value,
    image_id: imageId.value,
  });
  await updateProductVariant(form, "image");
};
const savedistributorStock = async () => {
  let form = reactive({
    products: checkedVariant.value,
    distributor_id: distributor.value,
    stock_qty: stockQuantity.value,
  });
  await updateProductVariant(form, "distributor-stock-quantity");
  await summary(product.value.id);
};
const validateAndSave = async (closeFunction: Function) => {
  if (methodNumber.value > 0) {
    saving.value = true;
    if (methodNumber.value == 1) {
      await saveStatus();
    }
    if (methodNumber.value == 2) {
      await saveOutOfStock();
    }
    if (methodNumber.value == 3) {
      await savedistributorStock();
    }
    if (methodNumber.value == 4) {
      await saveImage();
    }
    if (methodNumber.value == 5) {
      await saveDefaultDistributor();
    }
    await refreshList();
    closeFunction();
    saving.value = false;
  }
};
const saving = ref(false);
const checkAllProduct = () => {
  checkAll.value = !checkAll.value;
  checkedVariant.value = [];
  if (checkAll.value) {
    variants.value.forEach(function (variant: { id: number }) {
      checkedVariant.value.push(variant.id);
    });
  }
};
const changeStatus = async (value: boolean, id: number) => {
  let form = reactive({
    products: [id],
    status: value == true ? 1 : 0,
  });
  await updateProductVariant(form, "status");
  await refreshList();
};
onMounted(async () => {
  await nextTick();
  await fetchData();
})
const headerColumns = [
  { label: '', field: 'checkbox', sortable: false },
  { label: 'ID', field: 'id', sortable: true },
  { label: 'PRODUCT', field: "title", sortable: true },
  { label: 'SKU', field: 'product_no', sortable: true },
  { label: 'STOCK QTY', field: 'combined_stock_qty', sortable: true, extraClass: 'text-right' },
  { label: 'STATUS', field: 'status', sortable: true },
  { label: '', field: '', sortable: false, extraClass: 'text-center' }
];
const fetchList = async () => {
  currentPage.value = 1;
  await variantList(
    product.value.id
  );
};
const changeOrder = async (order_by: string) => {
  await changeOrderBy(order_by, orderBy, orderType, fetchList);
}
</script>

<template>
  <div class="grid grid-cols-12 gap-3 mt-5">
    <div class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
      <Button variant="pending" class="ml-0 mb-2 sm:mb-0 shadow-none" @click="setModelAwaiting(true)">
        Option Combos Awaiting Variants
      </Button>
    </div>
    <div class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
      <div class="mr-auto md:block text-slate-500" v-if="dataLoaded && summaryData">
        Current Combined Stock Qty
        <b>{{
          summaryData.total_stock_qty ? parseInt(summaryData.total_stock_qty) : 0
        }}</b>
        and Total Number of Variants <b>{{ parseInt(summaryData.total) }}</b>
      </div>
      <Popover class="inline-block mr-2 mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0" v-slot="{ close }">
        <Popover.Button :as="Button" variant="secondary">
          Modify Selected Variant
          <Lucide icon="ChevronDown" class="w-4 h-4 ml-2" />
        </Popover.Button>
        <Popover.Panel placement="bottom-start" v-if="dataLoaded">
          <div class="p-2" v-if="checkedVariant.length == 0">
            <Alert variant="secondary" class="flex py-2 px-2 items-center">
              Please Select A Variant
            </Alert>
          </div>

          <div class="p-2" v-if="checkedVariant.length > 0">
            <div>
              <FormSelect v-model="methodNumber">
                <option value="0">Choose Action</option>
                <option value="1">Change Status</option>
                <option value="2">Change Default Out of Stock Status</option>
                <option value="3">Change Distributor Stock Qty</option>
                <option value="4">Set Image</option>
                <option value="5">Change Default Distributor</option>
              </FormSelect>
            </div>
            <div class="mt-3">
              <FormSelect v-model="status" v-if="methodNumber == 1">
                <option value="0">Turn Off</option>
                <option value="1">Turn On</option>
                <option value="-1">Archive</option>
              </FormSelect>
              <FormSelect v-model="outOfStock" v-if="methodNumber == 2">
                <option v-for="availavility in availabilityList" :value="availavility.id">
                  {{ availavility.name }}
                </option>
              </FormSelect>
              <FormSelect v-model="distributor" v-if="methodNumber == 3">
                <option v-for="distributorSingle in distributorList" :value="distributorSingle.id">
                  {{ distributorSingle.name }}
                </option>
              </FormSelect>
              <FormInput class="mt-2" type="number" v-model="stockQuantity" v-if="methodNumber == 3" />
              <FormSelect v-model="imageId" v-if="methodNumber == 4">
                <option v-for="image in images" :value="image.id">
                  {{ image.name }}
                </option>
              </FormSelect>
              <FormSelect v-model="distributorId" v-if="methodNumber == 5">
                <option v-for="distributorSingle in distributorList" :value="distributorSingle.id">
                  {{ distributorSingle.name }}
                </option>
              </FormSelect>
            </div>
            <div class="flex items-center mt-3">
              <Button variant="primary" @click="saving == false ? validateAndSave(close) : () => { }"
                class="w-64 ml-auto" :class="{ 'cursor-wait': saving }">
                Save
              </Button>
            </div>
          </div>
        </Popover.Panel>
      </Popover>
      <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
        <div class="relative w-56 text-slate-500">
          <EnterSearch v-model="keywordString" :searchByKeyword="search" />
        </div>
      </div>
    </div>

    <div class="col-span-12 overflow-x-auto intro-y">
      <Table class="border-spacing-y-[10px] border-separate hover">
        <SortableTableHeader
          :columns="headerColumns"
          :orderBy="orderBy"
          v-if="dataLoaded"
          :orderType="orderType"
          :handleSort="changeOrder"
          :check-all="checkAll"
          :check-all-product="checkAllProduct"
        />
        <Table.Tbody>
          <Table.Tr v-if="!dataLoaded" class="intro-x">
            <Table.Td colspan="7" class="py-0 px-0">
              <TableLoading />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-if="variants.length == 0 && dataLoaded" class="intro-x">
            <Table.Td colspan="7" class="py-0 px-0">
              <AlertGray />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-for="variant in variants" @click="editVariant(variant.id)" :key="variant.id"
            class="intro-x cursor-pointer">
            <Table.Td>
              <input type="checkbox" @click="$event.stopPropagation()" v-model="checkedVariant" :value="variant.id"
                :key="variant.id" />
            </Table.Td>
            <Table.Td>
              {{ variant.id }}
            </Table.Td>
            <Table.Td>
              {{ variant.full_name }}
            </Table.Td>
            <Table.Td>
              {{ variant.sku }}
            </Table.Td>
            <Table.Td class="text-right">
              {{ variant.combined_stock_qty }}
            </Table.Td>
            <Table.Td>
              <IntSwitch :key="variant.status" v-model="variant.status" :change-status="changeStatus"
                :cat_id="variant.id" />
            </Table.Td>
            <Table.Td>
              <div class="flex items-center justify-center">
                <Button variant="danger" class="ml-0 mb-2 sm:mb-0 shadow-none" @click="(event) => {
                  setArchiveId(variant.id);
                  setConfirmationModal(true);
                  event.stopPropagation();
                }
                  ">
                  Unassign
                </Button>
              </div>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
      <Pagination v-model="currentPage" v-if="dataLoaded" :getList="refreshList" :numberOfPages="lastPage" />
    </div>
  </div>
  <EditVariantVue :key="product_id" v-if="product_id != 0" :product_id="product_id" :modal-show="modalShow"
    :set-model="setModel" />
  <Confirmation v-model="deleteConfirmationModal" buttonStringMain="Remove"
    subHeader="Do you want to unassign this variant?" :setConfirmationModal="setConfirmationModal"
    :set-id="setArchiveId" :functionToRun="removeVariant" />
  <AwaitingVariant v-if="modalShowAwaiting" v-model="product" :set-model="setModelAwaiting"
    :modal-show="modalShowAwaiting" />
</template>
