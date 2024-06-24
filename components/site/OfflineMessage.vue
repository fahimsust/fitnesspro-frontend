<script lang="ts" setup>
import { toRefs } from "vue";
import { FormInline } from "~/components/enigma/base-components/Form";
import { EditorField, SubmitButton, SelectField } from "~/components/form";

const props = defineProps({
  modelValue: {
    required: true,
    type: Object,
  },
});
const route = useRoute();
const idParem = parseInt(route.params.id.toString());
const { modelValue: offline } = toRefs(props);

const { errors, loading, updateOfflineSetting } = useSiteOfflineOnline();
const {getLayout} = useProductSiteSetting();

let form = reactive({
  offline_message: offline.value.offline_message,
  offline_layout_id: offline.value.offline_layout_id,
});
const emit = defineEmits(["update:modelValue"]);
const siteValidationAndUpdate = async () => {
  const updatedOfflineSetting = await updateOfflineSetting(form,idParem);
  validationFocus(form, errors);
  if (Object.keys(errors).length == 0) {
    emit("update:modelValue", updatedOfflineSetting);
  }
};
let layouts:any = ref([]);
const dataLoaded = ref(false)
onMounted(async()=>{
  await nextTick();
  layouts = await getLayout();
  dataLoaded.value = true
})
</script>
<template>
  <div class="mt-5">
    <EditorField
      name="offline_message"
      v-model="form"
      :error="errors.offline_message"
      title="Offline Message"
      :required="true"
    />
  </div>
  <FormInline class="mt-5 first:mt-0 flex-wrap" v-if="dataLoaded">
    <SelectField
      :options="layouts"
      name="offline_layout_id"
      :submit-function="siteValidationAndUpdate"
      v-model="form"
      :error="errors.offline_layout_id"
      title="Layout"
      :formInline="true"
    />
  </FormInline>
  
  <div class="mt-5 text-right">
    <SubmitButton :createFunction="siteValidationAndUpdate" :loading="loading" />
  </div>
</template>
