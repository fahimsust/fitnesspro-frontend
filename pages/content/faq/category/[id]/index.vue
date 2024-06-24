<script lang="ts" setup>

import { Disclosure } from "~/components/enigma/base-components/Headless";
import AddEditFaqCategory from "~/components/faqCategory/AddEditFaqCategory.vue";
import UpdateTranslatedFaqCategory from "~/components/faqCategory/UpdateTranslatedFaqCategory.vue";

const route = useRoute();

definePageMeta({
  middleware: ["auth"],
  layout: "simple-menu-new",
});
const idParem = parseInt(route.params.id.toString());
const { list } = useLanguages();
let languages: any = ref([]);

useHead({
  title: "Edit FAQ Category: " + useRuntimeConfig().public.company,
});
const { getFaqCategory } = useFaqCategory();
let faqCategory: any = ref({});
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  faqCategory = await getFaqCategory(idParem);
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
        {{ faqCategory.title }}
      </h2>
    </div>
    <div class="col-span-12 lg:col-span-12">
      <!-- BEGIN: Post Content -->
      <div class="col-span-12 intro-y box xl:mt-5">
        <div class="col-span-12 intro-y box p-5 xl:mt-5">
          <Disclosure.Group variant="boxed">
            <Disclosure key="1">
              <Disclosure.Button> English </Disclosure.Button>
              <Disclosure.Panel class="leading-relaxed text-slate-600 dark:text-slate-500">
                <AddEditFaqCategory v-model="faqCategory" />
              </Disclosure.Panel>
            </Disclosure>

            <Disclosure v-for="language in languages" :key="language.id">
              <Disclosure.Button>
                {{ language.name }}
              </Disclosure.Button>
              <Disclosure.Panel class="leading-relaxed text-slate-600 dark:text-slate-500">
                <UpdateTranslatedFaqCategory :faq_category_id="faqCategory.id" :language_id="language.id" />
              </Disclosure.Panel>
            </Disclosure>
          </Disclosure.Group>
        </div>
      </div>
    </div>
  </div>
</template>
