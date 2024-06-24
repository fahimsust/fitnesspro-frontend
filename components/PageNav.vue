<template>
    <template v-for="item in navigation" :key="item.name">
        <button v-if="item.onclick" @click="$emit(item.onclick)"
            :class="[item.current ? 'bg-sky-900 text-white' : 'text-gray-300 hover:bg-sky-600 hover:text-white', 'px-3 py-2 rounded-md text-xs font-normal']"
            :aria-current="item.current ? 'page' : undefined">
            {{ item.name }}
        </button>
        <nuxt-link v-else :to="item.href"
            :class="[item.current ? 'bg-sky-900 text-white' : 'text-gray-300 hover:bg-sky-600 hover:text-white', 'px-3 py-2 rounded-md text-xs font-normal']"
            :aria-current="item.current ? 'page' : undefined">
            {{ item.name }}
        </nuxt-link>
    </template>
</template>
<script setup>
defineProps(['navigation'])

const route = useRoute()
</script>