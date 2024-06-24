<script lang="ts" setup>
import AddEditFaq from "~~/components/faq/AddEditFaq.vue";
import UpdateTranslatedFaq from "~~/components/faq/UpdateTranslatedFaq.vue";
import { Disclosure } from "~/components/enigma/base-components/Headless";
import { Tab } from "~/components/enigma/base-components/Headless";
import Tabs from "~/components/tabs/Tabs.vue";
import AddCategoryToFaq from "~/components/faq/AddCategoryToFaq.vue";

const route = useRoute();

definePageMeta({
  middleware: ["auth"],
  layout: "simple-menu-new",
});
const idParem = parseInt(route.params.id.toString());
const { list } = useLanguages();
let languages: any = ref([]);

useHead({
  title: "Edit Faq: " + useRuntimeConfig().public.company,
});
const { getFaq } = useFaqs();
let faq: any = ref({});
const tabList = [
  { title: "Info", description: "Edit Basic Information", icon: "Info" },
  { title: "Category", description: "Update Faq Category", icon: "Menu" },
];
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  faq = await getFaq(idParem);
  languages = await list();
  if (languages.value[0].id == 1) languages.value.shift();
  dataLoaded.value = true
})
</script>
<template>
  <div class="mt-3" v-if="!dataLoaded">
    <div class="rounded-lg box intro-y lg:mt-0">
      <TableLoading />
    </div>
  </div>
  <div class="mt-8" v-if="dataLoaded">
    <div class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
      <h2 class="mt-2 mr-auto text-lg mb-3 font-medium intro-y">
        {{ faq.question }}
      </h2>
    </div>
    <div class="col-span-12 lg:col-span-12">
      <!-- BEGIN: Post Content -->
      <div class="col-span-12 intro-y box xl:mt-5">
        <Tab.Group class="intro-y box">
          <Tabs :tablist="tabList" />
          <Tab.Panels>
            <Tab.Panel class="p-0 md:p-5">
              <Disclosure.Group variant="boxed">
                <Disclosure key="1">
                  <Disclosure.Button> English </Disclosure.Button>
                  <Disclosure.Panel class="leading-relaxed text-slate-600 dark:text-slate-500">
                    <AddEditFaq v-model="faq" />
                  </Disclosure.Panel>
                </Disclosure>

                <Disclosure v-for="language in languages" :key="language.id">
                  <Disclosure.Button>
                    {{ language.name }}
                  </Disclosure.Button>
                  <Disclosure.Panel class="leading-relaxed text-slate-600 dark:text-slate-500">
                    <UpdateTranslatedFaq :faq_id="faq.id" :language_id="language.id" />
                  </Disclosure.Panel>
                </Disclosure>
              </Disclosure.Group>
            </Tab.Panel>
            <Tab.Panel class="p-0 md:p-5">
              <AddCategoryToFaq />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  </div>
</template>
