<script setup lang="ts">
import _ from "lodash";
import { nextTick, ref } from 'vue';
import { FormLabel, FormSelect } from "~/components/enigma/base-components/Form";
import Button from "~/components/enigma/base-components/Button";
import { useQueryParamStore } from "~/store/enigma/query-param";
import TableLoading from "~/components/TableLoading.vue";


definePageMeta({
  middleware: ["auth"],
  layout: "simple-menu-new",
});

useHead({
  title: "Product Bulk Edit: " + useRuntimeConfig().public.company,
});

useQueryParamStore().setQueryParam({})
let dynamic = shallowRef()
let dynamicPerform = shallowRef()

const { findCriteria, searchProduct, performCriteria, perform, errors, loading } = useProductBulkEditor();

const options = await findCriteria();
const performCriterias = await performCriteria();
const search_option = ref(null)
const perform_option = ref(null)
const serach_done = ref(false)
const searchForm = ref({})
const searchText = ref("")
let products: any = ref([])
const ids = ref([])
const setProduct = async (form: Object) => {
  products = await searchProduct(form);
  if (Object.keys(errors).length == 0 && products != undefined) {
    serach_done.value = true
    ids.value = products.map((object: { id: any; }) => object.id);
    searchForm.value = form
  }
}
const performAction = async (form: Object) => {
  await perform(form);
  if (Object.keys(errors).length == 0) {
    products = await searchProduct(searchForm.value);
    perform_option.value = null
    dynamicPerform.value = null
  }
}
const loadPerformComponent = () => {
  if (perform_option.value != null) {
    const obj: any = performCriterias.value.find((o: { id: string }) => o.id == perform_option.value);
    const componentName = obj.component_type
    dynamicPerform.value = defineAsyncComponent({
      loader: () => import(`../../../../components/bulkEdit/perform/${componentName}.vue`),
      loadingComponent: TableLoading,
    })
  }
}
const changeComponentPerform = async () => {
  if (perform_option.value == 0) {
    dynamicPerform.value = null
  }
  else {
    performFormValue.value = {}
    loadPerformComponent()
  }
}
const changeComponent = async () => {
  if (search_option.value == null) {
    dynamic.value = null
  }
  else {
    const obj: any = options.value.find((o: { id: string }) => o.id == search_option.value);
    const compname = obj.component_type
    dynamic.value = defineAsyncComponent({
      // the loader function
      loader: () => import(`../../../../components/bulkEdit/find/${compname}.vue`),
      loadingComponent: TableLoading,
      delay: 200,
      timeout: 3000,
      suspensible: true,
    })
  }
}
const checkAll = ref(true)
const checkAllProduct = () => {
  if (checkAll.value == false) {
    ids.value = products.map((object: { id: any; }) => object.id);
  }
  else {
    ids.value = []
  }
}
const performFormValue = ref({});
const resetSearch = () => {
  search_option.value = null
  perform_option.value = null
  serach_done.value = false
  products.value = []
  dynamic = shallowRef()
  dynamicPerform = shallowRef()
  performFormValue.value = {}
}
const getSearchCriteria = () => {
  const foundObject: any = options.value.find((obj: any) => obj.id === search_option.value);
  if (foundObject) {
    return foundObject.search_text
  }
  return "";
}
const addSearchText = (replaceObj: any) => {
  let value = getSearchCriteria();
  for (let key in replaceObj) {
    if (replaceObj.hasOwnProperty(key)) {
      if (key == "forLanguage") {
        const replacement = `${replaceObj[key]}`;
        const regex = new RegExp(key, 'g');
        value = value.replace(regex, replacement);
      }
      else {
        const replacement = `<span class="bg-blue-200 dark:bg-blue-800 px-1 py-0.5 rounded text-blue-600 dark:text-blue-300">${replaceObj[key]}</span>`;
        const regex = new RegExp(key, 'g');
        value = value.replace(regex, replacement);
      }

    }
  }
  searchText.value = value;
}


watch(ids, async () => {
  dynamic.value = null
  await nextTick();
  loadPerformComponent()
});

</script>

<template>
  <h2 class="mt-10 text-lg font-medium intro-y">Product Bulk Edit</h2>
  <div class="grid grid-cols-12 gap-6 mt-5" v-if="serach_done == false">
    <!-- BEGIN: Data List -->
    <div class="col-span-12 overflow-x-auto intro-y box p-5">
      <div>
        <FormLabel>Select Search Criteria</FormLabel>
        <FormSelect v-model="search_option" @change="changeComponent">
          <option value="null">Select Criteria</option>
          <option :value="option.id" v-for="option in options" :key="option.id">
            {{ option.name }}
          </option>
        </FormSelect>
      </div>
      <div class="mt-3">
        <component :is="dynamic" :addSearchText="addSearchText" :loading="loading" :errors="errors"
          :search_option="search_option" v-if="dynamic" :setProduct="setProduct" />
      </div>
    </div>
  </div>
  <div class="grid grid-cols-12 gap-6 mt-5 box p-5" v-if="serach_done == true">
    <h6 class="text-success font-bold col-span-12 leading-none mb-4">Select Criteria: <span v-html="searchText"></span>
    </h6>
    <div class="col-span-12 p-5 border" v-if="products.length > 0">
      <div>
        <FormLabel>Select Edit Criteria</FormLabel>
        <FormSelect v-model="perform_option" :key="perform_option != null ? perform_option : '0'"
          @change="changeComponentPerform">
          <option value="null">Select Criteria</option>
          <option :value="option.id" v-for="option in performCriterias" :key="option.id">
            {{ option.name }}
          </option>
        </FormSelect>
      </div>
      <div class="mt-3">
        <component :is="dynamicPerform" :loading="loading" :errors="errors" :perform_option="perform_option" :ids="ids"
          v-if="dynamicPerform" :performAction="performAction" v-model="performFormValue" />
      </div>
    </div>
    <div class="col-span-12 p-2 border">
      <input type="checkbox" v-if="products.length > 0" v-model="checkAll" value="true" @click="checkAllProduct" /><span
        v-if="products.length > 0" class="mx-3">Check All</span>
      <Button variant="primary" class="px-2 py-1" @click="resetSearch">
        Reset Search
      </Button>
    </div>
    <div class="col-span-12" v-if="products.length == 0">
      <AlertGray />
    </div>
    <div class="col-span-12 p-2 border md:col-span-6 lg:col-span-4" v-for="product in products">
      <input type="checkbox" v-model="ids" :value="product.id">&nbsp;&nbsp;&nbsp;{{ product.title }}
    </div>
  </div>
</template>
