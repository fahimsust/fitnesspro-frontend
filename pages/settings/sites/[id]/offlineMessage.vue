<script lang="ts" setup>
import _ from "lodash";
import OfflineMessage from "~/components/site/OfflineMessage.vue";
import { Disclosure } from "~/components/enigma/base-components/Headless";
import { FormSwitch, FormInline, FormLabel } from "~~/components/enigma/base-components/Form";
import UpdateTranslatedOfflineMessage from "~~/components/site/UpdateTranslatedOfflineMessage.vue";

const route = useRoute();

definePageMeta({
  middleware: ["auth"],
  layout: "edit-site",
});
const idParem = parseInt(route.params.id.toString());
const { getSite } = useSites();
let site: any = ref({});

const {
  online,
  offline,
} = useSiteOfflineOnline();
const changeStatus = async (value: boolean, id: number) => {
  if (value == true)
    await online(id);
  else
    await offline(id);

  await getSite(idParem);
};

useHead({
  title: "Edit Site: " + useRuntimeConfig().public.company,
});
const { offlineSetting } = useSiteOfflineOnline();
let offlineMsg = ref([]);
const { list } = useLanguages();
let languages: any = ref([]);

const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  site = await getSite(idParem);
  offlineMsg = await offlineSetting(idParem);
  languages = await list();
  if (languages.value[0].id == 1) languages.value.shift();
  dataLoaded.value = true
});
</script>
<template>
  <div class="col-span-12 lg:col-span-9">
    <div v-if="!dataLoaded">
      <div class="rounded-lg box intro-y mt-3">
        <TableLoading />
      </div>
    </div>
    <div class="col-span-12 intro-y" v-if="dataLoaded">
      <div class="p-5 intro-y box xl:mt-5">
        <div class="p-4 mb-5 mt-2 border">
          <FormInline class="mt-7 first:mt-0 flex-wrap">
            <FormLabel class="sm:text-left">Online</FormLabel>
            <FormSwitch>
              <FormSwitch.Input type="checkbox" :key="site.status" v-model="site.status" @click="(_: any) => {
                changeStatus(!site.status, site.id);
              }" />
            </FormSwitch>
          </FormInline>
          <FormInline class="mt-4 first:mt-0 flex-wrap">
            <FormLabel class="sm:text-left">Offline Url</FormLabel>
            <div class="flex items-center">
              <a :href="site.url + '/' + site.offline_key" target="_blank">{{ site.url }}/{{ site.offline_key }}</a>
            </div>
          </FormInline>
        </div>
        <Disclosure.Group variant="boxed">
          <Disclosure key="1">
            <Disclosure.Button> English </Disclosure.Button>
            <Disclosure.Panel class="leading-relaxed text-slate-600 dark:text-slate-500">
              <OfflineMessage v-model="offlineMsg" />
            </Disclosure.Panel>
          </Disclosure>

          <Disclosure v-for="language in languages" :key="language.id">
            <Disclosure.Button>
              {{ language.name }}
            </Disclosure.Button>
            <Disclosure.Panel class="leading-relaxed text-slate-600 dark:text-slate-500">
              <UpdateTranslatedOfflineMessage :language_id="language.id" />
            </Disclosure.Panel>
          </Disclosure>
        </Disclosure.Group>

      </div>
    </div>
  </div>
</template>