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
let form = reactive({
    'action_name': perform_option.value,
    'ids': ids.value,
    'status': obj.value != null && obj.value.status != null?obj.value.status:null,
});
const validateAndSearch = async () => {
    await performAction.value(form)
}
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
watch(form, () => {
    emit("update:modelValue", form);
});

</script>
<template>
    <div class="mt-3">
        <SelectField :withLabel="false" defaultOption="Select Status" :options="statusList" name="status" v-model="form" :error="errors.status" title="Status" />
    </div>
    <div class="mt-5 text-right">
        <SubmitButton :createFunction="validateAndSearch" :loading="loading" />
    </div>
</template>