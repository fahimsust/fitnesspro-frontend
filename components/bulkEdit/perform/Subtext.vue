<script lang="ts" setup>
import { InputField, SelectField, SubmitButton } from "~/components/form";
const props = defineProps({
    performAction: {
        required: true,
        type: Function,
    },
    perform_option: {
        required: true,
        type: String,
    },
    errors: {
        required: true,
        type: Object,
    },
    ids: {
        required: true,
        type: Array,
    },
    loading: {
        required: true,
        type: Boolean,
    },
    modelValue:{
        required:true,
        type:Object,
    }
});
const { performAction, perform_option, errors,modelValue:obj, loading, ids } = toRefs(props);

const { list } = useLanguages();
const languages = await list();
if (languages.value[0].id == 1) languages.value.shift();

const emit = defineEmits(["update:modelValue"]);
let form = reactive({
    'action_name': perform_option.value,
    'ids': ids.value,
    'keyword': obj.value != null && obj.value.keyword != null?obj.value.keyword:null,
    'replace': obj.value != null && obj.value.replace != null?obj.value.replace:null,
    'column': obj.value != null && obj.value.column != null?obj.value.column:null,
    'language_id':obj.value != null && obj.value.language_id != null?obj.value.language_id:null,
});
const validateAndSearch = async () => {
    await performAction.value(form)
}
const columns = [
    { id: 'p.title', 'name': 'Title' },
    { id: 'p.subtitle', 'name': 'Sub-title' },
    { id: 'p.product_no', 'name': 'Product No.' },
    { id: 'p.url_name', 'name': 'URL Name' },
    { id: 'p.inventory_id', 'name': 'Inventory Id.' },
    { id: 'pd.summary', 'name': 'Summary' },
    { id: 'pd.description', 'name': 'Description' },
    { id: 'pd.meta_title', 'name': 'Meta Title' },
    { id: 'pd.meta_desc', 'name': 'Meta Description' },
    { id: 'pd.meta_keywords', 'name': 'Meta Keywords' },
    { id: 'po.name', 'name': 'Product Option: Name' },
    { id: 'po.display', 'name': 'Product Option: Display' },
    { id: 'pov.name', 'name': 'Product Option Value: Name' },
    { id: 'pov.display', 'name': 'Product Option Value: Display' },
]
watch(form, () => {
    emit("update:modelValue", form);
});

</script>
<template>
    <InputField name="keyword" v-model="form" placeholder="keyword" :error="errors.keyword" title="Keyword" />
    <div class="mt-3">
        <SelectField :options="columns" name="column" v-model="form" :error="errors.column" title="In" />
    </div>
    <div class="mt-3">
        <InputField name="replace" v-model="form" placeholder="Replace By" :error="errors.replace" title="Replace By" />
    </div>
    <div class="mt-3" v-if="form.column != null && form.column != 'p.inventory_id' && form.column != 'p.product_no'">
        <SelectField :options="languages" defaultOption="English" name="language_id" v-model="form" :error="errors.language_id" title="Select Language" />
    </div>
    <div class="mt-5 text-right">
        <SubmitButton :createFunction="validateAndSearch" :loading="loading" />
    </div>
</template>