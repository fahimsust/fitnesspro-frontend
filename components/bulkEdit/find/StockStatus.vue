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
const { availabilities } = useProducts();
let availabilitieList:any = ref([])

const saveSearchText = () => {
  const keyword = availabilitieList.value.find((col: any) => col.id === form.out_of_stock_status);
  if (keyword) {
    const replaceObj = {keyKeyword:keyword.name}
    addSearchText.value(replaceObj);
  }
}

let form = reactive({
    'search_option': search_option.value,
    'out_of_stock_status': null
});
const validateAndSearch = async()=>{
    saveSearchText();
    await setProduct.value(form)
}
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  availabilitieList = await availabilities()
  dataLoaded.value = true
});

</script>
<template>
    <div v-if="!dataLoaded">
        <TableLoading />
    </div>
    <SelectField
      :options="availabilitieList"
      :with-label="false"
      default-option="Select Availability"
      name="out_of_stock_status"
      v-model="form"
      v-if="dataLoaded"
      :error="errors.out_of_stock_status"
      title="Availability"
    />
    <div class="mt-5 text-right">
        <SubmitButton  buttonText="Search" buttonLoading="Searching" :createFunction="validateAndSearch" :loading="loading" />
    </div>
</template>