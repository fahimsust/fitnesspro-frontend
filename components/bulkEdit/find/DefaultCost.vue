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
    const replaceObj = {keyMin:form.min,keyMax:form.max}
    addSearchText.value(replaceObj);
}

let form = reactive({
    'search_option': search_option.value,
    'min': 0,
    'max':100
});
const validateAndSearch = async()=>{
    saveSearchText();
    await setProduct.value(form)
}

</script>
<template>
    <InputField name="min" v-model="form" type="number" placeholder="min" :error="errors.min" title="Min" />
    <div class="mt-5">
        <InputField name="max" v-model="form" type="number" placeholder="max" :error="errors.min" title="Max" />
    </div>
    <div class="mt-5 text-right">
        <SubmitButton  buttonText="Search" buttonLoading="Searching" :createFunction="validateAndSearch" :loading="loading" />
    </div>
</template>