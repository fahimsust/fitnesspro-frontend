<script lang="ts" setup>
import Table from "~/components/enigma/base-components/Table";
import Lucide from "~/components/enigma/base-components/Lucide";
import Button from "~/components/enigma/base-components/Button";
import UploadFile from "~/components/UploadFile.vue";
import SearchImage from "~/components/SearchImage.vue";
import { FormSwitch, FormSelect } from "~/components/enigma/base-components/Form";
import { ref } from "vue";
const props = defineProps({
  modelValue: {
    required: true,
    type: Object,
  },
  popup: {
    required: false,
    type: Boolean,
    default: false,
  },
});
const product = ref(props.modelValue);
const popup = ref(props.popup);
const is_change = ref(false);
const {
  productImages,
  addProductImage,
  updateProductImage,
  deleteProductImage,
  searchProductImages,
  setArchiveId,
  updateCategoryImage,
  updateDetailImage,
  resetPage,
  deleteConfirmationModal,
} = useProductImage(product.value.parent_product == null ? 0 : 1);


let images: any = ref([])
let lastPage: any = ref(1)
let currentPage: any = ref(1)
let keywordString: any = ref('')
let orderBy:any = ref('');
let orderType:any = ref('');
let sImages: any = ref([])
const dataLoaded = ref(false)
const fetchData = async () => {
  const result = await searchProductImages(
    product.value.id
  );
  images = result.images
  lastPage = result.lastPage
  currentPage = result.currentPage
  keywordString = result.keywordString
  orderBy = result.orderBy;
  orderType = result.orderType;
  sImages = await productImages(
    product.value.parent_product == null ? product.value.id : product.value.parent_product
  );
  dataLoaded.value = true
}
const removeProductImage = () => {
  deleteProductImage(product.value.id);
};
const refreshImages = async () => {
  await searchProductImages(product.value.id);
};
const searchByKeyword = async (value: string) => {
  resetPage();
  createNewPathAndPush("keyword", value, true);
  await refreshImages();
};
const setValue = async (fieldName: string, value: any, productImageObj: any) => {
  let form: any = reactive({
    caption: productImageObj.caption,
    rank: productImageObj.rank,
    show_in_gallery: productImageObj.show_in_gallery,
  });
  if (fieldName == "show_in_gallery") {
    form[fieldName] = !form[fieldName];
  }
  await updateProductImage(form, productImageObj.product_id, productImageObj.image_id);
  await refreshImages();
};
const setVlueIfChange = async (fieldName: string, value: any, productImageObj: any) => {
  if (is_change.value == true) {
    await setValue(fieldName, value, productImageObj);
    is_change.value = false;
  }
};
const setValuDetails = (details_img_id: string) => {
  let form: any = reactive({
    details_img_id: details_img_id,
  });
  updateDetailImage(form, product.value.id);
};
const setValuCategory = (category_img_id: string) => {
  let form: any = reactive({
    category_img_id: category_img_id,
  });
  updateCategoryImage(form, product.value.id);
};
const addImage = async (image_id: number) => {
  let form: any = reactive({
    image_id: image_id,
  });
  await addProductImage(form, product.value.id);
  await refreshImages();
  sImages = await productImages(product.value.id);
};
const setConfirmationModal = (value: boolean) => {
  deleteConfirmationModal.value = value;
};
const modalShow = ref(false);
const setModal = (value: boolean) => {
  modalShow.value = value;
};
const modalShowSearch = ref(false);
const setModalSearch = (value: boolean) => {
  modalShowSearch.value = value;
};
onMounted(async () => {
  await nextTick();
  await fetchData();
})
const headerColumns = ref([
  { label: 'IMAGE', field: 'image', sortable: false },
  { label: 'CAPTION', field: 'caption', sortable: true },
  { label: 'RANK', field: 'rank', sortable: true,extraClass:"text-right" },
  { label: 'SHOW IN GALLERY', field: 'show_in_gallery', sortable: true }, 
  { label: 'ACTION', field: '', sortable: false }, // Add empty column
]);
const fetchList = async () => {
  currentPage.value = 1;
  await searchProductImages(
    product.value.id
  );
};
const changeOrder = async (order_by: string) => {
  await changeOrderBy(order_by, orderBy, orderType, fetchList);
}
</script>

