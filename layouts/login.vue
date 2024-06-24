<template>
  <div class="min-h-full flex">
    <div class="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 mx-auto">
      <div class="mx-auto w-full max-w-sm lg:w-96">
        <slot />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
useHead({
  htmlAttrs: {
    class: "h-full bg-sky-700"
  },
  bodyAttrs: {
    class: "h-full"
  }
})
</script>
  