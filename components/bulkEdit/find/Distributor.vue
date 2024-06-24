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
const { distributors } = useProducts();
let distributorList:any = ref([])

const saveSearchText = () => {
  const keyword = distributorList.value.find((col:any) => col.id === form.distributor_id);
  if (keyword) {
    const replaceObj = {keyKeyword:keyword.name}
    addSearchText.value(replaceObj);
  }
}
let form = reactive({
    'search_option': search_option.value,
    'distributor_id': null
});
const validateAndSearch = async()=>{
    saveSearchText();
    await setProduct.value(form)
}
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  distributorList = await distributors()
  dataLoaded.value = true
});

</script>
<template>
    <div v-if="!dataLoaded">
        <TableLoading />
    </div>
    <SelectField
      :options="distributorList"
      :with-label="false"
      default-option="Select Distributor"
      name="distributor_id"
      v-model="form"
      :error="errors.distributor_id"
      title="Default Distributor"
      v-if="dataLoaded"
    />
    <div class="mt-5 text-right">
        <SubmitButton buttonText="Search" buttonLoading="Searching" :createFunction="validateAndSearch" :loading="loading" />
    </div>
</template>