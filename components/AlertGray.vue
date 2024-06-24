<script lang="ts" setup>
import Alert from "~/components/enigma/base-components/Alert";
import Lucide from "~/components/enigma/base-components/Lucide";
const props = defineProps({
  alertText: {
    required: false,
    type: String,
    default: "No Data Found",
  },
});
const { alertText } = toRefs(props);
</script>
<template>
  <Alert variant="secondary" class="flex items-center">
    <Lucide icon="AlertCircle" class="w-6 h-6 mr-2" />
    {{alertText}}
  </Alert>
</template>
