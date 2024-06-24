<script setup lang="ts">
import _ from "lodash";
import { reactive, onMounted } from "vue";
import { SelectField, SubmitButton } from "~/components/form";
import Button from "~/components/enigma/base-components/Button";

const { getAdvantages, getAdvantagesOptions, deleteAdvantage, deleteConfirmationModal, errors, loading, addAdvantage, setDeleteId, updateAdvantage } = useDiscountAdvantage();
const props = defineProps({
  modelValue: {
    required: true,
    type: Object
  }
});
const ready = ref(false);
const { modelValue: discount } = toRefs(props);
let advantageOptions:any = ref([])
let advantages:any = ref([])

let formAdd = reactive({
  advantage_type_id: null,
  discount_id: discount.value.id,
});
const deleteAdvantageAndReload = async () => {
  await deleteAdvantage(discount.value.id);
}
const validateAndCreate = async () => {
  await addAdvantage(formAdd);
  validationFocus(formAdd, errors);
  await getAdvantages(discount.value.id);
};
const componentMap = shallowRef<{ [key: string]: any }>({});
const componentNameMap = ref<{ [key: string]: any }>({});

onMounted(async () => {
  await nextTick();
  advantageOptions = await getAdvantagesOptions();
  advantages = await getAdvantages(discount.value.id);
  for (const obj of advantageOptions.value) {
    if (!componentMap.value[obj.id]) {
      componentMap.value[obj.id] = defineAsyncComponent(() => import(`./advantage/${obj.component_type}.vue`));
    }
    if (!componentNameMap.value[obj.id]) {
      componentNameMap.value[obj.id] = obj.name;
    }
  }
  ready.value = true;
});

const getComponent = (advantage: any) => {
  return componentMap.value[advantage.advantage_type_id];
};
const getComponentName = (advantage: any) => {
  return componentNameMap.value[advantage.advantage_type_id];
};
const setConfirmationModal = (value: boolean) => {
  deleteConfirmationModal.value = value;
};
</script>

<template>
  <div  v-if="!ready">
    <div class="rounded-lg box intro-y lg:mt-14">
      <TableLoading />
    </div>
  </div>  
  <div class="p-3" v-if="ready">
    <div class="mt-5 p-3 border-gray-100 border-2 dark:bg-black/40 rounded-lg">
      <!-- Legend for the section -->
      <h2 class="mb-4">Add Advantage</h2>

      <div class="grid grid-cols-12 gap-8">
        <div class="col-span-10 md:col-span-12 md:hidden">
          <div class="col-span-12 intro-y md:col-span-6">
            <SelectField :options="advantageOptions" name="advantage_type_id" v-model="formAdd"
              :error="errors.advantage_type_id" title="Advantage Type" default-option="Select Advantage Type"
              :withLabel="false" />
          </div>
          <div class="col-span-12 intro-y md:col-span-6 mt-3">
            <SubmitButton buttonText="Add" :createFunction="validateAndCreate" :loading="loading" />
          </div>
        </div>
        <div class="hidden col-span-12 intro-y md:col-span-6 md:block">
          <SelectField :options="advantageOptions" name="advantage_type_id" v-model="formAdd"
            :error="errors.advantage_type_id" title="Advantage Type" default-option="Select Advantage Type"
            :withLabel="false" />
        </div>
        <div class="hidden col-span-12 intro-y md:col-span-6 md:block">
          <SubmitButton buttonText="Add" :createFunction="validateAndCreate" :loading="loading" />
        </div>
      </div>
    </div>


    <div class="mt-5 p-3 border-gray-100 border-2 dark:bg-gray-900  rounded-lg" v-for="advantage in advantages">
      <h3 class="mb-4 font-semibold leading-none">{{ getComponentName(advantage) }}</h3>
      <div class="gap-4 grid grid-cols-12 md:gap-8">
        <div class="col-span-12 md:col-span-10">
          <div class="gap-4 grid grid-cols-12 md:gap-8">
            <component :key="advantage.id" :is="getComponent(advantage)" :advantage="advantage" />
          </div>
        </div>
        <div class="col-span-12 md:col-span-2 md:text-right">
          <Button variant="danger" type="button" @click="() => {
            setDeleteId(advantage.id);
            setConfirmationModal(true);
          }" class="w-24 mr-2 mt-7 bg-red-500 hover:bg-red-600 text-white p-2 rounded">
            Delete
          </Button>
        </div>
      </div>
    </div>


  </div>
  <Confirmation buttonStringMain="Delete" v-model="deleteConfirmationModal" :setConfirmationModal="setConfirmationModal"
    :set-id="setDeleteId" sub-header="Do you really want to delete this discount advantage?"
    :functionToRun="deleteAdvantageAndReload" />
</template>