<template>
  <div class="col-span-12 intro-y" :class="{ box: !popup, 'md:mt-5': !popup }">
    <div class="md:px-5 px-2 intro-y overflow-x-auto" :class="{ 'md:mt-5': !popup }">
      <div v-if="!dataLoaded">
        <div class="rounded-lg box intro-y mt-3">
          <TableLoading />
        </div>
      </div>
      <Table class="mt-2 hover w-full" v-if="dataLoaded">
        <Table.Tbody>
          <Table.Tr class="intro-x">
            <Table.Td>
              <b>Product Deatils Image</b>
            </Table.Td>
            <Table.Td>
              <FormSelect v-model="product.details_img_id"
                @change="setValuDetails(($event.target as HTMLInputElement).value)">
                <option value="">Select</option>
                <option :value="image.id" v-for="image in sImages" :key="image.id">
                  {{ image.name }}
                </option>
              </FormSelect>
            </Table.Td>
          </Table.Tr>
          <Table.Tr class="intro-x">
            <Table.Td>
              <b>Product Category Image</b>
            </Table.Td>
            <Table.Td>
              <FormSelect v-model="product.category_img_id"
                @change="setValuCategory(($event.target as HTMLInputElement).value)">
                <option value="">Select</option>
                <option :value="image.id" v-for="image in sImages" :key="image.id">
                  {{ image.name }}
                </option>
              </FormSelect>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </div>
    <div class="flex flex-wrap items-center justify-between col-span-12 mt-5 pl-5 intro-y sm:flex-nowrap">
      <div class="flex flex-wrap items-center justify-between col-span-5 intro-y sm:flex-nowrap">
        <Button @click="() => setModal(true)" v-if="product.parent_product == null" variant="primary"
          class="mr-2 shadow-md">
          Upload Image
        </Button>
        <Button @click="() => setModalSearch(true)" variant="primary" class="mr-2 shadow-md">
          Search Image
        </Button>
      </div>
      <div class="w-full px-5 pl-0 sm:pl-5 mb-3 xl:mb-0 sm:w-auto mt-3 ml-0 xl:mt-0 sm:ml-auto md:ml-0">
        <div class="relative w-56 text-slate-500">
          <EnterSearch v-model="keywordString" :searchByKeyword="searchByKeyword" />
        </div>
      </div>
    </div>
    <div class="px-5 intro-y xl:mt-5 overflow-x-auto">
      <Table class="border-spacing-y-[10px] border-separate -mt-2 hover">
        <SortableTableHeader
          :columns="headerColumns"
          :orderBy="orderBy"
          :orderType="orderType"
          :handleSort="changeOrder"
          :v-if="dataLoaded"
        />
        <Table.Tbody>
          <Table.Tr v-if="!dataLoaded" class="intro-x">
            <Table.Td colspan="5" class="py-0 px-0">
              <TableLoading />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-if="images.length == 0 && dataLoaded" class="intro-x">
            <Table.Td colspan="5" class="py-0 px-0">
              <AlertGray />
            </Table.Td>
          </Table.Tr>

          <Table.Tr class="intro-x" v-for="image in images" :key="image.id">
            <Table.Td>
              <img :alt="image.image.name" :src="`${useRuntimeConfig().public.s3ImageUrl}/tr:w-80,h-80/${image.image.filename
                }`" />
            </Table.Td>
            <Table.Td>
              <input class="input_class" type="text" v-model="image.caption" @change="() => (is_change = true)"
                @blur="setVlueIfChange('caption', ($event.target as HTMLInputElement).value, image)" />
            </Table.Td>
            <Table.Td class="text-right px-3">
              <input class="input_class max-w-[75px] text-right" type="number" v-model="image.rank"
                @change="() => (is_change = true)"
                @blur="setVlueIfChange('rank', ($event.target as HTMLInputElement).value, image)" />
            </Table.Td>
            <Table.Td>
              <FormSwitch>
                <FormSwitch.Input type="checkbox" id="show_in_gallery" v-model="image.show_in_gallery"
                  @click="setValue('show_in_gallery', ($event.target as HTMLInputElement).value, image)" />
              </FormSwitch>
            </Table.Td>
            <Table.Td>
              <div class="flex items-center justify-center">
                <NuxtLink class="flex text-danger text-center cursor-pointer" @click="(event) => {
                  event.preventDefault();
                  setArchiveId(image.image_id);
                  setConfirmationModal(true);
                }
                  ">
                  <Lucide icon="Trash2" class="w-4 h-4 mr-1" />
                  <span class="hidden">Remove</span>
                </NuxtLink>
              </div>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </div>
    <Pagination v-if="product.parent_product == null && dataLoaded" class="pb-5" v-model="currentPage" :getList="refreshImages"
      :numberOfPages="lastPage" />
    <PaginationModal v-if="product.parent_product != null && dataLoaded" class="pb-5" v-model="currentPage" :getList="refreshImages"
      :numberOfPages="lastPage" />
  </div>
  <UploadFile v-if="modalShow" :setModel="setModal" :modalShow="modalShow" :add="addImage" />
  <SearchImage v-if="modalShowSearch" :setModel="setModalSearch" :modalShow="modalShowSearch" :add="addImage"
    :product_id="product.id" />
  <Confirmation v-model="deleteConfirmationModal" buttonStringMain="Remove"
    subHeader="Do you want to remove this product image?" :setConfirmationModal="setConfirmationModal"
    :set-id="setArchiveId" :functionToRun="removeProductImage" />
</template>
<style lang="postcss" scoped>
.input_class {
  @apply disabled:bg-slate-100 disabled:cursor-not-allowed text-center dark:disabled:bg-darkmode-800/50 dark:disabled:border-transparent [&[readonly]]:bg-slate-100 [&[readonly]]:cursor-not-allowed [&[readonly]]:dark:bg-darkmode-800/50 [&[readonly]]:dark:border-transparent transition duration-200 ease-in-out w-full text-sm border-slate-200 shadow-sm rounded-md placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary focus:border-opacity-40 dark:bg-darkmode-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:placeholder:text-slate-500/80 flex-1;
}
</style>
