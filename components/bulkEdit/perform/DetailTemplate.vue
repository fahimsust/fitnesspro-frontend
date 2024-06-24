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
const { getDisplayTemplateDetail } = useProductSiteSetting();
let templates:any = []
let form = reactive({
    'action_name': perform_option.value,
    'ids': ids.value,
    'template_id': obj.value != null && obj.value.template_id != null?obj.value.template_id:null,
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
  templates = await getDisplayTemplateDetail()
  dataLoaded.value = true
});
</script>
<template>
    <div v-if="!dataLoaded">
        <TableLoading />
    </div>
    <div class="mt-3" v-if="dataLoaded">
        <SelectField :withLabel="false" default-option="Select Template" :options="templates" name="template_id" v-model="form" :error="errors.template_id" title="Template" />
    </div>
    <div class="mt-5 text-right">
        <SubmitButton :createFunction="validateAndSearch" :loading="loading" />
    </div>
</template>