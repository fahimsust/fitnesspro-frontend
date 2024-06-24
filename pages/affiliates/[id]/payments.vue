<script setup>
import EditNav from "~/components/affiliate/EditNav";

definePageMeta({
    middleware: ["auth"],
    layout: 'edit-affiliate'
})

useHead({
    title: "Affiliate  Payments: " + useRuntimeConfig().public.company
})
</script>
<template>
   
        <div class="col-span-12 lg:col-span-9 2xl:col-span-10">
            <div class="rounded-lg bg-white shadow mt-14">
                <div class="px-5 py-6 sm:px-6 space-y-8 divide-y divide-gray-200 sm:space-y-5">
                    <div class="space-y-6 sm:space-y-5">
                        <div>
                            <h3 class="text-lg font-medium leading-6 text-gray-900">Payments</h3>
                            <!-- <p class="mt-1 max-w-2xl text-sm text-gray-500">Use a permanent address where you can
                                receive mail.</p> -->
                        </div>
                        <div class="space-y-6 sm:space-y-5">
                            <h3 class="text-lg font-medium leading-6 text-gray-900">Payments Goes Here</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
</template>