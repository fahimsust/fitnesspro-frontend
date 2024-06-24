<script lang="ts" setup>
import _ from "lodash";
import { Disclosure } from "~/components/enigma/base-components/Headless";
import UpdateModuleTemplate from "~/components/site/UpdateModuleTemplate.vue"
definePageMeta({
  middleware: ["auth"],
  layout: "edit-site",
});
const route = useRoute();
const idParem = parseInt(route.params.id.toString());

useHead({
  title: "Edit Site: " + useRuntimeConfig().public.company,
});
const { getSiteSetting } = useSiteSetting();

let siteSetting: any = ref([])
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  siteSetting = await getSiteSetting(idParem)
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
      <div class="col-span-12 p-5 intro-y box xl:mt-5" v-if="dataLoaded">
        <Disclosure.Group variant="boxed">
          <Disclosure>
            <Disclosure.Button>Default Module Template</Disclosure.Button>
            <Disclosure.Panel class="leading-relaxed text-slate-600 dark:text-slate-500">
              <UpdateModuleTemplate fieldName="default_module_template_id" v-model="siteSetting" />
            </Disclosure.Panel>
          </Disclosure>
          <Disclosure>
            <Disclosure.Button>Home Module Template</Disclosure.Button>
            <Disclosure.Panel class="leading-relaxed text-slate-600 dark:text-slate-500">
              <UpdateModuleTemplate section="home" fieldName="home_module_template_id" v-model="siteSetting" />
            </Disclosure.Panel>
          </Disclosure>
          <Disclosure>
            <Disclosure.Button>Category Module Template</Disclosure.Button>
            <Disclosure.Panel class="leading-relaxed text-slate-600 dark:text-slate-500">
              <UpdateModuleTemplate section="category" fieldName="default_category_module_template_id"
                v-model="siteSetting" />
            </Disclosure.Panel>
          </Disclosure>
          <Disclosure>
            <Disclosure.Button>Search Module Template</Disclosure.Button>
            <Disclosure.Panel class="leading-relaxed text-slate-600 dark:text-slate-500">
              <UpdateModuleTemplate section="search" fieldName="search_module_template_id" v-model="siteSetting" />
            </Disclosure.Panel>
          </Disclosure>
          <Disclosure>
            <Disclosure.Button>Product Module Template</Disclosure.Button>
            <Disclosure.Panel class="leading-relaxed text-slate-600 dark:text-slate-500">
              <UpdateModuleTemplate section="product" fieldName="default_product_module_template_id"
                v-model="siteSetting" />
            </Disclosure.Panel>
          </Disclosure>
          <Disclosure>
            <Disclosure.Button>Affiliate Module Template</Disclosure.Button>
            <Disclosure.Panel class="leading-relaxed text-slate-600 dark:text-slate-500">
              <UpdateModuleTemplate section="affiliate" fieldName="affiliate_module_template_id"
                v-model="siteSetting" />
            </Disclosure.Panel>
          </Disclosure>
          <Disclosure>
            <Disclosure.Button>Page Module Template</Disclosure.Button>
            <Disclosure.Panel class="leading-relaxed text-slate-600 dark:text-slate-500">
              <UpdateModuleTemplate section="page" fieldName="page_module_template_id" v-model="siteSetting" />
            </Disclosure.Panel>
          </Disclosure>
        </Disclosure.Group>
      </div>
    </div>
  </div>
</template>