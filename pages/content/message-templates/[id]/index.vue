<script lang="ts" setup>
import EditMessageTemplate from "~~/components/messageTemplate/EditMessageTemplate.vue";
import UpdateTranslatedMessageTemplate from "~~/components/messageTemplate/UpdateTranslatedMessageTemplate.vue";
import { Disclosure } from "~/components/enigma/base-components/Headless";

const route = useRoute();

definePageMeta({
  middleware: ["auth"],
  layout: "simple-menu-new",
});
const idParam = parseInt(route.params.id.toString());
const { list } = useLanguages();
let languages:any = ref([]);

useHead({
  title: "Edit Message Template: " + useRuntimeConfig().public.company,
});
const {
  getMessageTemplate
} = useMessageTemplates();
let messageTemplate:any = ref({});

const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  messageTemplate = await getMessageTemplate(idParam);
  languages = await list();
  if (languages.value[0].id == 1) languages.value.shift();
  dataLoaded.value = true
})
</script>
<template>
  <div class="mt-8">
    <div class="col-span-12 lg:col-span-12">
      <h2 class="mt-2 mr-auto text-lg font-medium intro-y">Edit Message Template: ({{ messageTemplate.name }})</h2>
    </div>
    <div class="col-span-12 lg:col-span-12">
      <!-- BEGIN: Post Content -->
      <div class="col-span-12 intro-y box p-5 xl:mt-5">
        <div class="mt-3" v-if="!dataLoaded">
          <div class="rounded-lg box intro-y lg:mt-0">
            <TableLoading />
          </div>
        </div>
        <Disclosure.Group variant="boxed" v-if="dataLoaded">
          <Disclosure key="1">
            <Disclosure.Button> English </Disclosure.Button>
            <Disclosure.Panel class="leading-relaxed text-slate-600 dark:text-slate-500">
              <EditMessageTemplate v-model="messageTemplate" />
            </Disclosure.Panel>
          </Disclosure>

          <Disclosure v-for="language in languages" :key="language.id">
            <Disclosure.Button>
              {{ language.name }}
            </Disclosure.Button>
            <Disclosure.Panel class="leading-relaxed text-slate-600 dark:text-slate-500">
              <UpdateTranslatedMessageTemplate :message_template_id="messageTemplate.id" :language_id="language.id" />
            </Disclosure.Panel>
          </Disclosure>
        </Disclosure.Group>
      </div>
      <!-- END: Data List -->
    </div>
  </div>
</template>
