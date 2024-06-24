<script setup lang="ts">
import _ from "lodash";
import Lucide from "~/components/enigma/base-components/Lucide";
import { InputField, SubmitButton, SelectField } from "~/components/form";
definePageMeta({
  middleware: ["auth"],
  layout: "simple-menu-new",
});

useHead({
  title: "Edit Setting Template: " + useRuntimeConfig().public.company,
});
const { updateSettingTemplate,getSettingTemplate, errors, loading } = useProductSettingTemplate();
const route = useRoute();
const idParem = parseInt(route.params.id.toString());
const settingTemplate = await getSettingTemplate(idParem)
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
  name: settingTemplate.value.name,
  layout_id:settingTemplate.value.layout_id,
  layout_id_default:settingTemplate.value.layout_id_default,
  module_template_id: settingTemplate.value.module_template_id,
  module_template_id_default: settingTemplate.value.module_template_id_default,
  product_detail_template: settingTemplate.value.product_detail_template,
  product_detail_template_default: settingTemplate.value.product_detail_template_default,
  product_thumbnail_template: settingTemplate.value.product_thumbnail_template,
  product_thumbnail_template_default: settingTemplate.value.product_thumbnail_template_default,
  product_zoom_template: settingTemplate.value.product_zoom_template,
  product_zoom_template_default: settingTemplate.value.product_zoom_template_default
});
const validateAndCreate = async () => {
  await updateSettingTemplate(form,idParem);
  validationFocus(form, errors);
};
onMounted(async()=>{
  await nextTick();
  await fetchData();
})
</script>
<template>
  <div class="flex items-center mt-8 intro-y">
    <h2 class="mr-auto text-lg font-medium">Edit Setting Template</h2>
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

