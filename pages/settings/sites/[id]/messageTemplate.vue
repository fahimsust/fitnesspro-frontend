<script lang="ts" setup>
import _ from "lodash";
import MessageTemplate from "~/components/site/MessageTemplate.vue";

const route = useRoute();

definePageMeta({
  middleware: ["auth"],
  layout: "edit-site",
});
const idParam = parseInt(route.params.id.toString());

useHead({
  title: "Edit Site: " + useRuntimeConfig().public.company,
});
const { getMessageTemplate } = useSiteMessageTemplate();

let messageTemplate: any = ref([])
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  messageTemplate = await getMessageTemplate(idParam)
  dataLoaded.value = true
});
</script>
<template>
  <div v-if="!dataLoaded">
    <div class="rounded-lg box intro-y mt-3">
      <TableLoading />
    </div>
  </div>
  <div class="col-span-12 lg:col-span-9" v-if="dataLoaded">
    <div class="col-span-12 intro-y">
      <div class="p-5 intro-y box xl:mt-5">
        <MessageTemplate v-model="messageTemplate" />
      </div>
    </div>
  </div>
</template>