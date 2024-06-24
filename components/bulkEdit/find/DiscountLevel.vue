<script lang="ts" setup>
import { SelectField, SubmitButton } from "~/components/form";
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
const { discountLevels } = useDiscountLevel();
let discountLevelList:any = ref([])

const saveSearchText = () => {
    const keyword = discountLevelList.value.find((col: any) => col.id === form.discount_level_id);
    if (keyword) {
        const replaceObj = { keyKeyword: keyword.name }
        addSearchText.value(replaceObj);
    }
}

let form = reactive({
    'search_option': search_option.value,
    'discount_level_id': null
});
const validateAndSearch = async () => {
    saveSearchText();
    await setProduct.value(form)
}
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  discountLevelList = await discountLevels()
  dataLoaded.value = true
});

</script>
<template>
    <div v-if="!dataLoaded">
        <TableLoading />
    </div>
    <SelectField v-if="dataLoaded" :options="discountLevelList" default-option="Discount Level" :with-label="false" name="discount_level_id"
        v-model="form" :error="errors.discount_level_id" title="Discount Level" />
    <div class="mt-5 text-right">
        <SubmitButton buttonText="Search" buttonLoading="Searching" :createFunction="validateAndSearch"
            :loading="loading" />
    </div>
</template>