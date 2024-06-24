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
const statusList = [
    {
        name:'Active',
        id:'1',
    },
    {
        name:'Inactive',
        id:'0',
    },
    {
        name:'Archived',
        id:'-1',
    }
]
const saveSearchText = () => {
  const keyword = statusList.find((col: any) => col.id === form.status);
  if (keyword) {
    const replaceObj = {keyKeyword:keyword.name}
    addSearchText.value(replaceObj);
  }
}

let form = reactive({
    'search_option': search_option.value,
    'status': 0
});
const validateAndSearch = async()=>{
    saveSearchText();
    await setProduct.value(form)
}

</script>
<template>
    <SelectField
      :options="statusList"
      :hasDefault="false"
      :withLabel="false"
      name="status"
      v-model="form"
      :error="errors.status"
      title="Status"
    />
    <div class="mt-5 text-right">
        <SubmitButton  buttonText="Search" buttonLoading="Searching" :createFunction="validateAndSearch" :loading="loading" />
    </div>
</template>