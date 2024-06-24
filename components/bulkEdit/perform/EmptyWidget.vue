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
    modelValue: {
        required: true,
        type: Object,
    }
});
const { performAction, perform_option, errors, modelValue: obj, loading, ids } = toRefs(props);

const emit = defineEmits(["update:modelValue"]);

let form = reactive({
    'action_name': perform_option.value,
    'ids': ids.value,
});
const validateAndSearch = async () => {
    await performAction.value(form)
}

watch(form, () => {
    emit("update:modelValue", form);
});

</script>
<template>
    <div class="mt-5 text-right">
        <SubmitButton :createFunction="validateAndSearch" :loading="loading" />
    </div>
</template>