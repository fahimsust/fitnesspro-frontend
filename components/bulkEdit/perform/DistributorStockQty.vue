<script lang="ts" setup>
import { SelectField, SubmitButton,InputField } from "~/components/form";
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
const { distributors } = useProducts();
let distributorList:any = ref([])
let form = reactive({
    'action_name': perform_option.value,
    'ids': ids.value,
    'distributor_id': obj.value != null && obj.value.distributor_id != null?obj.value.distributor_id:null,
    'stock_qty':obj.value != null && obj.value.stock_qty != null?obj.value.stock_qty:null,
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
  distributorList = await distributors()
  dataLoaded.value = true
});

</script>
<template>
    <div v-if="!dataLoaded">
        <TableLoading />
    </div>
    <div class="mt-3" v-if="dataLoaded">
        <SelectField :withLabel="false" default-option="Select Distributor" :options="distributorList" name="distributor_id" v-model="form" :error="errors.distributor_id" title="Discount Distributor" />
    </div>
    <div class="mt-3">
        <InputField :withLabel="false" name="stock_qty" type="number" v-model="form" placeholder="Stock Quantity" :error="errors.stock_qty" title="Stock Quantity" />
    </div>
    <div class="mt-5 text-right">
        <SubmitButton :createFunction="validateAndSearch" :loading="loading" />
    </div>
</template>