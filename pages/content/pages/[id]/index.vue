<script lang="ts" setup>
import _ from "lodash";
import { Tab } from "~/components/enigma/base-components/Headless";
import Tabs from "~/components/tabs/Tabs.vue";
import Basic from "~/components/page/Basic.vue";
import Button from "~/components/enigma/base-components/Button";
import Meta from "~/components/page/Meta.vue";
import { FormSelect, FormLabel } from "~/components/enigma/base-components/Form";

const route = useRoute();

definePageMeta({
  middleware: ["auth"],
  layout: "simple-menu-new",
});
const idParem = parseInt(route.params.id.toString());

useHead({
  title: "Edit Page: " + useRuntimeConfig().public.company,
});
const { getPage, getTranslatedPage } = usePages();
const { list, getLanguage } = useLanguages();
let page:any = ref([])
let languages:any = ref([]);
const languageId = ref(1);
const transLatedData = ref({});
let language:any = ref({});
const setLanguage = async (event: any) => {
  language = await getLanguage(parseInt(event.target.value));
  transLatedData.value = {};
  if (languageId.value > 1)
    transLatedData.value = await getTranslatedPage(idParem, event.target.value);
  languageId.value = event.target.value;
};

const tabList = [
  { title: "Info", description: "Edit Basic Information", icon: "Info" },
  { title: "Meta", description: "Update Meta Content", icon: "Menu" },
];

const dataLoaded = ref(false)
const fetchData = async ()=>{
  page = await getPage(idParem);
  languages = await list();
  language = await getLanguage(languageId.value);
  dataLoaded.value = true
}
onMounted(async () => {
  await nextTick();
  await fetchData();
});
</script>
<template>
  <div v-if="!dataLoaded">
    <div class="rounded-lg box intro-y mt-3">
      <TableLoading />
    </div>
  </div>
  <div class="mt-8" v-if="dataLoaded">
    <h2 class="mt-2 mr-auto text-lg mb-3 font-medium intro-y">
        {{ page.title }}
      </h2>
    <div class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
      <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0 mb-3">
        <div class="relative w-56 text-slate-500">
          <FormSelect v-model="languageId" @change="setLanguage($event)">
            <option :value="option.id" v-for="option in languages" :key="option.id">
              {{ option.name }}
            </option>
          </FormSelect>
        </div>
      </div>
    </div>
    <div class="col-span-12 lg:col-span-12">
      <!-- BEGIN: Post Content -->
      <div class="col-span-12 intro-y box xl:mt-5" >
        <Tab.Group class="intro-y box">
          <Tabs :tablist="tabList" />
          <Tab.Panels>
            <Tab.Panel class="p-0 md:p-5">
              <Basic v-model="page" :key="languageId" :languageId="languageId" :language="language"
                :translatedData="transLatedData" />
            </Tab.Panel>
            <Tab.Panel class="p-0 md:p-5">
              <Meta v-model="page" :key="languageId" :languageId="languageId" :language="language"
                :translatedData="transLatedData" />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  </div>
</template>
