<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
<script lang="ts" setup>
import { toRefs } from "vue";
import Button from "~/components/enigma/base-components/Button";
const props = defineProps({
  cancelFunction: {
    required: true,
    type: Function,
  },
  buttonText: {
    required: false,
    type: String,
    default: "Cancel",
  },
});

const { cancelFunction, buttonText } = toRefs(props);
</script>
<template>
  <Button
    variant="outline-secondary"
    type="button"
    @click="
      () => {
        cancelFunction(false);
      }
    "
    class="w-20 mr-1"
  >
    {{ buttonText }}
  </Button>
</template>
