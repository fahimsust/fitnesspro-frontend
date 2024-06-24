<script setup lang="ts">
import _ from "lodash";
import Lucide from "~/components/enigma/base-components/Lucide";
import { InputField, SubmitButton, SelectField } from "~/components/form";
definePageMeta({
  middleware: ["auth"],
  layout: "simple-menu-new",
});

useHead({
  title: "Add Setting Template: " + useRuntimeConfig().public.company,
});
const { updateSettingTemplate, getSettingTemplate, errors, loading } = useCategorySettingTemplate();
const route = useRoute();
const idParem = parseInt(route.params.id.toString());

const {
  getLayout,
  getDisplayTemplateThumbnail,
  getDisplayTemplateCategory,
  getSearchForms,
  getModuleTemplate
} = useProductSiteSetting();
const defaultLayouts = [
  { id: 0, name: "Use Site's Layout" },
  { id: 1, name: "Select different option" },
];
const defaultModule = [
  { id: 0, name: "Use Site's Module Template" },
  { id: 1, name: "Select different option" },
];

const dataLoaded = ref(false)
let settingTemplate: any = ref([])
let layoutTemplates: any = ref([])
let moduleTemplates: any = ref([])
let searchForms: any = ref([])
let thumbDisplay: any = ref([])
let categoryDisplay: any = ref([])

const fetchData = async () => {
  settingTemplate = await getSettingTemplate(idParem)
  layoutTemplates = await getLayout();
  moduleTemplates = await getModuleTemplate();
  searchForms = await getSearchForms();
  thumbDisplay = await getDisplayTemplateThumbnail();
  categoryDisplay = await getDisplayTemplateCategory();
  dataLoaded.value = true
}

