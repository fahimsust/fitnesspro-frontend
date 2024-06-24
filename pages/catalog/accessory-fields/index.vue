<template>
    <NuxtLayout name="with-page-nav">
        <template #pageNav>
            <button v-for="item in navigation" :key="item.name" @click="pageNavClick(item.onclick)"
                :class="[item.current ? 'bg-sky-900 text-white' : 'text-gray-300 hover:bg-sky-600 hover:text-white', 'px-3 py-2 rounded-md text-xs font-normal']"
                :aria-current="item.current ? 'page' : undefined">
                {{ item.name }}
            </button>
        </template>

        <template #sectionNav>
            <SectionNav :navigation="sectionNav" />
        </template>

        <template #mobileSectionNav>
            <MobileSectionNav :nav="sectionNav" />
        </template>

        <template #heading>
            Accessory Fields
        </template>

        <div class="px-3 md:px-0">
            <div class="-mx-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0 rounded-lg">
                <table class="min-w-full divide-y divide-gray-300">
                    <thead class="bg-slate-100">
                        <tr>
                            <th scope="col"
                                class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                Name</th>
                            <th scope="col"
                                class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell">
                                Email
                            </th>
                            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Id</th>
                            <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                <span class="sr-only">Edit</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 bg-white">
                        <!-- <tr v-for="order in orders" :key="order.id">
                            <td
                                class="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6">
                                {{ order.name }}
                                <dl class="font-normal lg:hidden">
                                    <dt class="sr-only">Email</dt>
                                    <dd class="mt-1 truncate text-gray-700">{{ order.email }}</dd>
                                </dl>
                            </td>
                            <td class="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">{{ order.email }}</td>
                            <td class="px-3 py-4 text-sm text-gray-500">{{ order.id }}</td>
                            <td class="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6
                            flex gap-1 justify-end">
                                <NuxtLink :to="manageOrder(order.id)">
                                    <PencilIcon class="list-icon text-teal-500 border-teal-500 
                                hover:text-white hover:bg-teal-500 hover:border-teal-200" />
                                </NuxtLink>
                                <button @click="archiveorder(order.id)">
                                    <TrashIcon class="list-icon text-red-500 border-red-500
                                    hover:text-white hover:bg-red-500 hover:border-red:200" />
                                </button>
                            </td>
                        </tr> -->
                    </tbody>
                </table>
            </div>
            <!-- <Pagination v-model="currentPage" :numberOfPages="lastPage" /> -->
        </div>
    </NuxtLayout>
</template>
<script setup>
import { TrashIcon, PencilIcon } from '@heroicons/vue/24/solid'

import { ArrowLongLeftIcon, ArrowLongRightIcon, PencilSquareIcon, PlusCircleIcon } from '@heroicons/vue/24/outline';
import Pagination from '~/components/Pagination.vue';
import { productsNav } from '~/utils/productsNav';

const route = useRoute()
const { $swal } = useNuxtApp()

const navigation = [
    { name: 'Active', onclick: 'active', current: true },
    { name: 'Archived', onclick: 'archive-click', current: false },
]

const sectionNav = productsNav()

definePageMeta({
    middleware: ["auth"],
    layout: false
})

useHead({
    title: "Products: " + useRuntimeConfig().public.company
})

// const currentPage = ref(1)
// const type = ref(route.query.type ?? "active")
// const perPage = 1

// let ordersList = await useAsyncData(
//     'orders',
//     () => $larafetch(`/order?page=${currentPage.value}&per_page=${perPage}`),
//     { watch: [currentPage] }
// )

// const orders = computed(() => listResponse().data)
// const lastPage = computed(() => listResponse().last_page)

// function listResponse() {
//     return ordersList.data.value
// }

// function editorder(id) {
//     return `orders/${id}`
// }

// function archiveorder(id) {
//     console.log('testing')
// }

function viewActive() {
    console.log('testing')
}

function viewArchived() {
    console.log('testing')
}
</script>