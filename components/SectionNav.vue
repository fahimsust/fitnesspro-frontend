<template>
    <nav aria-label="Global" class="flex h-16 space-x-10">
            <NuxtLink
            v-for="item in navigation" :key="item.name"
            :to="item.href" :class="[item.href == $route.path ? 'text-sky-700 border-sky-500' : 'border-transparent text-gray-900 hover:text-sky-500',
            'px-1 pt-1 text-sm inline-flex items-center border-b-2 font-medium']">
                {{ item.name }}
            </NuxtLink>
    </nav>
</template>
<script setup>
defineProps(['navigation'])
</script>