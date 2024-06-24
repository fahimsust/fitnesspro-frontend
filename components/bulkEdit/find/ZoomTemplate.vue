<script lang="ts" setup>
import { SelectField, SubmitButton } from "~/components/form";
const props = defineProps({
    setProduct: {
        required: true,
        type: Function,
    },
    search_option:{
        required:true,
        type:String,
    },
    errors:{
        required:true,
        type:Object,
    },
    loading:{
        required:true,
        type:Boolean,
    },
    addSearchText:{
        required:true,
        type:Function
    }
});
const { setProduct,search_option,errors,loading,addSearchText } = toRefs(props);
const { getDisplayTemplateZoom } = useProductSiteSetting();
let templates:any = ref([])
const saveSearchText = () => {
  const keyword = templates.value.find((col: any) => col.id === form.template_id);
  if (keyword) {
    const replaceObj = {keyKeyword:keyword.name}
    addSearchText.value(replaceObj);
  }
}
let form = reactive({
    'search_option': search_option.value,
    'template_id': null
});
const validateAndSearch = async()=>{
    saveSearchText();
    await setProduct.value(form)
}
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  templates = await getDisplayTemplateZoom()
  dataLoaded.value = true
});

</script>
<template>
    <div v-if="!dataLoaded">
        <TableLoading />
    </div>
    <SelectField
      :options="templates"
      default-option="Select Template"
      :with-label="false"
      name="template_id"
      v-if="dataLoaded"
      v-model="form"
      :error="errors.template_id"
      title="Template"
    />
    <div class="mt-5 text-right">
        <SubmitButton  buttonText="Search" buttonLoading="Searching" :createFunction="validateAndSearch" :loading="loading" />
    </div>
</template>