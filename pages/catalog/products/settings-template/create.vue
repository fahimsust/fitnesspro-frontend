<script setup lang="ts">
import _ from "lodash";
import Lucide from "~/components/enigma/base-components/Lucide";
import { InputField, SubmitButton, SelectField } from "~/components/form";
import { useQueryParamStore } from "~/store/enigma/query-param";
definePageMeta({
  middleware: ["auth"],
  layout: "simple-menu-new",
});

useHead({
  title: "Add Setting Template: " + useRuntimeConfig().public.company,
});

useQueryParamStore().setQueryParam({})
const { addSettingTemplate, errors, loading } = useProductSettingTemplate();
const {
  getModuleTemplate,
  getLayout,
  getDisplayTemplateZoom,
  getDisplayTemplateDetail,
  getDisplayTemplateThumbnail
} = useProductSiteSetting();

let layoutTemplates:any = ref([])
let moduleTemplates:any = ref([])
let zoomDisplay:any = ref([])
let thumbDisplay:any = ref([])
let detailDisplay:any = ref([])

const dataLoaded = ref(false)
const fetchData = async()=>{
  layoutTemplates = await getLayout();
  moduleTemplates = await getModuleTemplate();
  detailDisplay = await getDisplayTemplateDetail();
  zoomDisplay = await getDisplayTemplateZoom();
  thumbDisplay = await getDisplayTemplateThumbnail();
  dataLoaded.value = true
}

const defaultValue = [
  { id: 0, name: "Use Site's Setting" },
  { id: 1, name: "Select different option" },
];
let form = reactive({
  name: "",
  layout_id:null,
  layout_id_default:null,
  module_template_id: null,
  module_template_id_default: null,
  product_detail_template: null,
  product_detail_template_default: null,
  product_thumbnail_template: null,
  product_thumbnail_template_default: null,
  product_zoom_template: null,
  product_zoom_template_default: null
});
const validateAndCreate = async () => {
  await addSettingTemplate(form);
  validationFocus(form, errors);
};
onMounted(async()=>{
  await nextTick();
  await fetchData();
})
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
            <InputField
                name="name"
                v-model="form"
                :error="errors.name"
                title="Name"
                :required="true"
                :submitFunction="validateAndCreate"
              />
        </div>
      </div>    
      <div class="p-5 mt-3 intro-y box">
        <div class="p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400">
          <div
            class="flex items-center pb-5 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400"
          >
            <Lucide icon="ChevronDown" class="w-4 h-4 mr-2" /> Layout & Modules
          </div>
          <div class="mt-5">
            <div class="grid grid-cols-12 gap-4 gap-y-3">
              <div class="col-span-6 xs:col-span-12">
                <div>
                  <SelectField :options="defaultValue" name="layout_id_default" v-model="form" 
              :error="errors.layout_id_default" defaultOption="Use Default Product Layout" title="Layout" :submitFunction="validateAndCreate" />
                </div>
                <div class="mt-3" v-if="form.layout_id_default == 1">
                  <SelectField :options="layoutTemplates" name="layout_id" v-model="form"
              :error="errors.layout_id" title="Layout" :withLabel="false" :submitFunction="validateAndCreate" />
                </div>
                
              </div>

              <div class="col-span-6 xs:col-span-12">
                <div>
                  <SelectField :options="defaultValue" name="module_template_id_default" v-model="form" 
              :error="errors.module_template_id_default" defaultOption="Use Default Product Module Template" title="Module Template" :submitFunction="validateAndCreate" />
                </div>
                <div class="mt-3" v-if="form.module_template_id_default == 1">
                  <SelectField :options="moduleTemplates" name="module_template_id" v-model="form"
              :error="errors.module_template_id" title="Module Template" :withLabel="false" :submitFunction="validateAndCreate" />
                </div>
              </div>

              <div class="col-span-6 xs:col-span-12">
                <div>
                  <SelectField :options="defaultValue" name="product_detail_template_default" v-model="form" 
              :error="errors.product_detail_template_default" defaultOption="Use Default Product Detail Template" title="Detail Display Template" :submitFunction="validateAndCreate" />
                </div>
                <div class="mt-3" v-if="form.product_detail_template_default == 1">
                  <SelectField :options="detailDisplay" name="product_detail_template" v-model="form"
              :error="errors.product_detail_template" title="Detail Display Template" :withLabel="false" :submitFunction="validateAndCreate" />
                </div>
              </div>

              <div class="col-span-6 xs:col-span-12">
                <div>
                  <SelectField :options="defaultValue" name="product_thumbnail_template_default" v-model="form" 
              :error="errors.product_thumbnail_template_default" defaultOption="Use Default Product Thumbnail Template" title="Thumbnail Display Template" :submitFunction="validateAndCreate" />
                </div>
                <div class="mt-3" v-if="form.product_thumbnail_template_default == 1">
                  <SelectField :options="thumbDisplay" name="product_thumbnail_template" v-model="form"
              :error="errors.product_thumbnail_template" title="Thumbnail Display Template" :withLabel="false" :submitFunction="validateAndCreate" />
                </div>
              </div>

              <div class="col-span-6 xs:col-span-12">
                <div>
                  <SelectField :options="defaultValue" name="product_zoom_template_default" v-model="form" 
              :error="errors.product_zoom_template_default" defaultOption="Use Default" title="Zoom Display Template" :submitFunction="validateAndCreate" />
                </div>
                <div class="mt-3" v-if="form.product_zoom_template_default == 1">
                  <SelectField :options="zoomDisplay" name="product_zoom_template" v-model="form"
              :error="errors.product_zoom_template" title="Zoom Display Template" :withLabel="false" :submitFunction="validateAndCreate" />
                </div>
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
