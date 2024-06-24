<script lang="ts" setup>
import { toRefs } from "vue";
import { SubmitButton, EditorField } from "~/components/form";

const props = defineProps({
  language_id: {
    required: true,
    type: Number,
  },
});
const route = useRoute();
const idParem = parseInt(route.params.id.toString());
const { getTranslatedSite, getSite } = useSites();
const { updateTranslatedOfflineMessage, errors, loading } = useSiteOfflineOnline();
const { language_id } = toRefs(props);

let form: any = reactive({});

const siteValidationAndUpdate = async () => {
  await updateTranslatedOfflineMessage(form, idParem, language_id.value);
  validationFocus(form, errors);
};
let siteTranslation: any = ref({});
let site: any = ref({});
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  siteTranslation = await getTranslatedSite(idParem, language_id.value);
  site = await getSite(idParem)
  form = reactive({
    offline_message: siteTranslation.value != null
      ? siteTranslation.value.offline_message ? siteTranslation.value.offline_message : "" : "",
  });
  dataLoaded.value = true
})
</script>
<template>
  <div v-if="!dataLoaded">
    <div class="rounded-lg box intro-y mt-3">
      <TableLoading />
    </div>
  </div>
  <div class="mt-5" v-if="dataLoaded">
    <EditorField name="offline_message" v-model="form" :placeholder="stripHtml(site.offline_message)"
      :error="errors.offline_message" title="Offline Message" :required="true" />
  </div>
  <div class="mt-5 text-right">
    <SubmitButton :createFunction="siteValidationAndUpdate" :loading="loading" />
  </div>
</template>
