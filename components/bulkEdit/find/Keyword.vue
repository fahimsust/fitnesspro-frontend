<script lang="ts" setup>
import { InputField, SelectField, SubmitButton } from "~/components/form";
const props = defineProps({
    setProduct: {
        required: true,
        type: Function,
    },
    search_option: {
        required: true,
        type: String,
    },
    errors: {
        required: true,
        type: Object,
    },
    loading: {
        required: true,
        type: Boolean,
    },
    addSearchText: {
        required: true,
        type: Function
    }
});
const { setProduct, search_option, errors, loading, addSearchText } = toRefs(props);

const { list } = useLanguages();
let languages:any = ref([]);


let form = reactive({
    'search_option': search_option.value,
    'keyword': null,
    'column': null,
    'language_id': 1

});
const saveSearchText = () => {
    const column = columns.find(col => col.id === form.column);
    const language = languages.value.find((col: { id: null; }) => col.id === form.language_id);
    let columnName = "";
    if (column && form.keyword) {
        columnName = column.name;
        let languageName = ""
        if (language) {
            languageName = " For " + language.name + " Language"
        }
        const replaceObj = { keyKeyword: form.keyword, keyFieldName: columnName, forLanguage: languageName }
        addSearchText.value(replaceObj);
    }
}
const validateAndSearch = async () => {
    saveSearchText();
    await setProduct.value(form)
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
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  languages = await list()
  dataLoaded.value = true
});

</script>
<template>
    <div v-if="!dataLoaded">
        <TableLoading />
    </div>
    <div v-if="dataLoaded">
        <InputField name="keyword" v-model="form" placeholder="keyword" :error="errors.keyword" title="Keyword" />
        <div class="mt-3">
            <SelectField :options="columns" name="column" v-model="form" :error="errors.column" title="In" />
        </div>
        <div class="mt-3" v-if="form.column != null && form.column != 'p.inventory_id' && form.column != 'p.product_no'">
            <SelectField :options="languages" :hasDefault="false" name="language_id" v-model="form" :error="errors.language_id"
                title="Select Language" />
        </div>
        <div class="mt-5 text-right">
            <SubmitButton buttonText="Search" buttonLoading="Searching" :createFunction="validateAndSearch"
                :loading="loading" />
        </div>
    </div>
</template>