<script lang="ts" setup>
import { SelectField, SubmitButton } from "~/components/form";
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

const emit = defineEmits(["update:modelValue"]);
const { brands } = useProducts();
let brandList:any = ref([])
let form = reactive({
    'action_name': perform_option.value,
    'ids': ids.value,
    'brand_id': obj.value != null && obj.value.brand_id != null?obj.value.brand_id:null,
});
const validateAndSearch = async () => {
    await performAction.value(form)
}

watch(form, () => {
    emit("update:modelValue", form);
});
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  brandList = await brands()
  dataLoaded.value = true
});
</script>
<template>
    <div v-if="!dataLoaded">
        <TableLoading />
    </div>
    <div class="mt-3" v-if="dataLoaded">
        <SelectField :withLabel="false" default-option="Select Brand" :options="brandList" name="brand_id" v-model="form" :error="errors.brand_id" title="Brand" />
    </div>
    <div class="mt-5 text-right">
        <SubmitButton :createFunction="validateAndSearch" :loading="loading" />
    </div>
</template>