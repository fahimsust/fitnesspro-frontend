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
const { brands } = useProducts();
let brandList:any = ref([])

let form = reactive({
    'search_option': search_option.value,
    'brand_id': null
});
const saveSearchText = () => {
  const keyword = brandList.value.find((col: any) => col.id === form.brand_id);
  if (keyword) {
    const replaceObj = {keyKeyword:keyword.name}
    addSearchText.value(replaceObj);
  }
}
const validateAndSearch = async()=>{
    saveSearchText();
    await setProduct.value(form)
}
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  brandList = await brands()
  dataLoaded.value = true
});

</script>
<template>
    <div v-if="!dataLoaded">
        <TableLoading />
    </div>
    <SelectField
      :options="brandList"
      :with-label="false"
      default-option="Select Brand"
      name="brand_id"
      v-if="dataLoaded"
      v-model="form"
      :error="errors.brand_id"
      title="Brand"
    />
    <div class="mt-5 text-right">
        <SubmitButton  buttonText="Search" buttonLoading="Searching" :createFunction="validateAndSearch" :loading="loading" />
    </div>
</template>