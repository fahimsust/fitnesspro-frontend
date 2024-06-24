<script setup lang="ts">
import {
    Tab
} from "~/components/enigma/base-components/Headless";
import Tippy from "~/components/enigma/base-components/Tippy";
import Lucide from "~/components/enigma/base-components/Lucide";
const props = defineProps({
    title: {
        required: true,
        type: String,
    },
    description: {
        required: true,
        type: String,
    },
    hide: {
        required: true,
        type: Boolean,
    },
    icon: {
        required: false,
        type: String,
    },
    showHide: {
        required: true,
        type: Function,
    }
})

</script>

<template>
    <Tab :fullWidth="false" v-slot="{ selected }">
        <Tab.Button @click="showHide" :class="[
            'flex items-center justify-center w-full px-0 py-0 sm:w-40 text-slate-500',
            {
                'hidden md:block': !selected && hide
            }
            ,
            {
                'hover:border-transparent hover:bg-transparent hover:text-slate-600  hover:dark:text-slate-300':
                    !selected,
            },
            {
                'text-primary mb-2 md:mb-0 dark:bg-darkmode-600 dark:border-t-transparent dark:text-white':
                    selected,
            },
        ]" as="button">
            <Tippy :content="description" class="flex items-center text-lg md:text-sm justify-center w-full py-4"
                aria-controls="content" aria-selected="true">
                <Lucide :icon="icon" v-if="icon" class="w-4 h-4 mr-2" />
                {{ title }}
                <Lucide icon="ChevronDown" class="w-6 h-6 ml-5 items-end font-bold"
                    :class="['md:hidden', { 'hidden': !selected }]" />
            </Tippy>
        </Tab.Button>
    </Tab>
</template>