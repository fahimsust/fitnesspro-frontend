<template>
    <NuxtLayout name="with-page-nav">
        <template #pageNav>
            <template v-for="item in navigation" :key="item.name">
                <nuxt-link :to="item.href"
                    :class="[item.current ? 'bg-sky-900 text-white' : 'text-gray-300 hover:bg-sky-600 hover:text-white', 'px-3 py-2 rounded-md text-xs font-normal']"
                    :aria-current="item.current ? 'page' : undefined">
                    {{ item.name }}
                </nuxt-link>
            </template>
        </template>

        <template #sectionNav>
            <SectionNav :navigation="sectionNav" />
        </template>

        <template #mobileSectionNav>
            <MobileSectionNav :nav="sectionNav" />
        </template>

        <template #heading>
            report here
        </template>

        <div class="rounded-lg bg-white shadow">
            <form @submit.prevent="updatePost" class="space-y-8 divide-y divide-gray-200">
                <div class="px-5 py-6 sm:px-6 space-y-8 divide-y divide-gray-200 sm:space-y-5">
                    <div class="space-y-6 sm:space-y-5 sm:pt-10">
                        <div>
                            <h3 class="text-lg font-medium leading-6 text-gray-900">Personal Information</h3>
                            <!-- <p class="mt-1 max-w-2xl text-sm text-gray-500">Use a permanent address where you can
                                    receive mail.</p> -->
                        </div>
                        <div class="space-y-6 sm:space-y-5">
                            <div
                                class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                <label for="first-name"
                                    class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">First
                                    name</label>
                                <div class="mt-1 sm:col-span-2 sm:mt-0">
                                    <input type="text" name="first-name" id="first-name" autocomplete="given-name"
                                        class="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm" />
                                </div>
                            </div>

                            <div
                                class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                <label for="last-name"
                                    class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">Last
                                    name</label>
                                <div class="mt-1 sm:col-span-2 sm:mt-0">
                                    <input type="text" name="last-name" id="last-name" autocomplete="family-name"
                                        class="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm" />
                                </div>
                            </div>

                            <div
                                class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                <label for="email"
                                    class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">Email
                                    address</label>
                                <div class="mt-1 sm:col-span-2 sm:mt-0">
                                    <input id="email" name="email" type="email" autocomplete="email"
                                        class="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                </div>
                            </div>

                            <div
                                class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                <label for="country"
                                    class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">Country</label>
                                <div class="mt-1 sm:col-span-2 sm:mt-0">
                                    <select id="country" name="country" autocomplete="country-name"
                                        class="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm">
                                        <option>United States</option>
                                        <option>Canada</option>
                                        <option>Mexico</option>
                                    </select>
                                </div>
                            </div>

                            <div
                                class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                <label for="street-address"
                                    class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">Street
                                    address</label>
                                <div class="mt-1 sm:col-span-2 sm:mt-0">
                                    <input type="text" name="street-address" id="street-address"
                                        autocomplete="street-address"
                                        class="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                </div>
                            </div>

                            <div
                                class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                <label for="city"
                                    class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">City</label>
                                <div class="mt-1 sm:col-span-2 sm:mt-0">
                                    <input type="text" name="city" id="city" autocomplete="address-level2"
                                        class="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm" />
                                </div>
                            </div>

                            <div
                                class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                <label for="region"
                                    class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">State /
                                    Province</label>
                                <div class="mt-1 sm:col-span-2 sm:mt-0">
                                    <input type="text" name="region" id="region" autocomplete="address-level1"
                                        class="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm" />
                                </div>
                            </div>

                            <div
                                class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                <label for="postal-code"
                                    class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">ZIP / Postal
                                    code</label>
                                <div class="mt-1 sm:col-span-2 sm:mt-0">
                                    <input type="text" name="postal-code" id="postal-code" autocomplete="postal-code"
                                        class="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="p-5 bg-slate-300 border-white-500 rounded-b-lg">
                    <div class="flex justify-between">
                        <button type="button"
                            class="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-white-500 focus:ring-offset-2">Cancel</button>
                        <button type="submit" class="{{ submitState ? 'ready' : 'submitting' }}
                                inline-flex justify-center rounded-md border border-gray-300 
                                bg-amber-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-orange-500 
                                focus:outline-none focus:ring-2 focus:ring-white-500 focus:ring-offset-2">
                            Save
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </NuxtLayout>
</template>
<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/vue/24/outline'

definePageMeta({
    middleware: ["auth"],
    layout: false
})

useHead({
    title: "Report : " + useRuntimeConfig().public.company
})

const { $swal } = useNuxtApp()

const navigation = [
    { name: 'Details', href: '.', current: true },
    { name: 'Referrals', href: 'referrals', current: false },
    { name: 'Payments', href: 'payments', current: false },
]

const sectionNav = useOrderNav()

const submitState = ref(true)
const submitLabel = computed(() => submitState.value ? "Submit" : "Processing")

let formData = reactive({
    name: "lorem ipsum",
});
const errors = ref();

function updatePost() {
    submitState.value = false

    submitRequest(
        $larafetch("/affiliate/1", { method: "put", body: formData }),
        (result) => {
            console.log("Post updated successfully: ", result);
        },
        (validationErrors) => {

            let errors = []
            Object.entries(validationErrors).forEach(
                ([key, error]) => Object.values(error).forEach(
                    error => errors.push(`<li>${error}</li>`)
                )
            )

            $swal.fire({
                position: 'top-end',
                title: 'Update failed!',
                html: `<ul>${errors.join("")}</ul>`,
                icon: 'error',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                toast: true
            })
        },
        () => submitState.value = true
    );
}
</script>