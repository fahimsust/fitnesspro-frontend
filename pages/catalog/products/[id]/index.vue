<script lang="ts" setup>
import _ from "lodash";
import { Tab, Disclosure } from "~/components/enigma/base-components/Headless";
import Tabs from "~/components/tabs/Tabs.vue";
import Basic from "~/components/product/Basic.vue";
import Meta from "~/components/product/Meta.vue";
import CustomInfo from "~/components/product/CustomInfo.vue";
import AddToCart from "~/components/product/AddToCart.vue";
import Content from "~/components/product/Content.vue";
import Details from "~/components/product/Details.vue";
import Lucide from "~/components/enigma/base-components/Lucide";
import Tippy from "~/components/enigma/base-components/Tippy";
import { FormSelect } from "~/components/enigma/base-components/Form";

const route = useRoute();

definePageMeta({
  middleware: ["auth"],
  layout: "edit-product",
});
const idParam = parseInt(route.params.id.toString());

useHead({
  title: "Edit Product: " + useRuntimeConfig().public.company,
});
const { getProduct, getTranslatedProduct } = useProducts();
const { list, getLanguage } = useLanguages();
let product: any = ref({});
let languages: any = ref([]);
const languageId = ref(1);
const keyComponent = ref(1);
const transLatedData = ref({});
let language: any = ref({});

const dataLoaded = ref(false)
const fetchData = async () => {
  product = await getProduct(idParam);
  languages = await list();
  language = await getLanguage(languageId.value);
  dataLoaded.value = true
}

const getTranslated = async () => {
  transLatedData.value = await getTranslatedProduct(idParam, languageId.value);
};
const setLanguage = async (event: any) => {
  language = await getLanguage(parseInt(event.target.value));
  transLatedData.value = {};
  if (parseInt(event.target.value) > 1)
    transLatedData.value = await getTranslatedProduct(idParam, event.target.value);
  languageId.value = parseInt(event.target.value);
  keyComponent.value = parseInt(event.target.value);
};

