<script setup lang="ts">
import { toRefs } from "vue";
import {
    FormLabel,
} from "~/components/enigma/base-components/Form";
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import Lucide from "~/components/enigma/base-components/Lucide"
import Error from "~/components/form/Error.vue";
import { useDarkModeStore } from "~/store/enigma/colors/dark-mode";
const props = defineProps({
    error: {
        required: false,
        type: String
    },
    name: {
        required: true,
        type: String
    },
    modelValue: {
        type: Object,
        default: {}
    },
    title: {
        required: true,
        type: String,
    },
    enableTimePicker: {
        required: false,
        type: Boolean,
        default: false
    },
    required: {
        required: false,
        type: Boolean,
        default: false
    },
});
const darkMode = computed(() => useDarkModeStore().darkMode);

const { name, error, modelValue, enableTimePicker } = toRefs(props);

</script>
<template>
    <FormLabel :htmlFor="name">{{ title }}<b v-if="required" class="text-danger ml-1">*</b></FormLabel>
    <div class="relative w-full mx-auto">
        <div
            class="absolute flex items-center justify-center w-10 h-full border rounded-l bg-slate-100 text-slate-500 dark:bg-darkmode-700 dark:border-darkmode-800 dark:text-slate-400">
            <Lucide icon="Calendar" class="w-4 h-4" />
        </div>
        <Datepicker :dark="darkMode" :format="enableTimePicker ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd'" :auto-apply="true"
            :enable-time-picker="enableTimePicker" v-model="modelValue[name]"
            @change="$emit('update:modelValue[{{name}}]', ($event.target as HTMLInputElement).value);" />

    </div>
    <Error :error="error" />
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