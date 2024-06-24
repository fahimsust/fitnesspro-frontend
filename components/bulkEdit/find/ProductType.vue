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
    },
});
const { setProduct,search_option,errors,loading,addSearchText } = toRefs(props);
const { types } = useProducts();
let typeList:any = ref([])
const saveSearchText = () => {
  const keyword = typeList.value.find((col: any) => col.id === form.product_type_id);
  if (keyword) {
    const replaceObj = {keyKeyword:keyword.name}
    addSearchText.value(replaceObj);
  }
}
let form = reactive({
    'search_option': search_option.value,
    'product_type_id': null
});
const validateAndSearch = async()=>{
    saveSearchText();
    await setProduct.value(form)
}
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  typeList = await types()
  dataLoaded.value = true
});

</script>
<template>
    <div v-if="!dataLoaded">
        <TableLoading />
    </div>
    <SelectField
      :options="typeList"
      :with-label="false"
      default-option="Select Product Type"
      name="product_type_id"
      v-model="form"
      v-if="dataLoaded"
      :error="errors.product_type_id"
      title="Product Type"
    />
    <div class="mt-5 text-right">
        <SubmitButton  buttonText="Search" buttonLoading="Searching" :createFunction="validateAndSearch" :loading="loading" />
    </div>
</template>