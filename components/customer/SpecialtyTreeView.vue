<!-- components/SpecialtyTreeView.vue -->
<script setup lang="ts">
import _ from "lodash";
import Button from "~/components/enigma/base-components/Button";
import Lucide from "~/components/enigma/base-components/Lucide";
export interface Specialty {
    id: number;
    name: string;
    approved: boolean;
    children_recursive?: Specialty[];
    account_specialty: any
}
const loadingStates = reactive<{ [key: number]: boolean }>({});
const props = defineProps({
    specialties: {
        required: true,
        type: Array<Specialty>,
    },
    refresh: {
        required: true,
        type: Function,
    },
    parent: {
        required: false,
        type: Boolean,
        default: true
    },
    modelValue: {
        required: true,
        type: Object,
    },
});
let { specialties, refresh, parent, modelValue: customer } = toRefs(props);
const customerId = customer.value.id;

const {
    addSpecialty,
    deleteSpecialty,
} = useCustomerSpecialty();

const toggleLoading = (id: number, isLoading: boolean) => {
    loadingStates[id] = isLoading;
}

const createSpecialty = async (specialty: any, approved: boolean) => {
    toggleLoading(specialty.id, true);
    const form = reactive({
        specialty_id: specialty.id,
        approved: approved,
        account_id: customerId
    })
    await addSpecialty(form);
    await refresh.value();
    toggleLoading(specialty.id, false);
}

const removeSpecialty = async (id: number, specialty: any) => {
    toggleLoading(specialty.id, true);
    await deleteSpecialty(id);
    await refresh.value();
    toggleLoading(specialty.id, false);
}

</script>
<template>
    <div class="flex flex-col space-y-3">
        <div v-for="specialty in specialties" :key="specialty.id" :class="{
            'mt-3': parent,
            'border-black-100': parent,
            'border-t': parent,
            'border-l': parent,
            'border-r': parent,
            'rounded-md': parent
        }" class="p-1 pl-3 border-b border-gray-200 last:border-b-0">
            <div class="flex justify-between items-center mt-2"
                :class="{ 'mb-5': parent && specialty.children_recursive && specialty.children_recursive.length > 0, }">
                <span class="font-semibold flex items-center"
                    :class="{ 'opacity-40': !specialty.account_specialty.exists }">
                    <!-- Conditional rendering of icons -->
                    <Lucide icon="AlertCircle"
                        v-if="specialty.account_specialty.exists && !specialty.account_specialty.approved"
                        class="text-warning mr-2 font-bold" :stroke-width="2" />
                    <Lucide icon="CheckCircle"
                        v-else-if="specialty.account_specialty.exists && specialty.account_specialty.approved"
                        class="text-success mr-2 font-bold" :stroke-width="2" />

                    <Lucide icon="XCircle" v-if="!specialty.account_specialty.exists" class="mr-2" />
                    {{ specialty.name }}
                </span>
                <div class="flex space-x-2">
                    <Lucide v-if="loadingStates[specialty.id]" icon="Loader" class="animate-spin" />
                    <Button v-if="!specialty.account_specialty.exists" @click="createSpecialty(specialty, false)"
                        class="text-xs px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded shadow-sm">
                        Add
                    </Button>
                    <Button v-if="!specialty.account_specialty.exists" @click="createSpecialty(specialty, true)"
                        class="text-xs px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded shadow-sm">
                        Add & Approve
                    </Button>
                    <Button v-if="specialty.account_specialty.exists && !specialty.account_specialty.approved"
                        @click="createSpecialty(specialty, true)"
                        class="text-xs px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded shadow-sm">
                        Approve
                    </Button>
                    <Button v-if="specialty.account_specialty.exists && specialty.account_specialty.approved"
                        @click="createSpecialty(specialty, false)"
                        class="text-xs px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded shadow-sm">
                        Un Approve
                    </Button>
                    <Button v-if="specialty.account_specialty.exists"
                        @click="removeSpecialty(specialty.account_specialty.id, specialty)"
                        class="text-xs px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded shadow-sm">
                        Remove
                    </Button>
                </div>
            </div>
            <!-- Grid layout for child specialties for medium screens and up -->
            <div v-if="specialty.children_recursive"
                class="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2 items-center text-center">
                <specialty-tree-view v-for="childSpecialty in specialty.children_recursive" :key="childSpecialty.id"
                    :specialties="[childSpecialty]" v-model="customer" :refresh="refresh" :parent="false"
                    class="shadow overflow-hidden sm:rounded-lg" />
            </div>
        </div>
    </div>
</template>


