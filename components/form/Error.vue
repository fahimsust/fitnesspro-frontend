<script lang="ts">
export default {};
</script>
<script setup lang="ts">
import { toRefs } from "vue";
const props = defineProps({
  error: {
    required: false,
    type: String
  },
  formInline:{
        required:false,
        type:Boolean,
        default:false
    },
});

const {error} = toRefs(props);

</script>
<template>
  <div class="mt-2 text-danger w-full" v-if="error">
    <span :class="{'xl:ml-48':formInline}">
    {{ error }}
    </span>
  </div>
</template>
