<script lang="ts" setup>
import _ from "lodash";

import { Tab,Disclosure } from "~/components/enigma/base-components/Headless";
import Tabs from "~/components/tabs/Tabs.vue";
import Basic from "~/components/customForms/Basic.vue"
import CustomFormSections from "~/components/customForms/CustomFormSections.vue";
import { FormSelect } from "~~/components/enigma/base-components/Form";

const route = useRoute();

definePageMeta({
  middleware: ["auth"],
  layout: "simple-menu-new",
});
const idParam = parseInt(route.params.id.toString());

useHead({
  title: "Edit Custom Forms: " + useRuntimeConfig().public.company,
});
const { getCustomForm } = useCustomForms();
const { list } = useLanguages();
let customForm:any = ref({});

let languages:any = ref([]);
const languageId = ref(1);

const tabList = [
  { title: "Basic", description: "Edit Basic Information", icon: "Info" },
  { title: "Form Section", description: "Custom Form Sections and Fields", icon: "Filter" },
];

const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  languages = await list();
  if (languages.value[0].id == 1) languages.value.shift();
  customForm = await getCustomForm(idParam);
  dataLoaded.value = true
});
</script>
<template>
  <div v-if="!dataLoaded">
    <div class="rounded-lg box intro-y mt-3">
      <TableLoading />
    </div>
  </div>
  <div class="mt-8" v-if="dataLoaded">
    <div class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
      <h2 class="mt-2 mr-auto text-lg mb-3 font-medium intro-y">
        {{ customForm.name }}
      </h2>
      <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0 mb-3">
        <div class="relative w-56 text-slate-500">
          
        </div>
      </div>
    </div>
    <div class="col-span-12 lg:col-span-12">
      <!-- BEGIN: Post Content -->
      <div class="col-span-12 intro-y box xl:mt-5">
        <Tab.Group class="intro-y box">
          <Tabs :tablist="tabList" />
          <Tab.Panels>
            <Tab.Panel class="p-0 md:p-5">
              <Disclosure.Group variant="boxed">
                <Disclosure>
                  <Disclosure.Button> English </Disclosure.Button>
                  <Disclosure.Panel class="leading-relaxed text-slate-600 dark:text-slate-500">
                    <Basic
                      v-model="customForm"
                      :key="languageId"
                      :languageId="languageId"
                    />
                  </Disclosure.Panel>
                </Disclosure>
                <Disclosure v-for="language in languages" :key="language.id">
                  <Disclosure.Button>
                    {{ language.name }}
                  </Disclosure.Button>
                  <Disclosure.Panel class="leading-relaxed text-slate-600 dark:text-slate-500">
                    <Basic
                      v-model="customForm"
                      :key="language.id"
                      :languageId="language.id"
                    />
                  </Disclosure.Panel>
                </Disclosure>
              </Disclosure.Group>
            </Tab.Panel>
            <Tab.Panel class="p-0 md:p-5">
              <CustomFormSections />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  </div>
</template>
