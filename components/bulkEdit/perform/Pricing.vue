<script lang="ts" setup>
import { InputField,SelectField, SubmitButton, CheckBoxField } from "~/components/form";
const props = defineProps({
    performAction: {
        required: true,
        type: Function,
    },
    perform_option:{
        required:true,
        type:String,
    },
    errors:{
        required:true,
        type:Object,
    },
    ids:{
        required:true,
        type:Array,
    },
    loading:{
        required:true,
        type:Boolean,
    },
    modelValue:{
        required:true,
        type:Object,
    }
});
const emit = defineEmits(["update:modelValue"]);
const { performAction,perform_option,errors,modelValue:obj,loading,ids } = toRefs(props);
const { list } = useSites();
let sites = ref([]);
let form = reactive({
    'action_name': perform_option.value,
    'ids': ids.value,
    'site_id':obj.value != null && obj.value.site_id != null?obj.value.site_id:null,
    'price_reg':obj.value != null && obj.value.price_reg != null?obj.value.price_reg:null,
    'onsale':obj.value != null && obj.value.onsale != null?obj.value.onsale:null,
    'price_sale':obj.value != null && obj.value.price_sale != null?obj.value.price_sale:null,
});
const validateAndSearch = async()=>{
    await performAction.value(form)
}
watch(form, () => {
    emit("update:modelValue", form);
});
const dataLoaded = ref(false)
onMounted(async () => {
    await nextTick();
    sites = await list()
    dataLoaded.value = true
});
</script>
<template>
    <div v-if="!dataLoaded">
        <TableLoading />
    </div>
    <div v-if="dataLoaded">
        <SelectField :options="sites" name="site_id" v-model="form" :error="errors.site_id" title="Site" />
    </div>
    <div class="mt-3">
        <InputField name="price_reg" v-model="form" placeholder="Price" :error="errors.price_reg" title="Regular Price" />
    </div>
    <div class="mt-3">
        <CheckBoxField name="onsale" v-model="form"  :error="errors.onsale" title="Onsale" />
    </div>
    <div class="mt-3">
        <InputField name="price_sale" v-model="form" placeholder="Sale Price" :error="errors.price_sale" title="Sale Price" />
    </div>
    <div class="mt-5 text-right">
        <SubmitButton :createFunction="validateAndSearch" :loading="loading" />
    </div>
</template>