<template>
    <NuxtLayout>
            <main class="bg-white overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:mx-0 rounded-lg">
                <div class="my-auto flex-shrink-0 p-16 sm:p-32">
                    <p class="text-base font-semibold text-red-700">{{ error.statusCode }}</p>
                    <h1 class="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">{{ error.message.split(":")[0] }}</h1>
                    <p class="mt-2 text-base text-gray-500">{{ error.message.split(":")[1] }}</p>
                    <div class="mt-6">
                        <nuxt-link href="/" class="text-base font-medium primary-link">
                            Return to dashboard
                            <span aria-hidden="true"> &rarr;</span>
                        </nuxt-link>
                    </div>
                </div>
            </main>
    </NuxtLayout>
</template>
<script setup>
    let error = useError()
</script>