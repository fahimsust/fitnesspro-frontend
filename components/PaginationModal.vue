<script setup lang="ts">
import { computed, toRefs } from "vue"
import Pagination from "./enigma/base-components/Pagination";
import { FormInput, FormSelect } from "./enigma/base-components/Form";
import Lucide from "./enigma/base-components/Lucide";

import { ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/vue/24/outline';

const router = useRouter()
const route = useRoute()
const props = defineProps({
    numberOfPages: {
        required: true,
        type: Number,
    },
    modelValue: {
        required: true,
        type: Number,
    },
    getList:{
        required:true,
        type: Function
    }
})

const { numberOfPages, modelValue: currentPage,getList } = toRefs(props)

const maxPages = 3;

const startPage = computed(() => {
    if (currentPage.value === 1)
        return 1

    if (currentPage.value === numberOfPages.value && maxPages < numberOfPages.value + 1)
        return numberOfPages.value + 1 - maxPages

    return currentPage.value - 1
})

const lastPage = computed(() => numberOfPages.value)

const showFirstPage = computed(() => currentPage.value > 3 || currentPage.value > 2 && numberOfPages.value > 3)
const showLastEllipsis = computed(() => numberOfPages.value > maxPages && currentPage.value < (numberOfPages.value - 1))
const showLastPage = computed(() => numberOfPages.value > maxPages && currentPage.value < (numberOfPages.value - 1))
const showNextLink = computed(() => numberOfPages.value > 1 && currentPage.value != numberOfPages.value)

const pages = computed(() => {
    const range = []

    for (
        let i = startPage.value;
        i <= Math.min(startPage.value + maxPages - 1, numberOfPages.value);
        i++
    ) {
        range.push({
            name: i,
            isCurrent: i === currentPage.value
        })
    }

    return range
})
const allPages = computed(() => {
    const range = []

    for (
        let i = 1;
        i <= numberOfPages.value;
        i++
    ) {
        range.push({
            name: i,
            isCurrent: i === currentPage.value
        })
    }

    return range
})

const emit = defineEmits(["update:modelValue"])

async function createNewPath(number: Number): Promise<void> {
    emit("update:modelValue", number);
    scrollToTop();
    await getList.value();

}
const scrollToTop = () => {
    window.scrollTo(0, 0);
}

const setCurrentPage = async (number: Number) => {
    createNewPath(number);
}
const setCurrentPageOption = async (event: any) => {
    createNewPath(parseInt(event.target.value));
}
const previous = () => {
    if (currentPage.value === 1)
        return
    const prev = currentPage.value - 1
    createNewPath(prev);
}

const next = () => {
    if (currentPage.value >= numberOfPages.value)
        return

    const next = currentPage.value + 1
    createNewPath(next);
}
</script>
<template>
    <div v-if="numberOfPages > 1" class="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap">
        <Pagination :key="currentPage">
            <Pagination.Link v-if="currentPage > 2" @click="setCurrentPage(1)">
                <Lucide icon="ChevronsLeft" class="w-4 h-5" />
            </Pagination.Link>

            <Pagination.Link v-if="currentPage != 1" @click="previous">
                <Lucide icon="ChevronLeft" class="w-4 h-5" />
            </Pagination.Link>

            <!-- <Pagination.Link v-if="showFirstPage" @click="setCurrentPage(1)" :active="currentPage == 1 ? true : false">
                1
            </Pagination.Link> -->

            <!-- <Pagination.Link v-if="showFirstPage">...</Pagination.Link> -->


            <!-- <Pagination.Link v-for="page in pages" :key="page.name" @click="setCurrentPage(page.name)"
                aria-current="page" :active="page.isCurrent == true ? true : false">
                {{ page.name }}
            </Pagination.Link> -->

            <!-- <Pagination.Link active>2</Pagination.Link> -->

            <!-- <Pagination.Link v-if="showLastEllipsis">...</Pagination.Link> -->

            <!-- <Pagination.Link v-if="showLastPage" @click="setCurrentPage(numberOfPages)"
                :active="currentPage == lastPage ? true : false">
                {{ numberOfPages }}
            </Pagination.Link> -->

            <Pagination.Link v-if="showNextLink" @click="next">
                <Lucide icon="ChevronRight" class="w-4 h-5" />
            </Pagination.Link>

            <Pagination.Link v-if="showLastPage" @click="setCurrentPage(lastPage)">
                <Lucide icon="ChevronsRight" class="w-4 h-5" />
            </Pagination.Link>
        </Pagination>

        <!-- todo: update to be page selector -->
        <FormSelect v-model="currentPage" @change="setCurrentPageOption($event)"
            class="w-20 mt-0 ml-3" :key="currentPage">
            <option v-for="page in allPages" :key="page.name">{{ page.name }}</option>
        </FormSelect>
    </div>
</template>