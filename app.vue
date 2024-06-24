<script setup>
import { provideUseId } from '@headlessui/vue'
provideUseId(() => useId())
</script>
<template>
  <NuxtLayout>
    <NuxtPwaManifest />
    <NuxtPage />
  </NuxtLayout>
</template>