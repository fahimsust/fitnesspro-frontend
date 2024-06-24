<template>
    Dashboard goes here
</template>
<script setup>
import { ArrowLongLeftIcon, ArrowLongRightIcon, PencilSquareIcon, PlusCircleIcon } from '@heroicons/vue/24/outline';
import { useQueryParamStore } from "~/store/enigma/query-param";

definePageMeta({
    middleware: ["auth"],
    layout: "simple-menu-new"
})

useHead({
    title: "Admin Dashboard"
})
useQueryParamStore().setQueryParam({})
</script>