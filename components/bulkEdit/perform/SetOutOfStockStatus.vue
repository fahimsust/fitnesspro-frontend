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

const emit = defineEmits(["update:modelValue"]);
const { availabilities } = useProducts();
let availabilitieList:any = ref([])
let form = reactive({
    'action_name': perform_option.value,
    'ids': ids.value,
    'out_of_stock_status': obj.value != null && obj.value.out_of_stock_status != null?obj.value.out_of_stock_status:null,
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
    availabilitieList = await availabilities()
    dataLoaded.value = true
});

</script>
<template>
    <div v-if="!dataLoaded">
        <TableLoading />
    </div>
    <div class="mt-3" v-if="dataLoaded">
        <SelectField :withLabel="false" default-option="Select Availability" :options="availabilitieList" name="out_of_stock_status" v-model="form" :error="errors.out_of_stock_status" title="Availability" />
    </div>
    <div class="mt-5 text-right">
        <SubmitButton :createFunction="validateAndSearch" :loading="loading" />
    </div>
</template>