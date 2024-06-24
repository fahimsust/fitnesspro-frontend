<script lang="ts" setup>
import Alert from "~/components/enigma/base-components/Alert";
import LoadingIcon from "~/components/enigma/base-components/LoadingIcon";
</script>
<template>
  <Alert variant="secondary" class="flex items-center">
      <div class="w-6 h-6">
        <LoadingIcon icon="three-dots" class="w-6 h-6" />
      </div>
  </Alert>
</template>
