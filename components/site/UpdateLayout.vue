<script lang="ts" setup>
import { toRefs } from "vue";
import { SelectField } from "~/components/form";
const props = defineProps({
  modelValue: {
    required: true,
    type: Object,
  },
  fieldName: {
    required: true,
    type: String,
  },
});
const { modelValue: setting, fieldName } = toRefs(props);

const { getLayout } = useProductSiteSetting();
const { updateLayout, errors } = useSiteLayout();
const route = useRoute();
const idParem = parseInt(route.params.id.toString());

let form = reactive({
  layout_id: setting.value[fieldName.value],
  field_name: fieldName.value,
});
const emit = defineEmits(["update:modelValue"]);
const validateAndUpdateLayout = async () => {
  const siteSetting =  await updateLayout(form, idParem);
  validationFocus(form, errors);
  if(Object.keys(errors).length == 0)
  {
    emit("update:modelValue", siteSetting);
  }
};
let layouts: any = ref([]);
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  layouts = await getLayout();
  dataLoaded.value = true
})
</script>
<template>
  <div class="my-2" v-if="dataLoaded">
    <SelectField :options="layouts" name="layout_id" type="text" v-model="form" :error="errors.layout_id"
      :runFunction="validateAndUpdateLayout" title="Default Layout" :withLabel="false" />
  </div>
</template>
