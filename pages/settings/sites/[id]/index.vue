<script lang="ts" setup>
import _ from "lodash";
import Basic from "~/components/site/Basic.vue";
import Meta from "~~/components/site/Meta.vue";
import { Tab, Disclosure } from "~/components/enigma/base-components/Headless";
import Tabs from "~~/components/tabs/Tabs.vue";
import UpdateTranslatedSite from "~~/components/site/UpdateTranslatedSite.vue";

const route = useRoute();

definePageMeta({
  middleware: ["auth"],
  layout: "edit-site",
});
const idParem = parseInt(route.params.id.toString());
const { list } = useLanguages();
let languages: any = ref([]);

useHead({
  title: "Edit Site: " + useRuntimeConfig().public.company,
});
const { getSite } = useSites();
let site: any = ref({});
const tabList = [
  { title: "Info", description: "Edit Basic Information", icon: "Info" },
  { title: "Meta Data", description: "Update Site Meta Data", icon: "Database" },
];
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  site = await getSite(idParem);
  languages = await list();
  if (languages.value[0].id == 1) languages.value.shift();
  dataLoaded.value = true
});
</script>
<template>
  <div class="col-span-12 lg:col-span-9">
    <div class="col-span-12 lg:col-span-12">
      <div v-if="!dataLoaded">
        <div class="rounded-lg box intro-y mt-3">
          <TableLoading />
        </div>
      </div>
      <!-- BEGIN: Post Content -->
      <div class="col-span-12 intro-y box xl:mt-5" v-if="dataLoaded">
        <Tab.Group class="intro-y box">
          <Tabs :tablist="tabList" />
          <Tab.Panels>
            <Tab.Panel class="p-0 md:p-5">
              <Basic v-model="site" />
            </Tab.Panel>
          </Tab.Panels>
          <Tab.Panels>
            <Tab.Panel class="p-0 md:p-5">
              <Disclosure.Group variant="boxed">
                <Disclosure key="1">
                  <Disclosure.Button> English </Disclosure.Button>
                  <Disclosure.Panel class="leading-relaxed text-slate-600 dark:text-slate-500">
                    <Meta v-model="site" />
                  </Disclosure.Panel>
                </Disclosure>

                <Disclosure v-for="language in languages" :key="language.id">
                  <Disclosure.Button>
                    {{ language.name }}
                  </Disclosure.Button>
                  <Disclosure.Panel class="leading-relaxed text-slate-600 dark:text-slate-500">
                    <UpdateTranslatedSite :site_id="site.id" :language_id="language.id" />
                  </Disclosure.Panel>
                </Disclosure>
              </Disclosure.Group>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>

      </div>
    </div>
  </div>
</template>