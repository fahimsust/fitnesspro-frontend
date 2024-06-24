<script setup>
import Lucide from "~/components/enigma/base-components/Lucide";
import Table from "~/components/enigma/base-components/Table";

const props = defineProps({
    columns: {
        type: Array,
        required: true,
    },
    orderBy: {
        type: String,
        required: true,
    },
    orderType: {
        type: String,
        required: true,
    },
    handleSort: {
        type: Function,
        required: true,
    },
    checkAll: {
        type: Boolean,
        required: false,
    },
    checkAllProduct: {
        type: Function,
        required: false,
    }
});
const emit = defineEmits(['update:checkAll']);

const handleCheckAllClick = (event) => {
    emit('update:checkAll', event.target.checked);
    if (props.checkAllProduct) {
        props.checkAllProduct(event);
    }
};
</script>

<template>
    <Table.Thead variant="dark">
        <Table.Tr>
            <Table.Th v-for="(column, index) in columns" class="whitespace-nowrap" :key="index" :class="[{ 'cursor-pointer': column.sortable }, column.extraClass]"
                @click="column.sortable ? handleSort(column.field) : () => { }">
                <template v-if="column.field === 'checkbox'">
                    <input type="checkbox" :checked="checkAll" @click="handleCheckAllClick" :value="true" />
                </template>
                <template v-else>
                    {{ column.label }}
                    <Lucide v-if="orderBy === column.field && orderType === 'asc'" icon="ArrowDownAZ"
                        class="w-4 h-4 ml-0.5 inline" />
                    <Lucide v-else-if="orderBy === column.field && orderType === 'desc'" icon="ArrowUpZA"
                        class="w-4 h-4 ml-0.5 inline" />
                    <Lucide v-else-if="orderBy != column.field && column.sortable" icon="ArrowDownUp"
                        class="w-4 h-4 ml-0.5 inline" />
                </template>
            </Table.Th>
        </Table.Tr>
    </Table.Thead>
</template>
