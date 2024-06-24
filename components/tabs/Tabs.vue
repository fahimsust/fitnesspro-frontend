<script setup lang="ts">
import {
    Tab
} from "~/components/enigma/base-components/Headless";
import SingleTab from "./SingleTab.vue";
import { type PropType } from 'vue'
export interface TabsStructure {
    title: string
    description: string
    icon: string | null
}
defineProps({
    tablist: {
        required: true,
        type: Array as PropType<TabsStructure[]>,
    },
})
const hide = ref(true)
const showHide = () => {
    hide.value = !hide.value
}
</script>
<template>
    <Tab.List
        class="flex-col border-transparent dark:border-transparent sm:flex-row bg-slate-200 dark:bg-darkmode-800">
        <single-tab :hide="hide" :showHide="showHide" v-for="tab in tablist" :key="tab.title" :description="tab.description"
            :title="tab.title" :icon="tab.icon ? tab.icon : ''" />
    </Tab.List>
</template>