<script lang="ts" setup>
import Button from "~/components/enigma/base-components/Button";
import SiteSetting from "~/components/product/setting/SiteSetting.vue";
import ModuleSection from "~/components/moduleTemplate/ModuleSection.vue"
import { Disclosure } from "~/components/enigma/base-components/Headless";
import { ref } from "vue";

definePageMeta({
  middleware: ["auth"],
  layout: "edit-product",
});

useHead({
  title: "Manage Product Site Settings: " + useRuntimeConfig().public.company,
});

const { getProductSiteSettings } = useProductSiteSetting();
const { getProductSiteSettingsModulesSection } = useSettingModuleTemplate();
const route = useRoute();
const idParem = parseInt(route.params.id.toString());
let productSiteSettings:any = ref({});
const dataLoaded = ref(false)
onMounted(async()=>{
  await nextTick();
  productSiteSettings = await getProductSiteSettings(idParem);
  dataLoaded.value = true
}) 

const refreshSetting = async () => {
  productSiteSettings = await getProductSiteSettings(idParem);
  refresh.value = refresh.value == 0 ? 1 : 0;
};
const modalShow = ref(false);
const setModal = (value: boolean) => {
  modalShow.value = value;
};
const site_id = ref(0);
const module_template_id = ref(0);
const setValueAndOpenModal = (productSiteSetting: any) => {
  site_id.value = productSiteSetting.site_id == null ? 0 : productSiteSetting.site_id;
  if (
    productSiteSetting.settings &&
    productSiteSetting.settings.module_template_id != null
  ) {
    module_template_id.value = productSiteSetting.settings.module_template_id;
  }
  setModal(true);
};

const getDefaultZoomTemplate = () => {
  let name: string = "Default";
  productSiteSettings.value.forEach(function (element: any) {
    if (element.name == null) {
      if (element.settings && element.settings.product_zoom_template != null) {
        name = element.settings.zoom_template.name;
      }
    }
  });
  return name;
};
const getDefaultDetailTemplate = () => {
  let name: string = "Product Detail";
  productSiteSettings.value.forEach(function (element: any) {
    if (element.name == null) {
      if (element.settings && element.settings.product_detail_template != null) {
        name = element.settings.detail_template.name;
      }
    }
  });
  return name;
};
const getDefaultThumbnailTemplate = () => {
  let name: string = "Product Thumbnail";
  productSiteSettings.value.forEach(function (element: any) {
    if (element.name == null) {
      if (element.settings && element.settings.product_thumbnail_template != null) {
        name = element.settings.thumbnail_template.name;
      }
    }
  });
  return name;
};
const getDefaultModuleTemplate = () => {
  let name: string = "Products Page";
  productSiteSettings.value.forEach(function (element: any) {
    if (element.name == null) {
      if (element.settings && element.settings.module_template_id != null) {
        name = element.settings.module_template.name;
      }
    }
  });
  return name;
};
const getDefaultLayourTemplate = () => {
  let name: string = "Products Layout";
  productSiteSettings.value.forEach(function (element: any) {
    if (element.name == null) {
      if (element.settings && element.settings.layout_id != null) {
        name = element.settings.layout.name;
      }
    }
  });
  return name;
};
const getSettingsTemplate = () => {
  let name: string = "None";
  productSiteSettings.value.forEach(function (element: any) {
    if (element.name == null) {
      if (element.settings && element.settings.settings_template_id != null) {
        name = element.settings.settings_template.name;
      }
    }
  });
  return name;
};
const siteName = (productSiteSetting: any) => {
  return productSiteSetting.name != null ? productSiteSetting.name : "Default";
};

const moduleTemplate: any = (productSiteSetting: any) => {
  if (
    productSiteSetting.settings &&
    productSiteSetting.settings.module_template_id != null
  ) {
    return productSiteSetting.settings.module_template.name + " (Customized)";
  } else if (
    productSiteSetting.settings &&
    productSiteSetting.settings.module_template_id_default == 0
  ) {
    return "Products Page (Use Site)";
  } else {
    if (productSiteSetting.name != null) {
      return "Default Module Template (" + getDefaultModuleTemplate() + ")";
    } else {
      return "System Default (Products Page)";
    }
  }
};

const detailTemplate: any = (productSiteSetting: any) => {
  if (
    productSiteSetting.settings &&
    productSiteSetting.settings.product_detail_template != null
  ) {
    return productSiteSetting.settings.detail_template.name + " (Customized)";
  } else if (
    productSiteSetting.settings &&
    productSiteSetting.settings.product_detail_template_default == 0
  ) {
    return "Default Product Detail (Use Site)";
  } else {
    if (productSiteSetting.name != null) {
      return "Default Detail Template (" + getDefaultDetailTemplate() + ")";
    } else {
      return "System Default (Product Detail)";
    }
  }
};
const thumbnailTemplate: any = (productSiteSetting: any) => {
  if (
    productSiteSetting.settings &&
    productSiteSetting.settings.product_thumbnail_template != null
  ) {
    return productSiteSetting.settings.thumbnail_template.name + " (Customized)";
  } else if (
    productSiteSetting.settings &&
    productSiteSetting.settings.product_thumbnail_template_default == 0
  ) {
    return "Default Product Thumbnail (Use Site)";
  } else {
    if (productSiteSetting.name != null) {
      return "Default Thumbnail Template (" + getDefaultThumbnailTemplate() + ")";
    } else {
      return "System Default (Product Thumbnail)";
    }
  }
};