const tabList = [
  { title: "Info", description: "Edit Basic Information", icon: "Info" },
  { title: "Content", description: "Update Product Content", icon: "Mail" },
  { title: "Settings", description: "Update Product Details", icon: "Menu" },
];
const tabListTranslated = [
  { title: "Info", description: "Edit Basic Information", icon: "Info" },
  { title: "Content", description: "Update Product Content", icon: "Mail" },
];
onMounted(async () => {
  await nextTick();
  await fetchData();
}) 
</script>
<template>
  <div class="col-span-12 lg:col-span-9">
    <!-- BEGIN: Post Content -->
    <div class="col-span-12 intro-y box xl:mt-5 p-2">
      <div class="w-full mb-2">
        <div class="w-56 text-slate-500 ml-auto" v-if="dataLoaded">
          <FormSelect v-model="languageId" @change="setLanguage($event)">
            <option :value="option.id" v-for="option in languages" :key="option.id">
              {{ option.name }}
            </option>
          </FormSelect>
        </div>
      </div>
      <Tab.Group class="intro-y box" v-if="languageId > 1">
        <Tabs :tablist="tabListTranslated" />
        <Tab.Panels>
          <Tab.Panel class="p-0 md:p-5">
            <div v-if="!dataLoaded">
              <div class="rounded-lg box intro-y mt-3">
                <TableLoading />
              </div>
            </div>
            <div v-if="dataLoaded">
              <Disclosure.Group variant="boxed">
                <Disclosure>
                  <Disclosure.Button>
                    <Tippy content="Edit Basic Information" class="flex items-center font-bold text-md"
                      aria-controls="content" aria-selected="true">
                      <Lucide icon="Menu" class="w-4 h-4 mr-2" />
                      Basic
                    </Tippy>
                  </Disclosure.Button>
                  <Disclosure.Panel class="leading-relaxed text-slate-600 dark:text-slate-500">
                    <Basic v-model="product" :transLatedData="transLatedData" :languageId="languageId"
                      :key="keyComponent" :getTranslated="getTranslated" :language="language" />
                  </Disclosure.Panel>
                </Disclosure>
                <Disclosure>
                  <Disclosure.Button>
                    <Tippy content="Update Product Meta" class="flex items-center font-bold text-md"
                      aria-controls="content" aria-selected="true">
                      <Lucide icon="Menu" class="w-4 h-4 mr-2" />
                      Meta
                    </Tippy>
                  </Disclosure.Button>
                  <Disclosure.Panel class="leading-relaxed text-slate-600 dark:text-slate-500">
                    <Meta v-model="product" :transLatedData="transLatedData" :languageId="languageId"
                      :key="keyComponent" :getTranslated="getTranslated" :language="language" />
                  </Disclosure.Panel>
                </Disclosure>
                <Disclosure>
                  <Disclosure.Button>
                    <Tippy content="Update Product Customs Info" class="flex items-center font-bold text-md"
                      aria-controls="content" aria-selected="true">
                      <Lucide icon="Menu" class="w-4 h-4 mr-2" />
                      Customs Info
                    </Tippy>
                  </Disclosure.Button>
                  <Disclosure.Panel class="leading-relaxed text-slate-600 dark:text-slate-500">
                    <CustomInfo v-model="product" :transLatedData="transLatedData" :languageId="languageId"
                      :key="keyComponent" :getTranslated="getTranslated" :language="language" />
                  </Disclosure.Panel>
                </Disclosure>
              </Disclosure.Group>
            </div>
          </Tab.Panel>
          <Tab.Panel class="p-0 md:p-5">
            <Content v-model="product" :transLatedData="transLatedData" :languageId="languageId" :key="keyComponent"
              :getTranslated="getTranslated" :language="language" />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      <Tab.Group class="intro-y box" v-else>
        <Tabs :tablist="tabList" />
        <Tab.Panels>
          <Tab.Panel class="p-0 md:p-5">
            <div v-if="!dataLoaded">
              <div class="rounded-lg box intro-y mt-3">
                <TableLoading />
              </div>
            </div>
            <div v-if="dataLoaded">
              <Disclosure.Group variant="boxed">
                <Disclosure>
                  <Disclosure.Button>
                    <Tippy content="Edit Basic Information" class="flex items-center font-bold text-md"
                      aria-controls="content" aria-selected="true">
                      <Lucide icon="Menu" class="w-4 h-4 mr-2" />
                      Basic
                    </Tippy>
                  </Disclosure.Button>
                  <Disclosure.Panel class="leading-relaxed text-slate-600 dark:text-slate-500">
                    <Basic v-model="product" />
                  </Disclosure.Panel>
                </Disclosure>
                <Disclosure>
                  <Disclosure.Button>
                    <Tippy content="Update Product Meta" class="flex items-center font-bold text-md"
                      aria-controls="content" aria-selected="true">
                      <Lucide icon="Menu" class="w-4 h-4 mr-2" />
                      Meta
                    </Tippy>
                  </Disclosure.Button>
                  <Disclosure.Panel class="leading-relaxed text-slate-600 dark:text-slate-500">
                    <Meta v-model="product" />
                  </Disclosure.Panel>
                </Disclosure>
                <Disclosure>
                  <Disclosure.Button>
                    <Tippy content="Update Product Customs Info" class="flex items-center font-bold text-md"
                      aria-controls="content" aria-selected="true">
                      <Lucide icon="Menu" class="w-4 h-4 mr-2" />
                      Customs Info
                    </Tippy>
                  </Disclosure.Button>
                  <Disclosure.Panel class="leading-relaxed text-slate-600 dark:text-slate-500">
                    <CustomInfo v-model="product" />
                  </Disclosure.Panel>
                </Disclosure>
              </Disclosure.Group>
            </div>
          </Tab.Panel>
          <Tab.Panel class="p-0 md:p-5">
            <Content v-if="dataLoaded" v-model="product" />
          </Tab.Panel>
          <Tab.Panel class="p-0 md:p-5">
            <div v-if="!dataLoaded">
              <div class="rounded-lg box intro-y mt-3">
                <TableLoading />
              </div>
            </div>
            <div v-if="dataLoaded">
              <Disclosure.Group variant="boxed">
                <Disclosure>
                  <Disclosure.Button>
                    <Tippy content="Edit Basic Settings" class="flex items-center font-bold text-md"
                      aria-controls="content" aria-selected="true">
                      Basic
                    </Tippy>
                  </Disclosure.Button>
                  <Disclosure.Panel class="leading-relaxed text-slate-600 dark:text-slate-500">
                    <Details v-model="product" />
                  </Disclosure.Panel>
                </Disclosure>
                <Disclosure>
                  <Disclosure.Button>
                    <Tippy content="Update Add Cart Settings" class="flex items-center font-bold text-md"
                      aria-controls="content" aria-selected="true">
                      Add To Cart
                    </Tippy>
                  </Disclosure.Button>
                  <Disclosure.Panel class="leading-relaxed text-slate-600 dark:text-slate-500">
                    <AddToCart v-model="product" />
                  </Disclosure.Panel>
                </Disclosure>
              </Disclosure.Group>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  </div>
</template>
