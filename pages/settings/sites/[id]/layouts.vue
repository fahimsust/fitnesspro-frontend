<script lang="ts" setup>
import _ from "lodash";
import { Disclosure } from "~/components/enigma/base-components/Headless";
import UpdateLayout from "~/components/site/UpdateLayout.vue"
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
            <Disclosure.Button>Default Layout</Disclosure.Button>
            <Disclosure.Panel class="leading-relaxed text-slate-600 dark:text-slate-500">
              <UpdateLayout fieldName="default_layout_id" v-model="siteSetting" />
            </Disclosure.Panel>
          </Disclosure>
          <Disclosure>
            <Disclosure.Button>Home Layout</Disclosure.Button>
            <Disclosure.Panel class="leading-relaxed text-slate-600 dark:text-slate-500">
              <UpdateLayout fieldName="home_layout_id" v-model="siteSetting" />
            </Disclosure.Panel>
          </Disclosure>
          <Disclosure>
            <Disclosure.Button>Category Layout</Disclosure.Button>
            <Disclosure.Panel class="leading-relaxed text-slate-600 dark:text-slate-500">
              <UpdateLayout fieldName="default_category_layout_id" v-model="siteSetting" />
            </Disclosure.Panel>
          </Disclosure>
          <Disclosure>
            <Disclosure.Button>Search Layout</Disclosure.Button>
            <Disclosure.Panel class="leading-relaxed text-slate-600 dark:text-slate-500">
              <UpdateLayout fieldName="search_layout_id" v-model="siteSetting" />
            </Disclosure.Panel>
          </Disclosure>
          <Disclosure>
            <Disclosure.Button>Product Layout</Disclosure.Button>
            <Disclosure.Panel class="leading-relaxed text-slate-600 dark:text-slate-500">
              <UpdateLayout fieldName="default_product_layout_id" v-model="siteSetting" />
            </Disclosure.Panel>
          </Disclosure>
          <Disclosure>
            <Disclosure.Button>Affiliate Layout</Disclosure.Button>
            <Disclosure.Panel class="leading-relaxed text-slate-600 dark:text-slate-500">
              <UpdateLayout fieldName="affiliate_layout_id" v-model="siteSetting" />
            </Disclosure.Panel>
          </Disclosure>
          <Disclosure>
            <Disclosure.Button>Page Layout</Disclosure.Button>
            <Disclosure.Panel class="leading-relaxed text-slate-600 dark:text-slate-500">
              <UpdateLayout fieldName="page_layout_id" v-model="siteSetting" />
            </Disclosure.Panel>
          </Disclosure>
        </Disclosure.Group>
      </div>
    </div>
  </div>
</template>