const sortArray = [
  { 'name': 'Price (Low to High)', 'id': 1 },
  { 'name': 'Price (High to Low)', 'id': 2 },
  { 'name': 'Name (A to Z)', 'id': 3 },
  { 'name': 'Name (Z to A)', 'id': 4 },
  { 'name': 'Avg. Rating', 'id': 5 },
  { 'name': 'Brand (A to Z)', 'id': 6 },
  { 'name': 'Brand (Z to A)', 'id': 7 },
  { 'name': 'Product No. (A to Z)', 'id': 8 },
  { 'name': 'Product No. (Z to A)', 'id': 9 },
  { 'name': 'Created', 'id': 10 },
  { 'name': 'Newest', 'id': 11 },
  { 'name': 'Category/Product Rank', 'id': 12 },
]
const showHide = [
  { 'name': 'Show', 'id': 1 },
  { 'name': 'Hide', 'id': -1 },
]
const showProduct = [
  { 'name': 'Use Default Setting', 'id': -2 },
  { 'name': 'Don\'t Show Products', 'id': -1 },
  { 'name': 'Category Setting Filters (Types, Brand, Attribute Rules)', 'id': 0 },
  { 'name': 'Manually Related Products', 'id': 1 },
  { 'name': 'Both (Filtered and Manually Related)', 'id': 2 },
]
let form = reactive({
  name: settingTemplate.value.name,
  layout_id: settingTemplate.value.layout_id,
  layout_id_default: settingTemplate.value.layout_id_default,
  module_template_id: settingTemplate.value.module_template_id,
  module_template_id_default: settingTemplate.value.module_template_id_default,
  category_thumbnail_template: settingTemplate.value.category_thumbnail_template,
  feature_thumbnail_template: settingTemplate.value.feature_thumbnail_template,
  product_thumbnail_template: settingTemplate.value.product_thumbnail_template,
  show_categories_in_body: settingTemplate.value.show_categories_in_body,
  show_featured: settingTemplate.value.show_featured,
  feature_defaultsort: settingTemplate.value.feature_defaultsort,
  feature_showsort: settingTemplate.value.feature_showsort,
  feature_showmessage: settingTemplate.value.feature_showmessage,
  feature_thumbnail_count: settingTemplate.value.feature_thumbnail_count,
  show_products: settingTemplate.value.show_products,
  product_thumbnail_showsort: settingTemplate.value.product_thumbnail_showsort,
  product_thumbnail_defaultsort: settingTemplate.value.product_thumbnail_defaultsort,
  product_thumbnail_count: settingTemplate.value.product_thumbnail_count,
  product_thumbnail_showmessage: settingTemplate.value.product_thumbnail_showmessage,
  search_form_id: settingTemplate.value.search_form_id,
});
const validateAndCreate = async () => {
  await updateSettingTemplate(form, idParem);
  validationFocus(form, errors);
};
onMounted(async () => {
  await nextTick();
  await fetchData();
});
</script>
<template>
  <div class="flex items-center mt-8 intro-y">
    <h2 class="mr-auto text-lg font-medium">Add Setting Template</h2>
  </div>
  <div class="mt-3" v-if="!dataLoaded">
    <div class="rounded-lg box intro-y lg:mt-0">
      <TableLoading />
    </div>
  </div>  
  <div class="grid grid-cols-11 pb-20 mt-5 gap-x-6" v-if="dataLoaded">
    <div class="col-span-11 overflow-auto intro-y lg:overflow-visible">
      <div class="p-5 mt-5 intro-y box">
        <div class="p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400">
          <InputField name="name" v-model="form" :error="errors.name" title="Name" :required="true"
            :submitFunction="validateAndCreate" />
        </div>
      </div>
      <div class="p-5 mt-3 intro-y box">
        <div class="p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400">
          <div
            class="flex items-center pb-5 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400">
            <Lucide icon="ChevronDown" class="w-4 h-4 mr-2" /> Layout & Modules
          </div>
          <div class="mt-5">
            <div class="grid grid-cols-12 gap-4 gap-y-3">
              <div class="col-span-6 xs:col-span-12">
                <div>
                  <SelectField :options="defaultLayouts" name="layout_id_default" v-model="form"
                    :error="errors.layout_id_default" defaultOption="Use Default Category Module Template"
                    title="Layout" :submitFunction="validateAndCreate" />
                </div>
                <div class="mt-3" v-if="form.layout_id_default == 1">
                  <SelectField :options="layoutTemplates" name="layout_id" v-model="form" :error="errors.layout_id"
                    title="Layout" :withLabel="false" :submitFunction="validateAndCreate" />
                </div>

              </div>
              <div class="col-span-6 xs:col-span-12">
                <div>
                  <SelectField :options="defaultModule" name="module_template_id_default" v-model="form"
                    :error="errors.module_template_id_default" defaultOption="Use Default Category Module Template"
                    title="Module Template" :submitFunction="validateAndCreate" />
                </div>
                <div class="mt-3" v-if="form.module_template_id_default == 1">
                  <SelectField :options="moduleTemplates" name="module_template_id" v-model="form"
                    :error="errors.module_template_id" title="Module Template" :withLabel="false"
                    :submitFunction="validateAndCreate" />
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="p-5 mt-3 intro-y box">
        <div class="p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400">
          <div
            class="flex items-center pb-5 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400">
            <Lucide icon="ChevronDown" class="w-4 h-4 mr-2" /> Category Thumbnail Settings
          </div>
          <div class="mt-5">
            <div class="grid grid-cols-12 gap-4 gap-y-3">
              <div class="col-span-6 xs:col-span-12">
                <SelectField :options="showHide" name="show_categories_in_body" v-model="form"
                  :error="errors.show_categories_in_body" title="Categories in Body"
                  :submitFunction="validateAndCreate" />
              </div>
              <div class="col-span-6 xs:col-span-12">
                <SelectField :options="categoryDisplay" name="category_thumbnail_template" v-model="form"
                  :error="errors.category_thumbnail_template" title="Template" :submitFunction="validateAndCreate" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="p-5 mt-3 intro-y box">
        <div class="p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400">
          <div
            class="flex items-center pb-5 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400">
            <Lucide icon="ChevronDown" class="w-4 h-4 mr-2" /> Feature Thumbnail Settings
          </div>
          <div class="mt-5">
            <div class="grid grid-cols-12 gap-4 gap-y-3">
              <div class="col-span-6 xs:col-span-12">
                <SelectField :options="showHide" name="show_featured" v-model="form" :error="errors.show_featured"
                  title="Show Featured Products" :submitFunction="validateAndCreate" />
              </div>
              <div class="col-span-6 xs:col-span-12">
                <SelectField :options="thumbDisplay" name="feature_thumbnail_template" v-model="form"
                  :error="errors.feature_thumbnail_template" defaultOption="Use Default Category Feature Thumbnail"
                  title="Template" :submitFunction="validateAndCreate" />
              </div>
              <div class="col-span-6 xs:col-span-12">
                <SelectField :options="sortArray" name="feature_defaultsort" v-model="form"
                  :error="errors.feature_defaultsort" defaultOption="Use Default Category Feature Sort"
                  title="Default Sort" :submitFunction="validateAndCreate" />
              </div>
              <div class="col-span-6 xs:col-span-12">
                <SelectField :options="showHide" name="feature_showsort" v-model="form" :error="errors.feature_showsort"
                  title="Sort Menu" :submitFunction="validateAndCreate" />
              </div>
              <div class="col-span-6 xs:col-span-12">
                <SelectField :options="showHide" name="feature_showmessage" v-model="form"
                  :error="errors.feature_showmessage" title="Results Message" :submitFunction="validateAndCreate" />
              </div>
              <div class="col-span-6 xs:col-span-12">
                <InputField type="number" name="feature_thumbnail_count" v-model="form"
                  :error="errors.feature_thumbnail_count" title="Featured Products Count"
                  :submitFunction="validateAndCreate" />
              </div>
            </div>

          </div>
        </div>
      </div>
      <div class="p-5 mt-3 intro-y box">
        <div class="p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400">
          <div
            class="flex items-center pb-5 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400">
            <Lucide icon="ChevronDown" class="w-4 h-4 mr-2" /> Product Thumbnail Settings
          </div>
          <div class="mt-5">
            <div class="grid grid-cols-12 gap-4 gap-y-3">
              <div class="col-span-6 xs:col-span-12">
                <SelectField :options="showProduct" name="show_products" v-model="form" :error="errors.show_products"
                  title="Show Products By" :submitFunction="validateAndCreate" />
              </div>
              <div class="col-span-6 xs:col-span-12">
                <SelectField :options="thumbDisplay" name="product_thumbnail_template" v-model="form"
                  :error="errors.product_thumbnail_template" defaultOption="Use Default Category Product Thumbnail"
                  title="Template" :submitFunction="validateAndCreate" />
              </div>
              <div class="col-span-6 xs:col-span-12">
                <SelectField :options="showHide" name="product_thumbnail_showsort" v-model="form"
                  :error="errors.product_thumbnail_showsort" title="Sort Menu" :submitFunction="validateAndCreate" />
              </div>
              <div class="col-span-6 xs:col-span-12">
                <SelectField :options="sortArray" name="product_thumbnail_defaultsort" v-model="form"
                  :error="errors.product_thumbnail_defaultsort" defaultOption="Use Default Category Default Sort"
                  title="Default Sort" :submitFunction="validateAndCreate" />
              </div>
              <div class="col-span-6 xs:col-span-12">
                <InputField type="number" name="product_thumbnail_count" v-model="form"
                  :error="errors.product_thumbnail_count" title="Products per Page"
                  :submitFunction="validateAndCreate" />
              </div>
              <div class="col-span-6 xs:col-span-12">
                <SelectField :options="showHide" name="product_thumbnail_showmessage" v-model="form"
                  :error="errors.product_thumbnail_showmessage" title="Results Message"
                  :submitFunction="validateAndCreate" />
              </div>
            </div>

          </div>
        </div>
      </div>
      <div class="p-5 mt-3 intro-y box">
        <div class="p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400">
          <div
            class="flex items-center pb-5 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400">
            <Lucide icon="ChevronDown" class="w-4 h-4 mr-2" /> Search
          </div>
          <div class="mt-5">
            <div class="grid grid-cols-12 gap-4 gap-y-3">
              <div class="col-span-12 xs:col-span-12">
                <SelectField :options="searchForms" name="search_form_id" v-model="form" :error="errors.search_form_id"
                  title="Advanced Search Form" :submitFunction="validateAndCreate" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-5 text-right">
        <SubmitButton :createFunction="validateAndCreate" :loading="loading" />
      </div>

    </div>
  </div>
</template>
