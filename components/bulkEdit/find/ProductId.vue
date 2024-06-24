<script lang="ts" setup>
import { InputField, SubmitButton } from "~/components/form";
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

const saveSearchText = () => {
    const replaceObj = {keyKeyword:form.value}
    addSearchText.value(replaceObj);
}
let form = reactive({
    'search_option': search_option.value,
    'value': null
});
const validateAndSearch = async()=>{
    saveSearchText();
    await setProduct.value(form)
}

</script>
<template>
    <InputField name="value" v-model="form" placeholder="value" :error="errors.value" title="Parent Product Id" />
    <div class="mt-5 text-right">
        <SubmitButton  buttonText="Search" buttonLoading="Searching" :createFunction="validateAndSearch" :loading="loading" />
    </div>
</template>