<script lang="ts" setup>
import _ from "lodash";
import { Tab, Disclosure } from "~/components/enigma/base-components/Headless";
import Tabs from "~~/components/tabs/Tabs.vue";
import Basic from "~/components/category/Basic.vue";
import Menu from "~/components/category/Menu.vue";
import CategoryImage from "~~/components/category/CategoryImage.vue";
import FilterSetting from "~~/components/category/FilterSetting.vue";
import Meta from "~~/components/category/Meta.vue";
import { FormSelect, FormLabel } from "~/components/enigma/base-components/Form";

import Lucide from "~/components/enigma/base-components/Lucide";
import Tippy from "~/components/enigma/base-components/Tippy";
const route = useRoute();

definePageMeta({
  middleware: ["auth"],
  layout: "edit-category",
});
const idParem = parseInt(route.params.id.toString());

useHead({
  title: "Edit Category: " + useRuntimeConfig().public.company,
});
const { getCategory, parentCategories, getCategoryTranslation } = useCategories();
const { list, getLanguage } = useLanguages();

const dataLoaded = ref(false)
let parentCategoryList:any = ref([]);
let category:any = ref([]);
let languages:any = ref([]);
let language:any = ref({})


const fetchData = async ()=>{
  parentCategoryList = await parentCategories();
  category = await getCategory(idParem);
  languages = await list();
  language = await getLanguage(languageId.value);
  dataLoaded.value = true
}

const languageId = ref(1);
const keyComponant = ref(1);
const transLatedData = ref({});
const getTranslated = async () => {
  transLatedData.value = await getCategoryTranslation(idParem, languageId.value);
};
const setLanguage = async (event: any) => {
  language = await getLanguage(parseInt(event.target.value));
  transLatedData.value = {};
  if (parseInt(event.target.value) > 1)
    transLatedData.value = await getCategoryTranslation(idParem, event.target.value);
  languageId.value = parseInt(event.target.value);
  keyComponant.value = parseInt(event.target.value);
};

const tabList = [
  { title: "Info", description: "Edit Basic Information", icon: "Info" },
  {
    title: "Filter Setting",
    description: "Update Category Filter Setting",
    icon: "Filter",
  },
  { title: "Meta Data", description: "Update Category Meta Data", icon: "Database" },
];
const tabListLanguage = [
  { title: "Info", description: "Edit Basic Information", icon: "Info" },
  { title: "Meta Data", description: "Update Category Meta Data", icon: "Database" },
];
onMounted(async () => {
  await nextTick();
  await fetchData();
});
</script>
<template>
  <div class="col-span-12 lg:col-span-9 2xl:col-span-10" v-if="!dataLoaded">
    <div class="rounded-lg box intro-y mt-3">
      <TableLoading />
    </div>
  </div> 
  <div class="col-span-12 lg:col-span-9" v-if="dataLoaded">
    <!-- BEGIN: Post Content -->

    <div class="col-span-12 intro-y box md:mt-5 p-2">
      <div class="w-full mb-2">
        <div class="w-56 text-slate-500 ml-auto">
          <FormSelect v-model="languageId" @change="setLanguage($event)">
            <option :value="option.id" v-for="option in languages" :key="option.id">
              {{ option.name }}
            </option>
          </FormSelect>
        </div>
      </div>
      <Tab.Group class="intro-y box" v-if="languageId > 1">
        <Tabs :tablist="tabListLanguage" />
        <Tab.Panels>
          <Tab.Panel class="p-0 md:p-5">
            <Basic
              v-model="category"
              :transLatedData="transLatedData"
              :languageId="languageId"
              :key="keyComponant"
              :getTranslated="getTranslated"
              :parentCategoryList="parentCategoryList"
              :language="language"
            />
          </Tab.Panel>
        </Tab.Panels>
        <Tab.Panels>
          <Tab.Panel class="p-0 md:p-5">
            <Meta
              v-model="category"
              :transLatedData="transLatedData"
              :languageId="languageId"
              :key="keyComponant"
              :getTranslated="getTranslated"
              :language="language"
            />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      <Tab.Group class="intro-y box" v-if="languageId == 1">
        <Tabs :tablist="tabList" />
        <Tab.Panels>
          <Tab.Panel class="p-0 md:p-5">
            <Disclosure.Group variant="boxed">
              <Disclosure>
                <Disclosure.Button>
                  <Tippy
                    content="Edit Basic Information"
                    class="flex items-center font-bold text-md"
                    aria-controls="content"
                    aria-selected="true"
                  >
                    <Lucide icon="Menu" class="w-4 h-4 mr-2" />
                    Basic
                  </Tippy>
                </Disclosure.Button>
                <Disclosure.Panel
                  class="leading-relaxed text-slate-600 dark:text-slate-500"
                >
                  <Basic
                    v-model="category"
                    :language="language"
                    :parentCategoryList="parentCategoryList"
                  />
                </Disclosure.Panel>
              </Disclosure>
              <Disclosure>
                <Disclosure.Button>
                  <Tippy
                    content="Update Product Meta"
                    class="flex items-center font-bold text-md"
                    aria-controls="content"
                    aria-selected="true"
                  >
                    <Lucide icon="Menu" class="w-4 h-4 mr-2" />
                    Menu Setting
                  </Tippy>
                </Disclosure.Button>
                <Disclosure.Panel
                  class="leading-relaxed text-slate-600 dark:text-slate-500"
                >
                  <Menu v-model="category" />
                </Disclosure.Panel>
              </Disclosure>
              <Disclosure>
                <Disclosure.Button>
                  <Tippy
                    content="Update Product Customs Info"
                    class="flex items-center font-bold text-md"
                    aria-controls="content"
                    aria-selected="true"
                  >
                    <Lucide icon="Menu" class="w-4 h-4 mr-2" />
                    Image
                  </Tippy>
                </Disclosure.Button>
                <Disclosure.Panel
                  class="leading-relaxed text-slate-600 dark:text-slate-500"
                >
                  <CategoryImage v-model="category" />
                </Disclosure.Panel>
              </Disclosure>
            </Disclosure.Group>
          </Tab.Panel>
        </Tab.Panels>
        <Tab.Panels>
          <Tab.Panel class="p-0 md:p-5">
            <FilterSetting v-model="category" />
          </Tab.Panel>
        </Tab.Panels>
        <Tab.Panels>
          <Tab.Panel class="p-0 md:p-5">
            <Meta v-model="category" />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  </div>
</template>
