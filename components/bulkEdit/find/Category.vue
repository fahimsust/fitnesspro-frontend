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
const { categories } = useProducts();
let categoryList:any = []

const saveSearchText = () => {
  const keyword = categoryList.value.find((col: any) => col.id === form.category_id);
  if (keyword) {
    const replaceObj = {keyKeyword:keyword.title}
    addSearchText.value(replaceObj);
  }
}

let form = reactive({
    'search_option': search_option.value,
    'category_id': null
});
const validateAndSearch = async()=>{
    saveSearchText();
    await setProduct.value(form)
}
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  categoryList = await categories()
  dataLoaded.value = true
});

</script>
<template>
    <div v-if="!dataLoaded">
        <TableLoading />
    </div>
    <SelectField
      :options="categoryList"
      :with-label="false"
      default-option="Select Category"
      name="category_id"
      optionTitle="title"
      v-if="dataLoaded"
      v-model="form"
      :error="errors.category_id"
      title="Category"
    />
    <div class="mt-5 text-right">
        <SubmitButton  buttonText="Search" buttonLoading="Searching" :createFunction="validateAndSearch" :loading="loading" />
    </div>
</template>