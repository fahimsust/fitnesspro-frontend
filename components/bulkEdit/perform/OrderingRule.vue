<script lang="ts" setup>
import { InputField, SelectField, SubmitButton, CheckBoxField } from "~/components/form";
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
const emit = defineEmits(["update:modelValue"]);
const { performAction, perform_option, errors, modelValue: obj, loading, ids } = toRefs(props);
const { list } = useSites();
let sites = ref([]);
const { getOrderingRules } = useProductPricing();
let orderingRules: any = ref([])
let form = reactive({
    'action_name': perform_option.value,
    'ids': ids.value,
    'site_id': obj.value != null && obj.value.site_id != null ? obj.value.site_id : null,
    'ordering_rule_id': obj.value != null && obj.value.ordering_rule_id != null ? obj.value.ordering_rule_id : null,
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
    orderingRules = await getOrderingRules()
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
        <div class="mt-3">
            <SelectField :options="orderingRules" name="ordering_rule_id" v-model="form"
                :error="errors.ordering_rule_id" title="Ordering Rule" />
        </div>
    </div>
    <div class="mt-5 text-right">
        <SubmitButton :createFunction="validateAndSearch" :loading="loading" />
    </div>
</template>