const zoomTemplate: any = (productSiteSetting: any) => {
  if (
    productSiteSetting.settings &&
    productSiteSetting.settings.product_zoom_template != null
  ) {
    return productSiteSetting.settings.zoom_template.name + " (Customized)";
  } else if (
    productSiteSetting.settings &&
    productSiteSetting.settings.product_zoom_template_default == 0
  ) {
    return "Default (Use Site)";
  } else {
    if (productSiteSetting.name != null) {
      return "Default Zoom Template (" + getDefaultZoomTemplate() + ")";
    } else {
      return "System Default";
    }
  }
};
const layout: any = (productSiteSetting: any) => {
  if (productSiteSetting.settings && productSiteSetting.settings.layout_id != null) {
    return productSiteSetting.settings.layout.name + " (Customized)";
  } else if (
    productSiteSetting.settings &&
    productSiteSetting.settings.layout_id_default == 0
  ) {
    return "Products Layout (Use Site)";
  } else {
    if (productSiteSetting.name != null) {
      return "Default Layout Template (" + getDefaultLayourTemplate() + ")";
    } else {
      return "System Default (Products Layout)";
    }
  }
};
const settingTemplate: any = (productSiteSetting: any) => {
  if (
    productSiteSetting.settings &&
    productSiteSetting.settings.settings_template_id != null
  ) {
    return productSiteSetting.settings.settings_template.name + " (Customized)";
  } else {
    if (productSiteSetting.name != null) {
      if (
        productSiteSetting.settings &&
        productSiteSetting.settings.settings_template_id_default == 0
      ) {
        return "None";
      } else {
        return "Default Setting Template (" + getSettingsTemplate() + ")";
      }
    } else {
      return "None";
    }
  }
};
let siteSetting = ref({});
const slideKey = ref(0);
const refresh = ref(0);
const slideOver = ref(false);
const setSiteSetting = (productSiteSetting: any) => {
  siteSetting.value = productSiteSetting;
  const site_id_local =
    productSiteSetting.site_id == null ? 0 : productSiteSetting.site_id;
  slideKey.value = site_id_local + route.params.id;
  setSlideover(true);
};
const setSlideover = (value: boolean) => {
  slideOver.value = value;
};
</script>
<template>
  <div class="col-span-12 lg:col-span-9">
    <!-- BEGIN: Post Content -->
    <div class="col-span-12 intro-y">
      <div class="p-1 md:p-5 intro-y box xl:mt-5">
        <div v-if="!dataLoaded">
          <div class="rounded-lg box intro-y mt-3">
            <TableLoading />
          </div>
        </div> 
        <div v-if="dataLoaded">
          <Disclosure.Group :key="refresh" variant="boxed">
            <Disclosure v-for="productSiteSetting in productSiteSettings" :key="productSiteSettings.site_id">
              <Disclosure.Button>
                <b>{{ siteName(productSiteSetting) }}</b>
              </Disclosure.Button>
              <Disclosure.Panel>
                <div class="mt-2 rounded-md text-xs md:text-sm">
                  <div class="flex items-center">
                    <span class="font-medium">Settings Template:</span>
                    <div class="ml-2">{{ settingTemplate(productSiteSetting) }}</div>
                  </div>
                  <div class="flex items-center mt-3">
                    <span class="font-medium">Module Template:</span>
                    <div class="ml-2">{{ moduleTemplate(productSiteSetting) }}</div>
                  </div>
                  <div class="flex items-center mt-3">
                    <span class="font-medium">Layout :</span>
                    <div class="ml-2">{{ layout(productSiteSetting) }}</div>
                  </div>
                  <div class="flex items-center mt-3">
                    <span class="font-medium">Thumbnail:</span>
                    <div class="ml-2">{{ thumbnailTemplate(productSiteSetting) }}</div>
                  </div>
                  <div class="flex items-center mt-3">
                    <span class="font-medium">Detail:</span>
                    <div class="ml-2">{{ detailTemplate(productSiteSetting) }}</div>
                  </div>
                  <div class="flex items-center mt-3">
                    <span class="font-medium">Zoom:</span>
                    <div class="ml-2">{{ zoomTemplate(productSiteSetting) }}</div>
                  </div>
                  <div class="mt-4 flex items-left">
                    <Button variant="primary" class="flex" @click="(event) => {
                        setSiteSetting(productSiteSetting);
                      }
                      ">Edit</Button>
                    <Button @click="setValueAndOpenModal(productSiteSetting)" variant="primary" class="ml-2 flex">Manage
                      Module Settings</Button>
                  </div>
                </div>
              </Disclosure.Panel>
            </Disclosure>
          </Disclosure.Group>
        </div>
      </div>
    </div>
  </div>
  <ModuleSection :key="module_template_id" :getModulesSection="getProductSiteSettingsModulesSection"
    :modalShow="modalShow" :setModel="setModal" :site_id="site_id" :module_template_id="module_template_id"
    :product_id="idParem" />
  <SiteSetting :key="slideKey" :setSlideover="setSlideover" :slideover="slideOver" :refreshSetting="refreshSetting"
    v-model="siteSetting" />
</template>
