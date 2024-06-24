<script setup lang="ts">
import { toRefs, type PropType } from "vue";
import {
    FormLabel,
} from "~/components/enigma/base-components/Form";
import TomSelect from "~/components/enigma/base-components/TomSelect";
import Error from "~/components/form/Error.vue";
interface Option {
    id: string
    name: string
}
type ObjectKey = keyof typeof Option;
const props = defineProps({
    error: {
        required: false,
        type: String
    },
    name: {
        required: true,
        type: String
    },
    options: {
        required: true,
        type: Array as PropType<Array<Option>>,
    },
    modelValue: {
        type: Object,
        default: {}
    },
    title: {
        required: true,
        type: String,
    },
    runFunction: {
        required: false,
        type: Function
    },
    type: {
        required: false,
        type: String,
        default: "text"
    },
    formInline: {
        required: false,
        type: Boolean,
        default: false
    },
    required: {
        required: false,
        type: Boolean,
        default: false
    },
    optionTitle: {
        required: false,
        type: String,
        default: 'name'
    },
    multiple: {
        required: false,
        type: Boolean,
        default: false
    },
    callBack: {
        required: false,
        type: Function,
        default: () => { }
    },
    withLabel: {
        required: false,
        type: Boolean,
        default: true,
    },
    currentId: {
        required: false,
        type: Number,
        default: 0,
    },
    selectedId: {
        required: false,
        type: Number,
        default: 0,
    },
    hasDefault: {
        required: false,
        type: Boolean,
        default: true,
    },
    defaultOption: {
        required: false,
        type: String,
        default: "Select",
    },
});

const { name, error, modelValue, options, runFunction } = toRefs(props);

</script>
<template>
    <FormLabel :class="{ 'inline_label': formInline }" v-if="withLabel" :htmlFor="name">{{ title }}<b v-if="required"
            class="text-danger ml-1">*</b></FormLabel>
    <TomSelect v-model="modelValue[name]"
        :class="{ 'flex': formInline, 'items-center': formInline, 'flex-1': formInline, 'xl:pr-20': formInline }"
        class="w-full" :multiple="multiple" :callBack="callBack"
        @change="$emit('update:modelValue[{{name}}]', ($event.target as HTMLInputElement).value); runFunction ? runFunction(($event.target as HTMLInputElement).value) : ''">
        <option v-if="hasDefault" :value="null">{{ defaultOption }}</option>
        <option :value="option.id" v-for="option in options" :key="option.id">{{ option[`${optionTitle}` as ObjectKey] }}
        </option>

    </TomSelect>
    <Error :error="error" v-if="currentId == selectedId" :formInline="formInline" />
</template>
<style lang="postcss" scoped>
.inline_input {
    @apply flex items-center flex-1
}

[hidden] {
    display: none !important;
}

.inline_label {
    @apply inline-block text-left sm:mr-3
}
</style>