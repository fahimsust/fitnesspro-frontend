<script setup lang="ts">
import _ from "lodash";
import Lucide from "~/components/enigma/base-components/Lucide";
import { FormInline } from "~/components/enigma/base-components/Form";
import { InputField, SubmitButton, EditorField, CheckBoxField } from "~/components/form";
import TomSelectField from "~/components/form/TomSelectField.vue";
import { useQueryParamStore } from "~/store/enigma/query-param";
definePageMeta({
  middleware: ["auth"],
  layout: "simple-menu-new",
});

useHead({
  title: "Add Product: " + useRuntimeConfig().public.company,
});

useQueryParamStore().setQueryParam({})
const { createProduct, errors, loading, distributors } = useProducts();
let distributorList:any = ref([])

let form = reactive({
  title: "",
  subtitle: "",
  url_name: "",
  default_distributor_id: "",
  product_no: "",
  weight: "",
  summary: "",
  description: "",
  price_reg: "",
  price_sale: "",
  onsale: 0,
  min_qty: "",
  max_qty: "",
  feature: 0,
});
const validateAndCreate = async () => {
  await createProduct(form);
  validationFocus(form, errors);
};
const dataLoaded = ref(false)
onMounted(async()=>{
  await nextTick();
  distributorList = await distributors();
  dataLoaded.value = true
})
</script>
<template>
  <div class="flex items-center mt-8 intro-y">
    <h2 class="mr-auto text-lg font-medium">Add Product</h2>
  </div>
  <div class="grid grid-cols-11 pb-20 mt-5 gap-x-6">
    <div class="col-span-11 overflow-auto intro-y lg:overflow-visible">
      <div class="p-5 mt-5 intro-y box">
        <div class="p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400">
          <div
            class="flex items-center pb-5 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400"
          >
            <Lucide icon="ChevronDown" class="w-4 h-4 mr-2" /> Product Basic Information
          </div>
          <div class="mt-5">
            <FormInline class="mt-5 first:mt-0 flex-wrap">
              <InputField
                :submit-function="validateAndCreate"
                name="title"
                v-model="form"
                :error="errors.title"
                title="Product Title"
                :required="true"
                :formInline="true"
              />
            </FormInline>
            <FormInline class="mt-5 first:mt-0 flex-wrap">
              <InputField
                :submit-function="validateAndCreate"
                name="subtitle"
                v-model="form"
                :error="errors.subtitle"
                title="Sub-title"
                :formInline="true"
              />
            </FormInline>
            <FormInline class="mt-5 first:mt-0 flex-wrap">
              <InputField
                name="url_name"
                :submit-function="validateAndCreate"
                v-model="form"
                :error="errors.url_name"
                title="URL Slug"
                :required="true"
                :formInline="true"
              />
            </FormInline>
            <FormInline class="mt-5 first:mt-0 flex-wrap">
              <InputField
                name="product_no"
                :submit-function="validateAndCreate"
                v-model="form"
                :error="errors.product_no"
                title="SKU"
                :formInline="true"
              />
            </FormInline>
            <FormInline class="mt-5 first:mt-0 flex-wrap">
              <InputField
                name="weight"
                :submit-function="validateAndCreate"
                type="number"
                v-model="form"
                :error="errors.weight"
                title="Weight"
                :formInline="true"
              />
            </FormInline>
            <FormInline class="mt-5 first:mt-0 flex-wrap" v-if="dataLoaded">
              <TomSelectField
                :options="distributorList"
                name="default_distributor_id"
                v-model="form"
                :error="errors.default_distributor_id"
                title="Distributor"
                :formInline="true"
              />
            </FormInline>
          </div>
        </div>
      </div>
      <div class="p-5 mt-5 intro-y box">
        <div class="p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400">
          <div
            class="flex items-center pb-5 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400"
          >
            <Lucide icon="ChevronDown" class="w-4 h-4 mr-2" /> Product Details
          </div>
          <div class="mt-5">
            <EditorField
              name="description"
              v-model="form"
              :error="errors.description"
              title="Product Description"
              :required="true"
            />
          </div>
          <div class="mt-5">
            <EditorField
              name="summary"
              v-model="form"
              :error="errors.summary"
              minHeight="100px"
              title="Product Summary"
              :required="true"
            />
          </div>
        </div>
      </div>
      <div class="p-5 mt-5 intro-y box">
        <div class="p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400">
          <div
            class="flex items-center pb-5 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400"
          >
            <Lucide icon="ChevronDown" class="w-4 h-4 mr-2" /> Product Price
          </div>
          <FormInline class="mt-5 first:mt-0 flex-wrap">
            <InputField
              name="price_reg"
              :submit-function="validateAndCreate"
              type="number"
              v-model="form"
              :error="errors.price_reg"
              title="Default Regular Price ($)"
              :required="true"
              :formInline="true"
            />
          </FormInline>

          <FormInline class="mt-5 first:mt-0 flex-wrap">
            <InputField
              name="price_sale"
              :submit-function="validateAndCreate"
              type="number"
              v-model="form"
              :error="errors.price_sale"
              title="Default Sale Price ($)"
              :formInline="true"
            />
          </FormInline>
          <FormInline class="mt-5 first:mt-0 flex-wrap">
            <check-box-field
              name="onsale"
              v-model="form"
              :error="errors.onsale"
              title="Default On Sale"
              :formInline="true"
            />
          </FormInline>
          <FormInline class="mt-5 first:mt-0 flex-wrap">
            <InputField
              name="min_qty"
              :submit-function="validateAndCreate"
              type="number"
              v-model="form"
              :error="errors.min_qty"
              title="Min Qty"
              :formInline="true"
            />
          </FormInline>
          <FormInline class="mt-5 first:mt-0 flex-wrap">
            <InputField
              name="max_qty"
              :submit-function="validateAndCreate"
              type="number"
              v-model="form"
              :error="errors.max_qty"
              title="Max Qty"
              :formInline="true"
            />
          </FormInline>
          <div class="mt-5 text-right">
            <SubmitButton :createFunction="validateAndCreate" :loading="loading" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
