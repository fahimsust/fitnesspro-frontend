<script setup lang="ts">
import _ from "lodash";
import SpecialtyTreeView from "./SpecialtyTreeView.vue";

const props = defineProps({
  modelValue: {
    required: true,
    type: Object,
  },
});
let { modelValue: customer } = toRefs(props);

const customerId = customer.value.id;
const {
  accountSpecialties,
} = useCustomerSpecialty();

const refresh = async () => {
  await accountSpecialties(customerId);
}
let specialties:any = ref([]);
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  specialties = await accountSpecialties(customerId)
  dataLoaded.value = true
});
</script>

<template>
  <div v-if="!dataLoaded">
    <div class="rounded-lg box intro-y mt-3">
      <TableLoading />
    </div>
  </div>
  <div class="p-1" v-if="dataLoaded">
    <h3 class="mt-2 text-success font-semibold">Account Specialty</h3>
    <specialty-tree-view v-model="customer" :refresh="refresh" :specialties="specialties" />
  </div>
</template>
