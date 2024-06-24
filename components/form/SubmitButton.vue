<script setup lang="ts">
import { toRefs } from "vue";
import Button from "~/components/enigma/base-components/Button";
import LoadingIcon from "~/components/enigma/base-components/LoadingIcon";
const props = defineProps({
    createFunction: {
        required: true,
        type: Function,
    },
    buttonText: {
        required: false,
        type: String,
        default: 'Save'
    },
    buttonLoading: {
        required: false,
        type: String,
        default: 'Saving'
    },
    loading: {
        required: true,
        type: Boolean,
    },
});

const { createFunction, loading, buttonText, buttonLoading } = toRefs(props);
</script>
<template>
    <Button variant="primary" v-if="loading == false" type="button" class="mb-2 mr-1" @click="() => {
        createFunction();
    }
        ">
        {{ buttonText }}
    </Button>
    <Button v-if="loading == true" variant="primary" class="mb-2 mr-1">
        {{ buttonLoading }}
        <LoadingIcon icon="oval" color="white" class="w-4 h-4 ml-2" />
    </Button>
</template>